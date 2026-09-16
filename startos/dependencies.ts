import { ipc } from 'bitcoin-core-startos/startos/actions/ipc'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
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

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>=31.0:0',
      healthChecks: ['bitcoind'],
    },
  }
})
