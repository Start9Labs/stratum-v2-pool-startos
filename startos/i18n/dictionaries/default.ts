export const DEFAULT_LANG = 'en_US'

const dict = {
  // interfaces.ts
  Pool: 0,
  'Point Stratum V2 miners, translators, and JD clients here.': 1,
  'Monitoring API': 2,
  'Read-only HTTP API exposing connected miners, channels, and hashrate.': 3,
  'Job Declaration Server': 4,
  'Point JD clients here to declare their own block templates.': 5,

  // main.ts
  'Pool Server': 10,
  'The pool is serving work': 11,
  'The pool is not serving work': 12,
  'The Job Declaration Server is ready': 13,
  'The Job Declaration Server is not ready': 14,

  // dependencies.ts
  'The pool reads block templates from Bitcoin over its IPC socket.': 20,

  // init/taskRequireConfigure.ts
  'Set the pool payout address before starting.': 30,

  // actions/configure.ts
  Configure: 40,
  'Set the payout address, network, and pool settings.': 41,
  'Pool Payout Address': 42,
  'Bitcoin address that receives a block when the miner who found it did not name a payout address of its own, and the pool share of any donation.': 43,
  'Must be a Bitcoin address.': 44,
  'Pool Signature': 45,
  'Short label embedded in the blocks this pool mines.': 46,
  'Bitcoin Network': 47,
  'Must match the network your Bitcoin node runs on.\n- Mainnet: the real Bitcoin network\n- Testnet4: the public test network; its coins have no value\n- Signet: a test network whose blocks are signed by a central party; its coins have no value\n- Regtest: a private test network for development': 48,
  Mainnet: 49,
  Testnet4: 50,
  Signet: 51,
  Regtest: 52,
  'Shares Per Minute': 53,
  'Target share submission rate per miner; the pool adjusts difficulty to hold it.': 54,
  'Accept block templates that miners build from their own node. Turning it off removes the Job Declaration Server interface.': 55,

  // actions/connectionInfo.ts
  'Connection Info': 60,
  'Show the authority public key and addresses miners need to connect to this pool.': 61,
  'The pool has no authority keypair.': 62,
  'Give these to anyone pointing a Stratum V2 miner, translator, or JD client at this pool.': 63,
  'Authority Public Key': 64,
  'Miners verify the pool against this key; it changes only when the key is rotated.': 65,
  'Host and port for miners, translators, and JD clients.': 66,
  'Host and port for JD clients declaring their own templates.': 67,
  Address: 68,

  // actions/rotateAuthorityKey.ts
  'Rotate Authority Key': 70,
  'Generate a new authority keypair. Every miner must be given the new public key before it can connect again.': 71,
  'Miners that still hold the old public key will be refused until they update it.': 72,
  'Authority Key Rotated': 73,
  'Update every miner with the new public key.': 74,
  'Waiting for a block template from Bitcoin': 75,
  'Past Jobs Per Channel': 76,
  'Leave blank for the upstream default. Increase to retain more jobs for late shares, using more memory. Avoid lowering retention when serving job-declaration clients.': 77,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
