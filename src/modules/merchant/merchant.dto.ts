import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from 'src/core/shared/abstract.dto';
import { MerchantEntity } from './merchant.entity';

export class MerchantReponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Name',
    example: 'Doe Jane Merchant',
  })
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'janedoe@gamil.com',
  })
  email: string;

  @ApiProperty({
    description: 'Api Key',
  })
  apiKey: string;

  constructor(entity: MerchantEntity) {
    super(entity);

    this.name = entity.name;
    this.email = entity.email;
    this.apiKey = entity.apiKey;
  }
}

export class CreateMerchantDto {
  @ApiProperty({
    description: 'Name',
    example: 'Doe Jane',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'janedoe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
