import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth.module.js';
import { JwtStrategy } from './jwt-strategy.strategy.js';
import { LocalStrategy } from './local-strategy.strategy.js';
import { EmployeeModule } from '../../../../module/user-manage-module/employee-module/employee.module.js';

@Module({
  imports: [forwardRef(() => AuthModule), EmployeeModule],
  providers: [JwtStrategy, LocalStrategy],
})
export class AuthHelperModule {}
