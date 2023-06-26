"use client";

import Image from "next/image";
import { useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { Airframe, FlyableAirframe, Handlers } from "@/bindings/types";

export default function Home() {
  useEffect(() => {
    invoke<FlyableAirframe>(Handlers.GetFlyableAirframes)
      .then((flyables) => console.log(flyables))
      .catch(console.error);

    invoke<Airframe>(Handlers.GetAirframeById, { id: "F-16C_50" })
      .then((flyables) => console.log(flyables))
      .catch(console.error);
  }, []);

  return (
    <main>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-900 py-6 text-base leading-7 text-gray-600">
        <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
          <div className="mx-auto max-w-md">Hello World!</div>
        </div>
      </div>
    </main>
  );
}
