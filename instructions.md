# Stratum V2 Pool

## Documentation

- [Pool Server reference](https://github.com/stratum-mining/sv2-apps/blob/main/pool-apps/pool/README.md) — the upstream pool's own documentation, including the payout modes miners select with their username.
- [Monitoring API reference](https://github.com/stratum-mining/sv2-apps/blob/main/stratum-apps/src/monitoring/README.md) — the endpoints served by the Monitoring API interface.

## What you get on StartOS

A Stratum V2 pool that serves work to Stratum V2 miners and to the translators that put Stratum V1 hardware (Bitaxe, Antminer, and most ASICs) on Stratum V2. Block templates come from your own Bitcoin node, so every block this pool works on is one your node built. A Job Declaration Server is built in, so miners running their own node can declare their own templates instead — you validate them, they choose the transactions.

Each miner decides where its own blocks go by the username it connects with:

- A Bitcoin address, optionally followed by `.worker` — a block that miner finds pays that address in full.
- `sri/donate` — the block pays your pool address.
- `sri/donate/<percent>/<address>` — split between your pool address and the miner's.
- Anything else — the block pays your pool address.

Three interfaces are exposed: **Pool**, which miners connect to; **Job Declaration Server**, which their JD clients connect to when it is enabled; and a read-only **Monitoring API** with connected miners, channels, and hashrate.

## Getting set up

This pool builds its blocks from your own node, so **install Bitcoin first**.

1. Open the **Configure** task shown after install and enter the **Pool Payout Address** — the Bitcoin address that receives blocks from miners who did not name their own. Set the **Bitcoin Network** to the one your node runs on, and adjust the pool signature, shares per minute, and Job Declaration Server toggle if you need to.
2. Save. If Bitcoin's IPC socket is off, a task on Bitcoin asks you to enable it — complete it, then make sure Bitcoin is running.
3. Start Stratum V2 Pool.
4. Run **Connection Info** and give miners what it shows: the **Authority Public Key**, and the **Pool** address and port — plus the **Job Declaration Server** address and port for anyone declaring their own templates.

If your miners are Stratum V1 hardware, put the **Stratum V2** service from the marketplace between them and this pool: its _Pool_ mode takes exactly the details from Connection Info, and its _Job Declaration with Pool_ mode adds the Job Declaration Server port.

## Using Stratum V2 Pool

### Monitoring

The **Pool Server** health check waits for the initial block template and previous-block hash from Bitcoin before turning green. If it shows **Waiting for a block template from Bitcoin**, check whether your Bitcoin node is still syncing. Once the pool is ready, the **Job Declaration Server** check turns green when JD clients can connect, if it is enabled. The **Monitoring API** interface serves JSON with the connected miners and their channels, and the service logs show miners connecting and shares arriving.

### Actions

- **Configure** — change the payout address, network, pool signature, shares per minute, past-job retention, or the Job Declaration Server toggle. The pool restarts with the new settings. Leave **Past Jobs Per Channel** blank unless you need to tune late-share handling. Increasing it retains more old jobs but uses more memory; avoid lowering retention when serving job-declaration clients.
- **Connection Info** — the authority public key and the addresses miners need. Run it whenever you add a miner.
- **Rotate Authority Key** — generates a new keypair. Every miner keeps the old public key until you give it the new one, and is refused until then, so do this only when you mean to.

## Limitations

- Bitcoin must run on this same server with IPC enabled; the pool cannot use a remote node.
- The pool does not track or pay out shares. A block pays the address selected by the username of the miner that found it, in full or by the donation split that miner chose — there is no proportional payout across miners.
