import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MonsterController } from './monster.controller'
import { MonsterGateway } from './monster.gateway'
import { MonsterService } from './monster.service'
import { MonsterSchema } from './schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Monster', schema: MonsterSchema }])],
    controllers: [MonsterController],
    providers: [MonsterService, MonsterGateway],
    exports: [],
})
export class MonsterModule {}
