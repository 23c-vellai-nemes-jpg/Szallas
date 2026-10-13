fetch('data/szallasok.json')
    .then(valasz => valasz.json())
    .then(szallasok => {
        let tartalom = document.getElementById('szallasKartyak');
        tartalom.innerHTML = '';

        for (let szallas of szallasok) {
            let oszlop = document.createElement('div');
            oszlop.className = 'col-md-4';

            oszlop.innerHTML = `
                <div class="kartya">
                    <img class="szallas-kep" src="${szallas.kep}" alt="${szallas.nev}">
                    <h3>${szallas.nev}</h3>
                    <p>${szallas.tipus} · Legfeljebb ${szallas.ferohely} fő</p>
                    <p class="price">
                        ${szallas.arEgyEjszakara.toLocaleString('hu-HU')} Ft / éjszaka
                    </p>
                    <a class="btn btn-primary" href="foglalas.html?szallasId=${szallas.id}">
                        Szállás foglalása
                    </a>
                </div>
            `;

            tartalom.appendChild(oszlop);
        }
    })
    .catch(() => {
        document.getElementById('szallasKartyak').innerHTML =
            '<p class="text-danger">A szállásokat nem sikerült betölteni. Indítsd el a weboldalt Live Serverrel.</p>';
});

let visszaGomb = document.getElementById("visszaTetejere");

window.addEventListener("scroll", function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        visszaGomb.style.display = "block";
    } else {
        visszaGomb.style.display = "none";
    }
});

visszaGomb.addEventListener("mouseover", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
