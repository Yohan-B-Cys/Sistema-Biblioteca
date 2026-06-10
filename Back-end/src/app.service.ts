import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookdto } from './dto/create_book.dto';
import { Book } from './entities/book.entity';
import { Logs } from './entities/log.entity';
import { History } from './entities/history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class AppService { // injeção de dependencia do typeorm
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Book)
    private readonly books: Repository<Book>,

    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>,

    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}
 // metodo get que chama os livros fiz uma transação para garantir que sempre crie um registro na tabela log 
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

  async processTotsUpdate(dados: any) {
  // 1. Validação básica de entrada
  if (!dados.id) {
    throw new BadRequestException('O ID do livro é obrigatório no corpo da requisição.');
  }

  // 2. Mapeamos o JSON que veio da Tots para bater com as colunas do seu banco (corrigindo o 'autor')
  const dadosFormatados: Partial<Book> = {
    titulo: dados.titulo,
    autor: dados.autor, // garante que o 'autor' do Postman caia na propriedade certa
    ano: dados.ano,
  };

  // 3. REAPROVEITAMENTO: Chamamos o seu método update existente!
  // Ele já vai rodar a transação e gerar todo o histórico automaticamente.
  const livroAtualizado = await this.update(dados.id, dadosFormatados);

  // 4. Retorna o ID do livro atualizado para o Controller
  return { livroAtualizado: livroAtualizado.id };
}


 // similar ao get mas retorna um livro especifico mesma tranzação para tirar um log
  async findOne(id: string): Promise<Book> {

    const findBook = await this.books.findOneBy({ id });
    return this.dataSource.transaction( async (manager) => {

    if (!findBook) {
      throw new NotFoundException('ID não encontrado');
    }

     const log = manager.create(Logs, {
         bookId:id ,
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

 // metodo get para recuper o historico de um livro :

async findHistory(bookId: string): Promise<History[]> {
  // 1. Busca TODOS os históricos que pertencem ao ID desse livro
  const historyRecords = await this.historyRepository.find({
    where: { bookId: bookId },
    order: { createdAt: 'DESC' }, // traz as alterações mais novas 
  });

  // 2. Se não tiver nada, avisa o front-end
  if (!historyRecords || historyRecords.length === 0) {
    throw new NotFoundException('Nenhum histórico encontrado para este livro');
  }

  return this.dataSource.transaction (async (manager) =>  {
          const log = manager.create(Logs, {
        bookId:bookId ,
        method: 'GET',
        payload: JSON.stringify({
          resource:'History',
          action:'findAll',
        }) , 
      });

      await manager.save(Logs, log);
        // Retorna o array do historico
       return historyRecords;
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
    // 1. Busca o livro original no banco
    const book = await manager.findOne(Book, { where: { id } });

    if (!book) {
      throw new NotFoundException('ID não encontrado');
    }

    const fieldsToTrack: (keyof Book)[] = ['titulo', 'autor', 'ano'];

    // 2. Mapeia as alterações para o histórico antes de modificar o objeto
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

    //  Mescla os dados novos no objeto existente e salva de uma vez só
    Object.assign(book, newData);
    const updatedBook = await manager.save(Book, book); // Faz o UPDATE e retorna o livro atualizado

    //  Cria os registros de histórico com a instância atualizada
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
