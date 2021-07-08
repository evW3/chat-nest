import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.model';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  message: string

  @Column({ type: 'timestamptz' }) // Recommended
  date: Date;

  @ManyToOne(() => Users, user => user.messages)
  @JoinColumn({name: 'user_id'})
  user: Users
}