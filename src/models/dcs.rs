use serde::{Deserialize, Serialize};

/// Model representing the exported Weapon object from DCS
#[derive(Debug, Serialize, Deserialize)]
pub struct WeaponModel {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
}

/// Model representing the exported Launcher object from DCS
#[derive(Debug, Serialize, Deserialize)]
pub struct LauncherModel {
    pub clsid: String,
    pub category: String,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: Option<String>,
    pub attribute: String,
    pub display_name: String,
    pub weight: Option<f32>,
    //pub weapons: LauncherWeapon, TODO!
}

/// Model representing the exported Weapon for a Launcher object from DCS
// TODO: Fix the DCS export file to include id
#[derive(Debug, Serialize, Deserialize)]
pub struct LauncherWeapon {
    pub id: String,
    pub quantity: u8,
}

/// A weapon as used in this application (Do we need all fields?)
pub struct Weapon {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
    pub quantity: Option<u8>,
}

/// A launcher as used in this application (Do we need all fields?)
pub struct Launcher {
    pub clsid: String,
    pub category: String,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: Option<String>,
    pub attribute: String,
    pub display_name: String,
    pub weight: Option<f32>,
    weapons: Vec<Weapon>,
}

impl Launcher {
    fn new(launcher_model: LauncherModel) -> Launcher {
        // TODO: Look up the weapon based on the launcher_model.weapons ID and create a Weapon from it
        let weapons = Weapon {
            id: "someid".to_string(),
            display_name: "Some ID".to_string(),
            name: "some_id".to_string(),
            ws_type: "someWS".to_string(),
            quantity: Some(1),
        };

        // Return a new launcher object
        Launcher(weapons: vec![weapons], ..launcher_model)
    }
}
