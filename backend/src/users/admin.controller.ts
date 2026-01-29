import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from './entities/user.entity';
import { ApproveUserDto, RejectUserDto, UserDto } from './dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuarios pendientes de aprobación' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios pendientes' })
  async getPendingUsers(): Promise<UserDto[]> {
    const users = await this.usersService.getPendingUsers();
    return users.map(this.formatUserDto);
  }

  @Patch('users/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario aprobado' })
  async approveUser(
    @Param('id') userId: string,
    @Body() approveDto: ApproveUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<UserDto> {
    const user = await this.usersService.approveUser(
      userId,
      currentUser.id,
      approveDto.notes,
    );
    return this.formatUserDto(user);
  }

  @Patch('users/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rechazar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario rechazado' })
  async rejectUser(
    @Param('id') userId: string,
    @Body() rejectDto: RejectUserDto,
    @CurrentUser() currentUser: any,
  ): Promise<UserDto> {
    const user = await this.usersService.rejectUser(
      userId,
      rejectDto.reason,
      currentUser.id,
    );
    return this.formatUserDto(user);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR_POA)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de todos los usuarios' })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.getAllUsers();
    return users.map(this.formatUserDto);
  }

  private formatUserDto(user: any): UserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      rejectionReason: user.rejectionReason,
    };
  }
}
