import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
    database: process.env.POSTGRE_DB,
    host: process.env.POSTGRE_HOST,
    port: parseInt(process.env.POSTGRE_PORT || '5432'),
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASSWORD,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const password = await bcrypt.hash('AdminAA123', 10);

    await prisma.employee.create({
        data: {
            empId: 'ADM001',
            email: 'admin@gmail.com',
            name: 'Admin',
            password,
            role: 'ADMIN',
            shift: 'MORNING',
            salary: 5000000,
            startDate: new Date(),
        },
    });
}

main();