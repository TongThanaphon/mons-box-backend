import { Body, Controller, Get, Param, Put, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

import { UserDto } from './dto'
import { UserService } from './user.service'
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    async create(@Body() body: UserDto) {
        return this.userService.create(body)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    async get(@Param('id') id: string) {
        return this.userService.get(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    async update(@Param('id') id: string, @Body() body: UserDto) {
        return this.userService.update(id, body)
    }
}
