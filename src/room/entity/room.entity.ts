import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('room')
export class Room {
  @PrimaryColumn()
  room: string;

  @Column()
  user: string;
}
