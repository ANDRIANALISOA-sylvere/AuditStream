import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as readline from 'readline';
import * as bcrypt from 'bcrypt';

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

function questionHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = '';
    stdin.on('data', function handler(char: string) {
      if (char === '\r' || char === '\n') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', handler);
        process.stdout.write('\n');
        resolve(password);
      } else if (char === '\u0003') {
        process.exit();
      } else if (char === '\u007f') {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        password += char;
        process.stdout.write('*');
      }
    });
  });
}

async function main() {
  console.log("=== Création d'un administrateur ===\n");

  const username = await question("Nom d'utilisateur : ");
  const email = await question('Email : ');
  const password = await questionHidden('Mot de passe : ');
  const passwordConfirm = await questionHidden('Confirmer le mot de passe : ');

  if (!username || !email || !password) {
    console.error('Erreur : tous les champs sont obligatoires.');
    process.exit(1);
  }

  if (password !== passwordConfirm) {
    console.error('Erreur : les mots de passe ne correspondent pas.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error(
      'Erreur : le mot de passe doit contenir au moins 8 caractères.',
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, username, role: 'ADMIN', password: hashedPassword },
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
