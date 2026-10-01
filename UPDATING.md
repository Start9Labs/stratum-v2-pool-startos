# Updating the upstream version

Upstream is [stratum-mining/sv2-apps](https://github.com/stratum-mining/sv2-apps), the Stratum Reference Implementation. It publishes an official multi-arch `stratumv2/pool_sv2` image on Docker Hub per release, tagged with the release tag, and this package pins that tag in `startos/manifest/index.ts`.

Bump this package together with `stratum-v2`, the miner-side package: the two speak a versioned wire protocol to each other, and a user running both on one box will assume they match.

## Determining the upstream version

Fetch the latest release tag:

```sh
gh release view -R stratum-mining/sv2-apps --json tagName -q .tagName
```

The current pin is the `dockerTag` in `startos/manifest/index.ts`. Confirm the image carries the tag before bumping:

```sh
curl -s "https://hub.docker.com/v2/repositories/stratumv2/pool_sv2/tags/<tag>" | jq -r '.name // "missing"'
```

Don't trust `pool_sv2 --version` to tell you what an image contains — upstream does not bump the crate version with every release, so the binary can report an older version than its tag.

## Applying the bump

1. Set the new tag in `dockerTag` in `startos/manifest/index.ts`, and set `version` in `startos/versions/current.ts` to `<upstream>:0`.
2. **Diff the config schema.** Upstream moves fields between releases without deprecation. `generatePoolToml` in `startos/utils.ts` renders `pool.toml` as a literal string, so a schema change is silent until the daemon refuses to start. The authority is the serde structs, not the example configs:

   - `pool-apps/pool/src/lib/config.rs` — `PoolConfig`
   - `pool-apps/jd-server/src/lib/config.rs` — `JDSPartialConfig`, the `[jds]` section
   - `stratum-apps/src/tp_type.rs` — `TemplateProviderType`, including which Bitcoin Core IPC versions it accepts

   `shares_per_minute` is an `f32` and rejects a bare integer, which is why the generator emits floats by hand.

3. **Validate the rendered config against the new binary** before opening a PR. Render `pool.toml` with and without the `[jds]` section and run the binary against each — it parses the whole file before opening a socket, so a config error surfaces immediately, while a `CannotConnectToUnixSocket` error means the config was accepted:

   ```sh
   docker run --rm --network none --entrypoint /app/pool_sv2 \
     -v "$PWD/pool.toml:/cfg.toml:ro" stratumv2/pool_sv2:<tag> -c /cfg.toml
   ```

   The log names the IPC socket path it resolved; check it matches `ipcSocketLink()` in `startos/utils.ts` for a non-mainnet network as well as mainnet.

4. If the IPC schema version in `generatePoolToml` or the Bitcoin versions upstream accepts have moved, update `versionRange` in `startos/dependencies.ts` to match.
5. **Re-check the key encoding.** `generateAuthorityKeypair()` in `startos/utils.ts` reproduces `stratum-apps/src/key_utils/mod.rs`. If that module changes, confirm the generator still derives upstream's published example public key from its example secret key.
