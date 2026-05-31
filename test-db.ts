import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const fixtures = await prisma.fixture.count();
const teams = await prisma.team.count();
const venues = await prisma.venue.findMany({ select: { name: true } });
console.log('Fixtures:', fixtures);
console.log('Teams:', teams);
console.log('Venues:', venues.map(v => v.name));
await prisma.$disconnect();
