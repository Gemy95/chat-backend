import { LoginUserDto } from '../../dto/login.user.dto';
import { RegisterUserDto } from '../../dto/register.user.dto';
import { ResetPasswordDto } from '../../dto/reset-password.user.dto';

const resgisterUserModel = {
  statusCode: 201,
  message: 'data added successfully',
  data: {
    name: 'asd',
    email: 'test@gmail.com',
    activationCode: 'GsWHOnOiOGlRhdi2NVRpb',
    isActivated: false,
    _id: '6384771fb5a6f265fa9cf797',
    createdAt: '2022-11-28T08:53:51.974Z',
    updatedAt: '2022-11-28T08:53:51.974Z',
    __v: 0,
  },
};

const loginUserModel = {
  statusCode: 201,
  message: 'data added successfully',
  data: {
    _id: '63823772e9bffdb98e33e11c',
    name: 'ali',
    email: 'ali.gamal95880@gmail.com',
    isActivated: true,
    __v: 0,
    accessToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzgyMzc3MmU5YmZmZGI5OGUzM2UxMWMiLCJuYW1lIjoiYWxhYSIsImVtYWlsIjoiYWxhYWVsa29zeTIwMTBAZ21haWwuY29tIiwiaXNBY3RpdmF0ZWQiOnRydWUsIl9fdiI6MCwiaWF0IjoxNjY5NjQxNDUzLCJleHAiOjE2NzA1MDU0NTMsImF1ZCI6IkNMSUVOVCIsImlzcyI6IkNvbXBhbnkiLCJzdWIiOiJpYW1AdXNlci5tZSJ9.JccUBqdGuzLTZgoJah8uDqWuXZoQQKixxoT-wX11ty4GAw__xhjz7oPc28NEDN2eEvM0tIfIYzBvDqHlZZqb1Qq5k7X7v5H2kM9ynscN76KgSXffDjCWeAXECthggimDu-LtqkavrL26mu4I1W_iCq7e7GgiRCpZYKbOXc5CBhKpgrDdVo_Tb7hP4uMcxWcb-8fmJjLBdclxsRR3_6XI_90ZGIlvF7s8UPHBnk32pjqzs8c4yv2CKf6UPAcPBgqhbS78RP0gf5NodFQ8yVqAsfynauV01NVLd3sLhbYylsbMS5xl7AQvQmto8nfxOyJbvuP3dXKjUspruuv1Bt1i3A',
    refreshToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzgyMzc3MmU5YmZmZGI5OGUzM2UxMWMiLCJuYW1lIjoiYWxhYSIsImVtYWlsIjoiYWxhYWVsa29zeTIwMTBAZ21haWwuY29tIiwiaXNBY3RpdmF0ZWQiOnRydWUsIl9fdiI6MCwiaWF0IjoxNjY5NjQxNDUzLCJleHAiOjE2NzA5Mzc0NTMsImF1ZCI6IkNMSUVOVCIsImlzcyI6IkNvbXBhbnkiLCJzdWIiOiJpYW1AdXNlci5tZSJ9.IQ26YHAznCYNi_qOYCggvF64aAJYw-XtpJ5salNhjpxYtZiylipMmDRJhvAP0EnaK2SdbfVkHW7DpMnqpenesanbdIwcEypbYNfykGwpvtvuSiT7obOOWwTEzGWzPXtB0cIBpRyNBVkX5-HCki_T7QQBpTbcMiuWAZ7NLIaJy0q84GnxmJfof9HRgsKh750mF__jfzXs3U6iXCizxWzh2cFzyrNS50y_AUYMsh02WeubhZP8Px5fTSirIMa-SYzL4g5LX3TU9WSLvO_8xarKJG9oiDlGM-BzFLWNcEEF5jrMoABUPgRqSVNKi0xLxOmWZBeLpsaUGUmCatcEcu19KA',
  },
};

const resetPasswordModel = {
  statusCode: 200,
  message: 'data updated successfully',
  data: 'updated',
};

export const registerUserStub = (): {
  statusCode: number;
  message: string;
  data: {
    name: string;
    email: string;
    activationCode: string;
    isActivated: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
} => {
  return resgisterUserModel;
};

export const loginUserStub = (): {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    isActivated: boolean;
    __v: number;
    accessToken: string;
    refreshToken: string;
  };
} => {
  return loginUserModel;
};

export const resetPasswordUserStub = (): {
  statusCode: number;
  message: string;
  data: string;
} => {
  return resetPasswordModel;
};
