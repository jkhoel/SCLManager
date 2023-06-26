pub mod data_files {
    use crate::models::imports::{AirframeModel, LauncherModel, WeaponModel};

    pub fn get_airframe_models() -> Vec<AirframeModel> {
        let path = "./data/airframes.json";
        let file_content = &std::fs::read_to_string(path).unwrap();

        serde_json::from_str::<Vec<AirframeModel>>(file_content).unwrap()
    }

    pub fn get_launcher_models() -> Vec<LauncherModel> {
        let path = "./data/launchers.json";
        let file_content = &std::fs::read_to_string(path).unwrap();

        serde_json::from_str::<Vec<LauncherModel>>(file_content).unwrap()
    }

    pub fn get_weapon_models() -> Vec<WeaponModel> {
        let path = "./data/weapons.json";
        let file_content = &std::fs::read_to_string(path).unwrap();

        serde_json::from_str::<Vec<WeaponModel>>(file_content).unwrap()
    }
}
