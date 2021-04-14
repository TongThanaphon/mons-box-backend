import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Max, Min, IsOptional } from 'class-validator'

export class MultiDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User id of creator' })
    creatorId: string

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Code for multi' })
    code?: string

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(2)
    @ApiProperty({ description: 'Amount of player (min 0, max 2)' })
    count?: number
}
