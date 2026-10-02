# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes. Upstream-version bumps have
their own procedure in `UPDATING.md` — follow it rather than editing the image tag alone.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`pool.toml` is rendered as a literal string, and must stay that way.** Upstream types `shares_per_minute` as `f32` and rejects a bare integer where it wants a float. A TOML serializer emits `6` for `6.0` and the daemon refuses to start, so `generatePoolToml` in `utils.ts` formats floats by hand. Don't "improve" it into a `FileHelper.toml` model.
- **The authority keypair is generated per install and is a real secret.** Upstream's example configs ship a published keypair; never fall back to it, and never log the secret half. `generateAuthorityKeypair()` must keep producing SRI's encoding — base58check of the bare secret, and of the x-only public key behind a little-endian u16 version 1 — verify against upstream's example pair after touching it.
- **A dependency mount is always a directory, by design.** StartOS disabled file mounts on dependencies in alpha.16: `MountTarget.filetype` is `#[serde(skip_deserializing)]` and `SubContainer.mount` hardcodes `'directory'` for a pointer mount, so binding the socket fails with `mount exited with exit status: 32`. Mount Bitcoin's `ipc` **directory** instead. The `link-ipc-socket` oneshot is needed either way — upstream hardcodes `node.sock` while bitcoind publishes `bitcoin-core.sock`, so something has to bridge the name.
- **`ipcSocketLink()` must reproduce upstream's `[<network>/]node.sock` layout exactly.** Upstream appends that to `data_dir` itself, so a mismatch fails at connect time rather than at parse time.
- **Verify a config change against the real binary, not against upstream's example TOMLs.** The examples contradict each other and lag the serde structs. `UPDATING.md` has the one-line `docker run` that parses a rendered config without touching the network.
