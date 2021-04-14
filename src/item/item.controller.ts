import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ItemBuyDto, ItemDto } from './dto'
import { ItemService } from './item.service'

@ApiTags('Item')
@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post()
    @ApiOperation({ summary: 'Create item' })
    async create(@Body() body: ItemDto) {
        return this.itemService.create(body)
    }

    @Get()
    @ApiOperation({ summary: 'Get list of item' })
    async list() {
        return this.itemService.list()
    }

    @ApiOperation({ summary: 'Get item by id' })
    @Get(':id')
    async get(@Param('id') id: string) {
        return this.itemService.get(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update item' })
    async update(@Param('id') id: string, @Body() body: ItemDto) {
        return this.itemService.update(id, body)
    }

    @Post('/buy')
    async buy(@Body() body: ItemBuyDto) {
        return this.itemService.buy(body)
    }
}
