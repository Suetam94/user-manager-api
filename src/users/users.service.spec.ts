import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a user', async () => {
    // Arrange
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    const createdUser = {
      id: 1,
      ...createUserDto,
    };

    // Mockar o método create do Prisma para retornar o usuário criado
    mockPrisma.user.create.mockResolvedValue(createdUser);

    // Act
    const result = await usersService.create(createUserDto);

    // Assert
    expect(result).toEqual(createdUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: createUserDto,
    });
  });

  it('should return all users', async () => {
    // Arrange
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', password: '1234' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: '5678' },
    ];

    // Mockar o método findMany do Prisma para retornar a lista de usuários
    mockPrisma.user.findMany.mockResolvedValue(users);

    // Act
    const result = await usersService.findAll();

    // Assert
    expect(result).toEqual(users);
    expect(mockPrisma.user.findMany).toHaveBeenCalled();
  });

  it('should return a user by ID', async () => {
    // Arrange
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    // Mockar o método findUnique do Prisma para retornar o usuário
    mockPrisma.user.findUnique.mockResolvedValue(user);

    // Act
    const result = await usersService.findById(1);

    // Assert
    expect(result).toEqual(user);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return null when user is not found', async () => {
    // Arrange
    // Mockar o método findUnique do Prisma para retornar null
    mockPrisma.user.findUnique.mockResolvedValue(null);

    // Act
    const result = await usersService.findById(99);

    // Assert
    expect(result).toBeNull();
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 99 },
    });
  });

  it('should update a user', async () => {
    // Arrange
    const updateUserDto: UpdateUserDto = {
      name: 'Updated John',
      email: 'updated.john@example.com',
    };

    const updatedUser = {
      id: 1,
      ...updateUserDto,
    };

    // Mockar o método update do Prisma para retornar o usuário atualizado
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    // Act
    const result = await usersService.update(1, updateUserDto);

    // Assert
    expect(result).toEqual(updatedUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateUserDto,
    });
  });

  it('should delete a user by ID', async () => {
    // Arrange
    const deleteResult = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    // Mockar o método delete do Prisma para retornar o usuário deletado
    mockPrisma.user.delete.mockResolvedValue(deleteResult);

    // Act
    const result = await usersService.delete(1);

    // Assert
    expect(result).toEqual(deleteResult);
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
