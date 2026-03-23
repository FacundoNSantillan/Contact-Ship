import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class SynchronizationService {
  private readonly logger = new Logger(SynchronizationService.name);
  private readonly EXTERNAL_API = 'https://randomuser.me/api/?results=10';

  constructor(
    private readonly httpService: HttpService,
    private readonly leadsService: LeadsService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.log('Iniciando sincronización automática de leads...');
    await this.syncLeads();
  }

  async syncLeads() {
    try {
      const { data } = await firstValueFrom(this.httpService.get(this.EXTERNAL_API));
      const externalLeads = data.results;

      let importedCount = 0;

      for (const user of externalLeads) {
        try {
          await this.leadsService.create({
            firstName: user.name.first,
            lastName: user.name.last,
            email: user.email,
            phone: user.phone,
            picture: user.picture.large,
          });
          importedCount++;
        } catch (error) {
          this.logger.warn(`Lead omitido (posible duplicado): ${user.email}`);
        }
      }

      this.logger.log(`Sincronización finalizada. Leads nuevos importados: ${importedCount}`);
    } catch (error) {
      this.logger.error('Error en la sincronización con RandomUser API', error.stack);
    }
  }
}