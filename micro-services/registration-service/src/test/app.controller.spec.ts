import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { LoginUserDto } from '../dto/login.user.dto';
import { RegisterUserDto } from '../dto/register.user.dto';
import { ResetPasswordDto } from '../dto/reset-password.user.dto';
import {
  loginUserStub,
  registerUserStub,
  resetPasswordUserStub,
} from './stubs/app.stub';

jest.mock('../app.service.ts');

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    describe('Once register is called', () => {
      let registerUserDto: RegisterUserDto;
      let user;

      beforeEach(async () => {
        user = await appController.registerUser(registerUserDto);
      });

      it('Should call appService', () => {
        expect(appService.registerUser).toHaveBeenCalledWith(registerUserDto);
      });

      it('Should return created user', () => {
        expect(user).toEqual(registerUserStub());
      });
    });
  });

  describe('login', () => {
    describe('Once login is called', () => {
      let loginUserDto: LoginUserDto;
      let user;

      beforeEach(async () => {
        user = await appController.loginUser(loginUserDto);
      });

      it('Should call appService', () => {
        expect(appService.loginUser).toHaveBeenCalledWith(loginUserDto);
      });

      it('Should return login user', () => {
        expect(user).toEqual(loginUserStub());
      });
    });
  });

  describe('reset password', () => {
    describe('Once reset is called', () => {
      let resetPasswordDto: ResetPasswordDto;
      let user;

      beforeEach(async () => {
        user = await appController.resetPasswordUser(resetPasswordDto);
      });

      it('Should call appService', () => {
        expect(appService.resetPasswordUser).toHaveBeenCalledWith(
          resetPasswordDto,
        );
      });

      it('Should return updated user', () => {
        expect(user).toEqual(resetPasswordUserStub());
      });
    });
  });
});
// sudo npm run test -- app.controller.spec.ts
