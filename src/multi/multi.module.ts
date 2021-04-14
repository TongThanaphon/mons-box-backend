import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MultiController } from './multi.controller'
import { MultiService } from './multi.service'
import { MultiSchema } from './schema'
import { MultiGateway } from './multi.gateway'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Multi', schema: MultiSchema }])],
    controllers: [MultiController],
    providers: [MultiService, MultiGateway],
    exports: [],
})
export class MultiModule {}
