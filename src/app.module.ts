import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { MailerModule } from '@nestjs-modules/mailer';
import { DatabaseModule } from './common/database/database.module.js';
import { MainAppModule } from './module/main-app.module.js';
import { SecurityModule } from './common/security/security.module.js';
import { HelperModule } from './common/helpers/helper.module.js';
import { MedicineMainModule } from './module/medicine-module/medicine-main.module.js';
import { MedicineModule } from './module/medicine-module/medicine/medicine.module.js';
import { MedicineCategoryModule } from './module/medicine-module/medicine-category/medicine-category.module.js';
import { MedicineOrderModule } from './module/medicine-module/medicine-order/medicine-order.module.js';
import { SupplierModule } from './module/supplier-module/supplier.module.js';
import { UserModule } from './module/user-module/user.module.js';
import { ActivityLogModule } from './module/logs-module/activity-log.module.js';
import { AuthModule } from './common/security/auth/auth.module.js';
import { RolesGuard } from './common/security/guards/roles.guard.js';
import { OrderDetailModule } from './module/medicine-module/medicine-order/order-detail/order-detail.module.js';
import { TransactionModule } from './module/transaction-module/transaction.module.js';
import { TransactionDetailModule } from './module/transaction-module/transaction-detail/transaction-detail.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    HelperModule,
    SecurityModule,
    MainAppModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'api',
        module: MainAppModule,
        children: [
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'medicine-data',
            module: MedicineMainModule,
            children: [
              {
                path: 'medicines',
                module: MedicineModule,
              },
              {
                path: 'medicine-categories',
                module: MedicineCategoryModule,
              },
            ],
          },
          {
            path: 'suppliers',
            module: SupplierModule,
          },
          {
            path: 'users',
            module: UserModule,
          },
          {
            path: 'activity-logs',
            module: ActivityLogModule,
          },
          {
            path: 'finances',
            children: [
              {
                path: 'medicine-orders',
                module: MedicineOrderModule,
              },
              {
                path: 'order-details',
                module: OrderDetailModule,
              },
              {
                path: 'transactions',
                module: TransactionModule,
              },
              {
                path: 'transaction-details',
                module: TransactionDetailModule,
              },
            ],
          },
        ],
      },
    ]),
    // MailerModule.forRootAsync({}),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 20000,
          limit: 15,
          setHeaders: true,
        },
      ],
      errorMessage: 'Sorry you sending request to many times',
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AppController],
})
export class AppModule {}
