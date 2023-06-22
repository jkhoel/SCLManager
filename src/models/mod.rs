///
/// These structs represent data as exported from DCS with the included LUA
/// script. As time passes, the ED devs might change their API, and so having
/// typed imports enables us to verify our data-structures before shipping data
/// up front to the user.
///
pub mod dcs;

///
/// A Payload structs represent some combination of a launcher (or pylon)
/// with one or more weapons attached. Typically they represent some payload that
/// can be hung from aircraft weapon stores/stations.
///
pub mod payload;
