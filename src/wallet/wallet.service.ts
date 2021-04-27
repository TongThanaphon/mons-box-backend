import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Currency, Wallet, WalletFilter } from './interface'
import { CurrencyType } from './enum'
import { WalletCreateDto, WalletUpdateDto } from './dto'

@Injectable()
export class WalletService {
    constructor(@InjectModel('Wallet') private readonly walletModel: Model<Wallet>) {}

    responseObject(data: Wallet) {
        const response = {
            id: data.id,
            userId: data.userId,
            currencies: data.currencies,
        } as Wallet

        return response
    }

    async findOne(id: string) {
        let target: Wallet

        try {
            target = await this.walletModel.findById(id).exec()
        } catch (e) {
            throw new NotFoundException('Not found wallet')
        }

        if (!target) {
            throw new NotFoundException('Not found wallet')
        }

        return target
    }

    async create(body: WalletCreateDto) {
        const currencies: Currency[] = [
            {
                cType: CurrencyType.COIN,
                value: 10000,
            },
            {
                cType: CurrencyType.DIAMOND,
                value: 0,
            },
        ]

        const wallet = {
            ...body,
            currencies,
        } as Wallet

        const create = new this.walletModel(wallet)
        const save = await create.save()
        const response = this.responseObject(save)

        return response
    }

    async list(filter?: WalletFilter) {
        const list = await this.walletModel.find({ ...filter }).exec()
        const response = {
            size: list.length,
            data: list.map((item) => this.responseObject(item)),
        }

        return response
    }

    async get(id: string) {
        const wallet = await this.findOne(id)
        const response = this.responseObject(wallet)

        return response
    }

    async update(id: string, body: WalletUpdateDto) {
        await this.findOne(id)
        await this.walletModel.updateOne({ _id: id }, { ...body }).exec()

        const wallet = await this.findOne(id)
        const response = this.responseObject(wallet)

        return response
    }
}
