import { Controller, Post, Headers, BadRequestException, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('webhooks')
    export class WebhooksController{
        constructor(private readonly appService: AppService) {}
     
        @Post('tots-integration')
        @HttpCode(HttpStatus.OK)
        async handleTotsWebhook(
            @Headers('origem') origem : string,
            @Headers('chave') chave : string,
            @Body() body: any
            
        ){
            
            if (origem != 'Tots' || chave !='tots') {
                throw new BadRequestException('Requisição invalida ');
            }

            const resultado = await this.appService.processTotsUpdate(body);
          
            return{
                success: true,
                message: 'Webhook processado e validado com sucesso!',
                data: resultado
            }

            
        }
    }