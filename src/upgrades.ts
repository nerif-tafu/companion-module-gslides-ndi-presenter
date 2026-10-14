import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { Config } from './config.js'

/** Upgrade scripts run in order; append new ones when ids or options change. Never remove or reorder them. */
export const upgradeScripts: CompanionStaticUpgradeScript<Config>[] = []
