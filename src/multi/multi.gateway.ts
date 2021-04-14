import { Logger } from '@nestjs/common'
import { OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { MultiService } from './multi.service'

@WebSocketGateway({ namespace: '/socket/multi' })
export class MultiGateway implements OnGatewayInit {
    @WebSocketServer() wss: Server

    private logger: Logger = new Logger('MultiGateway')

    constructor(private readonly multiService: MultiService) {}

    afterInit(server: Server) {
        this.logger.log('Initialized')
    }

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: { code: string; sender: string; data: any }) {
        this.wss.to(payload.code).emit('msgToClient', payload)
    }

    @SubscribeMessage('joinMulti')
    async handleJoinMulti(client: Socket, code: string) {
        const { data } = await this.multiService.list({ code: code })
        const count = data[0].count + 1

        if (count <= 2) {
            await this.multiService.update(data[0].id, { creatorId: data[0].creatorId, count })

            client.join(code)
            client.emit('joinedMulti', code)
        }
    }

    @SubscribeMessage('leaveMulti')
    async handleLeaveMulti(client: Socket, code: string) {
        const { data } = await this.multiService.list({ code: code })
        const count = data[0].count - 1

        await this.multiService.update(data[0].id, { creatorId: data[0].creatorId, count })

        if (count === 0) {
            await this.multiService.delete(data[0].id)
        }

        client.leave(code)
        client.emit('leftMulti', code)
    }
}
