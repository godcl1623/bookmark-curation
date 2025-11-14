import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('Cleaning existing data...');
  try {
    await prisma.bookmark_history.deleteMany();
    await prisma.bookmark_tags.deleteMany();
    await prisma.media.deleteMany();
    await prisma.bookmarks.deleteMany();
    await prisma.tags.deleteMany();
    await prisma.folders.deleteMany();
    await prisma.sessions.deleteMany();
    await prisma.user_providers.deleteMany();
    await prisma.user_settings.deleteMany();
    await prisma.users.deleteMany();
    console.log('✓ Existing data cleaned');
  } catch (error) {
    console.log('⚠ Could not clean all data (permission issue or empty tables), continuing...');
  }

  // Create test users
  console.log('Creating users...');
  const user1 = await prisma.users.create({
    data: {
      uuid: '550e8400-e29b-41d4-a716-446655440001',
      email: 'test1@example.com',
      email_verified: true,
      display_name: 'Test User 1',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1',
      locale: 'ko',
      is_active: true,
      last_login_at: new Date('2024-01-15T10:30:00Z'),
    },
  });

  const user2 = await prisma.users.create({
    data: {
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      email: 'test2@example.com',
      email_verified: true,
      display_name: 'Test User 2',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2',
      locale: 'en',
      is_active: true,
    },
  });

  console.log(`✓ Created ${2} users`);

  // Create folders for user1
  console.log('Creating folders...');
  const folder1 = await prisma.folders.create({
    data: {
      data_id: 'F9iD9XnIwusA',
      user_id: user1.id,
      title: 'Development',
      color: '#3b82f6',
      parent_id: null,
      position: 0,
      type: 'folder',
    },
  });

  const folder2 = await prisma.folders.create({
    data: {
      data_id: 'uI9Y9Jwz74z5',
      user_id: user1.id,
      title: 'Design',
      color: '#ec4899',
      parent_id: null,
      position: 1,
      type: 'folder',
    },
  });

  const subfolder1 = await prisma.folders.create({
    data: {
      data_id: 'YWYhIU4-83uJ',
      user_id: user1.id,
      title: 'Frontend',
      color: '#10b981',
      parent_id: folder1.id,
      position: 0,
      type: 'folder',
    },
  });

  const folder3 = await prisma.folders.create({
    data: {
      data_id: 'i1V2USuTd82Y',
      user_id: user2.id,
      title: 'Resources',
      color: '#f59e0b',
      parent_id: null,
      position: 0,
      type: 'folder',
    },
  });

  console.log(`✓ Created ${4} folders`);

  // Create tags
  console.log('Creating tags...');
  const tag1 = await prisma.tags.create({
    data: {
      user_id: user1.id,
      name: 'JavaScript',
      slug: 'javascript',
      color: '#f7df1e',
    },
  });

  const tag2 = await prisma.tags.create({
    data: {
      user_id: user1.id,
      name: 'React',
      slug: 'react',
      color: '#61dafb',
    },
  });

  const tag3 = await prisma.tags.create({
    data: {
      user_id: user1.id,
      name: 'TypeScript',
      slug: 'typescript',
      color: '#3178c6',
    },
  });

  const tag4 = await prisma.tags.create({
    data: {
      user_id: user1.id,
      name: 'UI/UX',
      slug: 'ui-ux',
      color: '#ff6b6b',
    },
  });

  const tag5 = await prisma.tags.create({
    data: {
      user_id: user2.id,
      name: 'Tutorial',
      slug: 'tutorial',
      color: '#4ecdc4',
    },
  });

  console.log(`✓ Created ${5} tags`);

  // Create bookmarks
  console.log('Creating bookmarks...');
  const bookmark1 = await prisma.bookmarks.create({
    data: {
      data_id: '6mSMtcQcd6nP',
      user_id: user1.id,
      folder_id: subfolder1.id,
      parent_id: 'YWYhIU4-83uJ',
      title: 'React Documentation',
      description: 'Official React documentation - Learn React',
      url: 'https://react.dev/',
      domain: 'react.dev',
      favicon_url: 'https://react.dev/favicon.ico',
      preview_image: 'https://react.dev/images/og-home.png',
      metadata: {
        author: 'React Team',
        keywords: ['react', 'javascript', 'library'],
      },
      is_favorite: true,
      is_archived: false,
      is_private: false,
      position: 0,
      view_count: 42,
      click_count: 15,
      type: 'bookmark',
      created_at: new Date('2024-01-03T00:00:00Z'),
      updated_at: new Date('2024-01-03T00:00:00Z'),
    },
  });

  const bookmark2 = await prisma.bookmarks.create({
    data: {
      data_id: 'EzYKonbIPVzK',
      user_id: user1.id,
      folder_id: subfolder1.id,
      parent_id: 'YWYhIU4-83uJ',
      title: 'TypeScript Handbook',
      description: 'The TypeScript Handbook is a comprehensive guide to TypeScript',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      domain: 'typescriptlang.org',
      favicon_url: 'https://www.typescriptlang.org/favicon.ico',
      is_favorite: true,
      is_archived: false,
      is_private: false,
      position: 1,
      view_count: 28,
      click_count: 10,
      type: 'bookmark',
      created_at: new Date('2024-01-03T00:00:00Z'),
      updated_at: new Date('2024-01-03T00:00:00Z'),
    },
  });

  const bookmark3 = await prisma.bookmarks.create({
    data: {
      data_id: 'UwUPD9ue-rbX',
      user_id: user1.id,
      folder_id: folder2.id,
      parent_id: 'uI9Y9Jwz74z5',
      title: 'Figma',
      description: 'The collaborative interface design tool',
      url: 'https://www.figma.com/',
      domain: 'figma.com',
      favicon_url: 'https://www.figma.com/favicon.ico',
      is_favorite: false,
      is_archived: false,
      is_private: false,
      position: 0,
      view_count: 15,
      click_count: 8,
      type: 'bookmark',
      created_at: new Date('2024-01-04T00:00:00Z'),
      updated_at: new Date('2024-01-04T00:00:00Z'),
    },
  });

  const bookmark4 = await prisma.bookmarks.create({
    data: {
      data_id: 'xpT0yNxO2NSx',
      user_id: user1.id,
      folder_id: folder1.id,
      parent_id: 'F9iD9XnIwusA',
      title: 'MDN Web Docs',
      description: 'Resources for developers, by developers',
      url: 'https://developer.mozilla.org/',
      domain: 'developer.mozilla.org',
      favicon_url: 'https://developer.mozilla.org/favicon.ico',
      is_favorite: false,
      is_archived: false,
      is_private: true,
      position: 0,
      view_count: 67,
      click_count: 23,
      type: 'bookmark',
      created_at: new Date('2024-01-04T00:00:00Z'),
      updated_at: new Date('2024-01-04T00:00:00Z'),
    },
  });

  const bookmark5 = await prisma.bookmarks.create({
    data: {
      data_id: 'paynCrdrgF5h',
      user_id: user2.id,
      folder_id: folder3.id,
      parent_id: 'i1V2USuTd82Y',
      title: 'GitHub',
      description: 'Where the world builds software',
      url: 'https://github.com/',
      domain: 'github.com',
      favicon_url: 'https://github.com/favicon.ico',
      is_favorite: true,
      is_archived: false,
      is_private: false,
      position: 0,
      view_count: 89,
      click_count: 34,
      type: 'bookmark',
      created_at: new Date('2024-01-05T00:00:00Z'),
      updated_at: new Date('2024-01-05T00:00:00Z'),
    },
  });

  const bookmark6 = await prisma.bookmarks.create({
    data: {
      data_id: 'vgDrwz8F5ELk',
      user_id: user1.id,
      parent_id: null,
      title: 'Stack Overflow',
      description: 'Where developers learn, share, & build careers',
      url: 'https://stackoverflow.com/',
      domain: 'stackoverflow.com',
      favicon_url: 'https://stackoverflow.com/favicon.ico',
      is_favorite: false,
      is_archived: true,
      is_private: false,
      position: 0,
      view_count: 103,
      click_count: 45,
      type: 'bookmark',
      created_at: new Date('2024-01-05T00:00:00Z'),
      updated_at: new Date('2024-01-05T00:00:00Z'),
    },
  });

  console.log(`✓ Created ${6} bookmarks`);

  // Create bookmark tags
  console.log('Creating bookmark tags...');
  await prisma.bookmark_tags.createMany({
    data: [
      { bookmark_id: bookmark1.id, tag_id: tag2.id, user_id: user1.id },
      { bookmark_id: bookmark1.id, tag_id: tag1.id, user_id: user1.id },
      { bookmark_id: bookmark2.id, tag_id: tag3.id, user_id: user1.id },
      { bookmark_id: bookmark2.id, tag_id: tag1.id, user_id: user1.id },
      { bookmark_id: bookmark3.id, tag_id: tag4.id, user_id: user1.id },
      { bookmark_id: bookmark4.id, tag_id: tag1.id, user_id: user1.id },
      { bookmark_id: bookmark5.id, tag_id: tag5.id, user_id: user2.id },
    ],
  });

  console.log(`✓ Created ${7} bookmark tags`);

  // Create media for bookmarks
  console.log('Creating media...');
  await prisma.media.createMany({
    data: [
      {
        bookmark_id: bookmark1.id,
        type: 'image',
        url: 'https://react.dev/images/og-home.png',
        width: 1200,
        height: 630,
        created_at: new Date('2024-01-03T00:00:00Z'),
      },
      {
        bookmark_id: bookmark3.id,
        type: 'image',
        url: 'https://www.figma.com/og-image.png',
        width: 1200,
        height: 630,
        created_at: new Date('2024-01-04T00:00:00Z'),
      },
    ],
  });

  console.log(`✓ Created ${2} media items`);

  // Create bookmark history
  console.log('Creating bookmark history...');
  await prisma.bookmark_history.createMany({
    data: [
      {
        bookmark_id: bookmark1.id,
        user_id: user1.id,
        action: 'created',
        payload: { source: 'manual' },
        created_at: new Date('2024-01-03T00:00:00Z'),
      },
      {
        bookmark_id: bookmark1.id,
        user_id: user1.id,
        action: 'updated',
        payload: { field: 'title', old: 'React Docs', new: 'React Documentation' },
        created_at: new Date('2024-01-03T01:00:00Z'),
      },
      {
        bookmark_id: bookmark1.id,
        user_id: user1.id,
        action: 'viewed',
        payload: { timestamp: '2024-01-10T10:30:00Z' },
        created_at: new Date('2024-01-10T10:30:00Z'),
      },
      {
        bookmark_id: bookmark2.id,
        user_id: user1.id,
        action: 'created',
        payload: { source: 'import' },
        created_at: new Date('2024-01-03T00:00:00Z'),
      },
      {
        bookmark_id: bookmark6.id,
        user_id: user1.id,
        action: 'archived',
        payload: { reason: 'not_used' },
        created_at: new Date('2024-01-12T00:00:00Z'),
      },
    ],
  });

  console.log(`✓ Created ${5} history entries`);

  // Create user settings
  console.log('Creating user settings...');
  await prisma.user_settings.createMany({
    data: [
      {
        user_id: user1.id,
        settings: {
          theme: 'dark',
          language: 'ko',
          notifications: {
            email: true,
            push: false,
          },
          privacy: {
            defaultPrivate: true,
            showProfile: false,
          },
        },
      },
      {
        user_id: user2.id,
        settings: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
          },
        },
      },
    ],
  });

  console.log(`✓ Created ${2} user settings`);

  console.log('✅ Seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`- Users: 2`);
  console.log(`- Folders: 4`);
  console.log(`- Tags: 5`);
  console.log(`- Bookmarks: 6`);
  console.log(`- Bookmark Tags: 7`);
  console.log(`- Media: 2`);
  console.log(`- History: 5`);
  console.log(`- Settings: 2`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
