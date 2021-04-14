import { Document } from 'mongoose'

import { Currency } from './currency.interface'

export interface Wallet extends Document {
    id?: string
    userId: string
    currencies: Currency[]
}
