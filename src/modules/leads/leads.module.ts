import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { DatabaseModule } from '../database/database.module';
import { IaModule } from '../ia/ia.module';

@Module({
  imports: [DatabaseModule, IaModule,],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
