import { invoke } from "@tauri-apps/api/tauri";
import { Airframe, Handlers } from "../rust";
import { useEffect, useState } from "react";

type UseAirframeProps = {
    id?: string
}

export default function useAirframe({ id }: UseAirframeProps) {
    const [airframe, setAirframe] = useState<Airframe>();


    useEffect(() => {
        invoke<Airframe>(Handlers.GetAirframeById, { id })
            .then((af) => setAirframe(af))
            .catch(console.error);

    }, [id]);

    return airframe;
}