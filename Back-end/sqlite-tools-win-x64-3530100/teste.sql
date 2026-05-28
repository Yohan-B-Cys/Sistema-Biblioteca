/* create table User (
    id integer primary key,
    name text not null,
    username text not null unique ,
    email text ,
    age integer ,
    created_at datetime default current_timestamp
); */

/* insert into User( name , username , email , age) 
values ('Yohan Cys' ,'yohan.cys' , 'yohan.cys@br' , '20'); */

select * from User ;