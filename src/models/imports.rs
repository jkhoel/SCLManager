use serde::{Deserialize, Serialize};

// TODO Write tests that can actually read the exported files and verify they work

/// Model representing the exported Weapon object from DCS
#[derive(Debug, Serialize, Deserialize)]
pub struct WeaponModel {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
}

/// A struct representing the exported Launcher object from DCS
#[derive(Debug, Serialize, Deserialize)]
pub struct LauncherModel {
    pub clsid: String,
    pub category: serde_json::Value,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: Option<String>,
    pub attribute: String,
    pub display_name: String,
    pub weight: Option<f32>,
    pub weapons: Vec<LauncherWeaponModel>,
}

/// A struct representing the exported Weapon for a Launcher object from DCS
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LauncherWeaponModel {
    pub id: String,
    pub quantity: u8,
}

/// A struct representing a DCS Airframe
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframeModel {
    pub cms: Vec<AirframeCmsModel>,
    pub full_fidelity: bool,
    pub name: String,
    pub pylons: Vec<AirframePylonModel>,
    pub radios: Vec<AirframeRadioModel>,
    #[serde(rename(deserialize = "type"))]
    pub _type: String,
    pub weights: AirframeWeightsModel,
}

/// A struct representing a DCS Airframe's counter-measure system (CMS)
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframeCmsModel {
    #[serde(rename(deserialize = "CMDS_Edit"))]
    pub can_edit: bool,
    pub chaff: AirframeCmsDispenserModel,
    pub flare: AirframeCmsDispenserModel,
    pub total: serde_json::Value,
}

/// A struct defining a CMS dispenser
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframeCmsDispenserModel {
    #[serde(rename(deserialize = "charge_sz"))]
    pub charge: u8,
    pub default: u8,
    pub increment: u8,
}

/// A struct defining an Airframe Radio
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframeRadioModel {
    channels: Vec<AirframeRadioChannelModel>,
    name: String,
    ranges: Vec<AirframeRadioRangeModel>,
}

/// A struct that defines the channels of an AirframeRadioModel
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframeRadioChannelModel {
    default: u32,
    modulation: u32,
    name: String,
}

#[derive(Debug, Serialize, Deserialize)]
/// A struct that defines the frequency ranges of an AirframeRadioModel
pub struct AirframeRadioRangeModel {
    from: f32,
    interval: u32,
    modulation: u32,
    to: f32,
}

/// A struct representing a DCS Airframe's pylon
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframePylonModel {
    pub name: serde_json::Value,
    pub number: u16,
    pub order: u16,
    pub stores: Vec<String>,
}

/// Represents values for AirframeModel weights
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframeWeightsModel {
    pub ammo: serde_json::Value,
    pub empty: serde_json::Value,
    pub fuel: serde_json::Value,
    pub mtow: serde_json::Value,
}
