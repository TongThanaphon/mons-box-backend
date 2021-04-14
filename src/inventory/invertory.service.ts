import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { InventoryDto } from './dto'
import { Inventory, InventoryFilter } from './interface'
import { ItemService } from '../item/item.service'

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel('Inventory') private readonly inventoryModel: Model<Inventory>,
        @Inject(forwardRef(() => ItemService)) private readonly ItemService: ItemService,
    ) {}

    async findOne(id: string) {
        let target: Inventory

        try {
            target = await this.inventoryModel.findById(id).exec()
        } catch (e) {
            throw new NotFoundException('Not found inventory')
        }

        if (!target) {
            throw new NotFoundException('Not found inventory')
        }

        return target
    }

    responseObject(data: Inventory) {
        const response = {
            id: data.id,
            userId: data.userId,
            assets: data.assets,
        } as Inventory

        return response
    }

    async create(body: InventoryDto) {
        const create = new this.inventoryModel(body)
        const save = await create.save()
        const reuslt = this.responseObject(save)

        return reuslt
    }

    async list(filter?: InventoryFilter) {
        const list = await this.inventoryModel.find({ ...filter }).exec()
        const response = {
            size: list.length,
            data: list.map((inventory) => this.responseObject(inventory)),
        }

        return response
    }

    async get(id: string) {
        const inventory = await this.findOne(id)

        const assets = await Promise.all(
            inventory.assets.map(async (item) => {
                const obj = await this.ItemService.get(item.itemId)
                return obj
            }),
        )

        const response = {
            id: inventory.id,
            userId: inventory.userId,
            assets,
        }

        return response
    }

    async update(id: string, body: InventoryDto) {
        await this.findOne(id)

        await this.inventoryModel
            .updateOne(
                { _id: id },
                {
                    ...body,
                },
            )
            .exec()

        const inventory = await this.findOne(id)
        const response = this.responseObject(inventory)

        return response
    }
}
