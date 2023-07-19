import useAirframe from "@/bindings/hooks/useAirframe";
import {FocusedCellCoordinates} from "@blueprintjs/table";
import {Button, ButtonGroup, MenuItem, OptionProps, Text} from "@blueprintjs/core";
import React, {useMemo, useState} from "react";
import {typeAsArrayOfKeys} from "@/utils/type.utils";
import {Airframe, Payload} from "@/bindings/rust";
import {toPounds} from "@utils/formatting.utils";
import AirframeExplorerTable, {
    AirframeExplorerDefaultFilterOptions,
    AirframeExplorerSortingOptions
} from "@components/ui/tables/table-airframe-explorer";

import {ItemRenderer, Select} from "@blueprintjs/select";

import style from "@styles/style.module.scss";

type LoadoutExplorerTableProps = {
    airframeId: string;
};


function getOptionItems(airframe?: Airframe): string[] {
    const categoryItems: Set<string> = new Set();
    if (!airframe) return [AirframeExplorerDefaultFilterOptions.All]

    airframe.pylons.forEach(pylon =>
        pylon.stores.forEach(store =>
            categoryItems.add(store.category.replaceAll("\"", ""))))

    const filterItems = Array.from(categoryItems).sort((a, b) => a.localeCompare(b))
    filterItems.unshift(AirframeExplorerDefaultFilterOptions.All)

    return filterItems;
}


const LoadoutExplorer: React.FC<LoadoutExplorerTableProps> = ({airframeId}) => {
    const [sortingOption, setSortingOption] = useState<number>(AirframeExplorerSortingOptions.default)
    const [filterOption, setFilterOption] = useState<AirframeExplorerDefaultFilterOptions | string>(AirframeExplorerDefaultFilterOptions.All)

    const [selectedRowData, setSelectedRowData] = useState<Payload | undefined>()

    const airframe = useAirframe({id: airframeId});

    const sortOptions: OptionProps[] = useMemo(() => typeAsArrayOfKeys(AirframeExplorerSortingOptions).map((key, idx): OptionProps =>
        ({label: key.toProperCase(), value: idx})
    ), [AirframeExplorerSortingOptions])

    const filterOptions: string[] = useMemo(() => getOptionItems(airframe), [airframe])

    const handleFocusedCell = (focusedCellCoordinates: FocusedCellCoordinates) =>
        setSelectedRowData(airframe?.pylons[focusedCellCoordinates.col].stores[focusedCellCoordinates.row])

    if (!airframe) return <></>

    const sortSelectItemRenderer: ItemRenderer<OptionProps> = (sortOption, {
        handleClick,
        handleFocus,
        modifiers,
    }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }

        return (
            <MenuItem text={`${sortOption.label}`} key={sortOption.value} active={modifiers.active}
                      disabled={modifiers.disabled} onClick={handleClick} onFocus={handleFocus}
                      roleStructure={"listoption"}/>
        )
    }

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
            <ButtonGroup className="min-w-full justify-start">
                <Select<OptionProps> filterable={false} items={sortOptions} itemRenderer={sortSelectItemRenderer}
                                     onItemSelect={(opt) => setSortingOption(opt.value as number)}>
                    <Button text={AirframeExplorerSortingOptions[sortingOption].toProperCase()} icon="sort-asc"
                            rightIcon="caret-down"
                            placeholder="Sort by"/>
                </Select>
                <Select<string> filterable={false} items={filterOptions} itemRenderer={filterSelectItemRenderer}
                                onItemSelect={setFilterOption}>
                    <Button text={filterOption} icon="th-filtered" rightIcon="caret-down"
                            placeholder="Filter by Category"/>
                </Select>
                <div className="bp5-button bp5-fill"
                     style={{backgroundColor: style["bg-toolbar"], cursor: "default", zIndex: "-1"}}/>
            </ButtonGroup>
            <div className="p-2">
                <div className="flex-row">
                    <Text>{`${selectedRowData?.display_name ?? "N/A"} [${selectedRowData?.category.replaceAll("\"", "") ?? "-"}]`}</Text>
                    <Text>{toPounds(selectedRowData?.weight ?? 0, true)}</Text>
                </div>
            </div>
        </div>
        <div>
            <AirframeExplorerTable airframe={airframe} sorting={sortingOption} filter={filterOption}
                                   onFocusedCell={handleFocusedCell}/>
        </div>
    </div>
}

export default LoadoutExplorer;