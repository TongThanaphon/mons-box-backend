import { Document } from 'mongoose'

import { ItemType, ItemStatus } from '../enum'
import { Care } from '../../monster/interface'
import { Currency } from '../../wallet/interface'

export interface Item extends Document {
    id?: string
    name: string
    asset: string
    iType: ItemType
    quantity: number
    price: Currency[]
    status: ItemStatus
    owner: string
    effect: Care[]
}
