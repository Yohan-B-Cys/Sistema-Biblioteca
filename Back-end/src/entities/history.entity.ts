import { Entity,Column,PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity('history')
export class History{
    @PrimaryGeneratedColumn()
     id!: number;

    @Column({nullable: true})
    bookId!:string; 
    @ManyToOne(()=>Book, (book) => book.history , {
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