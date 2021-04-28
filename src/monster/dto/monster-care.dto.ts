import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested, IsArray, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { StatusType } from '../enum'
import { Care } from '../interface'

export class MonsterCareDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Hungry' })
    hungry: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Cleanliness' })
    cleanliness: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Healthy' })
    healthy: number

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @ApiProperty({ description: 'Experience' })
    experience: number
}

export class CareDto {
    @IsNotEmpty()
    @IsEnum(Object.keys(StatusType))
    @ApiProperty({ enum: StatusType, description: 'Status type' })
    status: StatusType

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Status effect' })
    effect: number
}
