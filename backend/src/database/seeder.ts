import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ColombiaSeeder } from '../seeders/colombia.seeder';
import { UsersSeeder } from '../seeders/users.seeder';
import { PoaTemplatesSeeder } from '../seeders/poa-templates.seeder';

export const SEED_USERS = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
  },
  {
    firstName: 'Supervisor',
    lastName: 'POA',
    email: 'supervisor@example.com',
    password: 'supervisor123',
    role: UserRole.SUPERVISOR_POA,
  },
  {
    firstName: 'Coordinador',
    lastName: 'Sistema',
    email: 'coordinator@example.com',
    password: 'coordinator123',
    role: UserRole.COORDINATOR,
  },
  {
    firstName: 'Usuario',
    lastName: 'Regular',
    email: 'user@example.com',
    password: 'user123',
    role: UserRole.USER,
  },
];

export async function runSeeder(dataSource: DataSource) {
  if (!dataSource.isInitialized) {
    console.log('[Seeder] DataSource no inicializado. Saltando seeder...');
    return;
  }

  const userRepository = dataSource.getRepository(User);

  console.log('[Seeder] Iniciando seeder de usuarios de prueba...');

  for (const seedUser of SEED_USERS) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await userRepository.findOne({
        where: { email: seedUser.email },
      });

      if (existingUser) {
        console.log(`[Seeder] ✓ Usuario ${seedUser.email} ya existe. Saltando...`);
        continue;
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(seedUser.password, 10);

      // Crear usuario
      const user = userRepository.create({
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
        email: seedUser.email,
        password: hashedPassword,
        role: seedUser.role,
        status: UserStatus.ACTIVE, // Aprobado automáticamente para testing
      });

      await userRepository.save(user);

      console.log(
        `[Seeder] ✓ Usuario creado: ${seedUser.email} (${seedUser.role})`,
      );
    } catch (error) {
      console.error(
        `[Seeder] ✗ Error al crear usuario ${seedUser.email}:`,
        error.message,
      );
    }
  }

  console.log('[Seeder] ✓ Seeder de usuarios completado!');

  // Ejecutar seeder de Colombia
  const colombiaSeeder = new ColombiaSeeder(dataSource);
  await colombiaSeeder.run();

  // Ejecutar seeder de usuarios con el nuevo seeder
  const usersSeeder = new UsersSeeder(dataSource);
  await usersSeeder.run();

  // Ejecutar seeder de plantillas POA
  const poaTemplatesSeeder = new PoaTemplatesSeeder(
    dataSource.getRepository('PoaTemplate'),
    dataSource.getRepository('PoaTemplateActivity'),
    dataSource.getRepository('Program'),
  );
  await poaTemplatesSeeder.seed();
}
