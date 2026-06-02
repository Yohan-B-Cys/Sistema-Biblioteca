import { Entity,Column,PrimaryGeneratedColumn, ManyToOne , CreateDateColumn , JoinColumn } from "typeorm";
import { Book } from "./book.entity";

 @Entity ('logs')
  export class Logs {
    @PrimaryGeneratedColumn()
     id!: number;
    
    @Column({nullable: true})
    bookId!:string; 
    @ManyToOne(()=>Book, (book) => book.logs , {
     createForeignKeyConstraints: false
    })
    @JoinColumn({ name: 'bookId' })
    book!: Book;

    @Column()
    method!:string;

    @Column()
    payload!:string;

    @CreateDateColumn()
    createdAt!:Date;
  }