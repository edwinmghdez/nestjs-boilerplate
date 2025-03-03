import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PasswordResetTokens } from 'src/modules/auth/entities/password-reset-tokens.entity'

@Module({
  imports:
  [
    TypeOrmModule.forFeature([
      PasswordResetTokens
    ])
  ],
  exports: [TypeOrmModule]
})
export class RepositoryModule {}
