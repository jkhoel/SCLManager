import useAirframe from "@/bindings/hooks/useAirframe";
import {Cell, Column, Table2} from "@blueprintjs/table";
import {Radio, RadioGroup} from "@blueprintjs/core";
import {useState} from "react";
import {typeAsArrayOfKeys} from "@/utils";

type LoadoutExplorerTableProps = {
    airframeId: string;
};

enum SORTING_OPTION {
    name, category, weight
}

const LoadoutExplorerTable: React.FC<LoadoutExplorerTableProps> = ({airframeId}) => {
    
    const [sortBy, setSortBy] = useState<SORTING_OPTION>(0)
    
    const airframe = useAirframe({id: airframeId});

    if (!airframe) return <></>


    // Sort pylons by order
    airframe?.pylons.sort((a, b) => a.order - b.order);

    // Sort each pylon's stores alphabetically and by weight, and also build our categories set (uniques)
    // let categories: Set<string> = new Set();
    // airframe.pylons.forEach((pyl) => {
    //     pyl.stores
    //         .sort((a, b) => a.weight - b.weight)
    //         .sort((a, b) => a.category.localeCompare(b.category));
    //
    //     pyl.stores.forEach((s) => categories.add(s.category));
    // });


    // Sort by: Name, Category, Weight

    return <div>
        <div>
            <RadioGroup label="Sort by" inline onChange={() => console.log("Changed!")} >
                {typeAsArrayOfKeys(SORTING_OPTION).map((key, idx) => {
                    
                    console.log("YOLO", key) // TODO: we only want the keys!
                    
                    return <Radio label={key.toProperCase()} value={idx} />
                })}
            </RadioGroup>
        </div>
        <Table2 numRows={100}>
        {airframe?.pylons.map((pylon, pIdx) =>
            <Column name={pylon.name.replaceAll("\"", "")} cellRenderer={(rowIndex, columnIndex) =>
                <Cell>{pylon.stores[rowIndex] ? pylon.stores[rowIndex].display_name : ""}</Cell>}/>)}
    </Table2>
    </div>
}

export default LoadoutExplorerTable;