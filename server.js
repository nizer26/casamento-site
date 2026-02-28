// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

// Permitir receber JSON
app.use(express.json());

// Servir arquivos da pasta Public
app.use(express.static("Public"));

// Criar tabela se não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS confirmacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            confirmado INTEGER DEFAULT 0
        )
    `);
});

// Rota para salvar confirmação do formulário
app.post("/confirmar", (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).send("Dados inválidos.");
    }

    db.run(
        "INSERT INTO confirmacoes (nome, email, confirmado) VALUES (?, ?, 1)",
        [nome, email],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao salvar.");
            }
            res.send("Confirmação salva com sucesso!");
        }
    );
});

// Rotas admin

// Listar apenas convidados que confirmaram presença
app.get("/admin/convidados", (req, res) => {
    const filtro = req.query.nome ? `%${req.query.nome}%` : "%";
    db.all(
        "SELECT * FROM confirmacoes WHERE nome LIKE ? AND confirmado = 1",
        [filtro],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json([]);
            }
            res.json(rows);
        }
    );
});

// Adicionar convidado manualmente (confirmado = 0)
app.post("/admin/convidados", (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).send("Dados inválidos");

    db.run(
        "INSERT INTO confirmacoes (nome, email, confirmado) VALUES (?, ?, 0)",
        [nome, email],
        function(err){
            if(err){
                console.error(err);
                return res.status(500).send("Erro ao adicionar");
            }
            res.send("Convidado adicionado manualmente");
        }
    );
});

// Remover convidado por ID
app.delete("/admin/convidados/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM confirmacoes WHERE id = ?", [id], function(err){
        if(err){
            console.error(err);
            return res.status(500).send("Erro ao remover");
        }
        res.send("Convidado removido");
    });
});

// Iniciar servidor
app.listen(8080, () => {
    console.log("Servidor rodando em http://localhost:8080");
});