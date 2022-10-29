const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

var limit = 10;
var offset = 0;

//Evento click para el boton "anterior"

previous.addEventListener("click", () => {
  if (offset != 0) {
    offset -= 10;
    removeChildNodes(pokemonContainer);
    ListPoke(offset, limit);
  }
});

//Evento click para el boton "siguiente"

next.addEventListener("click", () => {
  offset += 10;
  removeChildNodes(pokemonContainer);
  ListPoke(offset, limit);
});

// Función encargada de obtener el detalle de un pokemon en específico 
async function FetchPokemon(url){
    const response = await fetch(url);
    const data = await response.json();
    createPokemon(data);
    spinner.style.display = "none";
}

//Función que obtiene los datos de un conjunto de pokemon
async function ListPoke(ini,fin){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${ini}&limit=${fin}`)
    const data = await response.json()

    const object = data["results"]
    for (const [key, value] of Object.entries(object)) {
        await FetchPokemon(value["url"]);
    }
}
//Función encargada de obtener la/s ubicaciones de obtención del pokemon en particular.
async function Area(url){
    const responde = await fetch(url)
    const data = await responde.json()
    
    if(data.length==0)
        return ("No se encuentra en estado salvaje");
    else
        return ( (data[0]["location_area"]["name"]).toString());
}

//Función encargada de crear las tarjetas con la información del pokemon en particular.
async function createPokemon(pokemon) {

    //Elemento para voltear la carta.
    const flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    //Elemento contenedor de la info ("carta").
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    flipCard.appendChild(cardContainer);

    //elemento carta.
    const card = document.createElement("div");
    card.classList.add("pokemon-block");

    //Contenedor del sprite.
    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add("img-container");

    //Sprite del pokemon.
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprites.front_default;

    spriteContainer.appendChild(sprite);

    //Numero del pokemon en la pokedex.
    const number = document.createElement("p");
    number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

    //Nombre del pokemon.
    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = pokemon.name;

    //Altura del pokemon.
    const height = document.createElement("p");
    height.textContent = "Height: "+(pokemon["height"]/10)+ " m";

    //Peso del pokemon.
    const weight = document.createElement("p");
    weight.textContent = "Weight: "+(pokemon["weight"]/10)+ " kg";
    
    //Tipos del pokemon.
    const types = document.createElement("p");
    
    if(pokemon["types"].length>1)
        types.textContent = "Types: "+pokemon["types"][0]["type"]["name"]+" , "+pokemon["types"][1]["type"]["name"];
    
    else
        types.textContent = "Type: "+pokemon["types"][0]["type"]["name"];
    
    card.appendChild(spriteContainer);
    card.appendChild(number);
    card.appendChild(name);
    card.appendChild(types);

    //Elemento trasero de la carta.
    const cardBack = document.createElement("div");
    cardBack.classList.add("pokemon-block-back");

    //Habilidades del pokemon.
    const abilities = document.createElement("p");
    
    console.log(pokemon["abilities"].length, pokemon["abilities"]);

    if(pokemon["abilities"]["length"]==3)
        abilities.textContent = "Abilities: "+pokemon["abilities"][0]["ability"]["name"]+" , "+pokemon["abilities"][1]["ability"]["name"]+" , "+pokemon["abilities"][2]["ability"]["name"];
    
    else{
        if(pokemon["abilities"]["length"]==2)
          abilities.textContent = "Abilities: "+pokemon["abilities"][0]["ability"]["name"]+" , "+pokemon["abilities"][1]["ability"]["name"]; 
        else
          abilities.textContent = "Abilities: "+pokemon["abilities"][0]["ability"]["name"];
    }
    
    //Ubicacion del pokemon.
    const location = document.createElement("p");
    location.textContent = "Location: " + await Area(pokemon["location_area_encounters"]); 

    cardBack.appendChild(height);
    cardBack.appendChild(weight);
    cardBack.appendChild(abilities);
    cardBack.appendChild(location);

    cardContainer.appendChild(card);
    cardContainer.appendChild(cardBack);
    pokemonContainer.appendChild(flipCard);

    console.log(cardContainer);
    console.log(pokemonContainer);
  }

  //Se remueven las cartas anteriores al pasar páginas.
  function removeChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

ListPoke(offset,limit);