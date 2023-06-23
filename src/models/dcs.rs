use serde::{Deserialize, Serialize};

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
    pub category: String,
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
    from: u32,
    interval: u32,
    modulation: u32,
    to: u32,
}

/// A struct representing a DCS Airframe's pylon
#[derive(Debug, Serialize, Deserialize)]
pub struct AirframePylonModel {
    pub name: serde_json::Value,
    pub number: u8,
    pub order: u8,
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

// TODO Implement a new() in order to make sure the above serde_json::Values actually get cast to a proper value? https://docs.rs/serde_json/latest/serde_json/value/fn.from_value.html

// {
//     "cms": {
//       "CMDS_Edit": true,
//       "chaff": { "charge_sz": 1, "default": 60, "increment": 30 },
//       "flare": { "charge_sz": 1, "default": 60, "increment": 30 },
//       "total": 120
//     },
//     "full_fidelity": true,
//     "name": "F-16CM bl.50",
//     "pylons": [
//       {
//         "name": 1,
//         "number": 1,
//         "order": 1,
//         "stores": [
//           "{6CEB49FC-DED8-4DED-B053-E1F033FF72D3}",
//           "{AIS_ASQ_T50}"
//         ]
//       },
//       .....
//       {
//         "name": "SMK",
//         "number": 12,
//         "order": 12,
//         "stores": [
//           "{INV-SMOKE-RED}",
//           "{INV-SMOKE-ORANGE}"
//         ]
//       }
//     ],
//     "radios": [
//       {
//         "channels": [
//           { "default": 305000, "modulation": 0, "name": "Channel 1" },
//           { "default": 266000, "modulation": 0, "name": "Channel 20" }
//         ],
//         "name": "COMM 1 (UHF) AN/ARC-164",
//         "ranges": [
//           { "from": 225000, "interval": 25, "modulation": 0, "to": 399975 }
//         ]
//       },
//       {
//         "channels": [
//           { "default": 127000, "modulation": 0, "name": "Channel 1" },
//           { "default": 137000, "modulation": 0, "name": "Channel 20" }
//         ],
//         "name": "COMM 2 (VHF) AN/ARC-222",
//         "ranges": [
//           { "from": 30000, "interval": 25, "modulation": 1, "to": 87975 },
//           { "from": 116000, "interval": 25, "modulation": 0, "to": 155975 }
//         ]
//       }
//     ],
//     "roles": [],
//     "type": "F-16C_50",
//     "weights": { "ammo": 132.6, "empty": 9026, "fuel": 3249, "mtow": 19187 }
//   },
