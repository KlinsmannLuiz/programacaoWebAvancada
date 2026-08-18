const Database = require('better-sqlite3');
const path = require("path");
const fs = require("fs");    // Importação para manipular pastas

// Define o caminho do diretório e do arquivo
const pastaBanco = path.join(__dirname, '..', '..', 'database');
const caminhoBanco = path.join(pastaBanco, 'app.db');

// Verifica se a pasta existe, se não, cria ela recursivamente
if (!fs.existsSync(pastaBanco)) {
    fs.mkdirSync(pastaBanco, { recursive: true });
    console.log("Pasta de banco de dados criada com sucesso.");
}

const db = new Database(caminhoBanco);

db.pragma('journal_mode=WAL');

// Criação da tabela
db.exec(`
    CREATE TABLE IF NOT EXISTS pokemons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        criadoEm TEXT NOT NULL DEFAULT (datetime('now'))
    )
`);

module.exports = db;