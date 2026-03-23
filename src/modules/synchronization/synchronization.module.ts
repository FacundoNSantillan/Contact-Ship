import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SynchronizationService } from './synchronization.service';
import { LeadsModule } from '../leads/leads.module'; 

@Module({
  imports: [HttpModule, LeadsModule],
  providers: [SynchronizationService],
})
export class SynchronizationModule {}