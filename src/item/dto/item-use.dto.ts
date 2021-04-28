import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ItemUseDto {
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
    @ApiProperty({ description: 'Item quantity' })
    quantity: number
}
