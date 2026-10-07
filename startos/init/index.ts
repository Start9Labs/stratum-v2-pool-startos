import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { initAuthorityKeypair } from './generateAuthorityKeypair'
import { taskRequireConfigure } from './taskRequireConfigure'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  initAuthorityKeypair,
  setInterfaces,
  actions,
  dependencies,
  taskRequireConfigure,
)

export const uninit = sdk.setupUninit(versionGraph)
