import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { CurrencyType } from '../enum'

export class CurrenctDto {
    @IsNotEmpty()
    @IsEnum(Object.keys(CurrencyType))
    @ApiProperty({ enum: CurrencyType, description: 'currency type' })
    cType: CurrencyType

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'currency value' })
    value: number
}
