// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::generate_handler;

use crate::handlers::airframe::{get_airframe_by_id, get_flyable_airframes};

mod handlers;
mod models;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![get_flyable_airframes, get_airframe_by_id])
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// use crate::models::airframe::Airframe;
// use crate::models::imports::{AirframeModel, LauncherModel, WeaponModel};

// mod models;

// /// Main application function
// fn main() {
//     // Load WEAPONS file into a string.
//     let weapons_path = "./data/weapons.json";
//     let weapons_file_content = std::fs::read_to_string(weapons_path).unwrap();

//     // Load LAUNCHERS file into a string.
//     let launchers_path = "./data/launchers.json";
//     let launchers_file_content = std::fs::read_to_string(launchers_path).unwrap();

//     // Load AIRFRAMES file into a string.
//     let airframes_path = "./data/airframes.json";
//     let airframes_file_content = std::fs::read_to_string(airframes_path).unwrap();

//     // Parse models into typed JSON structure.
//     let weapons: Vec<WeaponModel> =
//         serde_json::from_str::<Vec<WeaponModel>>(&weapons_file_content).unwrap();

//     let launchers: Vec<LauncherModel> =
//         serde_json::from_str::<Vec<LauncherModel>>(&launchers_file_content).unwrap();

//     let airframes: Vec<AirframeModel> =
//         serde_json::from_str::<Vec<AirframeModel>>(&airframes_file_content).unwrap();

//     // Find a specific AircraftModel and make it into an Airframe
//     let f16cm50 = airframes
//         .into_iter()
//         .find(|am| am._type == "F-16C_50")
//         .map(|afm| Airframe::new(&afm, &launchers, &weapons));

//     // ... then debug print it
//     println!("{}", serde_json::to_string_pretty(&f16cm50).unwrap());
// }
