import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookdto } from './dto/create_book.dto';
import { Book } from './entities/book.entity';
import { Logs } from './entities/log.entity';
import { History } from './entities/history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Book)
    private readonly books: Repository<Book>,

    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,

    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async findAll(): Promise<Book[]> {
    
      return this.dataSource.transaction (async (manager) => {

      const log = manager.create(Logs, {
        method: 'GET',
        payload: JSON.stringify({
          resource:'books',
          action:'findAll',
        }) ,
      });


      await manager.save(Logs, log);

	 return await this.books.find();
    })


  }

  async findOne(id: string): Promise<Book> {

    const findBook = await this.books.findOneBy({ id });
    return this.dataSource.transaction( async (manager) => {
    
    const findBook = await this.books.findOneBy({ id });

    if (!findBook) {
      throw new NotFoundException('ID não encontrado');
    }

     const log = manager.create(Logs, {
        method: 'GET',
        payload: JSON.stringify({
          resource:'books',
          action:'findById',
        }) ,
      });

       await manager.save(Logs, log);

    return findBook;
    })
  }

  async create(createBookDto: CreateBookdto): Promise<Book> {
    return this.dataSource.transaction(async (manager) => {
      if (!createBookDto.titulo || createBookDto.titulo.trim().length === 0) {
        throw new BadRequestException('Título não pode ser vazio');
      }
       if (!createBookDto.autor || createBookDto.autor.trim().length === 0) {
        throw new BadRequestException('Autor não pode ser vazio');
      }
      if (!createBookDto.ano) {
        throw new BadRequestException('Ano não pode ser vazio');
      }  

      const book = manager.create(Book, createBookDto);
      const savedBook = await manager.save(Book, book);

      const history = manager.create(History, {
        label: 'book',
        oldValue: '',
        newValue: JSON.stringify({
          titulo: savedBook.titulo,
          autor: savedBook.autor,
          ano: savedBook.ano,
        }),
        book: savedBook,
      });

      const log = manager.create(Logs, {
        method: 'POST',
        payload: JSON.stringify({
          titulo: savedBook.titulo,
          autor: savedBook.autor,
          ano: savedBook.ano,
        }),
        book: savedBook,
      });

      await manager.save(History, history);
      await manager.save(Logs, log);

      return savedBook;
    });
  }

 async update(id: string, newData: Partial<Book>): Promise<Book> {
  return this.dataSource.transaction(async (manager) => {
    const book = await manager.findOne(Book, { where: { id } });

    if (!book) {
      throw new NotFoundException('ID não encontrado');
    }

    const fieldsToTrack: (keyof Book)[] = ['titulo', 'autor', 'ano'];

    const changes = fieldsToTrack
      .filter((field) => newData[field] !== undefined && newData[field] !== book[field])
      .map((field) => ({
        label: String(field),
        oldValue: String(book[field]),
        newValue: String(newData[field]),
      }));

    if (changes.length === 0) {
      return book;
    }

    await manager.update(Book, { id }, newData);

    const updatedBook = await manager.findOne(Book, { where: { id } });

    console.log('ID Recebido:', id);
  console.log('Dados para atualizar:', newData)

    if (!updatedBook) {
      throw new NotFoundException('Livro não encontrado após update');
    }

    const historyEntries = changes.map((change) =>
      manager.create(History, {
        label: change.label,
        oldValue: change.oldValue,
        newValue: change.newValue,
        book: updatedBook,
      }),
    );

    const log = manager.create(Logs, {
      method: 'PUT',
      payload: JSON.stringify({
        resource: 'books',
        action: 'update',
        bookId: id,
        changes,
      }),
      book: updatedBook,
    });

    await manager.save(History, historyEntries);
    await manager.save(Logs, log);

    return updatedBook;
  });
}

 async remove(id: string): Promise<void> {
  await this.dataSource.transaction(async (manager) => {
    const book = await manager.findOne(Book, { where: { id } });

    if (!book) {
      throw new NotFoundException('ID não encontrado');
    }

     const history = manager.create(History, {
        bookId: id, 
        label: 'book',
        oldValue: JSON.stringify({
          titulo: book.titulo,
          autor: book.autor,
          ano: book.ano,
        }),
        newValue: '' , 
      
      });

      const log = manager.create(Logs, {
        bookId: id,  
        method: 'DELETE',
        payload: JSON.stringify({
          titulo: book.titulo,
          autor: book.autor,
          ano: book.ano,
        }),
      });

      await manager.save(History, history);
      await manager.save(Logs, log);

    await manager.delete(Book, { id });
  });
}}
