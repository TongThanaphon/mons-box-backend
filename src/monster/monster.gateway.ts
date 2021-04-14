import { Logger } from '@nestjs/common'
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { MonsterService } from './monster.service'

@WebSocketGateway({ namespace: '/socket/monster' })
export class MonsterGateway implements OnGatewayInit {
    @WebSocketServer() wss: Server

    private logger: Logger = new Logger('MonsterGateway')

    constructor(private readonly monsterService: MonsterService) {}

    afterInit(server: Server) {
        this.logger.log('Initialized')
    }

    @SubscribeMessage('monsterStatusToServer')
    async handleMessage(client: Socket, payload: { id: string }) {
        if (payload.id) {
            const monster = await this.monsterService.get(payload.id)

            const response = {
                status: monster.status,
                evolve: monster.evolve,
            }

            setInterval(() => {
                client.emit('monsterStatusToClient', response)
            }, Number(process.env.MONSTER_GATEWAY_TIME))
        }
    }

    @SubscribeMessage('joinMonster')
    handleJoin(client: Socket, id: string) {
        client.join(id)
        client.emit('joinedMonster', id)
    }

    @SubscribeMessage('leaveMonster')
    handleLeave(client: Socket, id: string) {
        client.leave(id)
        client.emit('leftMonster', id)
    }
}
