use crate::models::dcs::{AirframeModel, LauncherModel, WeaponModel};
use crate::models::payload::Payload;

mod models;

/// Main application function
fn main() {
    // Load WEAPONS file into a string.
    let weapons_path = "./data/weapons.json";
    let weapons_file_content = std::fs::read_to_string(weapons_path).unwrap();

    // Load LAUNCHERS file into a string.
    let launchers_path = "./data/launchers.json";
    let launchers_file_content = std::fs::read_to_string(launchers_path).unwrap();

    // Load AIRFRAMES file into a string.
    let airframes_path = "./data/airframes.json";
    let airframes_file_content = std::fs::read_to_string(airframes_path).unwrap();

    // Parse models into typed JSON structure.
    let weapons: Vec<WeaponModel> =
        serde_json::from_str::<Vec<WeaponModel>>(&weapons_file_content).unwrap();

    let launchers: Vec<LauncherModel> =
        serde_json::from_str::<Vec<LauncherModel>>(&launchers_file_content).unwrap();

    let _airframes: Vec<AirframeModel> =
        serde_json::from_str::<Vec<AirframeModel>>(&airframes_file_content).unwrap();

    // println!(
    //     "Find AGM-65D in weapons: {:?}",
    //     &weapons.into_iter().find(|w| w.id == "{4,4,8,77}")
    // );
    //
    // println!(
    //     "Find {{444BA8AE-82A7-4345-842E-76154EFCCA46}} in launchers: {:?}",
    //     &launchers
    //         .into_iter()
    //         .find(|l| l.clsid == "{444BA8AE-82A7-4345-842E-76154EFCCA46}")
    // );

    // if let Some(lm) = launchers
    //     .into_iter()
    //     .find(|l| l.clsid == "{444BA8AE-82A7-4345-842E-76154EFCCA46}") {
    //     // Create an print a launcher
    //     let launcher: Launcher = Launcher::new(&lm, &weapons).unwrap();
    //
    //     println!("## Launcher: {:?}", launcher)
    // };

    // Find a specific LauncherModel (from an aircraft pylon) and make it into a Payload
    let payload = launchers
        .into_iter()
        .find(|l| l.clsid == "{444BA8AE-82A7-4345-842E-76154EFCCA46}")
        .map(|lm| Payload::new(&lm, &weapons).unwrap());

    // ... then debug print the result
    if let Some(l) = payload {
        println!("Payload: {:?}", l)
    }
}
