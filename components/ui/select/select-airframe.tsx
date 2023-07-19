import {FlyableAirframe} from "@/bindings/rust";
import {useEffect, useState} from "react";
import useFlyableAirframes from "@/bindings/hooks/useFlyableAirframes";
import {ItemRenderer, Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

type SelectAirframeProps = {
    callback?: (selectedItem: FlyableAirframe) => void;
};

const SelectAirframe: React.FC<SelectAirframeProps> = ({callback}) => {
    const [selectedAirframe, setSelectedAirframe] = useState<FlyableAirframe | undefined>()
    const flyableAirframes = useFlyableAirframes();

    useEffect(() => {
        if (flyableAirframes) {
            // TODO: add some user config to select the airframe from the last session
            flyableAirframes.length > 0 ? setSelectedAirframe(flyableAirframes.find(airframes => airframes.name.includes("F-16"))) : null
        }
    }, [flyableAirframes, setSelectedAirframe])

    if (callback && selectedAirframe) {
        callback(selectedAirframe)
    }
    const itemRenderer: ItemRenderer<FlyableAirframe> = (airframe, {handleClick, handleFocus, modifiers, query}) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }

        return (
            <MenuItem text={`${airframe.name}`} key={airframe.id} active={modifiers.active}
                      disabled={modifiers.disabled} onClick={handleClick} onFocus={handleFocus}
                      roleStructure={"listoption"}/>
        )
    }

    return (<Select<FlyableAirframe> items={flyableAirframes ?? []} itemRenderer={itemRenderer}
                                     onItemSelect={setSelectedAirframe} filterable={false} fill={true}>
        <Button text={selectedAirframe?.name} rightIcon="caret-down" placeholder="Select an Airframe"/>
    </Select>)
}

export default SelectAirframe;