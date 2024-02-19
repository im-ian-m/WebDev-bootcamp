async function randomizeCharacter() {
    document.querySelector('#randomize').setAttribute('disabled', 'disabled');
    document.querySelector('.loader').classList.add("spin-animation");
    document.querySelector('.loader').style.display = 'inline-block';

    const characterNo = Math.ceil(Math.random() * 83);
    const url = `https://swapi.dev/api/people/${characterNo}/`;
    console.log(characterNo);
    console.log(url);

    const response = await fetch(url) 
        .then(function(response) {
            if(!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).catch(function(error) { 
            alert("An error occured. Trying again.") 
            randomizeCharacter();
        });
    const character = await response.json();

    const name = character['name'];
    console.log(name);
    const height = character['height'];
    const mass = character['mass'];
    const hairColor = character['hair_color'];
    const skinColor = character['skin_color'];
    const eyeColor = character['eye_color'];
    const birthYear = character['birth_year'];
    const gender = character['gender'];
    const homeworld = await getLinkedObjectName(character['homeworld']) 
        .catch(function() {
            return 'Unknown';
        });

    const films = await getLinkedObjectNames(character['films'], true);
    const filmsNode = document.querySelector('#films');

    const species = await getLinkedObjectName(character['species'])
        .catch(function() {
            if(character['species'] == '') {
                return 'Human';
            } else {
                return 'Unknown';
            }
        });
    
    const vehicles = await getLinkedObjectNames(character['vehicles'], false);
    const vehiclesNode = document.querySelector('#vehicles');

    const starships = await getLinkedObjectNames(character['starships'], false);
    const starshipsNode = document.querySelector('#starships');

    console.log(name, height, mass, gender, homeworld, films, species, vehicles, starships);
    
    document.querySelector('#name').innerText = `Name: ${name}`;

    document.querySelector('#height').innerText = `Height: ${height}`;
    if(!isNaN(Number(height))) document.querySelector('#height').innerText += " cm";

    document.querySelector('#mass').innerText = `Weight: ${mass}`;
    if(!isNaN(Number(mass))) document.querySelector('#mass').innerText += " kg";

    document.querySelector('#hair_color').innerText = `Hair color: ${hairColor}`;
    document.querySelector('#skin_color').innerText = `Skin color: ${skinColor}`;
    document.querySelector('#eye_color').innerText = `Eye color: ${eyeColor}`;
    document.querySelector('#birth_year').innerText = `Birth year: ${birthYear}`;
    document.querySelector('#gender').innerText = `Gender: ${gender}`;
    document.querySelector('#homeworld').innerText = `Homeworld: ${homeworld}`;
    document.querySelector('#species').innerText = `Species: ${species}`;

    filmsNode.innerText = "Films: ";
    createList(filmsNode, films);

    vehiclesNode.innerText = "Vehicles: ";
    createList(vehiclesNode, vehicles);

    starshipsNode.innerText = "Starships: ";
    createList(starshipsNode, starships);

    document.querySelector('#randomize').removeAttribute('disabled');
    document.querySelector('.loader').classList.remove("spin-animation");
    document.querySelector('.loader').style.display = 'none';
}
document.querySelector('#randomize').onclick = randomizeCharacter; 
document.addEventListener('load', randomizeCharacter());

async function getLinkedObjectName(url) {
    const response = await fetch(url);
    const object = await response.json();

    return object['name'];
}

async function getLinkedObjectNames(urlList, isFilm) {
   let response;
   let object;
   let nameList = [];
    
    for(i in urlList) {
        response = await fetch(urlList[i]);
        object = await response.json();
        if(isFilm) {
            nameList.push(object['title']);
        } else {
            nameList.push(object['name']);
        }
    }

    return nameList; //return array of names
}

function createList(element, items) {
    console.log(items);
    if(items.length === 0) {
        element.innerText += " none";
    } else {
        let listItems = '';

        items.forEach(function(item) {
            listItems += `<li>${item}</li>`;
        });

        element.innerHTML += `<ul>${listItems}</ul>`;
    }
}