const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearMockEvents() {
  try {
    console.log('🗑️ Clearing mock events from database...');
    
    // Delete all events that match the mock event titles
    const mockEventTitles = [
      'Concert de Jazz au Sunset',
      'Tournoi de Football Amical',
      'Exposition d\'Art Contemporain',
      'Meetup Développeurs Web'
    ];
    
    const deletedEvents = await prisma.event.deleteMany({
      where: {
        title: {
          in: mockEventTitles
        }
      }
    });
    
    console.log(`✅ Deleted ${deletedEvents.count} mock events`);
    
    // Show remaining events
    const remainingEvents = await prisma.event.findMany({
      include: {
        category: true,
        user: true
      }
    });
    
    console.log('\n📊 Remaining events in database:');
    if (remainingEvents.length === 0) {
      console.log('No events found - database is clean!');
    } else {
      remainingEvents.forEach(event => {
        console.log(`- ${event.title} (ID: ${event.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error clearing mock events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMockEvents();
