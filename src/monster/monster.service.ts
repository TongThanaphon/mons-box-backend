import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'

import { Monster, MonsterFilter } from './interface'
import { MonsterActivity, MonsterCreateDto, MonsterUpdateDto } from './dto'
import { MonsterLevel, MonsterType } from './enum'

@Injectable()
export class MonsterService {
    constructor(@InjectModel('Monster') private readonly monsterModel: Model<Monster>) {}

    responseObject(data: Monster) {
        const response = {
            id: data.id,
            userId: data.userId,
            name: data.name,
            asset: data.asset,
            status: data.status,
            mType: data.mType,
            level: data.level,
            isAlive: data.isAlive,
        } as Monster

        return response
    }

    async findOne(id: string) {
        let target: Monster

        try {
            target = await this.monsterModel.findById(id).exec()
        } catch (e) {
            throw new NotFoundException('Not found monster')
        }

        if (!target) {
            throw new NotFoundException('Not found monster')
        }

        return target
    }

    async create(body: MonsterCreateDto) {
        const time = Date.now()

        const monster = {
            ...body,
            status: {
                hungry: {
                    value: 80,
                    maxValue: 100,
                    timestamp: time,
                },
                cleanliness: {
                    value: 80,
                    maxValue: 100,
                    timestamp: time,
                },
                healthy: {
                    value: 100,
                    maxValue: 100,
                    timestamp: time,
                },
                experience: {
                    value: 0,
                    maxValue: 100,
                    timestamp: time,
                },
            },
            mType: MonsterType.SLIME,
            level: MonsterLevel.BABY,
            isAlive: true,
        } as Monster

        const create = new this.monsterModel(monster)
        const save = await create.save()
        const response = this.responseObject(save)

        return response
    }

    async list(filter?: MonsterFilter) {
        const list = await this.monsterModel.find({ ...filter }).exec()
        const response = {
            size: list.length,
            data: list.map((item) => this.responseObject(item)),
        }

        return response
    }

    async get(id: string) {
        const monster = await this.findOne(id)
        const response = this.responseObject(monster)

        return response
    }

    async update(id: string, body: MonsterUpdateDto) {
        await this.findOne(id)
        await this.monsterModel.updateOne({ _id: id }, { ...body }).exec()

        const monster = await this.findOne(id)
        const response = this.responseObject(monster)

        return response
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async autoUpdateStatus() {
        const { size, data } = await this.list()
        if (size === 0) {
            return
        }
        data.map(async (monster) => {
            const body = {
                userId: monster.userId,
                name: monster.name,
                asset: monster.asset,
                status: {
                    hungry: {
                        ...monster.status.hungry,
                        value: monster.status.hungry.value - 5,
                    },
                    cleanliness: {
                        ...monster.status.cleanliness,
                        value: monster.status.cleanliness.value - 5,
                    },
                    healthy: {
                        ...monster.status.healthy,
                        value: monster.status.healthy.value - 5,
                    },
                    experience: monster.status.experience,
                },
                mType: monster.mType,
                level: monster.level,
                isAlive: monster.isAlive,
            } as MonsterUpdateDto
            await this.update(monster.id, body)
        })
    }

    async activity(id: string, body: MonsterActivity) {
        const monster = await this.findOne(id)
        const { activity, effect } = body
        const time = Date.now()

        const update = {
            userId: monster.userId,
            name: monster.name,
            asset: monster.asset,
            mType: monster.mType,
            level: monster.level,
            isAlive: monster.isAlive,
            status: {
                ...monster.status,
                [activity]: {
                    ...monster.status[activity],
                    value: monster.status[activity].value + effect,
                    timestamp: time,
                },
            },
        } as MonsterUpdateDto
        await this.update(id, update)
    }
}
