const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const axios = require('axios');
const port = 3000;

// Conectarea la baza de date SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Eroare la conectarea la baza de date:', err.message);
  } else {
    console.log('Conectat la baza de date SQLite.');

    // Adăugarea coloanei profileImage, dacă nu există deja
    db.serialize(() => {
        db.run(`ALTER TABLE utilizatori ADD COLUMN profileImage TEXT`, (err) => {
            if (err) {
                if (err.message.includes('duplicate column name: profileImage')) {
                    console.log('Coloana profileImage există deja.');
                } else {
                    console.error('Eroare la adăugarea coloanei:', err.message);
                }
            } else {
                console.log('Coloana profileImage a fost adăugată cu succes.');
            }
        });
    });
  }
});

// Middleware pentru a servi fișiere statice (HTML, CSS, JS)
app.use(express.static('public'));

// Middleware pentru parsarea datelor din formular
app.use(bodyParser.urlencoded({ extended: true }));

// Configurarea `multer` pentru a salva fișierele încărcate
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorul în care se vor salva imaginile
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nume fișier unic
    }
});

const upload = multer({ storage: storage });

// Ruta principală
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta pentru pagina de înregistrare
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// Ruta pentru procesarea datelor din formularul de înregistrare
app.post('/register', upload.single('profileImage'), (req, res) => {
    const { username, email, password, firstName, lastName, displayName, website } = req.body;
    const profileImage = req.file ? req.file.path : null; // Calea imaginii încărcate

    // Inserarea datelor utilizatorului în baza de date
    const sql = `INSERT INTO utilizatori (username, email, password, firstName, lastName, displayName, website, profileImage) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [username, email, password, firstName, lastName, displayName, website, profileImage], function (err) {
        if (err) {
            console.error('Eroare la salvarea utilizatorului:', err.message);
            res.status(500).send('A apărut o eroare.');
        } else {
            console.log(`Utilizatorul cu ID-ul ${this.lastID} a fost înregistrat.`);
            res.send('Înregistrare reușită!');
        }
    });
});

// Ruta pentru căutarea utilizatorilor după nume
app.get('/cauta', (req, res) => {
    const nume = req.query.nume; // Preluarea parametrului nume din query string
    const sql = `SELECT * FROM utilizatori WHERE firstName = ? OR lastName = ?`;

    db.all(sql, [nume, nume], (err, rows) => {
        if (err) {
            console.error('Eroare la căutare:', err.message);
            return res.status(500).send('A apărut o eroare la căutare.');
        }
        if (rows.length > 0) {
            return res.json(rows); // Returnează utilizatorii găsiți
        } else {
            return res.send('Nu a fost găsit niciun utilizator cu acest nume.');
        }
    });
});

// Ruta care face cerere către serverul Python
app.get('/api/date', async (req, res) => {
    try {
        // Fă o cerere GET către API-ul Flask (serverul Python)
        const response = await axios.get('http://localhost:5000/api/date');
        res.send(`Răspuns de la serverul Python: ${response.data}`);
    } catch (error) {
        console.error('Eroare la apelul către serverul Python:', error.message);
        res.status(500).send('Eroare la comunicarea cu serverul Python.');
    }
});

// Ruta pentru afișarea utilizatorilor
app.get('/users', (req, res) => {
    const sql = `SELECT username FROM utilizatori`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Eroare la preluarea utilizatorilor:', err.message);
            return res.status(500).send('Eroare la preluarea utilizatorilor.');
        }
        // Afișăm lista utilizatorilor fără sanitizare
        const usersList = rows.map(row => `<p>${row.username}</p>`).join('');
        res.send(`<h1>Utilizatori:</h1>${usersList}`);
    });
});

// Pornirea serverului
app.listen(port, () => {
    console.log(`Serverul rulează la http://localhost:${port}`);
});
