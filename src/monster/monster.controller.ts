import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger'

import { MonsterActivity, MonsterCreateDto } from './dto'
import { MonsterFilter } from './interface'
import { MonsterService } from './monster.service'

@ApiTags('Monster')
@Controller('monster')
export class MonsterController {
    constructor(private readonly monsterService: MonsterService) {}

    @Post()
    @ApiOperation({ summary: 'Create monster' })
    async create(@Body() body: MonsterCreateDto) {
        return this.monsterService.create(body)
    }

    @Get()
    @ApiQuery({ name: 'userId', required: false })
    @ApiOperation({ summary: 'List of monster' })
    async list(@Query() filter: MonsterFilter) {
        return this.monsterService.list(filter)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get monster by id' })
    async get(@Param('id') id: string) {
        return this.monsterService.get(id)
    }

    @Put(':id/activity')
    @ApiOperation({ summary: 'Update status monster from activity' })
    async activity(@Param('id') id: string, @Body() body: MonsterActivity) {
        return this.monsterService.activity(id, body)
    }
}
