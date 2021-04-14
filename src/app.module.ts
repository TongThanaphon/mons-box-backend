import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { ScheduleModule } from '@nestjs/schedule'

import { MonsterModule } from './monster/monster.module'
import { WalletModule } from './wallet/wallet.module'

let env = {}

try {
    const configEnvFilePath = path.resolve(`./.config.${process.env.DEPLOYMENT_ENV}`)
    const configEnv = dotenv.parse(fs.readFileSync(configEnvFilePath))
    env = { ...env, ...configEnv }
} catch (e) {
    console.log('env error: ', e)
}

Object.entries(env).forEach((entry: [string, string]) => (process.env[entry[0]] = entry[1]))

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_DATABASE),
        ConfigModule.forRoot({ load: [() => env] }),
        ScheduleModule.forRoot(),
        MonsterModule,
        WalletModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
