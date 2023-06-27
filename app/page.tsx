"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { Airframe, FlyableAirframe, Handlers } from "@/bindings/rust";
import { Listbox } from "@headlessui/react";
import UIListBox, { ListboxItem } from "@/components/ui/listbox";
import loadConfig from "next/dist/server/config";

const fakeItems: ListboxItem[] = [
  { id: 1, label: "foo", value: "foo" },
  { id: 2, label: "bar", value: "bar" },
  { id: 3, label: "baz", value: "baz" },
];

export default function Home() {
  const [flyableAirframes, setFlyableAirframes] = useState<FlyableAirframe[]>();
  const [selected, setSelected] = useState<ListboxItem>({
    id: 1,
    label: "Hello world!",
    value: 1,
  });

  useEffect(() => {
    invoke<FlyableAirframe[]>(Handlers.GetFlyableAirframes)
      .then((flyables) => setFlyableAirframes(flyables))
      .catch(console.error);

    invoke<Airframe>(Handlers.GetAirframeById, { id: "F-16C_50" })
      .then((flyables) => console.log(flyables))
      .catch(console.error);
  }, []);

  console.log(flyableAirframes);

  const handleAirframeSelect = (selectedItem: ListboxItem) => {
    setSelected(selectedItem);
  };

  return (
    <main>
      <div className="relative flex min-h-screen p-4 flex-col justify-start items-center overflow-hidden bg-slate-900 py-6 text-base leading-7 text-gray-600">
        <div className="grid grid-flow-row auto-rows-max min-w-full bg-white px-4 py-4 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
          <div className="bg-white p-4">
            <AirframeSelectListBox
              airframes={flyableAirframes}
              callback={handleAirframeSelect}
            />
          </div>
          <div className="mx-auto">{selected.label}</div>
        </div>
      </div>
    </main>
  );
}

type AirframeSelectListBox = {
  airframes?: FlyableAirframe[];
  callback?: (selectedItem: ListboxItem) => void;
};

const AirframeSelectListBox: React.FC<AirframeSelectListBox> = ({
  airframes,
  callback,
}) => {
  const [airframeItems, setAirframeItems] = useState<ListboxItem[]>();

  useEffect(() => {
    if (airframes) {
      const items: ListboxItem[] = airframes.map((airframe, airframeIdx) => ({
        id: airframe.id ?? airframeIdx,
        label: airframe.name,
        value: airframe.id ?? airframeIdx,
      }));

      setAirframeItems(items);
    }
  }, [airframes, setAirframeItems]);

  if (!airframeItems) return <></>;

  return (
    <UIListBox
      items={airframeItems}
      callback={callback ? callback : console.log}
    />
  );
};
