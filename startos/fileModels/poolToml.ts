import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Rendered as an exact string: upstream types shares_per_minute as f32 and
// rejects the bare integer a TOML serializer emits for 6.0.
export const poolToml = FileHelper.string({
  base: sdk.volumes.main,
  subpath: './pool.toml',
})
