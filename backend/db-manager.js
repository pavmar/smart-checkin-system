#!/usr/bin/env node

const { db, initializeDatabase } = require('./database/database');
const path = require('path');

async function resetDatabase() {
  console.log('🗄️  Resetting Smart Check-in System Database...');
  
  try {
    // Drop existing tables
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS checkins', (err) => {
          if (err) reject(err);
        });
        db.run('DROP TABLE IF EXISTS users', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
    
    console.log('✅ Existing tables dropped');
    
    // Recreate tables
    await initializeDatabase();
    console.log('✅ Database tables recreated');
    console.log('🎉 Database reset complete!');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
  } finally {
    db.close();
    process.exit(0);
  }
}

async function showStats() {
  console.log('📊 Smart Check-in System Database Statistics');
  console.log('=' .repeat(50));
  
  try {
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    const checkinCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM checkins', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    const todayCheckins = await new Promise((resolve, reject) => {
      const today = new Date().toISOString().split('T')[0];
      db.get('SELECT COUNT(*) as count FROM checkins WHERE date(checkin_time) = ?', [today], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`📝 Total Check-ins: ${checkinCount}`);
    console.log(`📅 Today's Check-ins: ${todayCheckins}`);
    
  } catch (error) {
    console.error('❌ Failed to get statistics:', error);
  } finally {
    db.close();
    process.exit(0);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'reset':
    resetDatabase();
    break;
  case 'stats':
    showStats();
    break;
  default:
    console.log('Smart Check-in System Database Manager');
    console.log('Usage:');
    console.log('  node db-manager.js reset  - Reset database (delete all data)');
    console.log('  node db-manager.js stats  - Show database statistics');
    process.exit(0);
}
