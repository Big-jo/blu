import { SetMetadata } from '@nestjs/common';

export const UserTypeDecorator = (...userTypes: string[]) =>
  SetMetadata('userTypes', userTypes);
