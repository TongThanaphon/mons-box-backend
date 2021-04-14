import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail } from 'class-validator'

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Username' })
    name: string

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'Email' })
    email: string
}
