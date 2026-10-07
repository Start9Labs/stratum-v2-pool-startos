import { ipc } from 'bitcoin-core-startos/startos/actions/ipc'
import { i18n } from './i18n'
import { bitcoinDescription } from './manifest/i18n'
import { sdk } from './sdk'

const bitcoind = sdk.Dependency.required('bitcoind', {
  description: bitcoinDescription,
  metadata: {
    title: 'Bitcoin',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
  },
  versionRange: '>=31.0:12',
  kind: 'running',
  healthChecks: ['bitcoind'],
}).withInit(async (effects) => {
  await sdk.action.createTask(effects, 'bitcoind', ipc, 'critical', {
    input: {
      kind: 'partial',
      accept: [{ enableIpc: true }],
      set: { enableIpc: true },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: i18n(
      'The pool reads block templates from Bitcoin over its IPC socket.',
    ),
  })
})

export const dependencies = sdk.Dependencies.of().addDependency(bitcoind)
