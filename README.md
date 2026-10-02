<p align="center">
  <img src="icon.png" alt="Stratum V2 Pool Logo" width="21%">
</p>

# Stratum V2 Pool on StartOS

> Everything not listed in this document should behave the same as upstream
> Stratum V2 Pool. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

Packages the Pool Server of the [Stratum Reference Implementation](https://github.com/stratum-mining/sv2-apps), with its embedded Job Declaration Server, as a native StartOS daemon. The pool builds block templates from the local Bitcoin node over IPC, authenticates to miners with a keypair generated for this install, and pays each block to the address the finding miner named in its username.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The official upstream image, unmodified. Its entrypoint is a shell wrapper that drops arguments, so the daemon runs the binary directly.

| Property      | Value                                                     |
| ------------- | --------------------------------------------------------- |
| Image source  | `stratumv2/pool_sv2`, official upstream image, unmodified |
| Architectures | x86_64, aarch64                                           |
| Entrypoint    | Not used — `/app/pool_sv2 -c /data/pool.toml`             |

One subcontainer, **`pool-sub`**, runs the `link-ipc-socket` oneshot and then the `pool` daemon. Attach with `start-cli package attach stratum-v2-pool -n pool-sub`.

## Volume and Data Layout

One volume holds everything the package owns; the daemon itself persists nothing. Bitcoin's IPC directory is mounted in from the dependency.

| Volume          | Mount point         | Purpose                                                                                                                                                                                                        |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`          | `/data`             | `store.json` (settings and the authority keypair), the rendered `pool.toml`, and `ipc/`, which holds only a symlink                                                                                            |
| `bitcoind:main` | `/mnt/bitcoind-ipc` | Bitcoin's IPC directory, read-only — it holds only the socket. The pool resolves its socket as `<data_dir>/[network/]node.sock`, so a oneshot symlinks that name under `/data/ipc` and `data_dir` points there |

## File Models

Both files live on the volume. Only `store.json` records user intent; `pool.toml` is a rendered artifact and a hand edit to it is discarded.

- **`store.json`** — every Configure answer plus the authority keypair, and the only source of user intent. Written by the Configure and Rotate Authority Key actions, read reactively by `main`, so saving it restarts the daemon with the new settings. The keypair is seeded once at install and changes only when rotated.
- **`pool.toml`** — regenerated from `store.json` on every start and overwritten wholesale. It is modelled as an opaque string rather than a TOML document because upstream types `shares_per_minute` as `f32` and rejects the bare integer a serializer emits for `6.0`. Fixed by the package and not exposed: `listen_address`, `cert_validity_sec`, `server_id`, `share_batch_size`, the extension lists, `monitoring_address`, and the template provider's `fee_threshold` and `min_interval`. The `[jds]` section exists only while the Job Declaration Server is enabled. Configure's optional past-job retention value is stored as `maxPastJobs`; a missing or null value omits `max_past_jobs` from the generated TOML and uses upstream's default without a data migration.

## Dependencies

**`bitcoind`, required.** The pool builds every block template from the local node over its IPC socket, so the package requires Bitcoin running and healthy, mounts its IPC directory read-only at `/mnt/bitcoind-ipc`, and raises a task on Bitcoin to enable IPC (see [Tasks](#tasks)). The user-facing name is Bitcoin. Startup is gated on the dependency check. The pool binds its listener before receiving a template but accepts miners only after receiving both the initial template and previous-block hash; it exits when the IPC socket cannot be opened.

## Network Access and Interfaces

Three interfaces, all bound by the package. The first two are meant to be reached by machines the operator may not own — a pool exists to be connected to — so where they are exposed is the operator's decision.

| Interface id | Type  | Port | Protocol                  | Purpose                                                                                                          |
| ------------ | ----- | ---- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `pool`       | `p2p` | 3333 | Stratum V2 over Noise TCP | Where translators, JD clients, and native SV2 miners connect                                                     |
| `jds`        | `p2p` | 3334 | Stratum V2 over Noise TCP | The Job Declaration Server; present only while enabled in Configure                                              |
| `monitoring` | `api` | 9090 | HTTP                      | Read-only JSON at `/api/v1/*` (`health`, `global`, `server`, `clients`), Prometheus at `/metrics`, `/swagger-ui` |

Outbound, the pool reaches only Bitcoin's socket.

## Installation and First-Run Flow

Install generates the authority keypair into `store.json`, raises the critical **Configure** task because the pool cannot start without a payout address, and — through the dependency declaration — raises Bitcoin's IPC task if IPC is off there. Saving Configure clears its task. Once Bitcoin is running with IPC on, the service starts; **Connection Info** then hands the operator what every miner needs.

## Actions

Three user-facing actions; none is hidden.

- **Configure** (`configure`) — run at install and whenever the payout address, network, pool signature, shares-per-minute target, past-job retention, or the Job Declaration Server toggle should change. Writes `store.json`; the daemon restarts with a re-rendered `pool.toml`, dropping every connected miner for a few seconds. Idempotent. Disabling the JDS unexports the `jds` interface as soon as the action saves.
- **Connection Info** (`connection-info`) — run whenever a miner is being pointed at the pool. Reads `store.json` and the package's own hosts; changes nothing. Returns the authority public key and the non-local `host:port` pairs of the `pool` interface, plus the `jds` interface while enabled.
- **Rotate Authority Key** (`rotate-authority-key`) — run when the secret key may have been exposed. Generates a fresh keypair into `store.json`; the daemon restarts and refuses every miner still holding the old public key. Returns the new public key. Safe to repeat; each run invalidates the previous key.

## Tasks

- **Configure** — raised at install, `critical`, so the service cannot start and shows no ordinary controls until it is saved. Cleared by saving Configure; never returns on its own.
- **Bitcoin → Enable IPC** — raised on the Bitcoin service by this package's dependency declaration whenever Bitcoin's `ipc` setting is off, `critical`. Appears on Bitcoin's page, not this one. Cleared when Bitcoin's IPC action has `enableIpc: true`; returns if IPC is later turned off.

## Health Checks

The checks distinguish a bound listener from a pool that has received mining work.

- **Pool Server** (`pool`) — requires both port 3333 listening and the current daemon's stdout message `Required template data received, ready to accept connections`, emitted after the initial template and previous-block hash arrive. The observer handles messages split across output chunks, forwards stdout and stderr to service logs, and resets on every daemon launch. Logging is fixed at `info` so the readiness message is emitted. A bound port without that message reports loading; Bitcoin may still be in initial block download. If the check remains red after its 30 s grace period, check Bitcoin is running with IPC enabled, that the Configure network matches the node's, and the service log for `CannotConnectToUnixSocket` or `Pool config error`.
- **Job Declaration Server** (`jds`) — present only while the JDS is enabled; probes port 3334 once `pool` is green. A failure means its listener is absent; inspect the service log for bind or shutdown errors. The embedded JDS attaches to Bitcoin before the pool becomes ready.

## Backups and Restore

`sdk.Backups.ofVolumes('main')` — the volume is copied wholesale, so a restore brings back the settings and the authority keypair, and miners keep working against the same public key. Nothing is excluded. A restored instance needs Bitcoin present with IPC enabled before it can start; it re-renders `pool.toml` on its own.

## Limitations and Differences

1. Only the Bitcoin Core IPC template provider is supported; upstream's `Sv2Tp` (a hosted or local SV2 Template Provider) is not offered, and Bitcoin must run on the same server.
2. The Job Declaration Server is embedded in the pool and shares its keypair, coinbase script, and certificate validity; it cannot be pointed at a different node or run on its own.
3. `supported_extensions` is fixed to Worker-Specific Hashrate Tracking and `required_extensions` to none.
4. Upstream's `--log-file` option is not used; logs go to the service log only.
5. The authority keypair is generated per install. Upstream's published example keypair is never used, so a miner following an upstream tutorial must take the key from Connection Info.

---

## Quick Reference for AI Consumers

```yaml
package_id: 'stratum-v2-pool'
image: stratumv2/pool_sv2
architectures: [x86_64, aarch64]
subcontainers:
  - pool-sub
volumes:
  main: /data
file_models:
  - store.json
  - pool.toml
startos_managed_env_vars: []
dependencies: [bitcoind]
interfaces:
  pool: { type: p2p, port: 3333 }
  jds: { type: p2p, port: 3334 } # only while the Job Declaration Server is enabled
  monitoring: { type: api, port: 9090 }
actions:
  - configure
  - connection-info
  - rotate-authority-key
tasks:
  - { action: configure, severity: critical }
  - { action: 'bitcoind:ipc', severity: critical }
health_checks:
  - pool
  - jds # only while the Job Declaration Server is enabled
```
