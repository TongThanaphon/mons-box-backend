import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

import { AssetDto } from './asset.dto'
import { Asset } from '../interface'

export class InventoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'User id' })
    userId: string

    @IsArray()
    @ValidateNested()
    @Type(() => AssetDto)
    @ApiProperty({ description: 'Asset array', type: [AssetDto] })
    assets: Asset[]
}
