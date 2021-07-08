import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Messages } from '../chat/messages.model';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  password_salt: string

  @OneToMany(() => Messages, message => message.user)
  messages: Messages[]
}