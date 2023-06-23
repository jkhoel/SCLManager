-- To use, Edit C:\DCS\DCS World\MissionEditor\modules\me_mission.lua and
-- add to the bottom:
--
--   base.dofile("D:\\00-Github\\00-132nd-Webpage\\scl_manager\\tools\\weapons_export.lua")
--
-- This is very much WIP but wanted to save it as this is
-- what generates teh JSON for the airframe / pylon population
-- It will output files in Saved Games (needs lfs unsanitized)

-- --------------------------------------------------------------------------------------------------------------------
-- MY CHANGES
-- --------------------------------------------------------------------------------------------------------------------
log.write("Weapon Info Here", log.INFO, "weapon info starting...")

local JSON = loadfile("./Scripts/JSON.lua")()

-------------------------------------------------------------------------------
-- aircraft export planes and helicopters - HumanCockpit only exists on installed modules
-------------------------------------------------------------------------------
local flyable = {}
-- Jet engine
flyable["A-10A"] = true
flyable["A-10C"] = true
flyable["A-10C_2"] = true
flyable["AJS37"] = true
flyable["AV8BNA"] = true
flyable["C-101CC"] = true
flyable["C-101EB"] = true
flyable["F-14A-135-GR"] = true
flyable["F-14B"] = true
flyable["F-15C"] = true
flyable["F-16C_50"] = true
flyable["FA-18C_hornet"] = true
flyable["F-5E-3"] = true
flyable["F-86F Sabre"] = true
flyable["Hawk"] = true
flyable["JF-17"] = true
flyable["L-39C"] = true
flyable["L-39ZA"] = true
flyable["M-2000C"] = true
flyable["MB-339A"] = true
flyable["MB-339APAN"] = true
flyable["MiG-15bis"] = true
flyable["MiG-19P"] = true
flyable["MiG-21Bis"] = true
flyable["MiG-29A"] = true
flyable["MiG-29S"] = true
flyable["Mirage-F1CE"] = true
flyable["Mirage-F1EE"] = true
flyable["Su-25"] = true
flyable["Su-25T"] = true
flyable["Su-27"] = true
flyable["Su-33"] = true

-- Piston engine
flyable["Bf-109K-4"] = true
flyable["Christen Eagle II"] = true
flyable["FW-190A8"] = true
flyable["FW-190D9"] = true
flyable["I-16"] = true
flyable["MosquitoFBMkVI"] = true
flyable["P-51D"] = true
flyable["P-51D-30-NA"] = true
flyable["P-47D-30"] = true
flyable["P-47D-30bl1"] = true
flyable["P-47D-40"] = true
flyable["SpitfireLFMkIX"] = true
flyable["SpitfireLFMkIXCW"] = true
flyable["TF-51D"] = true
flyable["Yak-52"] = true

-- Helicopters
flyable["AH-64D_BLK_II"] = true
flyable["Ka-50"] = true
flyable["Mi-8MT"] = true
flyable["Mi-24P"] = true
flyable["SA342L"] = true
flyable["SA342M"] = true
flyable["SA342Minigun"] = true
flyable["SA342Mistral"] = true
flyable["UH-1H"] = true

-- Now we can iterate through our aircraft  / plane
local launchers = {}

-- Outputs
local export_aircraft_data = {}
local export_launchers = {}
local export_weapons = {}

-- reindex weapons_table based on wsType
local weapons_db = {}
local weapons_aliases = {}

-- Helper Functions
local function dump(o, prefix)
    if prefix == nil then
        prefix = ""
    end

    if type(o) == "table" then
        for k, v in pairs(o) do
            if type(v) == "table" then
                dump(v, prefix .. "." .. tostring(k))
            else
                log.write("weapon info", log.INFO, prefix .. "." .. tostring(k) .. ": " .. tostring(v))
            end
        end
    else
        log.write("weapon info", log.INFO, prefix .. ": " .. tostring(o))
    end
end

function ws_type_match(a, b)
    return table.concat(a) == table.concat(b)
end

function load_launchers()
    -- Build a lookup for all the launchers by CLASS ID to valid launchers with a display name
    for cat, cat_info in pairs(db.Weapons.Categories) do
        for _, launcher in ipairs(cat_info.Launchers) do
            if launcher.CLSID ~= nil then
                -- We don't care if a launcher doesn't have a display name, some are only contained in
                -- other launchers (like the M274_HYDRA / M257_HYDRA / M151_HYDRA) and they then reference
                -- a weapon in their own right, so if we have no displayName, we set it to the weapon CLSID
                -- and set hidden to 1 (not that it matters)

                if launcher.displayName == nil then
                    launcher.displayName = launcher.CLSID
                    launcher.hidden = true
                end

                launchers[launcher.CLSID] = launcher
            end
        end
    end
end

function add_to_weapon_db(ws_type, weapon_data)
    -- Use the ws_type table which is the primary mechanism DCS uses for warehousing
    -- individual weapons which is what we ultimately care about
    --
    -- Return: True if added, False if not

    if type(ws_type) ~= "table" then
        log.write("add_to_weapon_db", log.ERROR, "Unable to add weapon to DB, ws_type not a table")
        return false
    end

    if #ws_type ~= 4 then
        log.write("add_to_weapon_db", log.ERROR, "ws_type must have 4 elements to enter")
        return false
    end

    local dest = weapons_db
    for x = 1, 3 do
        local key = tostring(ws_type[x])
        if dest[key] == nil then
            dest[key] = {}
        end
        dest = dest[key]
    end

    -- If it already exists, we bail
    local key = tostring(ws_type[4])
    if dest[key] ~= nil then
        if dest[key].ws_type_str ~= weapon_data.ws_type_str then
            log.write(
                "add_to_weapon_db",
                log.ERROR,
                "ws_type already exists (" .. dest[key].ws_type_str .. ") when adding " .. weapon_data.ws_type_str
            )
        end
        return false
    end

    -- We must not overwrite this, but instead update so references maintain consistency
    dest[key] = weapon_data

    local ws_type_str = "{" .. table.concat(ws_type, ",") .. "}"

    -- If we have a (not so) unique reference name, associate it
    if weapon_data.resource ~= nil then
        weapons_aliases[weapon_data.resource] = dest[key]
    end

    log.write(
        "add_to_weapon_db",
        log.INFO,
        "adding " ..
            ws_type_str ..
                " " ..
                    tostring(weapon_data.resource) ..
                        " " .. weapon_data.name .. " cat: " .. (weapon_data.category or "")
    )

    -- And our ws_type string because unique reference name is fucked
    weapons_aliases["{" .. table.concat(ws_type, ",") .. "}"] = dest[key]

    return true
end

function process_weapon_table_item(item, path)
    if type(item.ws_type) ~= "table" then
        log.write(
            "process_weapon_table_item",
            log.INFO,
            "Skipping item: " .. item.name .. " at " .. path .. ": ws_type not a table"
        )
        return false
    end

    -- Some things reference by the unique resourcen name, both in launchers -> weapons, but also
    -- in game with getAmmo. Despite this, some items don't have a unique reference name, yet do
    -- have one in game, so let's just decide what they should be here if they're not explicitly
    -- set in game

    local unique_resource_name = item._unique_resource_name
    if unique_resource_name == nil then
        log.write("process_weapons_table", log.INFO, "No unique resource name for: " .. item.name .. " using " .. path)
        unique_resource_name = path
    end

    local weapon_data = {
        ["name"] = item.name,
        ["category"] = get_warehouse_category(item.ws_type),
        ["resource"] = unique_resource_name,
        ["display_name"] = item.display_name,
        ["ws_type_str"] = "{" .. table.concat(item.ws_type, ",") .. "}",
        ["ws_type"] = item.ws_type,
        ["path"] = path
    }

    if add_to_weapon_db(item.ws_type, weapon_data) == false then
        log.write(
            "process_weapon_table_item",
            log.INFO,
            "Failed to add to database: " .. unique_resource_name .. " at " .. path
        )
    end
end

function process_weapons_table_level(level, path)
    path = path or ""

    -- recurse through the new API weapons table, as not all items are at the same depth
    -- we continue until we have a name and ws_type, then populate weapon_table_id

    if level.name ~= nil and level.ws_type ~= nil then
        process_weapon_table_item(level, path)
    else
        for k, v in pairs(level) do
            if type(v) == "table" then
                local next_level = path .. "." .. k
                if path == "" then
                    next_level = k
                end
                process_weapons_table_level(v, next_level)
            end
        end
    end
end

function get_weapon_from_wstype(wsType)
    if type(wsType) ~= "table" then
        return weapons_aliases[tostring(wsType)]
    end

    local base = weapons_db
    for x = 1, 4 do
        base = base[tostring(wsType[x])]
        if base == nil then
            return nil
        end
    end

    return base
end

function get_warehouse_category(ws)
    -- At this point we'll try and find our classification, this matters
    -- when the launcher is the "weapon" itself, and used for inventory / wearhousing
    -- but if it has a wsType, then that's what we'll use in the wearhouse

    -- This matches the UI "AA Missiles, AG missiles, AG Rockets, AG Bombs, AG Guided Bombs, Fuel Tanks, Misc"
    --
    -- 1,3,43 = Fuel Tank   (wsType_Air    -> wsType_Free_Fall -> wsType_FuelTank)
    -- 4,4,7  = AA missile  (wsType_Weapon -> wsType_Missile   -> wsType_AA_Missile)
    -- 4,4,8  = AG missiles (wsType_Weapon -> wsType_Missile   -> wsType_AS_Missile)
    -- 4,7,33 = AG rockets  (wsType_Weapon -> wsType_NURS      -> wsType_Rocket)
    -- 4,5,36 = AG Bombs Guided  (wsType_Weapon -> wsType_Bomb -> wsType_Bomb_Guided) => remainder go to AG Bombs)
    -- 4,5,38 = AG Bombs         (wsType_Weapon -> wsType_Bomb -> )

    if type(ws) ~= "table" then
        return nil
    end
    if #ws < 4 then
        return nil
    end

    log.write("get_warehouse_category", log.INFO, "Looking up category for: " .. table.concat(ws, ","))

    -- Level 1 (we can short circuit Fuel Tanks
    if ws[1] == wsType_Air and ws[2] == wsType_Free_Fall and ws[3] == wsType_FuelTank then
        return "Fuel Tank"
    end

    -- Next we know everything should have 4, if not don't assign to a filter
    if ws[1] ~= wsType_Weapon then
        return nil
    end

    -- Missiles
    if ws[2] == wsType_Missile then
        if ws[3] == wsType_AA_Missile then
            return "AA Missiles"
        end
        if ws[3] == wsType_AA_TRAIN_Missile then
            return "AA Missiles"
        end

        if ws[3] == wsType_AS_Missile then
            return "AG Missiles"
        end
        if ws[3] == wsType_AS_TRAIN_Missile then
            return "AG Missiles"
        end
    end

    -- Rockets are simple
    if ws[2] == wsType_NURS then
        if ws[3] == wsType_Rocket then
            return "Rockets"
        end
    end

    -- Bombs if they're guided, guided, else bomb
    if ws[2] == wsType_Bomb then
        if ws[3] == wsType_Bomb_Guided then
            return "Guided Bombs"
        end
        return "Bombs"
    end

    -- Pods under Pods
    if ws[2] == wsType_GContainer then
        return "Pods"
    end

    return "Misc"
end

function add_launcher_to_export(airframe, pylon, launcher)
    -- This is called per-airframe-pylon to ensure it's set
    -- we return the CLSID of the launcher if found

    -- Short Circuit
    if export_launchers[launcher.CLSID] ~= nil then
        return launcher.CLSID
    end

    local launcher_data = launchers[launcher.CLSID]

    if launcher_data == nil then
        log.write(
            "add_launcher_to_export",
            log.INFO,
            "Launcher not found " ..
                tostring(airframe.type) .. " Pylon " .. tostring(pylon.Number) .. " " .. launcher.CLSID
        )
        return nil
    end

    if launcher_data.evaluated == nil then
        log.write(
            "add_launcher_to_export",
            log.INFO,
            "Launcher not evaluated " ..
                tostring(airframe.type) .. " Pylon " .. tostring(pylon.Number) .. " " .. launcher.CLSID
        )
        return nil
    end

    -- First we make sure all the weapons are added
    for weapon_ws_type_str, weapon_count in pairs(launcher_data.evaluated) do
        if export_weapons[weapon_ws_type_str] == nil then
            local weapon_data = get_weapon_from_wstype(weapon_ws_type_str)
            if weapon_data == nil then
                log.write("add_launcher_to_export", log.INFO, "Failed to lookup weapon data for " .. weapon_ws_type_str)
            else
                table.insert(
                    export_weapons,
                    {
                        ["id"] = weapon_ws_type_str,
                        ["name"] = weapon_data.name,
                        ["ws_type"] = weapon_data.ws_type_str,
                        --['resource'] = weapon_data.resource,
                        --['path'] = weapon_data.path,
                        ["display_name"] = weapon_data.display_name
                    }
                )
            end
        end
    end

    local launcher_attribute_str = ""
    if type(launcher_data.attribute) == "table" then
        launcher_attribute_str = "{" .. table.concat(launcher_data.attribute, ",") .. "}"
    else
        launcher_attribute_str = tostring(launcher_data.attribute)
        log.write(
            "add_launcher_to_export",
            log.INFO,
            "Launcher has string attribute " ..
                tostring(airframe.type) ..
                    " Pylon " .. tostring(pylon.Number) .. " " .. launcher.CLSID .. ": " .. launcher_attribute_str
        )
    end

    local adapter_type_str
    if type(launcher_data.adapter_type) == "table" then
        adapter_type_str = "{" .. table.concat(launcher_data.adapter_type, ",") .. "}"
    elseif launcher_data.adapter_type ~= nil then
        adapter_type_str = tostring(launcher_data.adapter_type)
        log.write(
            "add_launcher_to_export",
            log.INFO,
            "Launcher has string adapter_type_str " ..
                tostring(airframe.type) ..
                    " Pylon " .. tostring(pylon.Number) .. " " .. launcher.CLSID .. ": " .. adapter_type_str
        )
    end

    -- Then we add ourselves, along with the counts and weapons

    local _weapons = {}
    for k, v in pairs(launcher_data.evaluated) do
        local _w = {}
        _w.id = k
        _w.quantity = v

        table.insert(_weapons, _w)
    end

    table.insert(
        export_launchers,
        {
            ["clsid"] = launcher.CLSID,
            --['hidden'] = launcher_data.hidden,
            ["category"] = launcher_data.category or "Misc",
            ["kind_of_shipping"] = launcher_data.kind_of_shipping,
            ["adapter_type"] = adapter_type_str,
            ["attribute"] = launcher_attribute_str,
            ["display_name"] = launcher_data.displayName,
            ["weight"] = launcher_data.Weight,
            ["weapons"] = _weapons
            --['airframes'] = {},
        }
    )

    return launcher.CLSID
end

function export_aircraft(airframe)
    -- Only care about human aircraft
    if airframe.HumanCockpit ~= true and flyable[airframe.type] == nil then
        log.write("export_aircraft", log.INFO, "Skipping " .. tostring(airframe.type) .. " - No HumanCockpit")
        return
    end

    -- Weights, also under M_ keys, but so far seem to match
    local weights = {
        ["empty"] = airframe.EmptyWeight,
        ["ammo"] = airframe.AmmoWeight,
        ["mtow"] = airframe.MaxTakeOffWeight,
        ["fuel"] = airframe.MaxFuelWeight
    }

    -- Crew Roles
    local roles = {}
    if airframe.crew_members ~= nil then
        for _, info in ipairs(airframe.crew_members) do
            if info.can_be_playable == true then
                table.insert(
                    roles,
                    {
                        ["role"] = info.role,
                        ["display_name"] = info.role_display_name
                    }
                )
            end
        end
    end

    -- Radios - can't do them completely here unfortunately - airframe.panelRadio is what determines what's
    -- shown in the ME and the validation of it (supported ranges) etc on the right hand side (or not in
    --  the case of A10C where there is no airframe.panelRadio) However not all human radios are available
    -- here (e.g: Ka50 R800, as they don't have presets)
    --
    -- There is a airframe.HumanRadio which has a list of frequency ranges you can manually set as a human
    -- however...it doesn't link to which radio can do what
    --
    -- Ultimately, we'll have to do some of the radios, ranges and intervals manually, but at least we can
    -- get some sensible defaults and do most of the work for us

    local radios = {}

    if airframe.panelRadio ~= nil then
        for radio_id, radio_data in pairs(airframe.panelRadio) do
            if radio_data.range ~= nil then
                -- connect is used to denote which is configured when modifying the group
                local info = {
                    ["name"] = radio_data.name,
                    ["channels"] = {},
                    ["ranges"] = {}
                }

                -- valid frequency ranges
                if radio_data.range.max ~= nil then
                    table.insert(
                        info.ranges,
                        {
                            ["from"] = radio_data.range.min * 1000,
                            ["to"] = radio_data.range.max * 1000,
                            ["modulation"] = radio_data.range.modulation or 0,
                            ["interval"] = math.floor(
                                (math.ceil(radio_data.range.max) - radio_data.range.max) * 1000 + 0.5
                            )
                        }
                    )
                else
                    for _, range in ipairs(radio_data.range) do
                        table.insert(
                            info.ranges,
                            {
                                ["from"] = range.min * 1000,
                                ["to"] = range.max * 1000,
                                ["modulation"] = range.modulation or radio_data.modulation or 0,
                                ["interval"] = math.floor((math.ceil(range.max) - range.max) * 1000 + 0.5)
                            }
                        )
                    end
                end

                -- Channels (presets) just an array of name, value, modulation, which is in FM / AM
                for _, channel in ipairs(radio_data.channels) do
                    local modulation_id = 0
                    if channel.modulation == "FM" then
                        modulation_id = 1
                    end

                    table.insert(
                        info.channels,
                        {
                            ["name"] = channel.name,
                            ["default"] = channel.default * 1000,
                            ["modulation"] = modulation_id
                        }
                    )
                end

                table.insert(radios, info)
            end
        end
    end

    -- Counter measures
    local cms = {}
    if airframe.passivCounterm ~= nil then
        -- If CMDS_Edit is false, then you cant change it on the rearm refuel menu
        -- However, these moduels (AV8B, F14) may allow you to change it on the kneeboard
        -- so, we need to manually configure how the CMDs work on a jet.... fun
        local _cms = {}

        _cms.CMDS_Edit = airframe.passivCounterm.CMDS_Edit
        _cms.total = airframe.passivCounterm.SingleChargeTotal
        for _, cms_type in ipairs({"chaff", "flare"}) do
            if airframe.passivCounterm[cms_type] ~= nil then
                _cms[cms_type] = {
                    ["default"] = airframe.passivCounterm[cms_type].default,
                    ["increment"] = airframe.passivCounterm[cms_type].increment,
                    ["charge_sz"] = airframe.passivCounterm[cms_type].chargeSz
                }
            end
        end
        table.insert(cms, _cms)
    end

    -- Pylons
    local pylons = {}
    if airframe.Pylons ~= nil then
        for id, pylon in ipairs(airframe.Pylons) do
            local display_name = pylon.DisplayName or pylon.Order
            local pylon_info = {
                ["number"] = pylon.Number,
                ["order"] = pylon.Order,
                ["name"] = display_name,
                ["stores"] = {}
            }

            for _, launcher in ipairs(pylon.Launchers) do
                local clsid = add_launcher_to_export(airframe, pylon, launcher)
                if clsid ~= nil then
                    table.insert(pylon_info.stores, clsid)
                end
            end

            table.insert(pylons, pylon_info)
        end
    end

    table.insert(
        export_aircraft_data,
        {
            ["name"] = airframe.DisplayName,
            ["type"] = airframe.type, -- basically a unique ID that can be used as key
            ["weights"] = weights,
            ["roles"] = roles,
            ["pylons"] = pylons,
            ["cms"] = cms,
            ["radios"] = radios,
            -- best guess, Mig-21Bis set to false, all FC 3 except J11 set to true, and J11 set to 3, so
            -- if it's non-existent or not false, we count it as old and non full fidelity
            ["full_fidelity"] = airframe.HumanFM ~= nil and
                (airframe.HumanFM.old == nil or airframe.HumanFM.old == false)
        }
    )
end

function process_old_api_table(tbl, tbl_name)
    for idx, itm in ipairs(tbl) do
        if itm.ws_type ~= nil and itm.display_name ~= nil then
            -- I have no idea why, or how - but the ws_type of the AGM_CATM_64K in the API table doesn't match
            -- what's in game (API Table: {4, 4, 100, 142} however in the ME warehouse it's {4, 4, 101, 142})
            -- If you change the warehouse ot be 100, then it doesnt' work in game... Sooo. I'm just gonna fix
            -- it here

            if itm.name == "CATM_65K" then
                itm.ws_type = {4, 4, 101, 142}
            end

            local ws_type_str = "{" .. table.concat(itm.ws_type, ",") .. "}"

            -- As before, some are missing, but here we have to go on tbl_name to make the reference
            local unique_resource_name = itm._unique_resource_name
            if unique_resource_name == nil then
                unique_resource_name = tbl_name .. "." .. itm.name
                log.write(
                    "process_weapons_table",
                    log.INFO,
                    "No unique resource name for: " .. itm.name .. " using " .. unique_resource_name
                )
            end

            local weapon_data = {
                ["name"] = itm.name,
                ["category"] = get_warehouse_category(itm.ws_type),
                ["resource"] = unique_resource_name,
                ["display_name"] = itm.display_name,
                ["ws_type_str"] = ws_type_str,
                ["ws_type"] = itm.ws_type,
                ["path"] = unique_resource_name
            }

            -- we expect these not to be added for duplicates, so just annouce we're processing
            if add_to_weapon_db(itm.ws_type, weapon_data) == false then
                log.write(
                    "process_old_api_table",
                    log.INFO,
                    "Skipping old API item, new API item exists " .. itm.name .. " " .. ws_type_str
                )
            end
        else
            log.write(
                "process_old_api_table",
                log.INFO,
                "Skipping old API item (no ws_type or display_name: " .. idx .. ")"
            )
        end
    end
end

function table_is_empty(tbl)
    local next = next
    if next(tbl) == nil then
        return true
    end
    return false
end

function process_launcher_item(launcher)
    -- If we're already processed, return
    if launcher.evaluated ~= nil then
        return launcher.evaluated
    end

    log.write("process_launcher_item", log.INFO, "processing launcher " .. launcher.CLSID)

    -- Our weapons table will hold the weapons indexed by unique
    -- reference name with quantity, which will be stored in evaluated
    local weapons = {}

    if launcher.Elements ~= nil then
        for _, element in ipairs(launcher.Elements) do
            if element.payload_CLSID ~= nil and launchers[element.payload_CLSID] ~= nil then
                log.write("process_launcher_item", log.INFO, "processing payload CLSID of " .. element.payload_CLSID)
                local element_info = process_launcher_item(launchers[element.payload_CLSID])
                for weapon, count in pairs(element_info) do
                    log.write("process_launcher_item", log.INFO, "processing payload weapon of " .. weapon)
                    if weapons[weapon] == nil then
                        weapons[weapon] = 0
                    end
                    weapons[weapon] = weapons[weapon] + count
                end
            end
        end
    end

    -- If we have weapons from the elements, we'll assume that's how they're defined
    -- on this object and set our category based on the first weapon and return
    if not table_is_empty(weapons) then
        for weapon, count in pairs(weapons) do
            local weapon_data = get_weapon_from_wstype(weapon)
            log.write(
                "process_launcher_item",
                log.INFO,
                "Looking up category of first weapon " .. weapon .. " got " .. weapon_data.category
            )
            launcher.category = weapon_data.category
            launcher.evaluated = weapons
            return launcher.evaluated
        end
    end

    if launcher.wsTypeOfWeapon ~= nil then
        local weapon_info = get_weapon_from_wstype(launcher.wsTypeOfWeapon)
        if weapon_info ~= nil then
            -- If we found our weapon then we can create it here and just link it to our count
            launcher.category = weapon_info.category
            launcher.evaluated = {
                [weapon_info.ws_type_str] = launcher.Count or 1
            }
            return launcher.evaluated
        else
            -- If we failed to look up the wsTypeOfWeapon then if it's a shell, gcontainer, then the
            -- launcher /is/ the weapon so we just skip to continue processing with attribute in the
            -- next block
            if type(launcher.wsTypeOfWeapon) == "table" then
                if not (launcher.wsTypeOfWeapon[2] == wsType_Shell or launcher.wsTypeOfWeapon[2] == wsType_GContainer) then
                    log.write(
                        "process_launcher_item",
                        log.INFO,
                        "wsTypeOfWeapon defined but not found: " ..
                            launcher.CLSID .. " looking for " .. table.concat(launcher.wsTypeOfWeapon, ",")
                    )
                    launcher.evaluated = {}
                    return launcher.evaluated
                end
            else
                log.write(
                    "process_launcher_item",
                    log.INFO,
                    "wsTypeOfWeapon defined but not a table: " ..
                        launcher.CLSID .. " looking for " .. launcher.wsTypeOfWeapon
                )
            end
        end
    end

    -- If we haven't got an attribute, bail
    if launcher.attribute == nil then
        log.write("process_launcher_item", log.ERROR, "unable to find weapon / count for: " .. launcher.CLSID)
        launcher.evaluated = {}
        return launcher.evaluated
    end

    -- Now, see if we're an existing item such as HVAR x 2
    local weapon_info = get_weapon_from_wstype(launcher.attribute)
    if weapon_info ~= nil then
        launcher.category = weapon_info.category
        launcher.evaluated = {
            [weapon_info.ws_type_str] = launcher.Count or 1
        }
        log.write("process_launcher_item", log.ERROR, "found via attribute: " .. weapon_info.ws_type_str)
        return launcher.evaluated
    end

    -- If not, then we are ourselves the weapon, and need to add ourselves to the weapons db as well
    -- so we can export it for the warehousing side of things

    -- We are the weapon, so need to add it to our weapon DB for inventory accounting purposes
    local ws_type_str
    if type(launcher.attribute) == "table" then
        ws_type_str = "{" .. table.concat(launcher.attribute, ",") .. "}"
    else
        ws_type_str = launcher.attribute
    end

    local weapon_info = {
        -- Name is important as the name of the item reference in weapons table
        ["name"] = launcher.CLSID,
        ["category"] = get_warehouse_category(launcher.attribute),
        ["resource"] = "wmapi.internal." .. launcher.CLSID,
        ["display_name"] = launcher.displayName,
        ["ws_type_str"] = ws_type_str,
        ["ws_type"] = launcher.attribute
    }

    if add_to_weapon_db(launcher.attribute, weapon_info) == false then
        log.write("process_launcher_item", log.ERROR, "FAILED to add Launcher to weapon DB: " .. launcher.CLSID)
        launcher.evaluated = {}
        return launcher.evaluated
    end

    launcher.category = weapon_info.category
    launcher.evaluated = {
        [weapon_info.resource] = 1
    }

    return launcher.evaluated
end

function process_launchers()
    -- Here, we'll go through each launcher and assoicate the underlying munition and
    -- count on the launcher

    -- A launcher can consist of:
    --   - Nested Launchers via Elements table
    --   - wsTypeOfWeapon table {4,4,8,48} pointing to a weapon
    --   - wsTypeOfWeapon string (weapon.missile.AGM_64K) pointing to a wepaon
    --   - attribute table {4,4,8,48} pointing to a weapon (e.g: HVARx2)

    -- We must process full depth for nested items, then bubble back up, short circuting
    -- if we've already visited that launcher before.

    for launcher_clsid, launcher in pairs(launchers) do
        process_launcher_item(launcher)
    end
end

-- -----------------------------------------------------------------------
-- PROCESSING
-- -----------------------------------------------------------------------

-- Evaluate all the available launchers
load_launchers()

-- Build up our mapping for wsTypes {4,4,8,132} => Weapon type
-- These are split between weapons_table (new API), rockets (Old API missile), bombs (Old API Bombs)

-- So this populates a data struct of
---
--  weapon_table_id[wsType[1]][wsType[2]][wsType[3]][wsType[4]] = {
--	  ['_unique_resource_name'] = level._unique_resource_name,
--	  ['display_name'] = level.display_name,
--	  ['ws_type_str'] = ws_type_string,
--  }
--
-- AND, since weapons also are associated by name (e.g: weapons.missiles.AT_6) we link their reference
-- to that name too

process_weapons_table_level(weapons_table)

process_old_api_table(rockets, "weapons.missiles")
process_old_api_table(bombs, "weapons.bombs")

-- At this point we have a weapon_table_id nested wstype or unqiue resource name
-- Now we need to map the launchers to munitions, we do this here to avoid having
-- to add the logic whilst enumerating pylons

process_launchers()

-- Finally, we go through the planes

for i in pairs(db.Units.Planes.Plane) do
    local plane = db.Units.Planes.Plane[i]
    export_aircraft(plane)
end

for i in pairs(db.Units.Helicopters.Helicopter) do
    local plane = db.Units.Helicopters.Helicopter[i]
    export_aircraft(plane)
end

-------------------------------------------
-- OUTPUT FILES:
-------------------------------------------

-- AIRFRAMES.JSON
local file, error = io.open(lfs.writedir() .. [[airframes.json]], "w")
if error then
    log.write("ERRR", log.INFO, tostring(error))
else
    file:write(JSON:encode(export_aircraft_data))
    file:close()
end

-- LAUNCHERS.JSON
local file, error = io.open(lfs.writedir() .. [[launchers.json]], "w")
if error then
    log.write("ERRR", log.INFO, tostring(error))
else
    file:write(JSON:encode(export_launchers))
    file:close()
end

-- WEAPONS.JSON
local file, error = io.open(lfs.writedir() .. [[weapons.json]], "w")
if error then
    log.write("ERRR", log.INFO, tostring(error))
else
    file:write(JSON:encode(export_weapons))
    file:close()
end
