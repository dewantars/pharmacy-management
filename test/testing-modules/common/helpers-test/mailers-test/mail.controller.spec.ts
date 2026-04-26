import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from 'src/common/helpers/mail/mail.controller';
import { MailService } from 'src/common/helpers/mail/mail.service';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [MailService],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
