import { Schema, SchemaDefinitionProperty } from 'mongoose'

import { StatusType } from '../../monster/enum'
import { CurrencyType } from '../../wallet/enum'
import { ItemStatus, ItemType } from '../enum'

const ItemSchemaDefinition: SchemaDefinitionProperty = {
    name: {
        type: String,
        require: true,
    },
    asset: {
        type: String,
        require: true,
    },
    iType: {
        type: String,
        enum: Object.keys(ItemType),
        default: String(ItemType.FOOD),
    },
    quantity: {
        type: Number,
        require: true,
    },
    price: {
        type: [
            {
                _id: false,
                cType: {
                    type: String,
                    enum: Object.keys(CurrencyType),
                    default: String(CurrencyType.COIN),
                },
                value: {
                    type: Number,
                    require: true,
                },
            },
        ],
    },
    status: {
        type: String,
        enum: Object.keys(ItemStatus),
        default: String(ItemStatus.SELL),
    },
    owner: {
        type: String,
        require: false,
    },
    effect: {
        type: [
            {
                _id: false,
                status: {
                    type: String,
                    enum: Object.keys(StatusType),
                },
                effect: {
                    type: Number,
                    require: true,
                },
            },
        ],
    },
}

export const ItemSchema = new Schema(ItemSchemaDefinition, { timestamps: true })
