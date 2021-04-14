import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { WalletSchema } from './schema'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }])],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
