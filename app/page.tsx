// prettier-ignore
'use client'

import {useState} from "react";

import '@utils/string.extensions'

import BrandText from "@/components/ui/branding";

import style from '@styles/style.module.scss';

import {FlyableAirframe} from "@/bindings/rust";
import useAirframe from "@/bindings/hooks/useAirframe";

import LoadoutExplorer from "@components/widgets/loadout-explorer";
import SelectAirframe from "@components/ui/select/select-airframe";

export default function Home() {
    const [selected, setSelected] = useState<FlyableAirframe>();

    const airframe = useAirframe({id: selected?.id});

    const handleAirframeSelect = (selectedItem: FlyableAirframe) => {
        setSelected(selectedItem);
    };

    return (
        <>
            <header className="w-full p-4 grid grid-flow-col items-center justify-between"
                    style={{backgroundColor: style["bg-titlebar"]}}>
                <div style={{minWidth: "160px"}}>
                    <SelectAirframe
                        callback={handleAirframeSelect}
                    />
                </div>
                <div className="mx-auto text-green-300 font-bold text-lg">
                    {selected?.name}
                </div>
                <div>
                    <BrandText/>
                </div>
            </header>
            <main className="overflow-y-auto">
                {selected && <LoadoutExplorer airframeId={selected.id}/>}
            </main>
            <footer className="absolute w-full bg-sky-900 inset-x-0 bottom-0"
                    style={{backgroundColor: style["bg-titlebar"]}}>
            </footer>
        </>
    );
}


