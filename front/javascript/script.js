const fields = ['name', 'height', 'weight']

document.addEventListener("DOMContentLoaded",() => {
    if (window.Worker) {
        let worker = new Worker('./javascript/dist/worker-bundled.js');

        let btnRefresh = document.getElementById("refresh");
        let container = document.getElementsByClassName("container")[0];

        btnRefresh.addEventListener("click",() => {
            container.classList.add('is-loading');
            worker.postMessage('go');
        });

        worker.onmessage = function(e) {
            let jsonFetched = e.data;
            for(let fieldName of fields) {
                document.getElementsByClassName(fieldName)[0].innerHTML = jsonFetched[fieldName];
            }
            document.getElementsByClassName('types')[0].innerHTML = jsonFetched['types'].map(x => x.type.name)
            document.getElementsByClassName('sprite')[0].src = jsonFetched['sprites'].front_default;
            container.classList.remove('is-loading');
        }
    }
})