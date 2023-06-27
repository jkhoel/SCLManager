import { FlyableAirframe } from "@/bindings/rust";
import StyledListBox, { StyledListBoxItem } from "@/components/ui/listbox";
import { useState, useEffect } from "react";

type AirframeSelectListBox = {
  airframes?: FlyableAirframe[];
  callback?: (selectedItem: StyledListBoxItem) => void;
};

const AirframeSelectListBox: React.FC<AirframeSelectListBox> = ({
  airframes,
  callback,
  ...rest
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
      {...rest}
    />
  );
};

export default AirframeSelectListBox;
