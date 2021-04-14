import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { InventoryModule } from '../inventory/inventory.module'
import { WalletModule } from '../wallet/wallet.module'
import { ItemController } from './item.controller'
import { ItemService } from './item.service'
import { ItemSchema } from './shcema'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]), WalletModule, InventoryModule],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService],
})
export class ItemModule {}
