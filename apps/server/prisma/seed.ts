// Canvas-Verse Seed Script
// Purpose: Import example canvases from _legacy_files into database
// Phase 4: 範例 Canvas 系統

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// System user configuration
const SYSTEM_USER = {
  email: 'system@canvas-verse.local',
  name: 'Canvas-Verse System',
  googleId: null,
};

// Legacy files mapping with metadata
const LEGACY_FILES = [
  {
    file: 'Boruto.html',
    type: 'html',
    title: 'Boruto Uzumaki SVG Character',
    tags: ['svg', 'anime', 'character', 'html'],
  },
  {
    file: 'Cube-Play.html',
    type: 'html',
    title: '3D Cube Interactive Game',
    tags: ['game', '3d', 'interactive', 'html'],
  },
  {
    file: 'Dot-Hunter.html',
    type: 'html',
    title: 'Dot Hunter Mini Game',
    tags: ['game', 'canvas', 'html'],
  },
  {
    file: 'Eagle-App-MVP.jsx',
    type: 'react',
    title: 'Eagle - Image Asset Manager MVP',
    tags: ['react', 'asset-manager', 'ui', 'mvp'],
  },
  {
    file: 'Instagram-MVP.jsx',
    type: 'react',
    title: 'Instagram Clone MVP',
    tags: ['react', 'social-media', 'mvp'],
  },
  {
    file: 'Pinterest-MVP.jsx',
    type: 'react',
    title: 'Pinterest Masonry Layout MVP',
    tags: ['react', 'layout', 'mvp'],
  },
  {
    file: 'Youtube-MVP.jsx',
    type: 'react',
    title: 'YouTube Video Platform MVP',
    tags: ['react', 'video', 'mvp'],
  },
  {
    file: 'Threads-MVP.jsx',
    type: 'react',
    title: 'Threads Conversation MVP',
    tags: ['react', 'social', 'mvp'],
  },
  {
    file: 'Line-Business-MVP.jsx',
    type: 'react',
    title: 'LINE Business App MVP',
    tags: ['react', 'business', 'mvp'],
  },
  {
    file: 'Cyberpunk-2077-MVP/v1.html',
    type: 'html',
    title: 'Cyberpunk 2077 UI - Version 1',
    tags: ['game', 'cyberpunk', 'ui', 'html'],
  },
  {
    file: 'Cyberpunk-2077-MVP/v2.html',
    type: 'html',
    title: 'Cyberpunk 2077 UI - Version 2',
    tags: ['game', 'cyberpunk', 'ui', 'html'],
  },
  {
    file: 'Cyberpunk-2077-MVP/v3.html',
    type: 'html',
    title: 'Cyberpunk 2077 UI - Version 3',
    tags: ['game', 'cyberpunk', 'ui', 'html'],
  },
];

async function main() {
  console.log('🚀 Starting Canvas-Verse Seed Process...');

  // Step 1: Create or find system user
  console.log('\n📌 Step 1: Ensure system user exists...');
  let systemUser = await prisma.user.findUnique({
    where: { email: SYSTEM_USER.email },
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: SYSTEM_USER,
    });
    console.log(`✅ System user created: ${systemUser.email} (ID: ${systemUser.id})`);
  } else {
    console.log(`✅ System user already exists: ${systemUser.email} (ID: ${systemUser.id})`);
  }

  // Step 2: Read and import legacy files
  console.log('\n📌 Step 2: Import legacy files as example canvases...');
  const legacyFilesDir = path.resolve(__dirname, '../../../_legacy_files');

  let importCount = 0;
  let skipCount = 0;

  for (const fileInfo of LEGACY_FILES) {
    const filePath = path.join(legacyFilesDir, fileInfo.file);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileInfo.file} - Skipping`);
      skipCount++;
      continue;
    }

    // Read file content
    const code = fs.readFileSync(filePath, 'utf-8');

    // Check if example already exists (by title)
    const existing = await prisma.canvas.findFirst({
      where: {
        title: fileInfo.title,
        isExample: true,
      },
    });

    if (existing) {
      console.log(`⏭️  Example already exists: ${fileInfo.title} - Skipping`);
      skipCount++;
      continue;
    }

    // Create canvas record
    await prisma.canvas.create({
      data: {
        title: fileInfo.title,
        type: fileInfo.type,
        code: code,
        description: `Example canvas from legacy files`,
        tags: JSON.stringify(fileInfo.tags),
        userId: systemUser.id,
        isExample: true,
        isPublic: true,
        views: 0,
      },
    });

    console.log(`✅ Imported: ${fileInfo.title} (${fileInfo.type})`);
    importCount++;
  }

  // Step 3: Summary
  console.log('\n📊 Seed Summary:');
  console.log(`   - Total files: ${LEGACY_FILES.length}`);
  console.log(`   - Imported: ${importCount}`);
  console.log(`   - Skipped: ${skipCount}`);

  // Step 4: Verify
  const exampleCount = await prisma.canvas.count({
    where: { isExample: true },
  });
  console.log(`   - Total examples in DB: ${exampleCount}`);

  console.log('\n✨ Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
