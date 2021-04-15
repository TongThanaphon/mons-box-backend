import { Document } from 'mongoose'

export interface User extends Document {
    id?: string
    username: string
    password?: string
    token?: string
}
