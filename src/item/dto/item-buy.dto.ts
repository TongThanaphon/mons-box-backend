import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { CurrencyType } from '../../wallet/enum'

export class ItemBuyDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User id' })
    userId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Item id' })
    itemId: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Quantity' })
    quantity: number

    @IsNotEmpty()
    @IsEnum(Object.keys(CurrencyType))
    @ApiProperty({ description: 'Currency type' })
    currency: CurrencyType
}
