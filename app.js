class Pokemon {
    constructor(name, url, image = null) {
      this.name = name;
      this.url = url;
      this.image = image;
    }
  
    getDisplayName() {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
  }
  
  const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=150';
  let pokemonList = [];
  
  const searchInput = document.getElementById('search');
  const totalElement = document.getElementById('total');
  const pokemonListElement = document.getElementById('pokemon-list');
  
  const renderList = (list) => {
    pokemonListElement.innerHTML = '';
    list.forEach(pokemon => {
      const listItem = document.createElement('li');
      listItem.style.display = 'flex';
      listItem.style.alignItems = 'center';
  
      const img = document.createElement('img');
      img.src = pokemon.image;
      img.alt = pokemon.getDisplayName();
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.marginRight = '10px';
  
      const text = document.createElement('span');
      text.textContent = pokemon.getDisplayName();
  
      listItem.appendChild(img);
      listItem.appendChild(text);
      pokemonListElement.appendChild(listItem);
    });
  };
  
  async function getFirstPokemonDetails() {
    if (pokemonList.length > 0) {
      try {
        const firstPokemon = pokemonList[0];
        const detailResponse = await fetch(firstPokemon.url);
        const detailData = await detailResponse.json();
        console.log(`Ejemplo: Tipo principal de ${firstPokemon.getDisplayName()} = ${detailData?.types?.[0]?.type?.name ?? 'desconocido'}`);
      } catch (err) {
        console.error('Error al obtener detalles del primer Pokémon:', err);
      }
    }
  }
  
  fetch(API_URL)
    .then(response => response.json())
    .then(async data => {
      const { results: allPokemon } = data;
      const totalPokemons = data?.count ?? 0;
      totalElement.textContent = `Total de Pokémon: ${totalPokemons}`;
  
      pokemonList = await Promise.all(
        allPokemon.map(async ({ name, url }) => {
          try {
            const detailResponse = await fetch(url);
            const detailData = await detailResponse.json();
            const image = detailData.sprites.front_default || 'ruta/imagen-placeholder.png';
            return new Pokemon(name, url, image);
          } catch {
            return new Pokemon(name, url, 'ruta/imagen-placeholder.png');
          }
        })
      );
  
      renderList(pokemonList);
      getFirstPokemonDetails();
    })
    .catch(error => {
      console.error('Error al obtener los datos de Pokémon:', error);
    });
  
  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    renderList(filteredList);
  });
  