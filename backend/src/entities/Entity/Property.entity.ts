import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  name: string;
 
  @Column()
  location: string;
 
  @Column()
  price: string;
 
  @Column({ type: 'enum', enum: ['rent', 'sale'] })
  type: 'rent' | 'sale';
 
  @CreateDateColumn()
  createdAt: Date;
}