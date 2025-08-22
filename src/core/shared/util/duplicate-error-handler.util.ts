import { ConflictException } from '@nestjs/common';

type ResponseArgs = {
  message?: string;
  nameReplacements: Record<string, string>;
};
export const duplicateErrorHandler = (
  error: any,
  responseArgs?: ResponseArgs,
) => {
  if (error?.code?.toString() !== '23505') {
    return;
  }

  const matches = error?.detail?.match(/Key \((.*)\)=/);
  const keys = matches?.[1]?.split(',');

  const { message, nameReplacements = {} } = responseArgs || {};

  const names: string[] = keys.reduce((acc: string[], curr: string) => {
    acc.push(nameReplacements[curr] || curr);
    return acc;
  }, []);

  const errorMessage =
    message || names.length
      ? `Duplicate record with same ${names.join('/')} already exists.`
      : 'Duplicate record already exists.';

  throw new ConflictException(errorMessage, 'DUPLICATE_ENTRY_ERROR');
};
