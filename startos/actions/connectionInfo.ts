import { T } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/storeJson'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  jdsHostId,
  jdsInterfaceId,
  jdsPort,
  poolHostId,
  poolInterfaceId,
  poolPort,
} from '../utils'

async function addresses(
  effects: T.Effects,
  hostId: string,
  port: number,
  interfaceId: string,
) {
  return (
    (await sdk.host
      .getOwn(effects, hostId, (host) =>
        host?.bindings[port]?.interfaces[
          interfaceId
        ]?.addressInfo.nonLocal.hostnames.map((h) =>
          h.hostname.includes(':')
            ? `[${h.hostname}]:${h.port}`
            : `${h.hostname}:${h.port}`,
        ),
      )
      .once()) ?? []
  )
}

const addressGroup = (
  name: string,
  description: string,
  list: string[],
): T.ActionResultMember => ({
  type: 'group',
  name,
  description,
  value: list.map((value, idx) => ({
    type: 'single',
    name: `${i18n('Address')} ${idx + 1}`,
    description: null,
    value,
    copyable: true,
    qr: false,
    masked: false,
  })),
})

export const connectionInfo = sdk.Action.withoutInput(
  'connection-info',

  async ({ effects }) => ({
    name: i18n('Connection Info'),
    description: i18n(
      'Show the authority public key and addresses miners need to connect to this pool.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const store = await storeJson.read().once()
    if (!store?.authorityPublicKey) {
      throw new Error(i18n('The pool has no authority keypair.'))
    }

    return {
      version: '1' as const,
      title: i18n('Connection Info'),
      message: i18n(
        'Give these to anyone pointing a Stratum V2 miner, translator, or JD client at this pool.',
      ),
      result: {
        type: 'group' as const,
        value: [
          {
            type: 'single' as const,
            name: i18n('Authority Public Key'),
            description: i18n(
              'Miners verify the pool against this key; it changes only when the key is rotated.',
            ),
            value: store.authorityPublicKey,
            copyable: true,
            qr: true,
            masked: false,
          },
          addressGroup(
            i18n('Pool'),
            i18n('Host and port for miners, translators, and JD clients.'),
            await addresses(effects, poolHostId, poolPort, poolInterfaceId),
          ),
          ...(store.jdsEnabled
            ? [
                addressGroup(
                  i18n('Job Declaration Server'),
                  i18n(
                    'Host and port for JD clients declaring their own templates.',
                  ),
                  await addresses(effects, jdsHostId, jdsPort, jdsInterfaceId),
                ),
              ]
            : []),
        ],
      },
    }
  },
)
