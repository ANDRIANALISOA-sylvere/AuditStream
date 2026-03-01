import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('client')
@UseGuards(AuthGuard, RolesGuard)
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('/')
  @Roles(Role.ADMIN, Role.USER)
  async getAll() {
    return await this.clientService.getAllClient();
  }

  @Post('/')
  @Roles(Role.USER)
  async create(@Body() data: CreateClientDto) {
    return await this.clientService.createClient(data);
  }
}
