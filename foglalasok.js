let foglalasok = [];
let szallasok = [];

let kartyasNezet = false;
let rendezesMezo = "";
let novekvo = true;


async function betoltes() {

    let foglalasValasz = await fetch("data/foglalasok.json");
    let szallasValasz = await fetch("data/szallasok.json");

    foglalasok = await foglalasValasz.json();
    szallasok = await szallasValasz.json();

    let szallasSelect = document.getElementById("szallasSzures");

    for (let szallas of szallasok) {

        let option = document.createElement("option");

        option.value = szallas.id;
        option.textContent = szallas.nev;

        szallasSelect.appendChild(option);
    }

    megjelenites();
}


function szallasNeve(id) {

    for (let szallas of szallasok) {

        if (szallas.id == id) {
            return szallas.nev;
        }
    }

    return "";
}


function arSzamitas(foglalas) {

    for (let szallas of szallasok) {

        if (szallas.id == foglalas.szallasId) {

            let erkezes = new Date(foglalas.erkezes);
            let tavozas = new Date(foglalas.tavozas);

            let napok = (tavozas - erkezes) / 86400000;

            return napok * szallas.arEgyEjszakara;
        }
    }

    return 0;
}


function szures() {

    let keresettNev = document.getElementById("kereses").value.toLowerCase();
    let keresettSzallas = document.getElementById("szallasSzures").value;

    let eredmeny = [];

    for (let foglalas of foglalasok) {

        if (foglalas.statusz == "torolt") {
            continue;
        }

        if (!foglalas.nev.toLowerCase().includes(keresettNev)) {
            continue;
        }

        if (keresettSzallas != "" && foglalas.szallasId != keresettSzallas) {
            continue;
        }

        eredmeny.push(foglalas);
    }

    return eredmeny;
}


function rendez(lista) {

    if (rendezesMezo == "") {
        return lista;
    }

    lista.sort(function(a, b) {

        let elso = a[rendezesMezo];
        let masodik = b[rendezesMezo];

        if (rendezesMezo == "szallasId") {
            elso = szallasNeve(a.szallasId);
            masodik = szallasNeve(b.szallasId);
        }

        if (rendezesMezo == "ar") {
            elso = arSzamitas(a);
            masodik = arSzamitas(b);
        }

        if (elso < masodik) {
            return novekvo ? -1 : 1;
        }

        if (elso > masodik) {
            return novekvo ? 1 : -1;
        }

        return 0;
    });

    return lista;
}


function megjelenites() {

    let lista = szures();

    rendez(lista);

    if (kartyasNezet == true) {
        kartyak(lista);
    } else {
        tabla(lista);
    }
}


function tabla(lista) {

    let tartalom = document.getElementById("foglalasokTartalom");

    if (lista.length == 0) {

        tartalom.innerHTML = `
            <div class="alert alert-warning">
                Nincs találat.
            </div>
        `;

        return;
    }

    let html = `
        <table class="table table-striped">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Név</th>
                    <th>Szállás</th>
                    <th>Érkezés</th>
                    <th>Távozás</th>
                    <th>Személyek</th>
                    <th>Ár</th>
                    <th>Törlés</th>
                </tr>
            </thead>

            <tbody>
    `;

    for (let foglalas of lista) {

        html += `
            <tr>

                <td>${foglalas.id}</td>

                <td>${foglalas.nev}</td>

                <td>${szallasNeve(foglalas.szallasId)}</td>

                <td>${foglalas.erkezes}</td>

                <td>${foglalas.tavozas}</td>

                <td>${foglalas.szemelyek} fő</td>

                <td>${arSzamitas(foglalas)} Ft</td>

                <td>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="torles(${foglalas.id})">
                        Törlés
                    </button>
                </td>

            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    tartalom.innerHTML = html;
}


function kartyak(lista) {

    let tartalom = document.getElementById("foglalasokTartalom");

    if (lista.length == 0) {

        tartalom.innerHTML = `
            <div class="alert alert-warning">
                Nincs találat.
            </div>
        `;

        return;
    }

    tartalom.innerHTML = "";

    for (let foglalas of lista) {

        let kartya = document.createElement("div");

        kartya.className = "card p-3 mb-3";

        kartya.innerHTML = `
            <h4>${foglalas.nev}</h4>

            <p>Szállás: ${szallasNeve(foglalas.szallasId)}</p>

            <p>Érkezés: ${foglalas.erkezes}</p>

            <p>Távozás: ${foglalas.tavozas}</p>

            <p>Személyek: ${foglalas.szemelyek} fő</p>

            <p>Ár: ${arSzamitas(foglalas)} Ft</p>

            <button
                class="btn btn-danger"
                onclick="torles(${foglalas.id})">
                Törlés
            </button>
        `;

        tartalom.appendChild(kartya);
    }
}


function rendezes(mezo) {

    if (rendezesMezo == mezo) {
        novekvo = !novekvo;
    } else {
        rendezesMezo = mezo;
        novekvo = true;
    }

    megjelenites();
}


function torles(id) {

    for (let foglalas of foglalasok) {

        if (foglalas.id == id) {
            foglalas.statusz = "torolt";
        }
    }

    document.getElementById("uzenet").innerHTML = `
        <div class="alert alert-success">
            A foglalás sikeresen törölve.
        </div>
    `;

    megjelenites();
}


document.getElementById("kereses").addEventListener("input", function() {
    megjelenites();
});


document.getElementById("szallasSzures").addEventListener("change", function() {
    megjelenites();
});


document.getElementById("tablaGomb").addEventListener("click", function() {

    kartyasNezet = false;

    megjelenites();
});


document.getElementById("kartyaGomb").addEventListener("click", function() {

    kartyasNezet = true;

    megjelenites();
});


document.getElementById("tetoreGomb").addEventListener("click", function() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


window.addEventListener("scroll", function() {

    let gomb = document.getElementById("tetoreGomb");

    if (window.scrollY > 300) {
        gomb.style.display = "block";
    } else {
        gomb.style.display = "none";
    }
});


betoltes();