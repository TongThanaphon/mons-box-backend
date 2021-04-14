import { MonsterLevel, MonsterType } from '../enum'

export interface Evolve {
    canEvolve: boolean
    nextType: MonsterType
    nextLevel: MonsterLevel
}
