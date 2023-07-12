// prettier-ignore
'use client'

import { useState } from "react";

import '@utils/string.extensions'

import BrandText from "@/components/ui/branding";
import SelectAirframe from "@components/widgets/select-airframe";


import style from '@styles/style.module.scss';

import {FlyableAirframe} from "@/bindings/rust";
import LoadoutExplorerTable from "@components/widgets/table-loadout-explorer";

export default function Home() {
  const [selected, setSelected] = useState<FlyableAirframe>();


  const handleAirframeSelect = (selectedItem: FlyableAirframe) => {
    setSelected(selectedItem);
  };

  return (
    <main className="bp5-dark overscroll-none overflow-hidden">
      <div className="relative flex min-h-screen flex-col justify-start items-center bg-titlebar leading-7 text-white" style={{backgroundColor: style["bg-main"]}}>
        <div className="grid grid-flow-row auto-rows-max min-w-full mx-2">
          <div
            id="header-menu-container"
            className="p-4 grid grid-flow-col justify-between items-center bg-slate-800"
            style={{backgroundColor: style["bg-titlebar"]}}
          >
            <div style={{ minWidth: "160px" }}>
              <SelectAirframe
                callback={handleAirframeSelect}
              />
            </div>
            <div className="mx-auto text-green-300 font-bold text-lg">
              {selected?.name}
            </div>
            <div>
              <BrandText />
            </div>
          </div>

          <div className="overflow-x-scroll">
            {selected && <LoadoutExplorerTable airframeId={selected.id} />}
          </div>
        </div>
      </div>
    </main>
  );
}
