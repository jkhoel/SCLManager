import useAirframe from "@/bindings/hooks/useAirframe";
import {Cell, Column, Table2} from "@blueprintjs/table";

type LoadoutExplorerTableProps = {
    airframeId: string;
};

const LoadoutExplorerTable: React.FC<LoadoutExplorerTableProps> = ({airframeId}) => {
    const airframe = useAirframe({id: airframeId});
    
    if(!airframe) return <></>
    
    // Sort pylons by order
    airframe.pylons.sort((a, b) => a.order - b.order);

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

    return <Table2 numRows={100}>
        {airframe?.pylons.map((pylon, pIdx) => 
            <Column name={pylon.name.replaceAll("\"", "")} cellRenderer={(rowIndex, columnIndex) => 
                <Cell>{pylon.stores[rowIndex] ? pylon.stores[rowIndex].display_name : ""}</Cell>} />)}
    </Table2>
}

export default LoadoutExplorerTable;