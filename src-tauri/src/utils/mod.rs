pub mod resources {
    use std::path::PathBuf;

    use crate::models::imports::{AirframeModel, LauncherModel, WeaponModel};

    /// Resolves a path-name for a file in the resource folders
    pub fn resolve_resource_path(handle: tauri::AppHandle, path: &str) -> PathBuf {
        handle
            .path_resolver()
            .resolve_resource(path)
            .expect("Failed to resolve resource")
    }

    /// Helper function that reads a JSON object from the resource files and
    /// returns a vector of the supplied type
    pub fn get_json_resource<T>(handle: tauri::AppHandle, path: &str) -> Vec<T>
    where
        T: for<'a> serde::Deserialize<'a>,
    {
        let path = resolve_resource_path(handle, path);
        let file_content = &std::fs::read_to_string(path).unwrap();

        serde_json::from_str::<Vec<T>>(file_content).unwrap()
    }

    /// Helper function to get a vector of all Airframe models from the library files
    pub fn get_airframe_models(handle: tauri::AppHandle) -> Vec<AirframeModel> {
        get_json_resource::<AirframeModel>(handle, "resources/library/airframes.json")
    }

    /// Helper function to get a vector of all Launcher models from the library files
    pub fn get_launcher_models(handle: tauri::AppHandle) -> Vec<LauncherModel> {
        get_json_resource::<LauncherModel>(handle, "resources/library/launchers.json")
    }

    /// Helper function to get a vector of all Weapon models from the library files
    pub fn get_weapon_models(handle: tauri::AppHandle) -> Vec<WeaponModel> {
        get_json_resource::<WeaponModel>(handle, "resources/library/weapons.json")
    }
}
