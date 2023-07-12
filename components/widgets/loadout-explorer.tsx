import useAirframe from "@/bindings/hooks/useAirframe";
import {Cell, Column, FocusedCellCoordinates, RegionCardinality, Table2} from "@blueprintjs/table";
import {Card, OptionProps, RadioGroup, Text} from "@blueprintjs/core";
import React, {useCallback, useMemo, useState} from "react";
import {typeAsArrayOfKeys} from "@/utils/type.utils";
import {handleNumberChange} from "@utils/event.utils";
import {Airframe, Payload} from "@/bindings/rust";
import {toPounds} from "@utils/formatting.utils";
import AirframeExplorerTable, {AirframeExplorerSortingOptions} from "@components/ui/tables/table-airframe-explorer";

type LoadoutExplorerTableProps = {
    airframeId: string;
};

const LoadoutExplorerTable: React.FC<LoadoutExplorerTableProps> = ({airframeId}) => {
    const [sortingOption, setSortingOption] = useState<number>(0)

    const [selectedRowData, setSelectedRowData] = useState<Payload | undefined>()

    const airframe = useAirframe({id: airframeId});

    const sortOptions: OptionProps[] = useMemo(() => typeAsArrayOfKeys(AirframeExplorerSortingOptions).map((key, idx): OptionProps =>
        ({label: key.toProperCase(), value: idx})
    ), [AirframeExplorerSortingOptions])

    const handleSorting = handleNumberChange(val =>
        setSortingOption(val)
    )

    const handleFocusedCell = ({ col, row }: FocusedCellCoordinates) => setSelectedRowData(airframe?.pylons[col].stores[row])

    if (!airframe) return <></>

    // TODO: Filter by categories

    // TODO: Make selection and filter buttons as a ButtonGroup with Popovers https://blueprintjs.com/docs/#core/components/button-group.usage-with-popovers

    return <div>
        <div>
            <div className="px-4 py-2">
                <RadioGroup label="Sorting:" inline selectedValue={sortingOption} onChange={handleSorting}
                            options={sortOptions}/>
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
            <AirframeExplorerTable airframe={airframe} sorting={sortingOption} onFocusedCell={handleFocusedCell}  />
        </div>
    </div>
}

export default LoadoutExplorerTable;