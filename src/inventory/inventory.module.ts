import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ItemModule } from '../item/item.module'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './invertory.service'
import { InventorySchema } from './schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Inventory', schema: InventorySchema }]), forwardRef(() => ItemModule)],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule {}
