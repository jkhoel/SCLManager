import useAirframe from "@/bindings/hooks/useAirframe";
import {Cell, Column, Table2} from "@blueprintjs/table";
import {OptionProps, RadioGroup} from "@blueprintjs/core";
import React, {useCallback, useMemo, useState} from "react";
import {typeAsArrayOfKeys} from "@/utils/type.utils";
import {handleNumberChange} from "@utils/event.utils";

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

    const airframe = useAirframe({id: airframeId});


    const sortAirframesBySortingOption = useCallback(() => {
        console.log("yolo!", sortingOption)
        const algorithmTypes: SortingAlgorithmTypes = {
            // Sort each pylon's stores alphabetically and by weight
            0: () => {
                console.log("Sorting by default...")
                airframe?.pylons.forEach((pyl) => {
                    pyl.stores
                        .sort((a, b) => a.weight - b.weight)
                        .sort((a, b) => a.category.localeCompare(b.category));
                })
            },
            // Sort each pylon's stores by weight
            1: () => {
                console.log("Sorting by weight...")
                airframe?.pylons.forEach((pyl) => {
                    pyl.stores
                        .sort((a, b) => a.weight - b.weight)
                })
            },
        }

        algorithmTypes[sortingOption as keyof SortingAlgorithmTypes]();
    }, [airframe, sortingOption])

    const requiredRows = useMemo(() => airframe?.pylons.reduce((p, c) => p > c.stores.length ? p : c.stores.length, 0), [airframe])

    const handleSorting = handleNumberChange(val =>
        setSortingOption(val)
    )

    if (!airframe) return <></>

    // Sort pylons by order
    airframe.pylons.sort((a, b) => a.order - b.order);

    // Sort Stores
    sortAirframesBySortingOption();

    // TODO: Filter by categories


    // TODO: Add some way of showing weapon info when selecting a cell
    
    
    const sortOptions: OptionProps[] = typeAsArrayOfKeys(SORTING_OPTION).map((key, idx): OptionProps =>
        ({label: key.toProperCase(), value: idx})
    )

    return <div>
        <div className="px-4 py-2">
            <RadioGroup label="Sorting:" inline selectedValue={sortingOption} onChange={handleSorting} options={sortOptions}/>
        </div>
        <Table2 numRows={requiredRows ? requiredRows + 2 : 0} cellRendererDependencies={[sortingOption]}>
            {airframe?.pylons.map((pylon) =>
                <Column name={pylon.name.replaceAll("\"", "")} cellRenderer={(rowIndex) =>
                    <Cell>{pylon.stores[rowIndex] ? pylon.stores[rowIndex].display_name : ""}</Cell>}/>)}
        </Table2>
    </div>
}

export default LoadoutExplorerTable;