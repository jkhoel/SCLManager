import BrandText from "@/components/ui/branding";
import AirframeSelectListBox from "@/components/widgets/airframe-selector-listbox";
import useFlyableAirframes from "@/bindings/hooks/useFlyableAirframes";
import AirframeLoadoutExplorer from "@/components/widgets/airframe-loadout-explorer";
import { StyledListBoxItem } from "@/components/ui/listbox";
import { useState } from "react";

export default function App() {
  const [selected, setSelected] = useState<StyledListBoxItem>({
    id: 1,
    label: "Hello world!",
    value: 1,
  });

  const flyableAirframes = useFlyableAirframes();

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

          <div className="overflow-x-scroll">
            <AirframeLoadoutExplorer id={selected.id as string} />
          </div>
        </div>
      </div>
    </main>
  );
}
