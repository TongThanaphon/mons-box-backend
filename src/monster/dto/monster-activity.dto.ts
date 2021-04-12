import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'

import { ActivityType } from '../enum'

export class MonsterActivity {
    @IsNotEmpty()
    @IsEnum(Object.keys(ActivityType))
    @ApiProperty({ enum: ActivityType, description: 'Activity type' })
    activity: ActivityType

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Activity effect' })
    effect: number
}
