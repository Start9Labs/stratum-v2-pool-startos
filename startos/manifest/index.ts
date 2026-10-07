import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

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
      source: { dockerTag: 'stratumv2/pool_sv2:v0.8.0' },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
