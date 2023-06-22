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
    pub weapons: Vec<LauncherWeaponModel>,
}

/// Model representing the exported Weapon for a Launcher object from DCS
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LauncherWeaponModel {
    pub id: String,
    pub quantity: u8,
}

/// A weapon as used in this application (Do we need all fields?)
#[derive(Debug)]
pub struct LauncherWeapon {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
    pub quantity: u8,
}

/// A launcher as used in this application (Do we need all fields?)
#[derive(Debug)]
pub struct Launcher {
    pub clsid: String,
    pub category: String,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: Option<String>,
    pub attribute: String,
    pub display_name: String,
    pub weight: Option<f32>,
    pub weapons: Option<Vec<LauncherWeapon>>,
}

impl Launcher {
    pub(crate) fn new(
        launcher_model: &LauncherModel,
        weapon_models: &[WeaponModel],
    ) -> Result<Launcher, &'static str> {
        let _weapons: Option<Vec<LauncherWeapon>> = launcher_model
            .weapons
            .clone()
            .into_iter()
            .map(|lwm| {
                let wm = weapon_models.iter().find(|wm| wm.id == lwm.id);

                match wm {
                    None => None,
                    Some(w) => Some(LauncherWeapon {
                        id: w.id.to_owned(),
                        display_name: w.display_name.to_owned(),
                        name: w.name.to_owned(),
                        ws_type: w.ws_type.to_owned(),
                        quantity: lwm.quantity.to_owned(),
                    }),
                }
            })
            .collect();

        // Return a new launcher object
        Ok(Launcher {
            clsid: launcher_model.clsid.to_owned(),
            category: launcher_model.category.to_owned(),
            kind_of_shipping: launcher_model.kind_of_shipping.to_owned(),
            adapter_type: launcher_model.adapter_type.to_owned(),
            attribute: launcher_model.attribute.to_owned(),
            display_name: launcher_model.display_name.to_owned(),
            weight: launcher_model.weight.to_owned(),
            weapons: _weapons,
        })
    }
}
