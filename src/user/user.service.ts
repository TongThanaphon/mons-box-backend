import { Injectable, NotFoundException, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

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
        const token = this.getToken(data)
        const response = {
            id: data.id,
            username: data.username,
            token: token,
        } as User

        return response
    }

    getToken(data: User) {
        const { id, username } = data

        return jwt.sign(
            {
                id,
                username,
            },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES },
        )
    }

    async login(body: UserDto) {
        const { username, password } = body
        let user: User
        let isPassword

        try {
            user = await this.userModel.findOne({ username }).exec()
            isPassword = await bcrypt.compare(password, user.password)
        } catch (e) {
            throw new NotFoundException('Username does not exits')
        }

        if (!user || !isPassword) {
            throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST)
        }

        const response = this.responseObject(user)

        return response
    }

    async register(body: UserDto) {
        const { username, password } = body
        const user = await this.userModel.findOne({ username }).exec()

        if (user) {
            throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST)
        }

        const hash = await bcrypt.hash(password, Number(process.env.HASH_SALT))

        const create = new this.userModel({ username, password: hash })
        const save = await create.save()
        const response = this.responseObject(save)

        await this.walletService.create({ userId: response.id })
        await this.inventoryService.create({ userId: response.id, assets: [] })

        return response
    }

    // async get(id: string) {
    //     const user = await this.findOne(id)
    //     const response = this.responseObject(user)

    //     return response
    // }

    // async update(id: string, body: UserDto) {
    //     await this.findOne(id)
    //     await this.userModel.updateOne({ _id: id }, { ...body }).exec()

    //     const user = await this.findOne(id)
    //     const response = this.responseObject(user)

    //     return response
    // }
}
