import { storeJson } from '../fileModels/storeJson'
import { sdk } from '../sdk'
import { generateAuthorityKeypair } from '../utils'

export const initAuthorityKeypair = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    const { publicKey, secretKey } = generateAuthorityKeypair()
    await storeJson.merge(effects, {
      authorityPublicKey: publicKey,
      authoritySecretKey: secretKey,
    })
  }
})
