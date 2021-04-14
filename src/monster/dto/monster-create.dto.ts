import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class MonsterCreateDto {
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
}
