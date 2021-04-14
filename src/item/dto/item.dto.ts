import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

import { Care } from '../../monster/interface'
import { CurrenctDto } from '../../wallet/dto'
import { CareDto } from '../../monster/dto'
import { Currency } from '../../wallet/interface'
import { ItemStatus, ItemType } from '../enum'

export class ItemDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Item name' })
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Item model asset' })
    asset: string

    @IsEnum(Object.keys(ItemType))
    @IsNotEmpty()
    @ApiProperty({ enum: ItemType, description: 'Item type' })
    iType: ItemType

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Item quantity' })
    quantity: number

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => CurrenctDto)
    @ApiProperty({ description: 'Item price', type: [CurrenctDto] })
    price: Currency[]

    @IsEnum(Object.keys(ItemStatus))
    @IsNotEmpty()
    @ApiProperty({ enum: ItemStatus, description: 'Item status' })
    status: ItemStatus

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Item owner' })
    owner?: string

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => CareDto)
    @ApiProperty({ description: 'Item effect', type: [CareDto] })
    effect: Care[]
}
