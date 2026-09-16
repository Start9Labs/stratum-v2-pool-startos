import { setupManifest } from '@start9labs/start-sdk'
import { bitcoinDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'stratum-v2-pool',
  title: 'Stratum V2 Pool',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9Labs/stratum-v2-pool-startos',
  upstreamRepo: 'https://github.com/stratum-mining/sv2-apps',
  marketingUrl: 'https://stratumprotocol.org/',
  donationUrl: 'https://opensats.org/',
  description: { short, long },
  volumes: ['main'],
  images: {
    pool: {
      source: { dockerTag: 'stratumv2/pool_sv2:v0.7.0' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoinDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
      },
    },
  },
})
