import { Schema, SchemaDefinitionProperty } from 'mongoose'

const UserSchemaDefinition: SchemaDefinitionProperty = {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
}

export const UserSchema = new Schema(UserSchemaDefinition, { timestamps: true })
