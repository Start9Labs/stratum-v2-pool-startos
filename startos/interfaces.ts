import { storeJson } from './fileModels/storeJson'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  jdsHostId,
  jdsInterfaceId,
  jdsPort,
  monitoringHostId,
  monitoringPort,
  poolHostId,
  poolInterfaceId,
  poolPort,
} from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const poolOrigin = await sdk.MultiHost.of(effects, poolHostId).bindPort(
    poolPort,
    {
      protocol: null,
      addSsl: null,
      preferredExternalPort: poolPort,
      secure: { ssl: false },
    },
  )
  const pool = sdk.createInterface(effects, {
    name: i18n('Pool'),
    id: poolInterfaceId,
    description: i18n(
      'Point Stratum V2 miners, translators, and JD clients here.',
    ),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const monitoringOrigin = await sdk.MultiHost.of(
    effects,
    monitoringHostId,
  ).bindPort(monitoringPort, { protocol: 'http' })
  const monitoring = sdk.createInterface(effects, {
    name: i18n('Monitoring API'),
    id: 'monitoring',
    description: i18n(
      'Read-only HTTP API exposing connected miners, channels, and hashrate.',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const receipts = [
    await poolOrigin.export([pool]),
    await monitoringOrigin.export([monitoring]),
  ]

  if (await storeJson.read((s) => s.jdsEnabled).const(effects)) {
    const jdsOrigin = await sdk.MultiHost.of(effects, jdsHostId).bindPort(
      jdsPort,
      {
        protocol: null,
        addSsl: null,
        preferredExternalPort: jdsPort,
        secure: { ssl: false },
      },
    )
    const jds = sdk.createInterface(effects, {
      name: i18n('Job Declaration Server'),
      id: jdsInterfaceId,
      description: i18n(
        'Point JD clients here to declare their own block templates.',
      ),
      type: 'p2p',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    })
    receipts.push(await jdsOrigin.export([jds]))
  }

  return receipts
})
