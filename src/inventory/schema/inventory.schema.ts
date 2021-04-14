import { Schema, SchemaDefinitionProperty } from 'mongoose'

const InventorySchemaDefinition: SchemaDefinitionProperty = {
    userId: {
        type: String,
        require: true,
    },
    assets: {
        type: [
            {
                _id: false,
                itemId: {
                    type: String,
                    require: true,
                },
                quantity: {
                    type: Number,
                    require: true,
                },
            },
        ],
    },
}

export const InventorySchema = new Schema(InventorySchemaDefinition, {
    timestamps: true,
})
