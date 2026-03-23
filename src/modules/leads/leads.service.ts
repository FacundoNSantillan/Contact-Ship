import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DatabaseService } from '../database/database.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateLeadDto) {
    const existing = await this.prisma.lead.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('El lead con este email ya existe');

    return this.prisma.lead.create({ data: dto });
  }

  async findAll() {
    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const cacheKey = `lead_detail:${id}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead no encontrado');

    await this.cacheManager.set(cacheKey, lead, 3600000); 
    
    return lead;
  }
}