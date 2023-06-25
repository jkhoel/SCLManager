///
/// These structs represent data imported from DCS with the included LUA
/// script. As time passes, the ED devs might change their API, and so having
/// typed imports enables us to verify our data-structures before shipping data
/// up front to the user.
///
pub mod imports;

///
/// A Payload structs represent some combination of a launcher (or pylon)
/// with one or more weapons attached. Typically they represent some payload that
/// can be hung from aircraft weapon stores/stations.
///
pub mod payload;

///
/// An Airframe struct represents a complete, full definition of an airframe, with all attributes
/// and launcher/weapon combinations available to that particular airframe.
///
pub mod airframe;