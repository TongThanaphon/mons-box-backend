import { Schema, SchemaDefinitionProperty } from 'mongoose'

const UserSchemaDefinition: SchemaDefinitionProperty = {
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
}

export const UserSchema = new Schema(UserSchemaDefinition, { timestamps: true })
