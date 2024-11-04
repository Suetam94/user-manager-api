import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  // Mock para o AuthService
  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      const user = { email: 'test@example.com', password: 'password' };
      const token = { access_token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(token);

      const result = await authController.login(user);

      expect(result).toEqual(token);
    });

    it('should throw an UnauthorizedException if login fails', async () => {
      const user = { email: 'invalid@example.com', password: 'wrongPassword' };
      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      try {
        await authController.login(user);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
