import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Username' })
    username: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Password' })
    password: string
}
