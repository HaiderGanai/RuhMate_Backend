
import { AppDataSource } from '../seeders/data-source.seed';
import { seedUsers } from './user.seed';

AppDataSource.initialize()
  .then(async (dataSource) => {
    await seedUsers(dataSource);
    await dataSource.destroy();
    console.log('🌱 Seeding complete');
  })
  .catch((err) => console.error(err));