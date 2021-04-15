import { Body, Controller, Get, Param, Put, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { UserDto } from './dto'
import { UserService } from './user.service'
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    async login(@Body() body: UserDto) {
        return this.userService.login(body)
    }

    @Post('register')
    @ApiOperation({ summary: 'User register' })
    async register(@Body() body: UserDto) {
        return this.userService.register(body)
    }

    // @Get(':id')
    // @ApiOperation({ summary: 'Get user by id' })
    // async get(@Param('id') id: string) {
    //     return this.userService.get(id)
    // }
}
