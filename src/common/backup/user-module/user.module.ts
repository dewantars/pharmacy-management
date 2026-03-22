import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { DatabaseModule } from '../../common/database/database.module.js';
import { DatabaseService } from '../../common/database/database.service.js';
import { UploadModule } from '../../common/helpers/upload/upload.module.js';
import { UploadService } from '../../common/helpers/upload/upload.service.js';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      imports: [UploadModule],
      useClass: UploadService,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, DatabaseService, UploadService],
  exports: [UserService],
})
export class UserModule {}
