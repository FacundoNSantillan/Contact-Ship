import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DatabaseService } from '../database/database.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { IaService } from '../ia/ia.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private prisma: DatabaseService,
    private iaService: IaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateLeadDto) {
    const existing = await this.prisma.lead.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(
        'El lead con este email ya existe en nuestra base de datos.',
      );
    }
    const insights = await this.iaService.generateLeadInsights(
      dto.firstName,
      dto.lastName,
    );

    const newLead = await this.prisma.lead.create({
      data: {
        ...dto,
        summary: insights.summary,
        nextAction: insights.nextAction,
      },
    });

    this.logger.log(`Nuevo lead creado: ${newLead.email} con insights de IA.`);
    return newLead;
  }

  async findAll() {
    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const cacheKey = `lead_detail:${id}`;

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      this.logger.debug(`Cache HIT para el lead: ${id}`);
      return cachedData;
    }

    this.logger.debug(`Cache MISS para el lead: ${id}. Consultando DB...`);

    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`No se encontró el lead con ID: ${id}`);
    }

    await this.cacheManager.set(cacheKey, lead, 3600000);

    return lead;
  }
}
