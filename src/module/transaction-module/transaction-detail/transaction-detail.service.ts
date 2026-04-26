import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../common/database/database.service.js';

@Injectable()
export class TransactionDetailService {
  private readonly logger = new Logger(TransactionDetailService.name);
  constructor(private readonly prisma: DatabaseService) { }

}

