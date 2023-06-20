use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Weapon {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Launcher {
    pub clsid: String,
    pub category: String,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: Option<String>,
    pub attribute: String,
    pub display_name: String,
    pub weight: Option<f32>,
    //pub weapons: LauncherWeapon, TODO!
}


// TODO: LauncherWeapon should reference an actual weapon directly, like weapon: Weapon instead of id
#[derive(Debug, Serialize, Deserialize)]
pub struct LauncherWeapon {
    pub id: String,
    pub quantity: u8
}