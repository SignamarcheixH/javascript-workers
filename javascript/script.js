const fields = ['name', 'height', 'weight']
const typesColor = {
    'normal': '#A8A77A',
    'fire': '#EE8130',
    'water': '#6390F0',
    'electric': '#F7D02C',
    'grass': '#7AC74C',
    'ice': '#96D9D6',
    'fighting': '#C22E28',
    'poison': '#A33EA1',
    'ground':  '#E2BF65',
    'flying': '#A98FF3',
    'psychic': '#F95587',
    'bug': '#A6B91A',
    'rock': '#B6A136',
    'ghost': '#735797',
    'dragon': '#6F35FC',
    'dark': '#705746',
    'steel': '#B7B7CE',
    'fairy': '#D685AD',
}
const container = document.getElementsByClassName("container")[0];
const catchphrase = document.getElementsByClassName("catchphrase")[0];
const btnRefresh = document.getElementById("refresh");
const card = document.getElementById("text-placeholder");

document.addEventListener("DOMContentLoaded",() => {
    let timer = launchTimer();
    if (window.Worker) {
        let worker = new Worker('./javascript/dist/worker-bundled.js');
        worker.postMessage('init');

        btnRefresh.addEventListener("click",() => {
            container.classList.add('is-loading');
            worker.postMessage('fetch');
        });

        worker.onmessage = function(e) {
            if(e.data.todo == 'fetch') {
                updateWithPokemon(e.data.data);
                if(allCompleted()) {
                    clearInterval(timer)
                    catchphrase.innerHTML = 'Congrats ! You wasted your time !'
                }
            } else if(e.data.todo == 'init') {
                pokeListInitialization(e.data.data.results);
            }
        }
    }
})





function updateWithPokemon(pokemon) {
    let pokeList = [...document.getElementsByClassName("poke-badge")];
    for(let fieldName of fields) { document.getElementsByClassName(fieldName)[0].innerHTML = pokemon[fieldName]; }
    document.getElementsByClassName('types')[0].innerHTML = pokemon['types'].map(x => x.type.name)
    document.getElementsByClassName('sprite')[0].src = pokemon['sprites'].front_default;

    if(pokemon['types'].length > 1) {
        card.style.borderTopColor = typesColor[pokemon['types'][0].type.name];
        card.style.borderLeftColor = typesColor[pokemon['types'][0].type.name];
        card.style.borderBottomColor = typesColor[pokemon['types'][1].type.name];
        card.style.borderRightColor = typesColor[pokemon['types'][1].type.name];
    } else {
        card.style.borderColor = typesColor[pokemon['types'][0].type.name];
    }


    container.classList.remove('is-loading');
    
    let find = pokeList.filter((elem) => {
        if(elem.dataset.name == pokemon['name'] && elem.classList.contains("empty")) {
            return true;
        }
        return false;
    })

    if(find.length) {
        find[0].style.backgroundImage = 'url(' + pokemon['sprites'].front_default + ')';
        find[0].style.backgroundColor = typesColor[pokemon['types'].filter(e => e.slot == 1)[0].type.name];
        find[0].classList.remove("empty");
    }
}


function pokeListInitialization(pokeArray) {
    let pokeList = document.getElementsByClassName("poke-list")[0];
    for(let poke of pokeArray) {
        let li = document.createElement('li');
        pokeList.appendChild(li);
        li.dataset['name'] = poke.name;
        li.classList.add('empty','poke-badge');
    }
}

function allCompleted() {
    let pokeList = [...document.getElementsByClassName("poke-badge")];
    let find = pokeList.filter(e => e.classList.contains("empty"));
    return(find.length < 1);
}

function launchTimer() {
    let minutesLabel = document.getElementById("minutes");
    let secondsLabel = document.getElementById("seconds");
    let totalSeconds = 0;
    let timer = setInterval(setTime, 1000);
    return timer;

    function setTime() {
      ++totalSeconds;
      secondsLabel.innerHTML = pad(totalSeconds % 60);
      minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
      let valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }
}