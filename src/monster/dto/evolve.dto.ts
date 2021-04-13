import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator'
import { MonsterLevel, MonsterType } from '../enum'

export class EvolveDto {
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: 'Can evolve or not' })
    canEvolve: boolean

    @IsEnum(Object.keys(MonsterType))
    @IsNotEmpty()
    @ApiProperty({ enum: MonsterType, description: 'Next monster type' })
    nextType: MonsterType

    @IsEnum(Object.keys(MonsterLevel))
    @IsNotEmpty()
    @ApiProperty({ enum: MonsterLevel, description: 'Next monster level' })
    nextLevel: MonsterLevel
}
