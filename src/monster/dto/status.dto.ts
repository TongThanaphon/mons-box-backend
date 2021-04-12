import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty } from 'class-validator'

export class StatusDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Value' })
    value: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Max value' })
    maxValue: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Timestamp' })
    timestamp: number
}
