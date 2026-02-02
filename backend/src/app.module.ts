import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { AuditsModule } from './audits/audits.module';
import { DepartmentsModule } from './departments/departments.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';
import { AgreementsModule } from './agreements/agreements.module';
import { PoaPeriodsModule } from './poa-periods/poa-periods.module';
import { ProgramsModule } from './programs/programs.module';
import { PoaTemplatesModule } from './poa-templates/poa-templates.module';
import { AgreementActivitiesModule } from './agreement-activities/agreement-activities.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ValidationsModule } from './validations/validations.module';
import { PoaActivitiesModule } from './poa-activities/poa-activities.module';
import { ReportsModule } from './reports/reports.module';
import { ActivityTrackingModule } from './activity-tracking/activity-tracking.module';
import { EvidencesModule } from './evidences/evidences.module';
import { User } from './users/entities/user.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { Department } from './departments/entities/department.entity';
import { Municipality } from './municipalities/entities/municipality.entity';
import { Agreement } from './agreements/entities/agreement.entity';
import { PoaPeriod } from './poa-periods/entities/poa-period.entity';
import { Program } from './programs/entities/program.entity';
import { PoaTemplate } from './poa-templates/entities/poa-template.entity';
import { PoaTemplateActivity } from './poa-templates/entities/poa-template-activity.entity';
import { AgreementActivity } from './agreement-activities/entities/agreement-activity.entity';
import { PoaActivity } from './poa-activities/entities/poa-activity.entity';
import { Review } from './reviews/entities/review.entity';
import { Validation } from './validations/entities/validation.entity';
import { ActivityTracking } from './activity-tracking/entities/activity-tracking.entity';
import { Evidence } from './evidences/entities/evidence.entity';
import { Audit } from './audits/entities/audit.entity';

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
        Department,
        Municipality,
        Agreement,
        PoaPeriod,
        Program,
        PoaTemplate,
        PoaTemplateActivity,
        AgreementActivity,
        PoaActivity,
        Review,
        Validation,
        ActivityTracking,
        Evidence,
        Audit,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

    // Modules
    HealthModule,
    AuthModule,
    UsersModule,
    AuditModule,
    DepartmentsModule,
    MunicipalitiesModule,
    AgreementsModule,
    PoaPeriodsModule,
    ProgramsModule,
    PoaTemplatesModule,
    AgreementActivitiesModule,
    ReviewsModule,
    ValidationsModule,
    PoaActivitiesModule,
    ReportsModule,
    ActivityTrackingModule,
    EvidencesModule,
    AuditsModule,
  ],
})
export class AppModule {}
