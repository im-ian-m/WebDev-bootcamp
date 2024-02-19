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
  // console.log(string);
  return string.replaceAll('-', ' ');
}

function capitalizeAll(string) {
  let newString = '';
  const arr = string.split('-');
  arr.forEach((value, i) => {
    arr[i] = value.charAt(0).toUpperCase() + value.substr(1);
    // console.log("value: " + value.charAt(0).toUpperCase());
  })

  for (let i in arr) {
    newString += arr[i];
    if (i !== arr.length - 1) {
      newString += ' ';
    }
  }

  // console.log("executed")

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
    'evolves_to': ['loading...'],
  } 

  getNewPokemon() {
    this.setState({
            'name': 'loading...',
            'height': 'loading...',
            'weight': 'loading...',
            'types': ['loading...'],
            'abilities': ['loading...'],
            'evolves_from': 'loading...',
            'evolves_to': ['loading...'],
          }) 
    if(document.querySelector('img') !== null) {
      document.querySelector('img').style.visibility = 'hidden';
    }
    const randomId = Math.ceil(Math.random() * 1010);
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      .then(response => response.json())
      .then(data => {
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
                while (chainLink.length > 0 && !nameFound) {
                  // console.log(`Last on chain: ${chain[chain.length - 1]}`);
                  //adapt for multiple evolutions (Eevee)
                  //if multiple evolutions are found, assume only one layer

                  for (let i in chainLink) {
                    const name = chainLink[i].species.name;
                    // console.log("name is " + name);
                    newLinkNames = [];
                    newLinkNames.push(name);
                    if (name === data.name) {
                      nameFound = true;
                      // nameFoundIndex = i;
                      break;
                    }
                  }
                  chain.push(newLinkNames);
                  // console.log(`Pushing ${newLinkNames}`);

                  chainLink = chainLink[0].evolves_to;
                  // console.log(chainLink);
                }
                //loop through last link
                let lastLink = [];
                chainLink.forEach((value, i) => {
                  // console.log('adding last link')
                  lastLink.push(value.species.name);
                })
                if (lastLink.length !== 0) {
                  chain.push(lastLink);
                }

                // console.log(chain);
                switch (chain.length) {
                  case 1:
                    evolvesFrom = ['N/A'];
                    evolvesTo = ['N/A'];
                    break;
                  case 2:
                    if (chain[0][0] === data.name) {
                      evolvesFrom = ['N/A'];
                      evolvesTo = chain[1];
                    } else {
                      evolvesFrom = chain[0];
                      evolvesTo = ['N/A'];
                    }
                    break;
                  default:
                    if (chain[chain.length - 1][0] === data.name) {
                      evolvesFrom = chain[chain.length - 2];
                      evolvesTo = ['N/A'];
                    } else {
                      evolvesFrom = chain[chain.length - 3] === undefined ? ['N/A'] : chain[chain.length - 3];
                      evolvesTo = chain[chain.length - 1] === undefined ? ['N/A'] : chain[chain.length - 1];
                    }
                }


                // console.log(evolvesFrom);
                // console.log(evolvesTo);

                // console.log('hello ' + typeof (evolvesFrom));
                // console.log('hello ' + typeof (evolvesTo));

                evolvesTo.forEach((value, i) => {
                  evolvesTo[i] = capitalizeAll(value);
                })

                
                this.setState({
                  'evolves_from': capitalizeAll(evolvesFrom.toString()),
                  'evolves_to': evolvesTo,
                });
              })
          })

        if(document.querySelector('img') !== null) {
          document.querySelector('img').style.visibility = 'visible';
        }

        this.setState({
          'name': capitalizeAll(data.name),
          'height': data.height * 10 + ' cm',
          'weight': data.weight / 10 + ' kg',
          'types': types,
          'abilities': abilities,
          'image': data.sprites.front_default,
          'loadedCharacter': true,
        })
      });
  }

  render() {
    if(this.state.loadedCharacter) {
      document.querySelector('.btnContainer').style = 'height: auto;'
    }

    const typesList = this.state.types.map((value, i) => {
      return <ListItemRow data={value} key={i} />
    })

    const abilitiesList = this.state.abilities.map((value, i) => {
      return <ListItemRow data={value} key={i} />
    })

    console.log('evolvesTo type: ' + typeof(this.state.evolves_to));
    const evolvesToList = this.state.evolves_to.map((value, i) => {
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
            <div className="container">
              <div>Height: {this.state.height}</div>
              <div>Weight: {this.state.weight}</div>
              <div className="ulHolder"><div>Type(s): </div><ul>{typesList}</ul></div>
              <div className="ulHolder"><div>Abilities: </div><ul>{abilitiesList}</ul></div>
              <div>Evolves from: {this.state.evolves_from}</div>
              {console.log(typeof('evolvesToList: ' + typeof(evolvesToList)))}
              <div className="ulHolder"><div>Evolves to: </div><ul>{evolvesToList}</ul></div>
            </div>
            

          </div>
        }
        {/*use name height weight abilities type official artwork or sprite*/}
        
        <div className="btnContainer">
          <button type="button" className="btn" onClick={() => this.getNewPokemon()}>Randomize Character</button>
        </div>
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
