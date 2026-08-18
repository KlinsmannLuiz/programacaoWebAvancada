function existeLogin(req,res,next){
  if(!req.session.usuario){
    return res.status(401).json({erro: "Voce precisa estar logado !!!"})
  }
  req.session.contadorAcesso += 1;
  next();
}




require('dotenv').config();
const session = require('express-session');
const express = require('express'); // Importando bibliotecas no formato CommonJS do node.js, aqui esta importando a biblioteca express
const path = require('path'); //Importando o modulo nativo path para trabalhar com caminhos no node.js. Exemplo path.join('public', 'img', 'foto.png'); -> public/img/foto.png

const app = express(); //Criando a aplicação

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

//Middleware -> É uma função executada antes da requisição chegar na rota.
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // chave usada para assinar e proteger o cookie da sessao
    resave: false, // Não salve novamente a sessão se ela não foi modificada
    saveUninitialized: false, //Não crie uma sessão para usuários que ainda não armazenaram nenhum dado.
    cookie: {
      // Ele contém as configurações do cookie que identifica a sessão.
      maxAge: 1000 * 60 * 30, // 30 minutos Depois desse tempo, o cookie expira.
      httpOnly: true, //Impede que o JavaScript executado no navegador leia o cookie.
      secure: false, //enviado em conexões HTTPS.
    },
  })
);

const PORT = process.env.PORT || 3008;

let pokemons = [
  { id: 0, nome: 'charmander', tipo: 'fogo' },
  { id: 1, nome: 'bulbassauro', tipo: 'planta' },
  { id: 2, nome: 'Squirtle', tipo: 'água' },
];

app.get(['/', '/api'], (request, response) => {
  response.status(200).json({
    inicio: 'Olá, Mundo',
  });
});

app.get('/api/info-cliente', existeLogin, (req, res) => {
  const userAgent = req.header('User-Agent') || 'Cabeçalho não encontrado';

  res.status(200).json({
    mensagem: 'Informação do cabeçalho lida com sucesso',
    navegadorOuFerramenta: userAgent,
  });
});

app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;
  const credenciaisValidas =
    usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASSWORD;
  if (!credenciaisValidas) {
    return res.status(401).json({ erro: 'usuário ou senha inválidos' });
  }
  req.session.usuario = usuario;
  req.session.logadoEm = new Date().toISOString();
  req.session.contadorAcesso = 0;
  res.status(200).json({ mensagem: `Bem-vinda(o), ${usuario}!` });
});

app.get('/api/perfil', existeLogin, (req, res) => {
  res.status(200).json({
    usuario: req.session.usuario,
    logadoEm: req.session.logadoEm,
  });
});

app.get('/api/contagemAcesso', existeLogin, (req, res) => {
    res.status(200).json({
        sucesso: `Acesso numero ${req.session.contadorAcesso}`,
    });
});

app.get('/api/pokemons/csv', existeLogin, (req, res, next) => {
  try {
    const cabecalho = 'id,nome,tipo';
    const linhas = pokemons.map((p) => `${p.id},${p.nome},${p.tipo}`);
    const csv = [cabecalho, ...linhas].join('\n');

    res.set('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

app.get('/api/status', existeLogin, (req, res) => {
  res.status(200).json({ ok: true, hora: new Date().toISOString() });
});

app.get('/api/pokemons', (req, res) => {
  res.status(200).json(pokemons);
});

app.get('/api/pokemon/:id', existeLogin, (req, res) => {
  const id = Number(req.params.id);
  const pokemon = pokemons.filter((p) => p.id === id);
  if (!pokemon) {
    return res.status(404), json({ erro: 'Esse Id não existe' });
  }
  res.status(200).json(pokemon);
});

app.post('/api/pokemon', existeLogin, (req, res) => {
  const { nome, tipo } = req.body;
  if (!nome || !tipo) {
    return res.status(400).json({ erro: 'Argumentos invalidos' });
  }

  const novoId =
    pokemons.length === 0 ? 0 : Math.max(...pokemons.map((p) => p.id)) + 1;

  const novoPokemon = {
    id: novoId,
    nome: nome.toLowerCase(),
    tipo: tipo.toLowerCase(),
  };

  pokemons.push(novoPokemon);
  res.status(201).json(novoPokemon); //criado com sucesso
});

app.put('/api/pokemon/:id',  existeLogin, (req, res) => {
  const idPokemon = Number(req.params.id);
  const { nome, tipo } = req.body;

  const pokemon = pokemons.find((p) => p.id === idPokemon);

  if (!pokemon) {
    return res.status(404).json({
      erro: 'Pokémon não encontrado.',
    });
  }

  if (!nome || !tipo) {
    return res.status(400).json({
      erro: 'Nome e tipo são obrigatórios.',
    });
  }

  pokemon.nome = nome;
  pokemon.tipo = tipo;

  res.status(200).json({
    mensagem: 'Pokémon atualizado com sucesso.',
    pokemon,
  });
});

app.delete('/api/pokemon/:id', existeLogin, (req, res) => {
  const idPokemon = Number(req.params.id);
  const index = pokemons.findIndex((p) => p.id === idPokemon);
  if (index === -1) {
    return res.status(404).json({ erro: 'não encontrado' });
  }

  pokemons.splice(index, 1);
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error('Erro capturado:', err.message);
  res.status(500).json({
    erro: 'Ocorreu um erro interno no servidor.',
    detalhes: err.message,
  });
});

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`)); // Inicia o servidor