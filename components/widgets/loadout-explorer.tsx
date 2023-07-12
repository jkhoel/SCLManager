import useAirframe from "@/bindings/hooks/useAirframe";
import {FocusedCellCoordinates} from "@blueprintjs/table";
import {Button, Card, MenuItem, OptionProps, RadioGroup, Text} from "@blueprintjs/core";
import React, {useMemo, useState} from "react";
import {typeAsArrayOfKeys} from "@/utils/type.utils";
import {handleNumberChange} from "@utils/event.utils";
import {Airframe, Payload} from "@/bindings/rust";
import {toPounds} from "@utils/formatting.utils";
import AirframeExplorerTable, {
    AirframeExplorerDefaultFilterOptions,
    AirframeExplorerSortingOptions
} from "@components/ui/tables/table-airframe-explorer";
import {ItemRenderer, Select} from "@blueprintjs/select";

type LoadoutExplorerTableProps = {
    airframeId: string;
};


function getOptionItems(airframe?: Airframe): string[] {
    const categoryItems: Set<string> = new Set();
    if(!airframe) return [AirframeExplorerDefaultFilterOptions.All]

    airframe.pylons.forEach(pylon =>
        pylon.stores.forEach(store =>
            categoryItems.add(store.category.replaceAll("\"", ""))))
    
    const filterItems =  Array.from(categoryItems).sort((a, b) => a.localeCompare(b))
    filterItems.unshift(AirframeExplorerDefaultFilterOptions.All)

    return filterItems;
}


const LoadoutExplorer: React.FC<LoadoutExplorerTableProps> = ({airframeId}) => {
    const [sortingOption, setSortingOption] = useState<number>(0)
    const [filterOption, setFilterOption] = useState<AirframeExplorerDefaultFilterOptions | string>(AirframeExplorerDefaultFilterOptions.All)

    const [selectedRowData, setSelectedRowData] = useState<Payload | undefined>()

    const airframe = useAirframe({id: airframeId});

    const sortOptions: OptionProps[] = useMemo(() => typeAsArrayOfKeys(AirframeExplorerSortingOptions).map((key, idx): OptionProps =>
        ({label: key.toProperCase(), value: idx})
    ), [AirframeExplorerSortingOptions])
    
    const filterOptions: string[] = useMemo(() => getOptionItems(airframe), [airframe])

    const handleSorting = handleNumberChange(val =>
        setSortingOption(val)
    )

    const handleFocusedCell = (focusedCellCoordinates: FocusedCellCoordinates) => 
        setSelectedRowData(airframe?.pylons[focusedCellCoordinates.col].stores[focusedCellCoordinates.row])

    if (!airframe) return <></>


    // TODO: Make selection and filter buttons as a ButtonGroup with Popovers https://blueprintjs.com/docs/#core/components/button-group.usage-with-popovers

    const filterSelectItemRenderer: ItemRenderer<string> = (filterOption, {
        handleClick,
        handleFocus,
        modifiers,
    }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }

        return (
            <MenuItem text={`${filterOption}`} key={filterOption} active={modifiers.active}
                      disabled={modifiers.disabled} onClick={handleClick} onFocus={handleFocus}
                      roleStructure={"listoption"}/>
        )
    }

    return <div>
        <div>
            <div className="px-4 py-2">
                <RadioGroup label="Sorting:" inline selectedValue={sortingOption} onChange={handleSorting}
                            options={sortOptions}/>
                <Select<string> filterable={false} items={filterOptions} itemRenderer={filterSelectItemRenderer} onItemSelect={setFilterOption}>
                    <Button text={filterOption} rightIcon="caret-down" placeholder="Filter by Category"/>
                </Select>
            </div>
            <div className="p-2">
                <Card>
                    <div className="flex-row">
                        <Text>{`${selectedRowData?.display_name ?? "N/A"} [${selectedRowData?.category.replaceAll("\"", "") ?? "-"}]`}</Text>
                        <Text>{toPounds(selectedRowData?.weight ?? 0, true)}</Text>
                    </div>
                </Card>
            </div>
        </div>
        <div>
            <AirframeExplorerTable airframe={airframe} sorting={sortingOption} filter={filterOption} onFocusedCell={handleFocusedCell}/>
        </div>
    </div>
}

export default LoadoutExplorer;