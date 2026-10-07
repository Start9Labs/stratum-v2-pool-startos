import { manifest as bitcoinManifest } from 'bitcoin-core-startos/startos/manifest'
import { dependencies } from './dependencies'
import { poolToml } from './fileModels/poolToml'
import { storeJson } from './fileModels/storeJson'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  bitcoindIpcMount,
  bitcoindSocketName,
  generatePoolToml,
  ipcSocketLink,
  jdsPort,
  observePoolStdout,
  poolPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Stratum V2 Pool!')

  const store = await storeJson.read().const(effects)
  if (!store?.coinbaseRewardAddress) {
    throw new Error(
      'Stratum V2 Pool is not configured — run the Configure action.',
    )
  }
  if (!store.authorityPublicKey || !store.authoritySecretKey) {
    throw new Error('The pool has no authority keypair.')
  }
  await dependencies.check(effects).then((r) => r.throwIfNotSatisfied())

  await poolToml.write(
    effects,
    generatePoolToml({
      authorityPublicKey: store.authorityPublicKey,
      authoritySecretKey: store.authoritySecretKey,
      coinbaseRewardAddress: store.coinbaseRewardAddress,
      poolSignature: store.poolSignature,
      network: store.bitcoinNetwork,
      sharesPerMinute: store.sharesPerMinute,
      maxPastJobs: store.maxPastJobs,
      jdsEnabled: store.jdsEnabled,
    }),
  )

  const sub = sdk.SubContainer.of(
    effects,
    { imageId: 'pool' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      })
      .mountDependency<typeof bitcoinManifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: 'ipc',
        mountpoint: bitcoindIpcMount,
        readonly: true,
      }),
    'pool-sub',
  )

  const socketLink = ipcSocketLink(store.bitcoinNetwork)
  let poolReady = false

  const daemons = sdk.Daemons.of(effects)
    .addOneshot('link-ipc-socket', {
      subcontainer: sub,
      exec: {
        command: [
          'sh',
          '-c',
          `mkdir -p "$(dirname "${socketLink}")" && ln -sfn "${bitcoindIpcMount}/${bitcoindSocketName}" "${socketLink}"`,
        ],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('pool', {
      subcontainer: sub,
      exec: {
        fn: async () => {
          poolReady = false
          return {
            command: ['/app/pool_sv2', '-c', '/data/pool.toml'],
            cwd: '/app',
            env: { RUST_LOG: 'info' },
            onStdout: observePoolStdout(() => {
              poolReady = true
            }),
            onStderr: (chunk: Buffer | string) => {
              process.stderr.write(chunk)
            },
          }
        },
      },
      ready: {
        display: i18n('Pool Server'),
        gracePeriod: 30_000,
        fn: async () => {
          const listening = await sdk.healthCheck.checkPortListening(
            effects,
            poolPort,
            {
              successMessage: i18n('The pool is serving work'),
              errorMessage: i18n('The pool is not serving work'),
            },
          )
          if (listening.result !== 'success' || poolReady) return listening
          return {
            result: 'loading',
            message: i18n('Waiting for a block template from Bitcoin'),
          }
        },
      },
      requires: ['link-ipc-socket'],
    })

  return store.jdsEnabled
    ? daemons.addHealthCheck('jds', {
        ready: {
          display: i18n('Job Declaration Server'),
          gracePeriod: 30_000,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, jdsPort, {
              successMessage: i18n('The Job Declaration Server is ready'),
              errorMessage: i18n('The Job Declaration Server is not ready'),
            }),
        },
        requires: ['pool'],
      })
    : daemons
})
