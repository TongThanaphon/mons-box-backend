import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'

import { MultiDto } from './dto'
import { MultiFilter } from './interface'
import { MultiService } from './multi.service'

@Controller('multi')
@ApiTags('Multi')
export class MultiController {
    constructor(private readonly multiService: MultiService) {}

    @Post()
    @ApiOperation({ summary: 'Create multi' })
    async create(@Body() body: MultiDto) {
        return this.multiService.create(body)
    }

    @Get()
    @ApiQuery({ name: 'creatorId', required: false })
    @ApiQuery({ name: 'code', required: false })
    @ApiOperation({ summary: 'List of multi' })
    async list(@Query() filter: MultiFilter) {
        return this.multiService.list(filter)
    }

    @Post(':id')
    @ApiOperation({ summary: 'Update multi' })
    async update(@Param('id') id: string, @Body() body: MultiDto) {
        return this.multiService.update(id, body)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete multi' })
    async delete(@Param('id') id: string) {
        return this.multiService.delete(id)
    }
}
