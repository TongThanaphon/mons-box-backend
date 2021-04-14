import { Body, Controller, Get, Param, Post, Query, Put } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { WalletCreateDto, WalletUpdateDto } from './dto'
import { WalletFilter } from './interface'
import { WalletService } from './wallet.service'

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post()
    @ApiOperation({ summary: 'Create new wallet' })
    async create(@Body() body: WalletCreateDto) {
        return this.walletService.create(body)
    }

    @Get()
    @ApiQuery({ name: 'userId' })
    @ApiOperation({ summary: 'List of wallet' })
    async list(@Query() filter: WalletFilter) {
        return this.walletService.list(filter)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get wallet by id' })
    async get(@Param('id') id: string) {
        return this.walletService.get(id)
    }

    @Put('id')
    @ApiOperation({ summary: 'Update wallet' })
    async update(@Param('id') id: string, @Body() body: WalletUpdateDto) {
        return this.walletService.update(id, body)
    }
}
