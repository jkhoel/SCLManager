"use client";

import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { Airframe, FlyableAirframe, Handlers } from "@/bindings/rust";

import StyledListBox, { StyledListBoxItem } from "@/components/ui/listbox";
import BrandText from "@/components/ui/branding";
import DraggableTable, {
  DragableDataHeader,
  createColumnsFromHeaders,
} from "@/components/ui/table";
import AirframeSelectListBox from "@/components/widgets/airframe-selector-listbox";
import useFlyableAirframes from "@/bindings/hooks/useFlyableAirframes";
import useAirframe from "@/bindings/hooks/useAirframe";

type FakeDataType = {
  col1: string;
  col2: string;
  col3: string;
};

const fakeData: FakeDataType[] = [
  {
    col1: "somedata11",
    col2: "somedata22",
    col3: "somedata33",
  },
  {
    col1: "somedata4",
    col2: "somedata5",
    col3: "somedata6",
  },
];

const fakeDataHeaders: DragableDataHeader<FakeDataType>[] = [
  {
    header: "Col11",
    accessor: "col1",
  },
  {
    header: "Col12",
    accessor: "col2",
  },
  {
    header: "Col12",
    accessor: "col3",
  },
];

// const columnHelper = createColumnHelper<FakeDataType>();

// const columns = fakeDataHeaders.map((header, headerIdx) =>
//   columnHelper.accessor((row: FakeDataType) => row[header.accessor], {
//     header: header.header,
//     cell: (info) => info.getValue(),
//   })
// );

const columns = createColumnsFromHeaders(fakeDataHeaders);

export default function Home() {
  // const [flyableAirframes, setFlyableAirframes] = useState<FlyableAirframe[]>();
  const [selected, setSelected] = useState<StyledListBoxItem>({
    id: 1,
    label: "Hello world!",
    value: 1,
  });

  const [data, setData] = useState<FakeDataType[]>(fakeData);

  const flyableAirframes = useFlyableAirframes();

  // useEffect(() => {
  //   invoke<Airframe>(Handlers.GetAirframeById, { id: "F-16C_50" })
  //     .then((flyables) => console.log(flyables))
  //     .catch(console.error);
  // }, []);

  const airframe = useAirframe({ id: selected.id as string });

  console.log(airframe);

  const handleAirframeSelect = (selectedItem: StyledListBoxItem) => {
    setSelected(selectedItem);
  };

  return (
    <main>
      <div className="relative flex min-h-screen flex-col justify-start items-center overflow-hidden bg-slate-900 text-base leading-7 text-black">
        <div className="grid grid-flow-row auto-rows-max min-w-full mx-2">
          <div
            id="header-menu-container"
            className="p-4 grid grid-flow-col justify-between items-center bg-slate-800"
          >
            <div style={{ minWidth: "160px" }}>
              <AirframeSelectListBox
                airframes={flyableAirframes}
                callback={handleAirframeSelect}
              />
            </div>
            <div className="mx-auto text-green-300 font-bold text-lg">
              {selected.label}
            </div>
            <div>
              <BrandText />
            </div>
          </div>
          <div>
            <DraggableTable columns={columns} data={data} setData={setData} />
          </div>
        </div>
      </div>
    </main>
  );
}
