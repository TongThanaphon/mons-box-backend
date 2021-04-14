import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from './interface'
import { UserDto } from './dto'

import { WalletService } from '../wallet/wallet.service'
import { InventoryService } from '../inventory/invertory.service'

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
        @Inject(forwardRef(() => InventoryService)) private readonly inventoryService: InventoryService,
    ) {}

    async findOne(id: string) {
        let target: User

        try {
            target = await this.userModel.findById(id).exec()
        } catch (e) {
            throw new NotFoundException('Not found user')
        }

        if (!target) {
            throw new NotFoundException('Not found user')
        }

        return target
    }

    responseObject(data: User) {
        const response = {
            id: data.id,
            name: data.name,
            email: data.email,
        } as User

        return response
    }

    async create(body: UserDto) {
        const create = new this.userModel(body)
        const save = await create.save()
        const response = this.responseObject(save)

        await this.walletService.create({ userId: response.id })
        await this.inventoryService.create({ userId: response.id, assets: [] })

        return response
    }

    async get(id: string) {
        const user = await this.findOne(id)
        const response = this.responseObject(user)

        return response
    }

    async update(id: string, body: UserDto) {
        await this.findOne(id)
        await this.userModel.updateOne({ _id: id }, { ...body }).exec()

        const user = await this.findOne(id)
        const response = this.responseObject(user)

        return response
    }
}
