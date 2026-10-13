let foglalasok = [];
let szallasok = [];
let kartyasNezet = false;
let rendezesMezo = '';
let novekvo = true;
let toroltLatszik = false;

async function betoltes() {
    try {
        let sv = await fetch('data/szallasok.json');
        szallasok = await sv.json();

        let tarolt = localStorage.getItem('balatonFoglalasok');

        if (tarolt === null) {
            let fv = await fetch('data/foglalasok.json');
            foglalasok = await fv.json();

            localStorage.setItem(
                'balatonFoglalasok',
                JSON.stringify(foglalasok)
            );
        } else {
            foglalasok = JSON.parse(tarolt);
        }

        let select = document.getElementById('szallasSzures');

        for (let szallas of szallasok) {
            let option = document.createElement('option');
            option.value = szallas.id;
            option.textContent = szallas.nev;

            select.appendChild(option);
        }

        megjelenites();

    } catch (e) {
        document.getElementById('foglalasokTartalom').innerHTML =
            '<div class="alert alert-danger">Az adatok betöltése nem sikerült. Nyisd meg a projektet VS Code Live Serverrel.</div>';
    }
}

function szallasNeve(id) {
    let szallas = szallasok.find(sz => sz.id == id);

    return szallas ? szallas.nev : 'Ismeretlen szállás';
}

function arSzamitas(f) {
    let szallas = szallasok.find(sz => sz.id == f.szallasId);

    if (!szallas) {
        return 0;
    }

    let napok = (
        new Date(f.tavozas + 'T00:00:00') -
        new Date(f.erkezes + 'T00:00:00')
    ) / 86400000;

    return Math.max(0, napok) * szallas.arEgyEjszakara;
}

function szures() {
    let nev = document.getElementById('kereses').value.toLocaleLowerCase('hu');
    let id = document.getElementById('szallasSzures').value;

    return foglalasok.filter(f =>
        (toroltLatszik || f.statusz !== 'torolt') &&
        f.nev.toLocaleLowerCase('hu').includes(nev) &&
        (id === '' || String(f.szallasId) === id)
    );
}

function rendez(lista) {
    if (!rendezesMezo) {
        return lista;
    }

    if (rendezesMezo === 'ar') {
        lista.sort((a, b) =>
            (arSzamitas(a) - arSzamitas(b)) * (novekvo ? 1 : -1)
        );
    } else {
        lista.sort((a, b) =>
            String(a[rendezesMezo]).localeCompare(
                String(b[rendezesMezo]),
                'hu'
            ) * (novekvo ? 1 : -1)
        );
    }

    return lista;
}

function megjelenites() {
    let lista = rendez(szures());

    document.getElementById('talalatok').textContent =
        lista.length + ' foglalás';

    if (kartyasNezet) {
        kartyak(lista);
    } else {
        tabla(lista);
    }
}

function torles(id) {
    let f = foglalasok.find(f => f.id === id);

    if (!f) {
        return;
    }

    if (f.statusz === 'torolt') {
        uzenet('Ez a foglalás már törölve van.', 'warning');
        return;
    }

    if (!confirm('Biztosan törlöd ezt a foglalást?')) {
        return;
    }

    f.statusz = 'torolt';

    localStorage.setItem(
        'balatonFoglalasok',
        JSON.stringify(foglalasok)
    );

    uzenet('A foglalást töröltük.', 'success');
    megjelenites();
}

function visszaallit(id) {
    let f = foglalasok.find(f => f.id === id);

    if (f) {
        f.statusz = 'aktiv';

        localStorage.setItem(
            'balatonFoglalasok',
            JSON.stringify(foglalasok)
        );

        uzenet('A foglalást visszaállítottuk.', 'success');
        megjelenites();
    }
}

function uzenet(szoveg, tipus) {
    document.getElementById('uzenet').innerHTML = `
        <div class="alert alert-${tipus} alert-dismissible fade show">
            ${szoveg}
            <button type="button" class="btn-close"
                data-bs-dismiss="alert" aria-label="Bezárás">
            </button>
        </div>
    `;
}

function tabla(lista) {
    let t = document.getElementById('foglalasokTartalom');

    if (!lista.length) {
        t.innerHTML = `
            <div class="alert alert-warning">
                Nincs megjeleníthető foglalás.
                <a href="foglalas.html">Hozz létre egy új foglalást.</a>
            </div>
        `;
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Szállás</th>
                        <th>Érkezés</th>
                        <th>Távozás</th>
                        <th>Fő</th>
                        <th>Ár</th>
                        <th>Állapot</th>
                        <th>Művelet</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (let f of lista) {
        html += `
            <tr>
                <td>${f.id}</td>
                <td>${biztosit(f.nev)}</td>
                <td>${biztosit(szallasNeve(f.szallasId))}</td>
                <td>${f.erkezes}</td>
                <td>${f.tavozas}</td>
                <td>${f.szemelyek}</td>
                <td>${arSzamitas(f).toLocaleString('hu-HU')} Ft</td>
                <td>
                    <span class="statusz ${f.statusz === 'torolt' ? 'torolt' : ''}">
                        ${f.statusz === 'torolt' ? 'Törölt' : 'Aktív'}
                    </span>
                </td>
                <td>
                    ${
                        f.statusz === 'torolt'
                            ? `<button class="btn btn-sm btn-success"
                                onclick="visszaallit(${f.id})">
                                Visszaállítás
                            </button>`
                            : `<button class="btn btn-sm btn-outline-danger"
                                onclick="torles(${f.id})">
                                Törlés
                            </button>`
                    }
                </td>
            </tr>
        `;
    }

    t.innerHTML = html + '</tbody></table></div>';
}

function kartyak(lista) {
    let t = document.getElementById('foglalasokTartalom');

    if (!lista.length) {
        t.innerHTML = `
            <div class="alert alert-warning">
                Nincs megjeleníthető foglalás.
                <a href="foglalas.html">Új foglalás</a>
            </div>
        `;
        return;
    }

    t.innerHTML = '';

    for (let f of lista) {
        let k = document.createElement('div');
        k.className = 'card p-3 mb-3';

        k.innerHTML = `
            <div class="d-flex flex-wrap justify-content-between gap-2">
                <h3 class="h5">${biztosit(f.nev)}</h3>

                <span class="statusz ${f.statusz === 'torolt' ? 'torolt' : ''}">
                    ${f.statusz === 'torolt' ? 'Törölt' : 'Aktív'}
                </span>
            </div>

            <p class="mb-1">
                Szállás: ${biztosit(szallasNeve(f.szallasId))}
            </p>

            <p class="mb-1">
                Érkezés: ${f.erkezes} · Távozás: ${f.tavozas}
            </p>

            <p class="mb-1">Személyek: ${f.szemelyek} fő</p>

            <p class="price">
                Ár: ${arSzamitas(f).toLocaleString('hu-HU')} Ft
            </p>

            ${
                f.statusz === 'torolt'
                    ? `<button class="btn btn-success align-self-start"
                        onclick="visszaallit(${f.id})">
                        Visszaállítás
                    </button>`
                    : `<button class="btn btn-outline-danger align-self-start"
                        onclick="torles(${f.id})">
                        Törlés
                    </button>`
            }
        `;

        t.appendChild(k);
    }
}

function biztosit(szoveg) {
    let d = document.createElement('div');
    d.textContent = String(szoveg);

    return d.innerHTML;
}

document.getElementById('kereses').addEventListener(
    'input',
    megjelenites
);

document.getElementById('szallasSzures').addEventListener(
    'change',
    megjelenites
);

document.getElementById('tablaGomb').addEventListener('click', () => {
    kartyasNezet = false;
    megjelenites();
});

document.getElementById('kartyaGomb').addEventListener('click', () => {
    kartyasNezet = true;
    megjelenites();
});

document.getElementById('rendezesNev').addEventListener('click', () => {
    rendezesKattintas('nev');
});

document.getElementById('rendezesErkezes').addEventListener('click', () => {
    rendezesKattintas('erkezes');
});

document.getElementById('rendezesAr').addEventListener('click', () => {
    rendezesKattintas('ar');
});

function rendezesKattintas(mezo) {
    if (rendezesMezo === mezo) {
        novekvo = !novekvo;
    } else {
        rendezesMezo = mezo;
        novekvo = true;
    }

    megjelenites();
}

document.getElementById('toroltMutat').addEventListener('click', function () {
    toroltLatszik = !toroltLatszik;

    this.textContent = toroltLatszik
        ? 'Csak aktív foglalások'
        : 'Töröltek megjelenítése';

    megjelenites();
});

document.getElementById('tetoreGomb').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    document.getElementById('tetoreGomb').style.display =
        window.scrollY > 300 ? 'block' : 'none';
});

betoltes();