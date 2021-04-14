import { Document } from 'mongoose'

import { Asset } from './asset.interface'

export interface Inventory extends Document {
    id?: string
    userId: string
    assets: Asset[]
}
