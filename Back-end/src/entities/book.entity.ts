import { Entity,Column,PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Logs } from "./log.entity";
import { History } from "./history.entity";

@Entity('books')
 export class Book{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column()
    titulo!:string;

    @Column()
    autor!:string;

    @Column()
    ano!:number;

    @OneToMany(() => Logs, (log) => log.book )
    logs!: Logs [];

    @OneToMany(() => History, (history)=> history.book )
    history!: History [] ;
 }