const request = require('supertest');
const app = require('../app');

test('GET /api/pokemon deve retornar os pokémons', async () => {
    const resposta = await request(app)
        .get('/api/pokemon');

    expect(resposta.statusCode).toBe(200);
});