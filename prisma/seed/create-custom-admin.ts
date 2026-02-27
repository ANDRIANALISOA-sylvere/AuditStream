import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as readline from 'readline';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("=== Création d'un administrateur ===\n");

  const username = await question("Nom d'utilisateur : ");
  const email = await question('Email : ');

  if (!username || !email) {
    console.error('Erreur : tous les champs sont obligatoires.');
    process.exit(1);
  }

  const user = await prisma.user.create({
    data: { email, username, role: 'ADMIN' },
  });

  console.log(`\nAdministrateur créé avec succès !`);
  console.log(`   ID       : ${user.id}`);
  console.log(`   Username : ${user.username}`);
  console.log(`   Email    : ${user.email}`);
  console.log(`   Rôle     : ${user.role}`);
}

main()
  .catch((e) => {
    console.error('Erreur :', e.message);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
