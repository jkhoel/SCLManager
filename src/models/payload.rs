use crate::models::dcs::{LauncherModel, WeaponModel};

///
/// Payloads are structs representing some combination of a launcher (or pylon)
/// with one or more weapons attached. Typically they represent some payload that
/// can be hung from aircraft weapon stores/stations.
///

/// A weapon as used in this application (Do we need all fields?)
#[derive(Debug)]
pub struct PayloadWeapon {
    pub id: String,
    pub display_name: String,
    pub name: String,
    pub ws_type: String,
    pub quantity: u8,
}

/// A Payload is an struct representing some combination of a launcher or pylon with a weapon that can be hung on an aircraft's station.
#[derive(Debug)]
pub struct Payload {
    pub clsid: String,
    pub category: String,
    pub kind_of_shipping: Option<u8>,
    pub adapter_type: Option<String>,
    pub attribute: String,
    pub display_name: String,
    pub weight: Option<f32>,
    pub weapons: Option<Vec<PayloadWeapon>>,
}

impl Payload {
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
