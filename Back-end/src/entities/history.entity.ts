import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Book } from "./book.entity";
import { Collection } from "typeorm/driver/mongodb/typings.js";

@Entity('history')
export class History{
    @PrimaryGeneratedColumn()
     id!: string;

    @Column({nullable: true})
    bookId!:string; 
    @ManyToOne(()=>Book, (book) => book.logs , {
     createForeignKeyConstraints: false
    })
    @JoinColumn({ name: 'bookId' })
    book!: Book;

     @Column()
     label!:string;

     @Column()
     oldValue!:string;

     @Column()
     newValue!:string;

     @CreateDateColumn()
     createdAt!:Date;
 
     
}