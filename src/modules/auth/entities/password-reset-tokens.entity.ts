import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, DeleteDateColumn } from 'typeorm'

@Entity({ name: 'password_reset_tokens' })
export class PasswordResetTokens
{
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  token: string

  @Column({ type: 'datetime', nullable: true })
  expiration_date: Date

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date

  @BeforeInsert()
  setExpirationDate() {
    const now = new Date()
    this.expiration_date = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes in milliseconds
  }
}
