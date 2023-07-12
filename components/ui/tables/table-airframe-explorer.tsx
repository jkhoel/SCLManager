import {Airframe, Payload} from "@/bindings/rust";
import {Cell, Column, FocusedCellCoordinates, RegionCardinality, Table2} from "@blueprintjs/table";
import React from "react";
import {Th} from "@blueprintjs/icons";

export enum AirframeExplorerSortingOptions {
    default, weight
}

interface ExplorerTableState {
    selectedRowData?: Payload;
}

type AirframeExplorerSortingAlgorithmTypes = {
    [key in AirframeExplorerSortingOptions]: () => void
}

type AirframeExplorerProps = {
    airframe?: Airframe;
    sorting: number;
    onFocusedCell: (focusedCellCoordinates: FocusedCellCoordinates) => void;
};

export default class AirframeExplorerTable extends React.PureComponent<AirframeExplorerProps, ExplorerTableState> {
    public state: ExplorerTableState = {
        selectedRowData: undefined
    }

    private requiredRows(): number {
        return this.props.airframe?.pylons.reduce((p, c) => p > c.stores.length ? p : c.stores.length, 0) ?? 10
    }

    private handleFocusedCell(focusedCellCoordinates: FocusedCellCoordinates) {
        this.props.onFocusedCell(focusedCellCoordinates)
    }

    private sortingOptions = {
        // Sort each pylon's stores alphabetically and by weight
        0: () => {
            this.props.airframe?.pylons.forEach((pyl) => {
                pyl.stores
                    .sort((a, b) => a.weight - b.weight)
                    .sort((a, b) => a.category.localeCompare(b.category));
            })
        },
        // Sort each pylon's stores by weight
        1: () => {
            this.props.airframe?.pylons.forEach((pyl) => {
                pyl.stores
                    .sort((a, b) => a.weight - b.weight)
            })
        },
    }

    public render() {
        this.sortingOptions[this.props.sorting as keyof AirframeExplorerSortingAlgorithmTypes]()

        const columns = this.props.airframe?.pylons.map((pylon) =>
            <Column key={pylon.number} name={pylon.name.replaceAll("\"", "")} cellRenderer={(rowIndex) =>
                <Cell>{pylon.stores[rowIndex] ? pylon.stores[rowIndex].display_name : ""}</Cell>}/>)

        return (
            <Table2 numRows={this.requiredRows() + 2} cellRendererDependencies={[this.props.sorting]}
                    selectionModes={[RegionCardinality.CELLS]} enableMultipleSelection={false} enableFocusedCell={true}
                    onFocusedCell={(focusedCell) => this.handleFocusedCell(focusedCell)}>
                {columns}
            </Table2>
        )
    }
}