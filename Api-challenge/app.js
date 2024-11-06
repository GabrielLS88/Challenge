require('dotenv').config();
const express = require("express");
const app = express();
const axios = require('axios');
const port = 8888;

function verificarToken(req, res, next) {
  const token = req.header("Token");
  if (!token || token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: "Token não fornecido ou inválido." });
  }
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verificarToken);
app.use((req, res, next) => {
  next();
});

async function requisisaoGithub() {
  try {
    const response = await axios.get('https://api.github.com/orgs/takenet/repos');
    return response.data;
  } catch (err) {
    console.error('Erro ao coletar repositórios', err);
    throw err;
  }
}

async function montagemDasOpcoes(body) {
  if (body.length > 0) {
    let encontrados = body
      .filter(repo => repo.language === "C#")
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        created_at: repo.created_at,
        owner_avatar_url: repo.owner.avatar_url
      }))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(0, 5);
    return encontrados;
  }
}

app.get("/consultargithub", async (req, res) => {
  try {
    const coletandoReositorios = await requisisaoGithub()
    const montandoCards = await montagemDasOpcoes(coletandoReositorios)
    res.json(montandoCards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
