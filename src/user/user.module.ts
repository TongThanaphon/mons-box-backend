import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserSchema } from './schema'

import { WalletModule } from '../wallet/wallet.module'
import { InventoryModule } from '../inventory/inventory.module'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), WalletModule, InventoryModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [],
})
export class UserModule {}
