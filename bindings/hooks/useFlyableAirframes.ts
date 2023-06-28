import { invoke } from "@tauri-apps/api/tauri";
import { FlyableAirframe, Handlers } from "../rust";
import { useEffect, useState } from "react";

export default function useFlyableAirframes() {
    const [flyableAirframes, setFlyableAirframes] = useState<FlyableAirframe[]>();

    useEffect(() => {
        invoke<FlyableAirframe[]>(Handlers.GetFlyableAirframes)
            .then((flyables) => setFlyableAirframes(flyables))
            .catch(console.error);


    }, []);

    return flyableAirframes;
}