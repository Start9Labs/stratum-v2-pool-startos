import { sdk } from '../sdk'
import { configure } from './configure'
import { connectionInfo } from './connectionInfo'
import { rotateAuthorityKey } from './rotateAuthorityKey'

export const actions = sdk.Actions.of()
  .addAction(configure)
  .addAction(connectionInfo)
  .addAction(rotateAuthorityKey)
