import { Body, Controller, Delete, Get , Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBookdto } from './dto/create_book.dto';

@Controller()
export class AppController {
  constructor(private  appService: AppService) {}

 /*  @Get()
  getHello(): string {
    return this.appService.getHello();
  } */

  @Get()
  findAll () {
    return this.appService.findAll() ;
  }

 @Get(':id')
  async findOne(@Param('id') id:string ){
  return await this.appService.findOne(id);
 }

 @Delete(':id')
  async remove(@Param('id') id:string ){
  return await this.appService.remove(id);
 }

  @Post()
    async create(@Body() CreateBookdto : CreateBookdto ){
    const insertbook = await this.appService.create(CreateBookdto) ;
    return insertbook;
   }   
   
   @Put (':id')
    update(@Param('id') id:string, @Body() newData: any){
      return this.appService.update(id , newData);
    }
 


}
