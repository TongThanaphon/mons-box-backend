import { Schema, SchemaDefinitionProperty } from 'mongoose'

import { MonsterType, MonsterLevel } from '../enum'

const MonsterSchemaDefinition: SchemaDefinitionProperty = {
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        require: true,
    },
    asset: {
        type: String,
        require: true,
    },
    status: {
        type: {
            _id: false,
            hungry: {
                type: {
                    _id: false,
                    value: {
                        type: Number,
                        require: true,
                    },
                    maxValue: {
                        type: Number,
                        require: true,
                    },
                    timestamp: {
                        type: Number,
                        require: true,
                    },
                },
            },
            cleanliness: {
                type: {
                    _id: false,
                    value: {
                        type: Number,
                        require: true,
                    },
                    maxValue: {
                        type: Number,
                        require: true,
                    },
                    timestamp: {
                        type: Number,
                        require: true,
                    },
                },
            },
            healthy: {
                type: {
                    _id: false,
                    value: {
                        type: Number,
                        require: true,
                    },
                    maxValue: {
                        type: Number,
                        require: true,
                    },
                    timestamp: {
                        type: Number,
                        require: true,
                    },
                },
            },
            experience: {
                type: {
                    _id: false,
                    value: {
                        type: Number,
                        require: true,
                    },
                    maxValue: {
                        type: Number,
                        require: true,
                    },
                    timestamp: {
                        type: Number,
                        require: true,
                    },
                },
            },
            happiness: {
                type: {
                    _id: false,
                    value: {
                        type: Number,
                        require: true,
                    },
                    maxValue: {
                        type: Number,
                        require: true,
                    },
                    timestamp: {
                        type: Number,
                        require: true,
                    },
                },
            },
            hp: {
                type: {
                    _id: false,
                    value: {
                        type: Number,
                        require: true,
                    },
                    maxValue: {
                        type: Number,
                        require: true,
                    },
                    timestamp: {
                        type: Number,
                        require: true
                    }
            },
        },
    },
    mType: {
        type: String,
        enum: Object.keys(MonsterType),
        default: String(MonsterType.SLIME),
    },
    level: {
        type: String,
        enum: Object.keys(MonsterLevel),
        default: String(MonsterLevel.BABY),
    },
    isAlive: {
        type: Boolean,
        require: true,
    },
    evolve: {
        type: {
            _id: false,
            canEvolve: {
                type: Boolean,
                require: true,
            },
            nextType: {
                type: String,
                enum: Object.keys(MonsterType),
            },
            nextLevel: {
                type: String,
                enum: Object.keys(MonsterLevel),
            },
        },
    },
}

export const MonsterSchema = new Schema(MonsterSchemaDefinition, { timestamps: true })
