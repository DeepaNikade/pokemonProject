const pokemonUrl = "https://pokeapi.co/api/v2/type/";
const pokeQueryParams = new URLSearchParams(window.location.search);
const typeParams = new URLSearchParams(window.location.search);
const typeSearch = typeParams.get("type");

const pokemonconatiner = document.getElementById("pokemonImagesConatiner");
const pokemonForm = document.getElementById("pokemonFilters");
const pokemoninputSelect = document.getElementById("typeFilters");

// 1st fetch the pokemon data
let pokemonArray = [];
let uniqueTypesofPokemon = new Set();
const fetchPokemon = () => {
  // create a array to store the data
  const promisesArray = [];
  for (let i = 1; i <= 151; i++) {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promisesArray.push(fetch(pokemonUrl).then((res) => res.json()));
  }

  // promise all will alow the promises to run at once
  Promise.all(promisesArray)
    .then(allPokemons => {
      const firstAllPokemons = allPokemons.map(pokemon => ({
        frontImage: pokemon.sprites['front_default'],
        pokemon_id: pokemon.id,
        name: pokemon.name,
        type: pokemon.types[0].type.name,
        abilities: pokemon.abilities
          .map(ability => ability.ability.name)
          .join(","),
        description: pokemon.species.url,
      }));

      pokemonArray = firstAllPokemons;
      createSinglePokemonCards(firstAllPokemons);
    })
    .then(generateTypes);
};

fetchPokemon();

pokemonForm.addEventListener("input", (event) => {
  const filterPokemon = pokemonArray.filter((pokemon) =>
    pokemon.name.includes(event.target.value.toLowerCase())
  );
  clearPokemon();
  createSinglePokemonCards(filterPokemon);
});

function clearPokemon() {
  let ImageDiv = document.getElementById("pokemonImagesConatiner");
  ImageDiv.innerHTML = "";
}

function createSinglePokemonCards(pokemons) {
  let currPokemon = pokemons;
  if (typeSearch) {
    currPokemon = pokemons.filter((pokemon) =>
      pokemon.type.includes(typeSearch.toLowerCase())
    );
  }
  currPokemon.forEach((pokemon) => {
    createSinglePokemonCard(pokemon);
  });
}

function createSinglePokemonCard(pokemon) {
  // full cards
  const flipingtheCard = document.createElement("div");
  flipingtheCard.classList.add("flipCard");
  flipingtheCard.id = `${pokemon.name}`;
  pokemonconatiner.append(flipingtheCard);

  // back and frontside container of the card

  const flipCardInner = document.createElement("div");
  flipCardInner.classList.add("flipCardInner");
  flipCardInner.id = `${pokemon.type}`;
  flipingtheCard.append(flipCardInner);

  //   front side
  const frontCard = document.createElement("div");
  frontCard.classList.add("frontSideCard");

  const frontImage = document.createElement("img");
  frontImage.src = `${pokemon.frontImage}`;
  frontImage.classList.add("frontSideImage");

//   const frontPokemonName = document.createElement("h2");
//   frontPokemonName.innerHTML = (
//     `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">
//       ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
//     </a>`
//   );
}

function generateTypes() {
  uniqueTypesofPokemon.forEach((type) => {
    const typeOption = document.createElement("option");
    typeOption.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeOption.value = type;

    pokemoninputSelect.append(typeOption);
  });
}
