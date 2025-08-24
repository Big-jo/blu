import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from '../../core/shared/abstract.dto';
import { CustomerEntity } from './customer.entity';
import { WalletResponseDto } from '../wallet/wallet.dto';

export class CustomerResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Balance',
    type: WalletResponseDto,
  })
  wallet: WalletResponseDto;

  constructor(entity: CustomerEntity) {
    super(entity);
    this.name = entity.name;
    this.email = entity.email;
    this.wallet = entity.wallet?.toDto();
  }
}

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
