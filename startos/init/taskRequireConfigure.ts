import { configure } from '../actions/configure'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const requireConfigureReplayId = 'require-configure'

export const taskRequireConfigure = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, configure, 'critical', {
      replayId: requireConfigureReplayId,
      reason: i18n('Set the pool payout address before starting.'),
    })
  }
})
