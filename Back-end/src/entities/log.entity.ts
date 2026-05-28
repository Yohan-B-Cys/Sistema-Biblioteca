import { Entity,Column,PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Book } from "./book.entity";

 @Entity ('logs')
  export class Logs {
    @PrimaryGeneratedColumn('uuid')
     id!: string;
    
    @ManyToOne(()=>Book, (book) => book.logs)
    book!: Book;

    @Column()
    metod!:string;

    @Column()
    payload!:string;
  }