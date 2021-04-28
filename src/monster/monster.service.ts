import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'

import { Monster, MonsterFilter, MonsterStatus, Care } from './interface'
import { MonsterCareDto, MonsterCreateDto, MonsterUpdateDto } from './dto'
import { MonsterLevel, MonsterType, StatusType } from './enum'

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
            evolve: data.evolve,
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
                happiness: {
                    value: 10,
                    maxValue: 20,
                    timestamp: time,
                },
            },
            mType: MonsterType.SLIME,
            level: MonsterLevel.BABY,
            isAlive: true,
            evolve: {
                canEvolve: false,
                nextType: MonsterType.SLIME,
                nextLevel: MonsterLevel.BABY,
            },
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

    getRandomInt() {
        return (
            Math.floor(Math.random() * (Number(process.env.MAX_DECREASE_STATUS) - Number(process.env.MIN_DECREASE_STATUS) + 1)) +
            Number(process.env.MIN_DECREASE_STATUS)
        )
    }

    decreaseStatusValue(status: MonsterStatus) {
        let haValue = status.happiness.value
        const huValue = status.hungry.value - this.getRandomInt()
        const hungryValue = huValue < 0 ? 0 : huValue
        const cValue = status.cleanliness.value - this.getRandomInt()
        const cleanValue = cValue < 0 ? 0 : cValue
        const heValue = status.healthy.value - this.getRandomInt()
        const healthValue = heValue < 0 ? 0 : heValue

        if (hungryValue < Number(process.env.FLOOR_1_STATUS)) {
            haValue -= 1
        } else if (hungryValue < Number(process.env.FLOOR_2_STATUS)) {
            haValue -= 2
        } else if (cleanValue < Number(process.env.FLOOR_1_STATUS)) {
            haValue -= 1
        } else if (cleanValue < Number(process.env.FLOOR_2_STATUS)) {
            haValue -= 2
        } else if (healthValue < Number(process.env.FLOOR_1_STATUS)) {
            haValue -= 1
        } else if (healthValue < Number(process.env.FLOOR_2_STATUS)) {
            haValue -= 2
        }

        const happyValue = haValue < 0 ? 0 : haValue

        return {
            hungryValue,
            cleanValue,
            healthValue,
            happyValue,
        }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async autoUpdateStatus() {
        const { size, data } = await this.list()
        if (size === 0) {
            return
        }
        data.map(async (monster) => {
            const { hungryValue, cleanValue, healthValue, happyValue } = this.decreaseStatusValue(monster.status)

            const body = {
                userId: monster.userId,
                name: monster.name,
                asset: monster.asset,
                status: {
                    hungry: {
                        ...monster.status.hungry,
                        value: hungryValue,
                    },
                    cleanliness: {
                        ...monster.status.cleanliness,
                        value: cleanValue,
                    },
                    healthy: {
                        ...monster.status.healthy,
                        value: healthValue,
                    },
                    experience: monster.status.experience,
                    happiness: {
                        ...monster.status.happiness,
                        value: happyValue,
                    },
                },
                mType: monster.mType,
                level: monster.level,
                isAlive: monster.isAlive,
            } as MonsterUpdateDto

            await this.update(monster.id, body)
        })
    }

    careHappyStatus(activities: Care[], mStatus: MonsterStatus, time: number) {
        let happy = mStatus.happiness.value

        activities.map(({ status, effect }) => {
            let value = mStatus[status].value + effect
            const max = mStatus[status].maxValue

            if (value < Number(process.env.FLOOR_1_STATUS)) {
                happy += 1
            } else if (value < Number(process.env.FLOOR_2_STATUS)) {
                happy += 2
            }

            if (value > max && value >= Number(process.env.OVER_LIMIT_STATUS)) {
                happy -= 1
                value = max
            }

            // old version
            // if (value < Number(process.env.FLOOR_1_STATUS) || value < Number(process.env.FLOOR_2_STATUS)) {
            //     happy += 1
            // }

            // value += effect

            // if (value > max && value >= Number(process.env.OVER_LIMIT_STATUS)) {
            //     happy -= 1
            //     value = max
            // } else {
            //     happy += 2
            // }

            mStatus[status] = {
                ...mStatus[status],
                value: value < 0 ? 0 : value,
                timestamp: time,
            }
        })

        mStatus.happiness = {
            ...mStatus.happiness,
            value: happy < 0 ? 0 : happy,
            timestamp: time,
        }
    }

    handleExperiencePoint(point: number, currLvl: MonsterLevel, currType: MonsterType, status: MonsterStatus, time: number) {
        const currExp = status.experience.value
        const maxExp = status.experience.maxValue
        const happy = status.happiness.value
        let experience = currExp + point
        const length = Object.keys(MonsterLevel).length - 1
        const condition = currLvl !== Object.keys(MonsterLevel)[length]
        let nextType = currType
        let nextLevel
        let canEvolve = false

        if (experience >= maxExp) {
            experience = maxExp

            if (currType === MonsterType.SLIME) {
                if (happy > 18) {
                    nextType = MonsterType.WATER
                } else if (happy > 18) {
                    nextType = MonsterType.TERRESTRIAL
                } else {
                    nextType = MonsterType.POULTRY
                }
            }

            const index = Object.keys(MonsterLevel).indexOf(currLvl)
            nextLevel = condition ? Object.keys(MonsterLevel)[index + 1] : currLvl
            canEvolve = true
        }

        status.experience = {
            ...status.experience,
            value: experience,
            timestamp: time,
        }

        return {
            canEvolve,
            nextType,
            nextLevel,
        }
    }

    async care(id: string, body: MonsterCareDto) {
        const monster = await this.findOne(id)
        const { healthy, hungry, cleanliness, experience } = body
        const time = Date.now()
        const activities = [
            {
                status: StatusType.hungry,
                effect: hungry,
            },
            {
                status: StatusType.cleanliness,
                effect: cleanliness,
            },
            {
                status: StatusType.healthy,
                effect: healthy,
            },
        ] as Care[]
        this.careHappyStatus(activities, monster.status, time)
        const { canEvolve, nextLevel, nextType } = this.handleExperiencePoint(
            experience,
            monster.level,
            monster.mType,
            monster.status,
            time,
        )

        monster.evolve = {
            canEvolve,
            nextType,
            nextLevel,
        }

        const update = {
            userId: monster.userId,
            name: monster.name,
            asset: monster.asset,
            mType: monster.mType,
            level: monster.level,
            isAlive: monster.isAlive,
            status: {
                ...monster.status,
            },
            evolve: monster.evolve,
        } as MonsterUpdateDto

        await this.update(id, update)
    }

    async evolve(id: string, body: MonsterCreateDto) {
        const monster = await this.findOne(id)
        const mType = monster.evolve.nextType
        const level = monster.evolve.nextLevel
        const canEvolve = monster.evolve.canEvolve
        const time = Date.now()

        if (!canEvolve) return

        const update = {
            userId: monster.userId,
            name: monster.name,
            asset: body.asset,
            mType,
            level,
            isAlive: monster.isAlive,
            status: {
                ...monster.status,
                experience: {
                    value: 0,
                    maxValue: 100,
                    timestamp: time,
                },
            },
            evolve: {
                ...monster.evolve,
                canEvolve: false,
            },
        } as MonsterUpdateDto

        await this.update(id, update)
    }
}
