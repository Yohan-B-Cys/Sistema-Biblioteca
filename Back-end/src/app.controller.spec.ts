import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateBookdto } from './dto/create_book.dto';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  // 1. Create a mock version of AppService
  const mockAppService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  // 2. Set up the testing module before each test runs
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService, // Use our fake service instead of the real one
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  // 3. Write the actual tests
  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [{ id: '1', titulo: '1984', autor: 'George Orwell', ano: 1949 }];
      
      // Tell our mock service what to return when findAll is called
      mockAppService.findAll.mockResolvedValue(result);

      // Call the controller method
      const response = await controller.findAll();

      // Assertions: Did it do what we expect?
      expect(response).toEqual(result);
      expect(mockAppService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const dto: CreateBookdto = { titulo: 'Duna', autor: 'Frank Herbert', ano: 1965 };
      const createdBook = { id: '2', ...dto };

      mockAppService.create.mockResolvedValue(createdBook);

      const response = await controller.create(dto);

      expect(response).toEqual(createdBook);
      expect(mockAppService.create).toHaveBeenCalledWith(dto);
    });
  });
});