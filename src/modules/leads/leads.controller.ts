import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('create-lead')
  @ApiOperation({ summary: 'Crea un lead manualmente' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista los leads existentes' })
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene el detalle de un lead (con cache)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.findOne(id);
  }
}