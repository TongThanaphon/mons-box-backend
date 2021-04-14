import { Schema, SchemaDefinitionProperty } from 'mongoose'

const MultiSchemaDefinition: SchemaDefinitionProperty = {
    creatorId: {
        type: String,
        require: true,
    },
    code: {
        type: String,
        require: true,
    },
    count: {
        type: Number,
        require: true,
        min: 0,
        max: 2,
        default: 0,
    },
}

export const MultiSchema = new Schema(MultiSchemaDefinition, { timestamps: true })
