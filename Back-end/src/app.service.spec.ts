import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Logs } from './entities/log.entity';
import { History } from './entities/history.entity';
import { CreateBookdto } from './dto/create_book.dto';

describe('AppService', () => {
    let service: AppService;


    const mockEntityManager = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };

    const mockDataSource = {
        transaction: jest.fn().mockImplementation(async (cb) => {
            return await cb(mockEntityManager);
        }),
    };

    // 3. Create fake Repositories
    const mockBookRepository = {
        find: jest.fn(),
        findOneBy: jest.fn(),
    };
    const mockLogsRepository = {};
    const mockHistoryRepository = {
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                { provide: DataSource, useValue: mockDataSource },
                { provide: getRepositoryToken(Book), useValue: mockBookRepository },
                { provide: getRepositoryToken(Logs), useValue: mockLogsRepository },
                { provide: getRepositoryToken(History), useValue: mockHistoryRepository },
            ],
        }).compile();

        service = module.get<AppService>(AppService);

        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all books and save a log via transaction', async () => {
            const booksArray = [{ id: '1', titulo: 'Test Book 1', autor: 'Testador da Silva', ano: 2026 }];


            mockBookRepository.find.mockResolvedValue(booksArray);


            const fakeLog = { method: 'GET' };
            mockEntityManager.create.mockReturnValue(fakeLog);
            mockEntityManager.save.mockResolvedValue(fakeLog);

            const result = await service.findAll();

            // Assertions
            expect(result).toEqual(booksArray);
            expect(mockDataSource.transaction).toHaveBeenCalled();
            expect(mockEntityManager.create).toHaveBeenCalled();
            expect(mockEntityManager.save).toHaveBeenCalledWith(Logs, fakeLog);
            expect(mockBookRepository.find).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a book, save log and history via transaction', async () => {
            const dto: CreateBookdto = { titulo: 'teste1', autor: 'testador da silva', ano: 123 };


            const savedBook = { id: 'generated-uuid-123', ...dto };
            const fakeLog = { method: 'POST', payload: JSON.stringify(dto), book: savedBook };
            const fakeHistory = { label: 'book', oldValue: '', newValue: JSON.stringify(dto), book: savedBook };

            // 1. Smart Mocking for manager.create based on the Entity type
            mockEntityManager.create.mockImplementation((entityClass, data) => {
                if (entityClass === Book) return { ...data, id: 'generated-uuid-123' };
                if (entityClass === Logs) return fakeLog;
                if (entityClass === History) return fakeHistory;
                return data;
            });


            mockEntityManager.save.mockImplementation(async (entityClass, data) => data);

            const result = await service.create(dto);

            expect(result).toEqual(savedBook);
            expect(mockDataSource.transaction).toHaveBeenCalled();

            expect(mockEntityManager.save).toHaveBeenCalledWith(Book, expect.any(Object));
            expect(mockEntityManager.save).toHaveBeenCalledWith(Logs, fakeLog);
            expect(mockEntityManager.save).toHaveBeenCalledWith(History, fakeHistory);
        });
    });

   describe('findHistory', () => {
  it('should return the history of one book and save a log via transaction', async () => {
    const id = 'generated-uuid-3213';
    const historyArray = [{ label: 'Campo de teste', oldValue: 'valor velho', newValue: 'Valor novo' }];
    const fakeLog = { method: 'GET', payload: expect.any(String) }; // Usamos expect.any para não falhar por espaços ou formatação do JSON

    mockHistoryRepository.find.mockResolvedValue(historyArray);

  
    mockEntityManager.create.mockReturnValue(fakeLog);
    mockEntityManager.save.mockResolvedValue(fakeLog);

    // Act
    const result = await service.findHistory(id);

    // Assert
    expect(result).toEqual(historyArray);
    expect(mockDataSource.transaction).toHaveBeenCalled();
    expect(mockHistoryRepository.find).toHaveBeenCalledWith({
      where: { bookId: id },
      order: { createdAt: 'DESC' },
    });
    expect(mockEntityManager.create).toHaveBeenCalled();
    expect(mockEntityManager.save).toHaveBeenCalledWith(Logs, fakeLog);
  });
});

});