import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Book } from "./book.entity";
import { Collection } from "typeorm/driver/mongodb/typings.js";

@Entity('history')
export class History{
    @PrimaryGeneratedColumn('uuid')
     id!: string;

     @OneToOne(() => Book)
     @JoinColumn()
     book!:Book

     @Column()
     label!:string;

     @Column()
     value!:string;
     
}