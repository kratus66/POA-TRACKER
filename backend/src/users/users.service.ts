import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, UserRole } from './entities/user.entity';
import { AuditLog, AuditAction } from '../audit/entities/audit-log.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async getPendingUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: UserStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async approveUser(userId: string, performedBy: string, notes?: string): Promise<User> {
    const user = await this.getUserById(userId);

    if (user.status !== UserStatus.PENDING) {
      throw new Error('Solo se pueden aprobar usuarios pendientes');
    }

    user.status = UserStatus.ACTIVE;
    await this.userRepository.save(user);

    // Registrar auditoría
    await this.auditLogRepository.save({
      userId,
      performedBy,
      action: AuditAction.APPROVE,
      description: `Usuario aprobado${notes ? `: ${notes}` : ''}`,
    });

    return user;
  }

  async rejectUser(userId: string, reason: string, performedBy: string): Promise<User> {
    const user = await this.getUserById(userId);

    if (user.status !== UserStatus.PENDING) {
      throw new Error('Solo se pueden rechazar usuarios pendientes');
    }

    user.status = UserStatus.REJECTED;
    user.rejectionReason = reason;
    await this.userRepository.save(user);

    // Registrar auditoría
    await this.auditLogRepository.save({
      userId,
      performedBy,
      action: AuditAction.REJECT,
      description: `Usuario rechazado. Motivo: ${reason}`,
      metadata: { reason },
    });

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: { role, status: UserStatus.ACTIVE },
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }
}
