use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::{
    models::airframe::Airframe,
    utils::resources::{get_airframe_models, get_launcher_models, get_weapon_models},
};

#[derive(Debug, Deserialize, Serialize)]
#[typeshare]
pub struct FlyableAirframe {
    pub id: String,
    pub name: String,
}

#[tauri::command]
pub fn get_flyable_airframes(handle: tauri::AppHandle) -> Vec<FlyableAirframe> {
    let airframes = get_airframe_models(handle);

    airframes
        .into_iter()
        .filter(|af| af.full_fidelity)
        .map(|af| FlyableAirframe {
            id: af._type,
            name: af.name,
        })
        .collect()
}

#[tauri::command]
pub fn get_airframe_by_id(handle: tauri::AppHandle, id: &str) -> Result<Airframe, &'static str> {
    let airframe_models = get_airframe_models(handle.clone());
    let launcher_models = get_launcher_models(handle.clone());
    let weapon_models = get_weapon_models(handle);

    let afm = airframe_models.into_iter().find(|afm| afm._type == id);

    match afm {
        Some(afm) => Airframe::new(&afm, &launcher_models, &weapon_models),
        None => Err("Unabel to find an airframe for the supplied airframe id"),
    }
}
