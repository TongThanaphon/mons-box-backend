import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsBoolean, ValidateNested, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

import { MonsterStatus } from '../interface'
import { MonsterLevel, MonsterType } from '../enum'
import { MonsterStatusDto } from './monster-status.dto'

export class MonsterUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User id' })
    userId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Monster name' })
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Monster asset model' })
    asset: string

    @ValidateNested()
    @Type(() => MonsterStatusDto)
    @ApiProperty({ description: 'Monster status', type: () => MonsterStatusDto })
    status: MonsterStatus

    @IsEnum(Object.keys(MonsterType))
    @IsNotEmpty()
    @ApiProperty({ enum: MonsterType, description: 'Monster type' })
    mType: MonsterType

    @IsEnum(Object.keys(MonsterLevel))
    @IsNotEmpty()
    @ApiProperty({ enum: MonsterLevel, description: 'Monster level' })
    level: MonsterLevel

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: 'Is mosnter alive' })
    isAlive: true
}
