import { Injectable , NotFoundException } from '@nestjs/common';
import { CreateBookdto } from './create_book.dto';
import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  
  constructor(
    @InjectRepository(Book)
    private readonly books: Repository<Book>,
  ){}
  


  // Lista livros essa e demais funçoes foram adptadas para usar o repositorio e as funções do typeOrm
 async findAll() {
    return await this.books.find();
  }
 // busca livro por id
  async findOne(id:string){

    const findBook = await this.books.findOneBy({ id }); 
    if (!findBook) {
      throw new NotFoundException(" ID não encontrado");
    }
    return findBook;
  }
  /*   // gerava  valor aleatorio para id agora implementei uuid entao não se usa mais 
   getRandomInt(min:number,max:number)  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  } */
 // cria livro 
 async create(CreateBookdto : CreateBookdto): Promise<Book>{
    const book = this.books.create(CreateBookdto);
     //book.id ++ ;
     if (book.titulo.length === 0 || !book.titulo) {
        throw new NotFoundException('Titulo não pode ser vazio'); 
     }
    return await this.books.save(book);
   
  }
  // remove livro
   async remove(id:string): Promise<void>{
    const index = await this.books.delete(id) ;

    if (index.affected ===0) {
        throw new NotFoundException("ID não encontrado");
    }
  }

}
