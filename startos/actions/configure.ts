import { storeJson } from '../fileModels/storeJson'
import { i18n } from '../i18n'
import { requireConfigureReplayId } from '../init/taskRequireConfigure'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const bitcoinAddress =
  '^([13mn2][a-km-zA-HJ-NP-Z1-9]{25,39}|(bc|tb|bcrt)1[a-z0-9]{6,90})$'

export const inputSpec = InputSpec.of({
  coinbaseRewardAddress: Value.text({
    name: i18n('Pool Payout Address'),
    description: i18n(
      'Bitcoin address that receives a block when the miner who found it did not name a payout address of its own, and the pool share of any donation.',
    ),
    required: true,
    default: null,
    patterns: [
      {
        regex: bitcoinAddress,
        description: i18n('Must be a Bitcoin address.'),
      },
    ],
  }),
  poolSignature: Value.text({
    name: i18n('Pool Signature'),
    description: i18n('Short label embedded in the blocks this pool mines.'),
    required: true,
    default: 'Stratum V2 Pool on StartOS',
    maxLength: 32,
  }),
  bitcoinNetwork: Value.select({
    name: i18n('Bitcoin Network'),
    description: i18n('Must match the network your Bitcoin node runs on.'),
    default: 'mainnet',
    values: {
      mainnet: i18n('Mainnet'),
      testnet4: i18n('Testnet4'),
      signet: i18n('Signet'),
      regtest: i18n('Regtest'),
    },
  }),
  sharesPerMinute: Value.number({
    name: i18n('Shares Per Minute'),
    description: i18n(
      'Target share submission rate per miner; the pool adjusts difficulty to hold it.',
    ),
    required: true,
    default: 6,
    integer: false,
    min: 1,
  }),
  jdsEnabled: Value.toggle({
    name: i18n('Job Declaration Server'),
    description: i18n(
      'Accept block templates that miners build from their own node. Turning it off removes the Job Declaration Server interface.',
    ),
    default: true,
  }),
})

export const configure = sdk.Action.withInput(
  'configure',

  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n('Set the payout address, network, and pool settings.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const s = await storeJson.read().once()
    return {
      coinbaseRewardAddress: s?.coinbaseRewardAddress ?? undefined,
      poolSignature: s?.poolSignature,
      bitcoinNetwork: s?.bitcoinNetwork,
      sharesPerMinute: s?.sharesPerMinute,
      jdsEnabled: s?.jdsEnabled,
    }
  },

  async ({ effects, input }) => {
    if (!new RegExp(bitcoinAddress).test(input.coinbaseRewardAddress)) {
      throw new Error(i18n('Must be a Bitcoin address.'))
    }
    await storeJson.merge(effects, input)
    await sdk.action.clearTask(effects, requireConfigureReplayId)
  },
)
