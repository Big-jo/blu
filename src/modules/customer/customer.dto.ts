import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from '../../core/shared/abstract.dto';
import { CustomerEntity } from './customer.entity';

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

  constructor(entity: CustomerEntity) {
    super(entity);
    this.name = entity.name;
    this.email = entity.email;
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
