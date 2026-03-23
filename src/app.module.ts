import { Module } from '@nestjs/common';
import { LeadsModule } from './modules/leads/leads.module';
import { IaModule } from './modules/ia/ia.module';
import { SynchronizationModule } from './modules/synchronization/synchronization.module';
import { SynchronizationService } from './modules/synchronization/synchronization.service';
import { DatabaseModule } from './modules/database/database.module';
import { DatabaseService } from './modules/database/database.service';

@Module({
  imports: [LeadsModule, IaModule, SynchronizationModule, DatabaseModule],
  controllers: [],
  providers: [SynchronizationService, DatabaseService],
})
export class AppModule {}
