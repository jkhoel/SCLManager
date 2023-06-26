# SCL Manager

[![Rust](https://github.com/jkhoel/SCLManager/actions/workflows/rust.yml/badge.svg)](https://github.com/jkhoel/SCLManager/actions/workflows/rust.yml)
[![Security Audit](https://github.com/jkhoel/SCLManager/actions/workflows/audit.yml/badge.svg)](https://github.com/jkhoel/SCLManager/actions/workflows/audit.yml)

A Standard Combat Load (SCL) manager for DCS:World

> Concurrent with DCS Open Beta v.2.8.6.41363

## Exporting data from DCS

Run `weapons_export.lua` by adding the following line to the bottom of `C:\DCS\DCS World\MissionEditor\modules\me_mission.lua`:

```lua
base.dofile("D:\\path\\to\\scl_manager\\tools\\weapons_export.lua")
```

## Development

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Typeshare

[Typeshare](https://crates.io/crates/typeshare) ensures we have type-definitions for our Rust bindings inside the `./bindings` folder.

First, make sure to install the `typeshare-cli` (see link above) and then when tagged structs/enums are changed, update the definition file with:

```cmd
npm run typeshare
```

### Run in Development

To run the program in development, use the following command from the project root folder:

```cmd
npm run tauri dev
```
