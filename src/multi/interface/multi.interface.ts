import { Document } from 'mongoose'

export interface Multi extends Document {
    id?: string
    creatorId: string
    code: string
    count: number
}
