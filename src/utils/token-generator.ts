import { v4 as uuidv4 } from 'uuid'

export function generateUniqueToken(): string
{
  return uuidv4();
}
