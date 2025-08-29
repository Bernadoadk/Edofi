/// <reference types="node" />
import { PrismaClient, NotificationType, NotificationPriority, NotificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Créer des utilisateurs de test
  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: test123
      first_name: 'Test',
      last_name: 'User',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // password: test123
      first_name: 'Admin',
      last_name: 'User',
    },
  });

  console.log('✅ Users created:', { user1: user1.id, user2: user2.id });

  // Créer des préférences de notification pour user2
  await prisma.notificationPreference.upsert({
    where: { user_id: user2.id },
    update: {},
    create: {
      user_id: user2.id,
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      in_app_enabled: true,
      planning_enabled: true,
      booking_enabled: true,
      social_enabled: true,
      performance_enabled: true,
      system_enabled: true,
      commercial_enabled: false,
      personalized_enabled: true,
      urgent_enabled: true,
    },
  });

  // Créer quelques notifications de test pour user2
  const notifications = [
    {
      user_id: user2.id,
      type: NotificationType.EVENT_REMINDER,
      title: "Rappel d'événement",
      message: "Votre événement 'Conférence Tech 2024' commence dans 2 heures",
      priority: NotificationPriority.HIGH,
      status: NotificationStatus.PENDING,
      data: { event_title: 'Conférence Tech 2024', time_remaining: '2 heures' }
    },
    {
      user_id: user2.id,
      type: NotificationType.NEW_BOOKING,
      title: "Nouvelle réservation",
      message: "Marie Dupont s'est inscrite à votre événement 'Workshop Design'",
      priority: NotificationPriority.HIGH,
      status: NotificationStatus.PENDING,
      data: { participant_name: 'Marie Dupont', event_title: 'Workshop Design' }
    },
    {
      user_id: user2.id,
      type: NotificationType.EVENT_TRENDING,
      title: "Événement en tendance",
      message: "Votre événement 'Festival de Musique' est en tendance !",
      priority: NotificationPriority.HIGH,
      status: NotificationStatus.PENDING,
      data: { event_title: 'Festival de Musique' }
    },
    {
      user_id: user2.id,
      type: NotificationType.NEW_FEATURE,
      title: "Nouvelle fonctionnalité",
      message: "Découvrez notre nouvelle fonctionnalité : Notifications en temps réel",
      priority: NotificationPriority.LOW,
      status: NotificationStatus.READ,
      data: { feature_name: 'Notifications en temps réel' }
    },
    {
      user_id: user2.id,
      type: NotificationType.WEEKEND_EVENTS,
      title: "Événements du week-end",
      message: "Que faire ce week-end ? Découvrez nos événements",
      priority: NotificationPriority.LOW,
      status: NotificationStatus.PENDING,
      data: {}
    }
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification
    });
  }

  console.log('✅ Test notifications created for user2');

  // Créer des catégories de base
  const categories = [
    { name: 'Conférence', description: 'Conférences et séminaires' },
    { name: 'Concert', description: 'Concerts et spectacles' },
    { name: 'Workshop', description: 'Ateliers et formations' },
    { name: 'Sport', description: 'Événements sportifs' },
    { name: 'Culture', description: 'Événements culturels' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categories created');

  console.log('🎉 Database seed completed!');
  console.log('📧 Test users:');
  console.log(`   - test@example.com (ID: ${user1.id}) - password: test123`);
  console.log(`   - admin@example.com (ID: ${user2.id}) - password: test123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
