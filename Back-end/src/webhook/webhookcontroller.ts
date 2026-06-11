import { Controller, Post, Headers, BadRequestException, HttpCode, HttpStatus, Body, Req } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('webhooks')
export class WebhooksController {
    constructor(private readonly appService: AppService) {}
 
    @Post('tots-integration')
    @HttpCode(HttpStatus.OK)
    async handleTotsWebhook(
        @Headers('origem') origem: string,
        @Headers('chave') chave: string,
        @Headers('authorization') authHeader: string, 
        @Req() request: any, 
        @Body() body: any
    ) {
        console.log('--- TODOS OS HEADERS RECEBIDOS ---');
        console.log(request.headers); 

        console.log('--- HEADER DE AUTORIZAÇÃO ESPECÍFICO ---');
        console.log('Authorization recebido:', authHeader);

        // verificando tipo de autorização

        // Verifica Bearer Token
        if (authHeader && authHeader.startsWith('Bearer ')) {
            console.log('Tipo de Autorização Detectado: Bearer Token');
            
            const token = authHeader.split(' ')[1]; // Corta o Bearer e pega so o token
            const expectedToken = 'alface'; // Define o token esperado

            if (token !== expectedToken) {
                throw new BadRequestException('Requisição inválida: Token Bearer incorreto.');
            }
        } 
         // verifica Basic Auth
        else if (authHeader && authHeader.startsWith('Basic')) {
            console.log('Tipo de Autorização Detectado: Basic Auth');

            const base64Credentials = authHeader.split(' ')[1]; // tira o basic e pega so o texto em base64

            if (!base64Credentials) {
               throw new BadRequestException('Credenciais Basic Auth ausentes.'); // se nao tiver taca exception
            }

            const translatedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8'); // traduz a base pra string

            const [user, password] = translatedCredentials.split(':'); // tira o :  e separa o usuario da senha

            console.log(`Tentativa de login - Usuário: ${user}`);

            const expectedUser = 'admin';
            const expectedPassword = 'teste';

              if (user!==expectedUser|| password !==expectedPassword ) {
                throw new BadRequestException('Requisição inválida: Usuario ou Senha incorretas.'); // se o user e a password nao bater dale exception
            }
        }
        
        // Verifica o header a logica de antes
        else if (origem === 'Tots' && chave === 'tots') {
            console.log('Tipo de Autorização Detectado: Custom API Key (origem/chave)');
            // Origem e chave batem 
        } 
        
        // nao mandou credencial em nenhum dos formatos
        else {
            console.log('Tipo de Autorização Detectado: Nulo ou Inválido');
            throw new BadRequestException('Requisição inválida: Credenciais de autorização ausentes ou incorretas.');
        }

        // se passou por qualquer uma das validacoes acima dale Service
        return await this.appService.processTotsUpdate(body);
    }
}