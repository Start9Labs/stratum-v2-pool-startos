import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  authorityPublicKey: z.string().nullable().catch(null),
  authoritySecretKey: z.string().nullable().catch(null),

  coinbaseRewardAddress: z.string().nullable().catch(null),
  poolSignature: z.string().catch('Stratum V2 Pool on StartOS'),
  bitcoinNetwork: z
    .enum(['mainnet', 'testnet4', 'signet', 'regtest'])
    .catch('mainnet'),
  sharesPerMinute: z.number().catch(6),
  maxPastJobs: z.number().int().positive().nullable().catch(null),
  jdsEnabled: z.boolean().catch(true),
})

export type Store = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
