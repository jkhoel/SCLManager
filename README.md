# SCL Manager

[![Rust](https://github.com/jkhoel/SCLManager/actions/workflows/rust.yml/badge.svg)](https://github.com/jkhoel/SCLManager/actions/workflows/rust.yml)
[![Security Audit](https://github.com/jkhoel/SCLManager/actions/workflows/audit.yml/badge.svg)](https://github.com/jkhoel/SCLManager/actions/workflows/audit.yml)

A Standard Combat Load (SCL) manager for DCS:World

## Exporting data from DCS

Run `weapons_export.lua` by adding the following line to the bottom of `C:\DCS\DCS World\MissionEditor\modules\me_mission.lua`:

```lua
base.dofile("D:\\path\\to\\scl_manager\\tools\\weapons_export.lua")
```
