import { createHash } from 'crypto'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { createBase58check } from '@scure/base'

// Downstream listener that translators and JD clients connect to.
export const poolPort = 3333
export const poolHostId = 'pool'
export const poolInterfaceId = 'pool'

// Embedded Job Declaration Server, present only while it is enabled.
export const jdsPort = 3334
export const jdsHostId = 'jds'
export const jdsInterfaceId = 'jds'

// Read-only HTTP monitoring API.
export const monitoringPort = 9090
export const monitoringHostId = 'monitoring'

// SV2 extension 0x0002, Worker-Specific Hashrate Tracking.
export const workerHashrateExtension = '0x0002'

// Bitcoin's IPC directory, mounted read-only. It holds `bitcoin-core.sock`,
// but the pool resolves its socket as `${dataDir}/[network/]node.sock`, so
// ipcDataDir holds a symlink under that name rather than being the mount.
export const bitcoindIpcMount = '/mnt/bitcoind-ipc'
export const bitcoindSocketName = 'bitcoin-core.sock'
export const ipcDataDir = '/data/ipc'

export type BitcoinNetwork = 'mainnet' | 'testnet4' | 'signet' | 'regtest'

export function ipcSocketLink(network: BitcoinNetwork): string {
  return network === 'mainnet'
    ? `${ipcDataDir}/node.sock`
    : `${ipcDataDir}/${network}/node.sock`
}

// SRI's key encoding: base58check of the bare 32-byte secret, and of the
// x-only public key behind a little-endian u16 version 1.
const base58check = createBase58check((data: Uint8Array) =>
  createHash('sha256').update(data).digest(),
)

export function generateAuthorityKeypair() {
  const secret = secp256k1.utils.randomSecretKey()
  const versioned = new Uint8Array(34)
  versioned[0] = 1
  versioned.set(secp256k1.getPublicKey(secret, true).subarray(1), 2)
  return {
    secretKey: base58check.encode(secret),
    publicKey: base58check.encode(versioned),
  }
}
