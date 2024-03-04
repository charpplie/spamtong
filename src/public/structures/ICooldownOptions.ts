export interface CooldownOptions {
  amount: number,
  multiplier: cooldownMultiplier,
  type?: CooldownType,
  ownerBypass?: boolean | false,
}

type cooldownMultiplier =
  | 'Seconds'
  | 'Minutes'
  | 'Hours'
  | 'Days'
  | 'Weeks'

type CooldownType =
  | 'Global'
  | 'Per Guild'
  | 'Per User Per Guild'
  | 'Per User Per DM'
  | 'Per User'