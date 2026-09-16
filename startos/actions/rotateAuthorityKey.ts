import { storeJson } from '../fileModels/storeJson'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { generateAuthorityKeypair } from '../utils'

export const rotateAuthorityKey = sdk.Action.withoutInput(
  'rotate-authority-key',

  async ({ effects }) => ({
    name: i18n('Rotate Authority Key'),
    description: i18n(
      'Generate a new authority keypair. Every miner must be given the new public key before it can connect again.',
    ),
    warning: i18n(
      'Miners that still hold the old public key will be refused until they update it.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const { publicKey, secretKey } = generateAuthorityKeypair()
    await storeJson.merge(effects, {
      authorityPublicKey: publicKey,
      authoritySecretKey: secretKey,
    })

    return {
      version: '1' as const,
      title: i18n('Authority Key Rotated'),
      message: i18n('Update every miner with the new public key.'),
      result: {
        type: 'single' as const,
        value: publicKey,
        copyable: true,
        qr: true,
        masked: false,
      },
    }
  },
)
