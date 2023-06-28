import useAirframe from "@/bindings/hooks/useAirframe";
import { Payload } from "@/bindings/rust";
import DraggableTable, {
  DragableDataHeader,
  createColumnsFromHeaders,
} from "@/components/ui/table";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";

type StoresRow = {
  [k: string]: Payload | string | undefined | unknown;
};
type StoresData = StoresRow[]; // Person

type AirframeLoadoutExplorerProps = {
  id: string;
};

const AirframeLoadoutExplorer: React.FC<AirframeLoadoutExplorerProps> = ({
  id,
}) => {
  const [airframeId, setAirframeId] = useState<string | undefined>();
  const [data, setData] = useState([]);

  const airframe = useAirframe({ id: airframeId });

  useEffect(() => {
    if (id) setAirframeId(id);
  }, [id]);

  if (!airframe) return <></>;

  // Sort pylons by order
  airframe.pylons.sort((a, b) => a.order - b.order);

  // Sort each pylon's stores alphabetically and by weight, and also build our categories set (uniques)
  let categories: Set<string> = new Set();
  airframe.pylons.forEach((pyl) => {
    pyl.stores
      .sort((a, b) => a.weight - b.weight)
      .sort((a, b) => a.category.localeCompare(b.category));

    pyl.stores.forEach((s) => categories.add(s.category));
  });

  // Build headers
  const headers = airframe.pylons.map((p, pIdx) => ({
    header: p.name,
    accessor: String(p.number),
  }));

  // Find number of stores on pylon with the most stores available
  let maxStoresLength = airframe.pylons.reduce(
    (maxI, el, _i, _arr) => (el.stores.length > maxI ? el.stores.length : maxI),
    0
  );

  // Build a list of data
  let storesData: StoresRow[] = [];
  for (let index = 0; index < maxStoresLength; index++) {
    let row: StoresRow = {};

    headers.forEach(({ accessor }) => {
      row[accessor] = airframe.pylons.find(
        (p, pIdx) => String(p.number) === accessor
      )?.stores[index];
    });

    storesData.push(row);
  }

  // Build columns
  const columnHelper = createColumnHelper<StoresData>();
  const columns = headers.map((header, headerIdx) =>
    columnHelper.accessor((row: any) => row[header.accessor], {
      header: header.header,
      cell: (info) => (info.getValue() ? info.getValue().display_name : ""),
    })
  );

  return (
    <DraggableTable columns={columns} data={storesData} setData={setData} />
  );
};

export default AirframeLoadoutExplorer;
