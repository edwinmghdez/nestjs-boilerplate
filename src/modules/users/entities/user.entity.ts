import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('users')
export class User
{
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  last_name: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ type: 'datetime', nullable: true })
  email_verified_at: Date

  @Column({ nullable: false })
  password: string

  @Column({ nullable: false })
  is_two_factor_enabled: boolean

  @Column({ nullable: true })
  two_factor_secret: string

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date
}
