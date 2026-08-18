import requests

BASE_URL = "http://localhost:3008"


def test_listar_pokemons():
    response = requests.get(f"{BASE_URL}/api/pokemons")
    assert response.status_code == 200
    pokemons = response.json()
    assert isinstance(pokemons, list)

def test_buscar_pokemon_existente():
    response = requests.get(f"{BASE_URL}/api/pokemon/0")
    assert response.status_code == 200
    pokemon = response.json()
    assert pokemon["id"] == 0
    assert pokemon["nome"] == "charmander"

def test_buscar_pokemon_inexistente():
    response = requests.get(f"{BASE_URL}/api/pokemon/999")
    assert response.status_code == 404

def test_criar_pokemon_valido():
    dados = {
        "nome": "Pikachu",
        "tipo": "Eletrico"
    }

    response = requests.post(
        f"{BASE_URL}/api/pokemon",
        json=dados
    )

    assert response.status_code == 201
    pokemon = response.json()
    assert pokemon["nome"] == "pikachu"
    assert pokemon["tipo"] == "eletrico"
    assert "id" in pokemon


def test_criar_pokemon_sem_nome():
    dados = {
        "tipo": "eletrico"
    }
    response = requests.post(
        f"{BASE_URL}/api/pokemon",
        json=dados
    )
    assert response.status_code == 400


def test_criar_pokemon_sem_tipo():
    dados = {
        "nome": "Pikachu"
    }
    response = requests.post(
        f"{BASE_URL}/api/pokemon",
        json=dados
    )
    assert response.status_code == 400


def test_atualizar_pokemon():
    dados = {
        "nome": "charmander atualizado",
        "tipo": "fogo"
    }
    response = requests.put(
        f"{BASE_URL}/api/pokemon/0",
        json=dados
    )
    assert response.status_code == 200
    resultado = response.json()
    assert resultado["pokemon"]["nome"] == "charmander atualizado"


def test_atualizar_pokemon_inexistente():
    dados = {
        "nome": "pokemon",
        "tipo": "fogo"
    }
    response = requests.put(
        f"{BASE_URL}/api/pokemon/999",
        json=dados
    )
    assert response.status_code == 404


def test_deletar_pokemon_inexistente():
    response = requests.delete(
        f"{BASE_URL}/api/pokemon/999"
    )
    assert response.status_code == 404