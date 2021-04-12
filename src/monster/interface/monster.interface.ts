import { Document } from 'mongoose'

import { MonsterStatus } from './monster-status.interface'
import { MonsterLevel, MonsterType } from '../enum'

export interface Monster extends Document {
    id?: string
    userId: string
    name: string
    asset: string
    status: MonsterStatus
    mType: MonsterType
    level: MonsterLevel
    isAlive: true
}
