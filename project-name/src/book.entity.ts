import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";

@Entity('books')
 export class Book{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    titulo:string;

    @Column()
    autor:string;

    @Column()
    ano:number;
 }