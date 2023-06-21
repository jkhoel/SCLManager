use crate::models::dcs::{Launcher, LauncherModel, WeaponModel};

mod models;

fn main() {
    // Load WEAPONS file into a string.
    let weapons_path = "./data/weapons.json";
    let weapons_file_content = std::fs::read_to_string(weapons_path).unwrap();

    // Parse the string into a dynamically-typed JSON structure.
    let weapons: Vec<WeaponModel> =
        serde_json::from_str::<Vec<WeaponModel>>(&weapons_file_content).unwrap();

    //println!("{:?}", weapons);

    println!(
        "Find AGM-65D in weapons: {:?}",
        weapons.into_iter().find(|w| w.id == "{4,4,8,77}")
    );

    // Load LAUNCHER file into a string.
    let launchers_path = "./data/launchers.json";
    let launchers_file_content = std::fs::read_to_string(launchers_path).unwrap();

    // Parse the string into a dynamically-typed JSON structure.
    let launchers: Vec<LauncherModel> =
        serde_json::from_str::<Vec<LauncherModel>>(&launchers_file_content).unwrap();

    //println!("{:?}", launchers);

    println!(
        "Find {{444BA8AE-82A7-4345-842E-76154EFCCA46}} in launchers: {:?}",
        launchers
            .into_iter()
            .find(|l| l.clsid == "{444BA8AE-82A7-4345-842E-76154EFCCA46}")
    );

    match launchers
        .into_iter()
        .find(|l| l.clsid == "{444BA8AE-82A7-4345-842E-76154EFCCA46}")
    {
        Some(lm) => {
            // Create an print a launcher
            let launcher = Launcher::new(&lm {}, &weapons);
        }
        _ => (),
    };
}
