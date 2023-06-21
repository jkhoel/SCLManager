#!/usr/bin/env bash

# Running this command requires https://crates.io/crates/cargo-watch to be installed
cargo watch -x 'clippy --fix --allow-dirty -- -D warnings'