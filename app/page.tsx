"use client";

import { useEffect, useState } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { Airframe, FlyableAirframe, Handlers } from "@/bindings/rust";

import StyledListBox, { StyledListBoxItem } from "@/components/ui/listbox";
import BrandText from "@/components/ui/branding";

const fakeItems: StyledListBoxItem[] = [
  { id: 1, label: "foo", value: "foo" },
  { id: 2, label: "bar", value: "bar" },
  { id: 3, label: "baz", value: "baz" },
];

export default function Home() {
  const [flyableAirframes, setFlyableAirframes] = useState<FlyableAirframe[]>();
  const [selected, setSelected] = useState<StyledListBoxItem>({
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

  const handleAirframeSelect = (selectedItem: StyledListBoxItem) => {
    setSelected(selectedItem);
  };

  return (
    <main>
      <div className="relative flex min-h-screen flex-col justify-start items-center overflow-hidden bg-slate-900 text-base leading-7 text-black">
        <div className="grid grid-flow-row auto-rows-max min-w-full mx-2">
          <div
            id="header-menu-container"
            className="p-4 grid grid-flow-col justify-between bg-slate-800"
          >
            <div>
              <AirframeSelectListBox
                airframes={flyableAirframes}
                callback={handleAirframeSelect}
              />
            </div>
            <div className="justify-end flex items-center ">
              <BrandText />
            </div>
          </div>
          <div className="mx-auto text-white">{selected.label}</div>
        </div>
      </div>
    </main>
  );
}

type AirframeSelectListBox = {
  airframes?: FlyableAirframe[];
  callback?: (selectedItem: StyledListBoxItem) => void;
};

const AirframeSelectListBox: React.FC<AirframeSelectListBox> = ({
  airframes,
  callback,
}) => {
  const [airframeItems, setAirframeItems] = useState<StyledListBoxItem[]>();

  useEffect(() => {
    if (airframes) {
      const items: StyledListBoxItem[] = airframes.map(
        (airframe, airframeIdx) => ({
          id: airframe.id ?? airframeIdx,
          label: airframe.name,
          value: airframe.id ?? airframeIdx,
        })
      );

      setAirframeItems(items);
    }
  }, [airframes, setAirframeItems]);

  if (!airframeItems) return <></>;

  return (
    <StyledListBox
      items={airframeItems}
      callback={callback ? callback : console.log}
    />
  );
};
