import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { Currency } from '../interface'
import { CurrenctDto } from './currency.dto'

export class WalletUpdateDto {
    @IsArray()
    @ValidateNested()
    @Type(() => CurrenctDto)
    @ApiProperty({ description: 'Currency array', type: [CurrenctDto] })
    currencies: Currency[]
}
