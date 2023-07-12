// prettier-ignore
'use client'

import {useState} from "react";

import '@utils/string.extensions'

import BrandText from "@/components/ui/branding";
import SelectAirframe from "@components/widgets/select-airframe";


import style from '@styles/style.module.scss';

import {FlyableAirframe} from "@/bindings/rust";
import LoadoutExplorerTable from "@components/widgets/table-loadout-explorer";
import {Text} from "@blueprintjs/core";

export default function Home() {
    const [selected, setSelected] = useState<FlyableAirframe>();


    const handleAirframeSelect = (selectedItem: FlyableAirframe) => {
        setSelected(selectedItem);
    };

    return (
        <>
            <header className="w-full p-4 grid grid-flow-col items-center justify-between"  style={{backgroundColor: style["bg-titlebar"]}}>
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
            </header>
            <main className="overflow-y-auto">
                    {selected && <LoadoutExplorerTable airframeId={selected.id}/>}
            </main>
            <footer className="absolute w-full bg-sky-900 inset-x-0 bottom-0" style={{backgroundColor: style["bg-titlebar"]}}>
                <Text>Footer</Text>
            </footer>
        </>
    );
}


