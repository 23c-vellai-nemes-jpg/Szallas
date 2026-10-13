let szallasok = [];
let foglalasok = [];

const datumMa = new Date();
datumMa.setHours(0, 0, 0, 0);

const datumSzoveg =
    datumMa.getFullYear() + '-' +
    String(datumMa.getMonth() + 1).padStart(2, '0') + '-' +
    String(datumMa.getDate()).padStart(2, '0');

document.getElementById('erkezes').min = datumSzoveg;
document.getElementById('tavozas').min = datumSzoveg;

async function betoltes() {
    try {
        let szallasValasz = await fetch('data/szallasok.json');
        szallasok = await szallasValasz.json();

        let tarolt = localStorage.getItem('balatonFoglalasok');

        if (tarolt === null) {
            let valasz = await fetch('data/foglalasok.json');
            foglalasok = await valasz.json();

            localStorage.setItem(
                'balatonFoglalasok',
                JSON.stringify(foglalasok)
            );
        } else {
            foglalasok = JSON.parse(tarolt);
        }

        let select = document.getElementById('szallas');

        select.innerHTML = '<option value="">Válassz szállást</option>';

        for (let szallas of szallasok) {
            let op = document.createElement('option');

            op.value = szallas.id;
            op.textContent =
                szallas.nev + ' – ' +
                szallas.arEgyEjszakara.toLocaleString('hu-HU') +
                ' Ft/éj';

            select.appendChild(op);
        }

        let id = new URLSearchParams(window.location.search).get('szallasId');

        if (id && szallasok.some(sz => String(sz.id) === id)) {
            select.value = id;
        }

        arFrissites();

    } catch (e) {
        uzenet(
            'Nem sikerült betölteni az adatokat. Nyisd meg a projektet VS Code Live Serverrel.',
            'danger'
        );
    }
}

function uzenet(szoveg, tipus) {
    document.getElementById('uzenet').innerHTML = `
        <div class="alert alert-${tipus}">
            ${szoveg}
        </div>
    `;
}

function arFrissites() {
    let szallas = szallasok.find(
        sz => String(sz.id) === document.getElementById('szallas').value
    );

    let erkezes = document.getElementById('erkezes').value;
    let tavozas = document.getElementById('tavozas').value;

    let napok = 0;

    if (erkezes && tavozas) {
        napok = (
            new Date(tavozas + 'T00:00:00') -
            new Date(erkezes + 'T00:00:00')
        ) / 86400000;

        if (napok < 0) {
            napok = 0;
        }
    }

    document.getElementById('ejszakak').textContent = napok;

    document.getElementById('ar').textContent =
        szallas && napok > 0
            ? (napok * szallas.arEgyEjszakara).toLocaleString('hu-HU') + ' Ft'
            : '–';

    if (szallas) {
        document.getElementById('szemelyek').max = szallas.ferohely;
    }
}

document.getElementById('szallas').addEventListener(
    'change',
    arFrissites
);

document.getElementById('erkezes').addEventListener('change', function () {
    document.getElementById('tavozas').min = this.value || datumSzoveg;
    arFrissites();
});

document.getElementById('tavozas').addEventListener(
    'change',
    arFrissites
);

document.getElementById('foglalasForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let szallas = szallasok.find(
        sz => String(sz.id) === document.getElementById('szallas').value
    );

    let nev = document.getElementById('nev').value.trim();
    let email = document.getElementById('email').value.trim();
    let telefon = document.getElementById('telefon').value.trim();

    let erkezes = document.getElementById('erkezes').value;
    let tavozas = document.getElementById('tavozas').value;
    let szemelyek = Number(document.getElementById('szemelyek').value);

    if (!szallas || !nev || !email || !telefon || !erkezes || !tavozas) {
        uzenet('Kérlek, tölts ki minden mezőt!', 'danger');
        return;
    }

    if (erkezes < datumSzoveg) {
        uzenet('Az érkezés nem lehet a mai napnál korábban.', 'danger');
        return;
    }

    if (tavozas <= erkezes) {
        uzenet(
            'A távozás dátuma legyen későbbi az érkezésnél.',
            'danger'
        );
        return;
    }

    if (szemelyek < 1 || szemelyek > szallas.ferohely) {
        uzenet(
            'Ehhez a szálláshoz legfeljebb ' +
            szallas.ferohely +
            ' fő foglalható.',
            'danger'
        );
        return;
    }

    let id = 1;

    for (let f of foglalasok) {
        if (f.id >= id) {
            id = f.id + 1;
        }
    }

    foglalasok.push({
        id: id,
        szallasId: szallas.id,
        nev: nev,
        email: email,
        telefon: telefon,
        erkezes: erkezes,
        tavozas: tavozas,
        szemelyek: szemelyek,
        statusz: 'aktiv'
    });

    localStorage.setItem(
        'balatonFoglalasok',
        JSON.stringify(foglalasok)
    );

    uzenet(
        'Sikeres foglalás! A foglalás elmentve. Átirányítás a foglalásokhoz…',
        'success'
    );

    document.getElementById('foglalasForm').reset();

    window.setTimeout(() => {
        window.location.href = 'foglalasok.html';
    }, 900);
});

betoltes();