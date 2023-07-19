import {Airframe, AirframePylon, Payload} from "@/bindings/rust";
import {Cell, Column, FocusedCellCoordinates, RegionCardinality, Table2} from "@blueprintjs/table";
import React from "react";
import {Th} from "@blueprintjs/icons";

export enum AirframeExplorerSortingOptions {
    default, weight
}

export enum AirframeExplorerDefaultFilterOptions {
    All = "All Categories",
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
    filter: string,
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

    private sortStores(airframe = this.props.airframe) {
        const sortingOptions = {
            // Sort each pylon's stores alphabetically and by weight
            0: () => {
                airframe?.pylons.forEach((pyl) => {
                    pyl.stores
                        .sort((a, b) => a.weight - b.weight)
                        .sort((a, b) => a.category.localeCompare(b.category));
                })
            },
            // Sort each pylon's stores by weight
            1: () => {
                airframe?.pylons.forEach((pyl) => {
                    pyl.stores
                        .sort((a, b) => a.weight - b.weight)
                })
            },
        }

        sortingOptions[this.props.sorting as keyof AirframeExplorerSortingAlgorithmTypes]()
        
        return airframe;
    }
    
    private filterStores(airframe = this.props.airframe) {
        const { filter } = this.props ?? AirframeExplorerDefaultFilterOptions.All;
        
        if(!airframe) return this.props.airframe
        
        if(filter === AirframeExplorerDefaultFilterOptions.All) return airframe
        
        const filteredPylons: AirframePylon[] = airframe.pylons.map(({name, number, order, stores}): AirframePylon => ({
            name, number, order, stores: stores.filter(store => store.category.replaceAll("\"", "") === filter)
        }))
        
        return {...airframe, pylons: filteredPylons }
    }

    public render() {
        const filteredAirframe = this.filterStores();
        const filteredAndSortedAirframe = this.sortStores(filteredAirframe)

        const columns = filteredAndSortedAirframe?.pylons.map((pylon) =>
            <Column key={pylon.number} name={pylon.name.replaceAll("\"", "")} cellRenderer={(rowIndex) => <Cell>{pylon.stores[rowIndex]?.display_name}</Cell>}/>)

        return (
            <Table2 numRows={this.requiredRows() + 2} cellRendererDependencies={[this.props.sorting, this.props.filter]}
                    selectionModes={[RegionCardinality.CELLS]} enableMultipleSelection={false} enableFocusedCell={true}
                    onFocusedCell={(focusedCell) => this.handleFocusedCell(focusedCell)}>
                {columns}
            </Table2>
        )
    }
}