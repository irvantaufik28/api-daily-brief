import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed minimal untuk test (bisa sesuaikan)
  const person = await prisma.person.create({
    data: {
      fullName: "Irvan Taufik",
      category: "PERMANENT",
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      username: "admin",
      password: "securepassword123",
      role: "ADMIN",
      person: { connect: { id: person.id } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
