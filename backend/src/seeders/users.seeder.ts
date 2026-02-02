import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

export class UsersSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('\n📋 [UsersSeeder] Iniciando seeder de usuarios...\n');

    const userRepository = this.dataSource.getRepository(User);

    const usersData = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        firstName: 'Coordinador',
        lastName: 'POA',
        email: 'coordinator@example.com',
        password: 'Coordinator123!',
        role: UserRole.COORDINATOR,
        status: UserStatus.ACTIVE,
      },
      {
        firstName: 'Supervisor',
        lastName: 'POA',
        email: 'supervisor@example.com',
        password: 'Supervisor123!',
        role: UserRole.SUPERVISOR_POA,
        status: UserStatus.ACTIVE,
      },
      {
        firstName: 'Usuario',
        lastName: 'Regular',
        email: 'user@example.com',
        password: 'User123!',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const userData of usersData) {
      try {
        const existing = await userRepository.findOne({
          where: { email: userData.email },
        });

        if (existing) {
          console.log(`  ⚪ Usuario existente: ${userData.email} (${userData.role})`);
          skipped++;
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = userRepository.create({
          ...userData,
          password: hashedPassword,
        });

        await userRepository.save(user);
        console.log(`  ✅ Usuario creado: ${userData.email} (${userData.role})`);
        console.log(`     Contraseña temporal: ${userData.password}`);
        created++;
      } catch (error) {
        console.error(`  ❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }

    console.log(`\n✅ [UsersSeeder COMPLETADO]`);
    console.log(`   Creados: ${created}, Existentes: ${skipped}\n`);
  }
}
