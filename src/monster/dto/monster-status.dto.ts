import { ApiProperty } from '@nestjs/swagger'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { Status } from '../interface'
import { StatusDto } from './status.dto'

export class MonsterStatusDto {
    @ValidateNested()
    @Type(() => StatusDto)
    @ApiProperty({ type: () => StatusDto })
    hungry: Status

    @ValidateNested()
    @Type(() => StatusDto)
    @ApiProperty({ type: () => StatusDto })
    cleanliness: Status

    @ValidateNested()
    @Type(() => StatusDto)
    @ApiProperty({ type: () => StatusDto })
    healthy: Status

    @ValidateNested()
    @Type(() => StatusDto)
    @ApiProperty({ type: () => StatusDto })
    experience: Status

    @ValidateNested()
    @Type(() => StatusDto)
    @ApiProperty({ type: () => StatusDto })
    happiness: Status
}
