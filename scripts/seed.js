
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(MONGODB_DB);
    const reportsCollection = db.collection('reports');

    // Clear existing data
    await reportsCollection.deleteMany({});
    console.log('Cleared existing reports');

    const reports = [
      {
        fileName: 'deepfake_video_1.mp4',
        fileType: 'video',
        analysis: {
          deepfakePercentage: 95.5,
          summary: 'This video shows strong indicators of being a deepfake. Facial expressions are inconsistent with the audio track.',
        },
        uploadDate: new Date('2024-07-20T10:00:00Z'),
        thumbnailUrl: '/placeholder-video.jpg',
      },
      {
        fileName: 'real_audio_1.mp3',
        fileType: 'audio',
        analysis: {
          deepfakePercentage: 2.1,
          summary: 'This audio file appears to be authentic. No signs of AI manipulation were detected.',
        },
        uploadDate: new Date('2024-07-21T11:30:00Z'),
        thumbnailUrl: '/placeholder-audio.jpg',
      },
      {
        fileName: 'doctored_image_1.jpg',
        fileType: 'image',
        analysis: {
          deepfakePercentage: 87.3,
          summary: 'The image shows signs of digital alteration, particularly around the subject's eyes and mouth.',
        },
        uploadDate: new Date('2024-07-22T14:00:00Z'),
        thumbnailUrl: '/placeholder-image.jpg',
      },
    ];

    await reportsCollection.insertMany(reports);
    console.log('Seeded reports');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seed();
