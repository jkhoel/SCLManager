use crate::models::imports::{LauncherModel, WeaponModel};
use serde::{Deserialize, Serialize};

/// A `PayloadWeapon` represents weapon(s) hung from a launcher represented as a `Payload`
#[derive(Debug, Deserialize, Serialize)]
pub struct PayloadWeapon {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
    pub quantity: u8,
}

/// A `Payload` is an struct representing some combination of a launcher or pylon with a weapon that can be hung on an aircraft's station.
#[derive(Debug, Deserialize, Serialize)]
pub struct Payload {
    pub clsid: String,
    pub category: String,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: String,
    pub attribute: String,
    pub display_name: String,
    pub weight: f32,
    pub weapons: Option<Vec<PayloadWeapon>>,
}

impl Payload {
    /// Returns a new Payload created for the supplied DCS LauncherModel
    ///
    /// # Arguments
    ///
    /// * `&LauncherModel` - A LauncherModel that we want to make into a Payload
    /// * `&[WeaponModel]` - A collection (slice) of all available WeaponModels. Used to match and populate the `Payload.weapons` field with `Vec<PayloadWeapon>`
    ///
    /// # Examples
    ///
    /// Look up a certain Launcher and convert it into a Pyload:
    /// ```
    /// let payload = launchers
    ///     .into_iter()
    ///     .find(|l| l.clsid == "{444BA8AE-82A7-4345-842E-76154EFCCA46}")
    ///     .map(|lm| Payload::new(&lm, &weapons).unwrap());
    /// ```

    pub(crate) fn new(
        launcher_model: &LauncherModel,
        weapon_models: &[WeaponModel],
    ) -> Result<Payload, &'static str> {
        let _weapons: Option<Vec<PayloadWeapon>> = launcher_model
            .weapons
            .clone()
            .into_iter()
            .map(|lwm| {
                let wm = weapon_models.iter().find(|wm| wm.id == lwm.id);

                match wm {
                    None => None,
                    Some(w) => Some(PayloadWeapon {
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
        Ok(Payload {
            clsid: launcher_model.clsid.to_owned(),
            category: match launcher_model.category.is_string() {
                true => launcher_model.category.to_string(),
                _ => "Other".to_string(),
            },
            kind_of_shipping: launcher_model.kind_of_shipping.to_owned(),
            adapter_type: launcher_model.adapter_type.clone().unwrap_or(0.to_string()),
            attribute: launcher_model.attribute.to_owned(),
            display_name: launcher_model.display_name.to_owned(),
            weight: launcher_model.weight.unwrap_or(0.0),
            weapons: _weapons,
        })
    }
}
