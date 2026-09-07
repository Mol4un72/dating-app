import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const users = [
  {
    email: 'anna@example.com',
    name: 'Anna',
    age: 26,
    gender: 'Female',
    location: 'Kyiv',
    bio: 'Love traveling, coffee and long walks 🌿',
    photo: 'https://i.pravatar.cc/600?img=47',
    interests: ['Travel', 'Coffee', 'Photography'],
  },
  {
    email: 'emma@example.com',
    name: 'Emma',
    age: 29,
    gender: 'Female',
    location: 'Lviv',
    bio: 'Designer, book lover and weekend explorer ✨',
    photo: 'https://i.pravatar.cc/600?img=44',
    interests: ['Design', 'Books', 'Travel'],
  },
  {
    email: 'sofia@example.com',
    name: 'Sofia',
    age: 25,
    gender: 'Female',
    location: 'Warsaw',
    bio: 'Always looking for a new adventure 🚀',
    photo: 'https://i.pravatar.cc/600?img=49',
    interests: ['Travel', 'Music', 'Hiking'],
  },
  {
    email: 'olivia@example.com',
    name: 'Olivia',
    age: 31,
    gender: 'Female',
    location: 'Kyiv',
    bio: 'Yoga, sunsets and good conversations ☀️',
    photo: 'https://i.pravatar.cc/600?img=45',
    interests: ['Yoga', 'Nature', 'Cooking'],
  },
  {
    email: 'mia@example.com',
    name: 'Mia',
    age: 27,
    gender: 'Female',
    location: 'Lviv',
    bio: 'Music addict and food enthusiast 🎵',
    photo: 'https://i.pravatar.cc/600?img=48',
    interests: ['Music', 'Food', 'Concerts'],
  },
  {
    email: 'james@example.com',
    name: 'James',
    age: 28,
    gender: 'Male',
    location: 'Kyiv',
    bio: 'Coffee, gym and spontaneous trips.',
    photo: 'https://i.pravatar.cc/600?img=12',
    interests: ['Fitness', 'Coffee', 'Travel'],
  },
  {
    email: 'alex@example.com',
    name: 'Alex',
    age: 30,
    gender: 'Male',
    location: 'Lviv',
    bio: 'Developer who loves mountains and photography.',
    photo: 'https://i.pravatar.cc/600?img=13',
    interests: ['Coding', 'Hiking', 'Photography'],
  },
  {
    email: 'daniel@example.com',
    name: 'Daniel',
    age: 27,
    gender: 'Male',
    location: 'Warsaw',
    bio: 'Food lover, traveler and amateur chef.',
    photo: 'https://i.pravatar.cc/600?img=11',
    interests: ['Cooking', 'Travel', 'Food'],
  },
]

async function main() {
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: {
        email: userData.email,
      },
      update: {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        location: userData.location,
        bio: userData.bio,
      },
      create: {
        email: userData.email,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        location: userData.location,
        bio: userData.bio,
        verified: true,
      },
    })

    await prisma.profilePhoto.deleteMany({
      where: {
        userId: user.id,
      },
    })

    await prisma.profilePhoto.create({
      data: {
        userId: user.id,
        url: userData.photo,
        position: 0,
      },
    })

    for (const interestName of userData.interests) {
      const interest = await prisma.interest.upsert({
        where: {
          name: interestName,
        },
        update: {},
        create: {
          name: interestName,
        },
      })

      await prisma.profileInterest.upsert({
        where: {
          userId_interestId: {
            userId: user.id,
            interestId: interest.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          interestId: interest.id,
        },
      })
    }
  }

  console.log(`Created ${users.length} test users`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })