import { Schema, SchemaDefinitionProperty } from 'mongoose'

import { CurrencyType } from '../enum'

const WalletSchemaDefinition: SchemaDefinitionProperty = {
    userId: {
        type: String,
        require: true,
    },
    currencies: {
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
}

export const WalletSchema = new Schema(WalletSchemaDefinition, { timestamps: true })
