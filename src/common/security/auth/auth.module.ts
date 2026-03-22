import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthHelperModule } from './helper/auth-helper.module.js';
import { EmployeeModule } from '../../../module/user-manage-module/employee-module/employee.module.js';

@Module({
  imports: [
    AuthHelperModule,
    EmployeeModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
