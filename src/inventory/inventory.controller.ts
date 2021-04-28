import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { InventoryDto } from './dto'
import { InventoryFilter } from './interface'
import { InventoryService } from './invertory.service'

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Post()
    @ApiOperation({ summary: 'Create inventory' })
    async create(@Body() body: InventoryDto) {
        return this.inventoryService.create(body)
    }

    @Get()
    @ApiQuery({ name: 'userId', required: false })
    @ApiOperation({ summary: 'Get list of invetory' })
    async list(@Query() filter: InventoryFilter) {
        return this.inventoryService.list(filter)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get inventory by id' })
    async get(@Param('id') id: string) {
        return this.inventoryService.get(id)
    }

    @Post(':id')
    @ApiOperation({ summary: 'Update inventory' })
    async update(@Param('id') id: string, @Body() body: InventoryDto) {
        return this.inventoryService.update(id, body)
    }
}
