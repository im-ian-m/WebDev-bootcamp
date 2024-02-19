import React from 'react';
import './App.css';

class ListItemRow extends React.Component {
  render() {
    return (
      <li>{this.props.data}</li>
    )
  }
}

function capitalizeFirst(string) { 
  string = string.substr(0, 1).toUpperCase() + string.substr(1);
  console.log(string);
  return string.replaceAll('-', ' '); 
}

function capitalizeAll(string) {
  let newString = '';
  const arr = string.split('-');
  arr.forEach((value, i) => {
    arr[i] = value.charAt(0).toUpperCase() + value.substr(1);
    console.log("value: " + value.charAt(0).toUpperCase());
  })

  for(let i in arr) {
    newString += arr[i];
    if(i !== arr.length - 1) {
      newString += ' ';
    }
  }

  console.log("executed")

  return newString;
}

class Pokemon extends React.Component {
  state = {
    'loadedCharacter': false,
    'name': 'loading...',
    'height': 'loading...',
    'weight': 'loading...',
    'types': ['loading...'],
    'abilities': ['loading...'],
    'evolves_from': 'loading...',
    'evolves_to': 'loading...',
  }

  getNewPokemon() {
    const randomId = Math.ceil(Math.random() * 1010);
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          'name': 'loading...',
          'height': 'loading...',
          'weight': 'loading...',
          'types': ['loading...'],
          'abilities': ['loading...'],
          'evolves_from': 'loading...',
          'evolves_to': 'loading...', 
      })
        const types = [];
        const abilities = [];
        console.log(data);
        data.types.forEach((node) => types.push(capitalizeFirst(node.type.name)));
        data.abilities.forEach((node) => abilities.push(capitalizeFirst(node.ability.name)));

        fetch(data.species.url)
          .then(speciesResponse => speciesResponse.json())
          .then(speciesData => {
            console.log(speciesData.evolution_chain.url);
            fetch(speciesData.evolution_chain.url)
              .then(received => received.json())
              .then(evolutionChain => {
                let arr = [evolutionChain.chain.species.name];
                let chain = [];
                chain.push(arr);
                let chainLink = evolutionChain.chain.evolves_to;
                let newLinkNames = [chain[0]];
                let nameFound = (chain[0][0] === data.name);
                let evolvesFrom;
                let evolvesTo;
                while(chainLink.length > 0 && !nameFound) {
                  console.log(`Last on chain: ${chain[chain.length - 1]}`);
                  //adapt for multiple evolutions (Eevee)
                  //if multiple evolutions are found, assume only one layer
    
                  for(let i in chainLink) {
                    const name = chainLink[i].species.name;
                    console.log("name is " + name);
                    newLinkNames = [];
                    newLinkNames.push(name);
                    if(name === data.name) {
                      nameFound = true;
                      // nameFoundIndex = i;
                      break;
                    }
                  }
                  // chainLink.forEach((value, i) => {
                  //   const name = value.species.name;
                    
                  // });
    
                  // if(nameFound) {
                  //   chain.push(data.name);
                  // } else {
                    chain.push(newLinkNames);
                    console.log(`Pushing ${newLinkNames}`);
                  // }
                  
                  chainLink = chainLink[0].evolves_to;
                  console.log(chainLink);
                }
                //loop through last link
                let lastLink = [];
                chainLink.forEach((value, i) => {
                  console.log('adding last link')
                  lastLink.push(value.species.name);
                })
                if(lastLink.length !== 0) {
                  chain.push(lastLink);
                }

                console.log(chain);
                switch(chain.length) {
                  case 1:
                      evolvesFrom = 'N/A';
                      evolvesTo = 'N/A';
                      break;
                  case 2:
                      if(chain[0][0] === data.name) {
                        evolvesFrom = 'N/A';
                        evolvesTo = chain[1];
                      } else {
                        evolvesFrom = chain[0];
                        evolvesTo = 'N/A';
                      }
                      break;
                  default:
                    if(chain[chain.length - 1][0] === data.name) {
                      evolvesFrom = chain[chain.length - 2];
                      evolvesTo = 'N/A';
                    } else {
                      evolvesFrom = chain[chain.length - 3] === undefined ? 'N/A' : chain[chain.length - 3];
                      evolvesTo = chain[chain.length - 1] === undefined ? 'N/A' : chain[chain.length - 1];
                    }
                }

                
                console.log(evolvesFrom);
                console.log(evolvesTo);

                console.log('hello ' + typeof(evolvesFrom));
                console.log('hello ' + typeof(evolvesTo));

                this.setState({
                  'evolves_from': capitalizeAll(evolvesFrom.toString()),
                  'evolves_to': capitalizeAll(evolvesTo.toString()),
                });
                
              })
          })


        this.setState({
          'name': capitalizeAll(data.name),
          'height': data.height * 10,
          'weight': data.weight / 10,
          'types': types,
          'abilities': abilities,
          'image': data.sprites.front_default,
          'loadedCharacter': true,
        })
      });
  }
    
  render() {
    const typesList = this.state.types.map((value, i) => {
      return <ListItemRow data={value} key={i} />
    })

    const abilitiesList = this.state.abilities.map((value, i) => {
      return <ListItemRow data={value} key={i} />
    })

    return (
      <div>
        {
          this.state.loadedCharacter &&
            <div>
              <div className="header">
                <h1>{this.state.name}</h1>
                <div><img src={this.state.image} alt="" /></div>
              </div>
              <div> 
                <p>Height: {this.state.height} cm</p>
                <p>Weight: {this.state.weight} kg</p>
                <div>Type(s): <ul>{typesList}</ul></div>
                <div>Abilities: <ul>{abilitiesList}</ul></div>
                <p>Evolves from: {this.state.evolves_from}</p>
                <p>Evolves to: {this.state.evolves_to}</p>
              </div>
            </div>
        }
        {/*use name height weight abilities type official artwork or sprite*/}
        <button type="button" className="btn" onClick={() => this.getNewPokemon()}>Randomize Character</button>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Pokemon /> 
      </header>
    </div>
  );
}

export default App;
