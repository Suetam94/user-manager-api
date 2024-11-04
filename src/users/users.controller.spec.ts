import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  // Mock para o UsersService
  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Mock para o JwtAuthGuard
  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard) // Mock do JwtAuthGuard para permitir acesso
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
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

    // Mockar o método create do UsersService para retornar o usuário criado
    mockUsersService.create.mockResolvedValue(createdUser);

    // Act
    const result = await usersController.create(createUserDto);

    // Assert
    expect(result).toEqual(createdUser);
    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should return all users', async () => {
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', password: '1234' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: '5678' },
    ];

    mockUsersService.findAll.mockResolvedValue(users);

    const result = await usersController.findAll();

    expect(result).toEqual(users);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('should return users by id', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    mockUsersService.findById.mockResolvedValue(user);

    const result = await usersController.findById('1');

    expect(result).toEqual(user);
    expect(usersService.findById).toHaveBeenCalledWith(1);
  });

  it('should throw an exception when user is not found', async () => {
    mockUsersService.findById.mockResolvedValue(null);

    try {
      await usersController.findById('99');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toBe('User Not Found');
    }
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'John Updated',
      email: 'john.updated@example.com',
    };

    const updatedUser = {
      id: 1,
      ...updateUserDto,
    };

    mockUsersService.update.mockResolvedValue(updatedUser);

    const result = await usersController.update('1', updateUserDto);

    expect(result).toEqual(updatedUser);
    expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should delete a user by ID', async () => {
    const deleteResult = { message: 'User deleted successfully' };

    mockUsersService.delete.mockResolvedValue(deleteResult);

    const result = await usersController.delete('1');

    expect(result).toEqual(deleteResult);
    expect(usersService.delete).toHaveBeenCalledWith(1);
  });
});
