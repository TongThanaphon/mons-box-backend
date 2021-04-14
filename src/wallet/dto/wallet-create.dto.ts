import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class WalletCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User id' })
    userId: string
}
