import useAirframe from "@/bindings/hooks/useAirframe";
import {Cell, Column, FocusedCellCoordinates, RegionCardinality, Table2} from "@blueprintjs/table";
import {Card, OptionProps, RadioGroup, Text} from "@blueprintjs/core";
import React, {useCallback, useMemo, useState} from "react";
import {typeAsArrayOfKeys} from "@/utils/type.utils";
import {handleNumberChange} from "@utils/event.utils";
import {Payload} from "@/bindings/rust";
import {toPounds} from "@utils/formatting.utils";

type LoadoutExplorerTableProps = {
    airframeId: string;
};

type SortingAlgorithmTypes = {
    [key in SORTING_OPTION]: () => void
}

enum SORTING_OPTION {
    default, weight
}


const LoadoutExplorerTable: React.FC<LoadoutExplorerTableProps> = ({airframeId}) => {
    const [sortingOption, setSortingOption] = useState<number>(0)
    
    const [selectedRowData, setSelectedRowData] = useState<Payload | undefined >()

    const airframe = useAirframe({id: airframeId});


    const sortAirframesBySortingOption = useCallback(() => {
        const algorithmTypes: SortingAlgorithmTypes = {
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

        algorithmTypes[sortingOption as keyof SortingAlgorithmTypes]();
    }, [airframe, sortingOption])

    const requiredRows = useMemo(() => airframe?.pylons.reduce((p, c) => p > c.stores.length ? p : c.stores.length, 0), [airframe])


    const sortOptions: OptionProps[] = useMemo(() => typeAsArrayOfKeys(SORTING_OPTION).map((key, idx): OptionProps =>
        ({label: key.toProperCase(), value: idx})
    ), [SORTING_OPTION])

    const handleSorting = handleNumberChange(val =>
        setSortingOption(val)
    )

    const handleFocusedCell = ({col, row}: FocusedCellCoordinates) => setSelectedRowData(airframe?.pylons[col].stores[row])

    if (!airframe) return <></>

    // Sort pylons by order
    airframe.pylons.sort((a, b) => a.order - b.order);

    // Sort Stores
    sortAirframesBySortingOption();

    // TODO: Filter by categories
    
    // TODO: Make selection and filter buttons as a ButtonGroup with Popovers https://blueprintjs.com/docs/#core/components/button-group.usage-with-popovers
    // TODO: Make the footer stay attached to the bottom of the screen when scrolling...
    
    return <div>
        <div className="px-4 py-2">
            <RadioGroup label="Sorting:" inline selectedValue={sortingOption} onChange={handleSorting}
                        options={sortOptions}/>
        </div>
        <div className="p-2">
            <Card>
                <div className="flex-row">
                    <Text>{selectedRowData?.display_name ?? "N/A"} </Text>
                    <Text>{toPounds(selectedRowData?.weight ?? 0, true)}</Text>
                </div>
            </Card>
        </div>
        <div className="">
            <Table2 numRows={requiredRows ? requiredRows + 2 : 0} cellRendererDependencies={[sortingOption]}
                    selectionModes={[RegionCardinality.CELLS]} enableMultipleSelection={false} enableFocusedCell={true}
                    onFocusedCell={handleFocusedCell}>
                {airframe?.pylons.map((pylon) =>
                    <Column key={pylon.number} name={pylon.name.replaceAll("\"", "")} cellRenderer={(rowIndex) =>
                        <Cell>{pylon.stores[rowIndex] ? pylon.stores[rowIndex].display_name : ""}</Cell>}/>)}
            </Table2>
        </div>
    </div>
}

export default LoadoutExplorerTable;