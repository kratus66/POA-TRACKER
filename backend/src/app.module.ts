import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';
import { AgreementsModule } from './agreements/agreements.module';
import { PoaPeriodsModule } from './poa-periods/poa-periods.module';
import { ProgramsModule } from './programs/programs.module';
import { PoaTemplatesModule } from './poa-templates/poa-templates.module';
import { AgreementActivitiesModule } from './agreement-activities/agreement-activities.module';
import { User } from './users/entities/user.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { Municipality } from './municipalities/entities/municipality.entity';
import { Agreement } from './agreements/entities/agreement.entity';
import { PoaPeriod } from './poa-periods/entities/poa-period.entity';
import { Program } from './programs/entities/program.entity';
import { PoaTemplate } from './poa-templates/entities/poa-template.entity';
import { PoaTemplateActivity } from './poa-templates/entities/poa-template-activity.entity';
import { AgreementActivity } from './agreement-activities/entities/agreement-activity.entity';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        AuditLog,
        Municipality,
        Agreement,
        PoaPeriod,
        Program,
        PoaTemplate,
        PoaTemplateActivity,
        AgreementActivity,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

    // Modules
    HealthModule,
    AuthModule,
    UsersModule,
    AuditModule,
    MunicipalitiesModule,
    AgreementsModule,
    PoaPeriodsModule,
    ProgramsModule,
    PoaTemplatesModule,
    AgreementActivitiesModule,
  ],
})
export class AppModule {}
