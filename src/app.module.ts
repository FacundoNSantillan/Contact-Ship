import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { LeadsModule } from './modules/leads/leads.module';
import { DatabaseModule } from './modules/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SynchronizationModule } from './modules/synchronization/synchronization.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL || 'redis://localhost:6379',
          ttl: 60000,
        }),
      }),
    }),
    DatabaseModule,
    LeadsModule,
    ScheduleModule.forRoot(),
    SynchronizationModule,
  ],
})
export class AppModule {}
