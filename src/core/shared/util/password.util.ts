import { compare, hash } from 'bcrypt';
import { getConfig } from '../../config/security';

export const hashPassword = async (password: string) => {
  const { saltRounds } = getConfig();
  return hash(password, saltRounds);
};

export const comparePasswords = (
  plainPassword: string,
  hashedPassword: string,
) => {
  return compare(plainPassword, hashedPassword);
};
