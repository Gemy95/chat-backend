import {
  loginUserStub,
  registerUserStub,
  resetPasswordUserStub,
} from '../test/stubs/app.stub';

export const AppService = jest.fn().mockReturnValue({
  registerUser: jest.fn().mockReturnValue(registerUserStub()),
  resetPasswordUser: jest.fn().mockReturnValue(resetPasswordUserStub()),
  loginUser: jest.fn().mockReturnValue(loginUserStub()),
});
