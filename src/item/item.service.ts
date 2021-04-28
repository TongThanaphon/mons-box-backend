import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { InventoryService } from '../inventory/invertory.service'
import { WalletService } from '../wallet/wallet.service'
import { ItemBuyDto, ItemDto, ItemUseDto } from './dto'
import { ItemStatus } from './enum'
import { Item } from './interface'

@Injectable()
export class ItemService {
    constructor(
        @InjectModel('Item') private readonly itemModel: Model<Item>,
        @Inject(forwardRef(() => InventoryService)) private readonly invetoryService: InventoryService,
        @Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
    ) {}

    async findOne(id: string) {
        let target: Item

        try {
            target = await this.itemModel.findById(id).exec()
        } catch (e) {
            throw new NotFoundException('Item Not Found')
        }

        if (!target) {
            throw new NotFoundException('Item Not Found')
        }

        return target
    }

    responseObject(data: Item) {
        const result = {
            id: data.id,
            name: data.name,
            asset: data.asset,
            iType: data.iType,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            owner: data.owner,
            effect: data.effect,
        } as Item

        return result
    }

    async create(body: ItemDto) {
        const create = new this.itemModel(body)
        const save = await create.save()
        const response = this.responseObject(save)

        return response
    }

    async list() {
        const list = await this.itemModel.find().exec()
        const response = {
            size: list.length,
            data: list.map((item) => this.responseObject(item)),
        }

        return response
    }

    async get(id: string) {
        const item = await this.findOne(id)
        const response = this.responseObject(item)

        return response
    }

    async update(id: string, body: ItemDto) {
        await this.findOne(id)
        await this.itemModel.updateOne({ _id: id }, { ...body }).exec()

        const item = await this.findOne(id)
        const response = this.responseObject(item)

        return response
    }

    async buy(body: ItemBuyDto) {
        const item = await this.findOne(body.itemId)

        if (body.quantity > item.quantity) {
            throw new BadRequestException('Item quantity not enought')
        }

        const inventory = await this.invetoryService.list({ userId: body.userId })
        const wallet = await this.walletService.list({ userId: body.userId })

        const inventoryData = inventory.data[0]
        const walletData = wallet.data[0]

        const itemPrice = item.price.find((price) => price.cType === body.currency)
        const price = itemPrice.value * body.quantity

        const buyObject: ItemDto = {
            name: item.name,
            asset: item.asset,
            iType: item.iType,
            status: ItemStatus.OWNER,
            price: [],
            quantity: body.quantity,
            owner: body.userId,
            effect: item.effect,
        }

        const updateItemObject: ItemDto = {
            name: item.name,
            asset: item.asset,
            iType: item.iType,
            status: item.quantity > 0 ? item.status : ItemStatus.SOLD_OUT,
            price: item.price,
            quantity: item.quantity - body.quantity,
            owner: item.owner,
            effect: item.effect,
        }

        walletData.currencies.map((cur) => {
            if (cur.cType === body.currency) {
                if (cur.value >= price) {
                    cur.value -= price
                } else {
                    throw new BadRequestException('Your money is not enought')
                }
            }
        })

        const updateWalletObject = {
            userId: walletData.userId,
            currencies: walletData.currencies,
        }

        await this.update(body.itemId, updateItemObject)
        await this.walletService.update(walletData.id, updateWalletObject)

        const newItem = new this.itemModel(buyObject)
        const save = await newItem.save()
        const response = await this.responseObject(save)

        inventoryData.assets.push({ itemId: response.id, quantity: response.quantity })

        const updateInventoryObject = {
            userId: inventoryData.userId,
            assets: inventoryData.assets,
        }

        await this.invetoryService.update(inventoryData.id, updateInventoryObject)

        return updateInventoryObject
    }

    async use(body: ItemUseDto) {
        const item = await this.findOne(body.itemId)

        if (body.quantity > item.quantity) {
            throw new BadRequestException('Item quantity not enought')
        }

        const updateItemObject: ItemDto = {
            name: item.name,
            asset: item.asset,
            iType: item.iType,
            status: item.status,
            price: item.price,
            quantity: item.quantity - body.quantity,
            owner: item.owner,
            effect: item.effect,
        }

        const inventory = await this.invetoryService.list({ userId: body.userId })
        const inventoryData = inventory.data[0]

        inventoryData.assets.find((item) => {
            if (item.itemId === body.itemId) {
                item.quantity -= body.quantity
            }

            return item
        })

        let updateInv

        if (updateItemObject.quantity <= 0) {
            updateInv = inventoryData.assets.filter((item) => item.quantity > 0)
        }

        const updateInventoryObject = {
            userId: updateInv.userId,
            assets: updateInv.assets,
        }

        await this.update(body.itemId, updateItemObject)
        await this.invetoryService.update(inventoryData.id, updateInventoryObject)
    }
}
