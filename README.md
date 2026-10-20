# Balaton Resort – foglalási weboldal
**Készítette:** 12.c – Szitási Levente és Vellai-Nemes Samu

## Funkciók
- **Kezdőlap:** A szállások kártyás megjelenítése, amelyekről a felhasználó továbbléphet a foglaláshoz.
- **Új foglalás:** A felhasználó kiválaszthatja a szállást, megadhatja a nevét, e-mail-címét, telefonszámát, az érkezés és távozás dátumát, valamint a vendégek számát. A weboldal ezek alapján automatikusan kiszámolja az árat.
- **Foglalások kezelése:** A foglalások név alapján kereshetők, szállás szerint szűrhetők, valamint táblázatos vagy kártyás nézetben jeleníthetők meg.
- **Rendezés:** A foglalások név, érkezési dátum vagy ár alapján rendezhetők.
- **Törlés és visszaállítás:** A felhasználó törölheti a foglalásokat, illetve visszaállíthatja őket.
- **Adatok mentése:** A foglalások a böngésző `localStorage` tárhelyére mentődnek, így az oldal újbóli megnyitásakor is megmaradnak ugyanabban a böngészőben.

## Munka felosztása

### Szitási Levente
- **JavaScript (JS):** Elkészítette a weboldal működéséért felelős programkódot. Ez kezeli a foglalások létrehozását, törlését és visszaállítását, a keresést, a szűrést, a rendezést, valamint a foglalások táblázatos és kártyás megjelenítését. A JavaScript végzi az árak automatikus kiszámítását és a foglalások adatainak böngészőben történő mentését is.
- **JSON:** Elkészítette és kezelte a szállások adatait tároló adatstruktúrát. Ennek segítségével a weboldal egységes formában tudja tárolni és feldolgozni a szállásokhoz tartozó információkat, például a neveket és az árakat.

### Vellai-Nemes Samu
- **HTML:** Elkészítette a weboldal szerkezetét. Meghatározta az oldal különböző részeit, például a kezdőlapot, a szálláskártyákat, a foglalási űrlapot és a foglalások megjelenítésére szolgáló területeket. A HTML biztosítja az oldal tartalmi elemeinek alapját.
- **CSS:** Elkészítette a weboldal megjelenését és stílusát. Beállította az elrendezést, a színeket, a betűtípusokat, a térközöket és a kártyák kinézetét. A CSS feladata, hogy az oldal átlátható, egységes és könnyen használható legyen.
