import * as dotenv from "dotenv";

dotenv.config();

export const filtersFields = {
  defaultPage: 1,
  defaultLimit: 10
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  token_type: 'bearer',
  ttl: parseInt(process.env.JWT_TTL, 10) * 60
};
