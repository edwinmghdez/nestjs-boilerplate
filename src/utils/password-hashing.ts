import * as bcrypt from 'bcrypt'

const saltRounds = 10

/**
 * Hash a plain text password using bcrypt.
 * @param password The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

/**
 * Compare a plain text password with a hashed password.
 * @param plainPassword The plain text password to compare.
 * @param hashedPassword The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const match = await bcrypt.compare(plainPassword, hashedPassword)
  return match
}

export const comparePlainPasswords = (
  password: string,
  passwordConfirm: string,
) => {
  return password === passwordConfirm
}
