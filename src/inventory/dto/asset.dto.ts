import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty } from 'class-validator'

export class AssetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Item id' })
    itemId: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Item quantity in inventory' })
    quantity: number
}
