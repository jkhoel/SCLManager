use serde::{Deserialize, Serialize};

pub mod airframe;

#[typeshare::typeshare]
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Handlers {
    GetFlyableAirframes,
    GetAirframeById,
}
