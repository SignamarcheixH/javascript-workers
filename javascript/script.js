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

document.addEventListener("DOMContentLoaded",() => {
    if (window.Worker) {
        let worker = new Worker('./javascript/dist/worker-bundled.js');

        let btnRefresh = document.getElementById("refresh");
        let container = document.getElementsByClassName("container")[0];
        let card = document.getElementById("text-placeholder");

        worker.postMessage('init');

        btnRefresh.addEventListener("click",() => {
            container.classList.add('is-loading');
            worker.postMessage('fetch');
        });

        worker.onmessage = function(e) {
            if(e.data.todo == 'fetch') {
                let jsonFetched = e.data.data;
                for(let fieldName of fields) {
                    document.getElementsByClassName(fieldName)[0].innerHTML = jsonFetched[fieldName];
                }
                document.getElementsByClassName('types')[0].innerHTML = jsonFetched['types'].map(x => x.type.name)
                if(jsonFetched['types'].length > 1) {
                    card.style.borderTopColor = typesColor[jsonFetched['types'][0].type.name];
                    card.style.borderLeftColor = typesColor[jsonFetched['types'][0].type.name];
                    card.style.borderBottomColor = typesColor[jsonFetched['types'][1].type.name];
                    card.style.borderRightColor = typesColor[jsonFetched['types'][1].type.name];
                } else {
                    card.style.borderColor = typesColor[jsonFetched['types'][0].type.name];
                }
                document.getElementsByClassName('sprite')[0].src = jsonFetched['sprites'].front_default;
                container.classList.remove('is-loading');
                let pokeList = [...document.getElementsByClassName("poke-badge")];
                let find = pokeList.filter((elem) => {
                    if(elem.dataset.name == jsonFetched['name'] && elem.classList.contains("empty")) {
                        return true;
                    }
                    return false;
                })
                if(find.length) {
                    find[0].style.backgroundImage = 'url(' + jsonFetched['sprites'].front_default + ')';
                    find[0].style.backgroundColor = typesColor[jsonFetched['types'].filter(e => e.slot == 1)[0].type.name];
                    find[0].classList.remove("empty");
                }

            } else if(e.data.todo == 'init') {
                let pokeArray = e.data.data.results;
                let pokeList = document.getElementsByClassName("poke-list")[0];
                console.log(pokeArray)
                for(let poke of pokeArray) {
                    let li = document.createElement('li');
                    pokeList.appendChild(li);
                    li.dataset['name'] = poke.name;
                    li.classList.add('empty','poke-badge');
                    console.log(poke.name);
                }
            }
        }
    }
})