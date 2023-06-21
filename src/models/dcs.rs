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
// TODO: Fix the DCS export file to include id
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LauncherWeaponModel {
    pub id: String,
    pub quantity: u8,
}

/// A weapon as used in this application (Do we need all fields?)
#[derive(Debug)]
pub struct Weapon {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
    pub quantity: Option<u8>,
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
    weapons: Option<Vec<Weapon>>,
}

impl Launcher {
    pub(crate) fn new(
        launcher_model: &LauncherModel,
        weapon_models: &[WeaponModel],
    ) -> Result<Launcher, &'static str> {
        let _weapons = launcher_model.weapons.clone().into_iter().map(|lwm| {
            let wm: Option<&WeaponModel> = weapon_models.iter().find(|wm| wm.id == lwm.id);

            wm.map(|wm| Weapon {
                id: wm.id.clone(),
                display_name: "".to_string(),
                name: "".to_string(),
                ws_type: "".to_string(),
                quantity: None,
            });
        });

        // let weapons = launcher_model.weapons.into_iter().map(|lwm| {
        //     let weapon = weapon_models.into_iter().find(|wm| wm.id == &lwm.id);
        //
        //     let quantity: u8 = match lwm.quantity {
        //         Some(q) => q,
        //         None => 0
        //     };
        //
        //     match weapon {
        //         Ok(weapon) =>  Weapon {
        //             id: weapon.id,
        //             display_name: weapon.display_name,
        //             name: weapon.name,
        //             ws_type: weapon.ws_type,
        //             quantity: Option::from(quantity)
        //         },
        //         Err(err) => err,
        //     }
        //
        //
        // });

        // Return a new launcher object
        Ok(Launcher {
            clsid: launcher_model.clsid.clone(),
            category: launcher_model.category.clone(),
            kind_of_shipping: launcher_model.kind_of_shipping,
            adapter_type: launcher_model.adapter_type.clone(),
            attribute: launcher_model.attribute.clone(),
            display_name: launcher_model.display_name.clone(),
            weight: launcher_model.weight,
            weapons: None,
            // weapons: Some(vec![Weapon {
            //     id: "someid".into(),
            //     display_name: "Some ID".into(),
            //     name: "some_id".into(),
            //     ws_type: "someWS".into(),
            //     quantity: Some(1),
            // }])
        })
    }
}
