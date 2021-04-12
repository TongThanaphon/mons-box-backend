import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import path from 'path'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    app.useGlobalPipes(new ValidationPipe({ transform: true }))

    const options = new DocumentBuilder()
        .setTitle("Mon's Box API")
        .setDescription("API for Mon's Box project")
        .setVersion(process.env.API_VERSION)
        .build()
    const document = SwaggerModule.createDocument(app, options, { deepScanRoutes: true })
    SwaggerModule.setup('swagger', app, document)

    await app.listen(process.env.PORT)
}
bootstrap()
