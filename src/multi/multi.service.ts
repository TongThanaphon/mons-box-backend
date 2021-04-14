import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Multi } from './interface'
import { MultiDto } from './dto'

@Injectable()
export class MultiService {
    constructor(@InjectModel('Multi') private readonly multiModel: Model<Multi>) {}

    async findOne(id: string) {
        let target: Multi

        try {
            target = await this.multiModel.findById(id).exec()
        } catch (e) {
            throw new NotFoundException('Multi Not Found')
        }

        if (!target) {
            throw new NotFoundException('Multi Not Found')
        }

        return target
    }

    responseObject(data: Multi) {
        const result = {
            id: data.id,
            creatorId: data.creatorId,
            code: data.code,
            count: data.count,
        } as Multi

        return result
    }

    async create(body: MultiDto) {
        body.code = Math.floor(1000 + Math.random() * 9000).toString()

        const create = new this.multiModel(body)
        const save = await create.save()
        const response = this.responseObject(save)

        return response
    }

    async list(filter?: any) {
        const list = await this.multiModel.find({ ...filter }).exec()
        const response = {
            size: list.length,
            data: list.map((item) => this.responseObject(item)),
        }

        return response
    }

    async update(id: string, body: MultiDto) {
        await this.findOne(id)
        await this.multiModel.updateOne({ _id: id }, { ...body }).exec()

        const multi = await this.findOne(id)
        const response = this.responseObject(multi)

        return response
    }

    async delete(id: string) {
        await this.findOne(id)
        await this.multiModel.deleteOne({ _id: id }).exec()

        const response = { message: `Delete id ${id} Success` }

        return response
    }
}
