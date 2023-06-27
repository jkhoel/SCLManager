use crate::models::imports::{AirframeModel, WeaponModel};
use crate::models::payload::Payload;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use super::imports::LauncherModel;

#[derive(Debug, Deserialize, Serialize)]
#[typeshare]
pub struct AirframePylon {
    name: String,
    number: u16,
    order: u16,
    stores: Vec<Payload>,
}

/// An Airframe struct represents a complete airframe with all available properties
/// and weapons/launcer combinations for each pylon (station)
#[typeshare]
#[derive(Debug, Deserialize, Serialize)]
pub struct Airframe {
    pub id: String,
    pub name: String,
    // pub cms: Vec<AirframeCmsModel>,
    pub pylons: Vec<AirframePylon>,
    // pub radios: Vec<AirframeRadioModel>,
    // pub weights: AirframeWeightsModel,
}

impl Airframe {
    ///
    /// Returns an Airframe representing a flyable aircraft in DCS, with available
    /// aircraft options and weapon payloads.
    ///
    /// # Arguments
    ///
    /// * `&airframe_model` - An AirframeModel that we want to convert into an Airframe
    /// * `&[LauncherModel]` - A collection (slice) of all available LauncherModels. Used to match and populate `Aircraft.stores` fields with available loadouts
    /// * `&[WeaponModel]` - A collection (slice) of all available WeaponModels. Used to match and populate the `Payload.weapons` field with `Vec<PayloadWeapon>`
    ///
    /// # Examples
    ///
    /// Look up a certain aircraft and convert it into a Airframe:
    /// ```
    /// let f16cm50 = airframes
    ///     .into_iter()
    ///     .find(|am| am._type == "F-16C_50")
    ///     .map(|afm| Airframe::new(&afm.into(), &launchers, &weapons));
    /// ```

    pub(crate) fn new(
        airframe_model: &AirframeModel,
        launcher_models: &[LauncherModel],
        weapon_models: &[WeaponModel],
    ) -> Result<Airframe, &'static str> {
        let _pylons: Vec<AirframePylon> = airframe_model
            .pylons
            .clone()
            .into_iter()
            .map(|pm| {
                let _stores: Option<Vec<Payload>> = pm
                    .stores
                    .into_iter()
                    .map(|clsid| {
                        let lm = launcher_models.iter().find(|_lm| _lm.clsid == clsid);

                        match lm {
                            None => None,
                            Some(l) => Payload::new(l, weapon_models).ok(),
                        }
                    })
                    .collect();

                AirframePylon {
                    name: pm.name.to_string(),
                    number: pm.number,
                    order: pm.order,
                    stores: _stores.unwrap_or(vec![]),
                }
            })
            .collect();

        Ok(Airframe {
            id: airframe_model._type.clone(),
            name: airframe_model.name.clone(),
            // cms: airframe_model.cms.to_owned(),
            pylons: _pylons,
            // radios: airframe_model.radios.to_owned(´),
            // weights: airframe_model.weights,
        })
    }
}
