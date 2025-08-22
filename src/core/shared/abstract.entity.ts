import { PrimaryGeneratedColumn } from 'typeorm';
import { AbstractDto, AbstractIdentityDto } from './abstract.dto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;
  toDto(): T {
    return new this.dtoClass(this);
  }
}
export abstract class AbstractIdentityEntity<
  T extends AbstractIdentityDto = AbstractIdentityDto,
> {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;
  abstract dtoClass: new (entity: AbstractIdentityEntity, options?: any) => T;
  toDto(): T {
    return new this.dtoClass(this);
  }
}
