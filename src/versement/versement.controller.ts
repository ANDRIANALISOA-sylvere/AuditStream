import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VersementService } from './versement.service';
import { CreateVersementDto } from './dto/create-versement.dto';
import { UpdateVersementDto } from './dto/update-versement.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import {
  CurrentUser,
  type CurrentUserData,
} from 'src/common/decorators/current-user.decorator';

@Controller('versement')
@UseGuards(AuthGuard, RolesGuard)
export class VersementController {
  constructor(private readonly versementService: VersementService) {}

  @Get('/')
  @Roles(Role.USER, Role.ADMIN)
  getAll() {
    return this.versementService.getAll();
  }

  @Post('/')
  @Roles(Role.USER)
  create(
    @Body() dto: CreateVersementDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.versementService.create(dto, user.sub);
  }

  @Patch('/:numero_versement')
  @Roles(Role.USER)
  update(
    @Param('numero_versement') numero_versement: string,
    @Body() dto: UpdateVersementDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.versementService.update(numero_versement, dto, user.sub);
  }

  @Delete('/:numero_versement')
  @Roles(Role.USER)
  delete(
    @Param('numero_versement') numero_versement: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.versementService.delete(numero_versement, user.sub);
  }
}
