const sqlite3 = require('sqlite3').verbose();

// Conectarea la baza de date SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Eroare la deschiderea bazei de date:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite.');
    
    // Crearea tabelei 'utilizatori' dacă nu există
    db.run(`CREATE TABLE IF NOT EXISTS utilizatori (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      displayName TEXT,
      website TEXT,
      tip TEXT DEFAULT 'utilizator',
      timpInregistrare DATETIME DEFAULT CURRENT_TIMESTAMP
	  profileimage TEXT
    )`, (err) => {
      if (err) {
        console.error('Eroare la crearea tabelei utilizatori:', err.message);
      } else {
        console.log('Tabela utilizatori a fost creată sau există deja.');
      }
    });
  }
});

module.exports = db;
