const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'checkin_system.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unique_id TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create checkins table
    const createCheckinsTable = `
      CREATE TABLE IF NOT EXISTS checkins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        location TEXT,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users (unique_id)
      )
    `;

    // Create indexes for better performance
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users (unique_id)',
      'CREATE INDEX IF NOT EXISTS idx_users_mobile ON users (mobile)',
      'CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins (user_id)',
      'CREATE INDEX IF NOT EXISTS idx_checkins_time ON checkins (checkin_time)',
    ];

    db.serialize(() => {
      db.run(createUsersTable, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
      });

      db.run(createCheckinsTable, (err) => {
        if (err) {
          console.error('Error creating checkins table:', err);
          reject(err);
          return;
        }
      });

      // Create indexes
      createIndexes.forEach((indexQuery) => {
        db.run(indexQuery, (err) => {
          if (err) {
            console.error('Error creating index:', err);
          }
        });
      });

      resolve();
    });
  });
};

// User-related database operations
const userQueries = {
  create: (userData) => {
    return new Promise((resolve, reject) => {
      const { uniqueId, firstName, lastName, mobile, email } = userData;
      const query = `
        INSERT INTO users (unique_id, first_name, last_name, mobile, email)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(query, [uniqueId, firstName, lastName, mobile, email], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, uniqueId });
        }
      });
    });
  },

  findByUniqueId: (uniqueId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE unique_id = ?';
      
      db.get(query, [uniqueId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  findByMobile: (mobile) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE mobile = ?';
      
      db.get(query, [mobile], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users ORDER BY created_at DESC';
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
};

// Check-in related database operations
const checkinQueries = {
  create: (checkinData) => {
    return new Promise((resolve, reject) => {
      const { userId, location, notes } = checkinData;
      const query = `
        INSERT INTO checkins (user_id, location, notes)
        VALUES (?, ?, ?)
      `;
      
      db.run(query, [userId, location || '', notes || ''], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  },

  getByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.first_name, u.last_name, u.mobile
        FROM checkins c
        JOIN users u ON c.user_id = u.unique_id
        WHERE c.user_id = ?
        ORDER BY c.checkin_time DESC
      `;
      
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.first_name, u.last_name, u.mobile
        FROM checkins c
        JOIN users u ON c.user_id = u.unique_id
        ORDER BY c.checkin_time DESC
      `;
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
};

module.exports = {
  db,
  initializeDatabase,
  userQueries,
  checkinQueries,
};
