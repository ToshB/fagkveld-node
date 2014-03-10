Fagkveld Webstep 6. mars 2014
============
Node.js Intro
----------------

### Installere Node.js
Gå til http://nodejs.org og klikk installer. Da skal du få installert Node.js, og du vil få kommandoene node og npm tilgjengelig i konsollen.

Etter at installasjonen er ferdig, prøv å gå i konsollen og skriv `node` og du skal få opp en prompt hvor du kan begynne å skrive JavaScript, prøv å skriv `console.log(1+2)`.

```
> console.log(1+2);
3
undefined
>
```

Node.js kommer med en REPL - en Read Eval Print Loop. Som navnet antyder leser den input, evaluerer input, printer resultat, og looper. Det kan brukes for teste JavaScript, ikke ulikt konsollen vi kjenner fra Developer Tools i Chrome.

### Kjøre fra fil
Akkurat som at node kan lese input fra konsoll, kan den også lese input fra fil. Putt et par linjer JavaScript i filen program.js, og kjør med `node program.js`. For eksempel som vist nedenfor.

program.js:
```javascript
var a = 'Hello world!';
console.log(a);
```

`node program.js`

Output:
```
Hello World
```

### Lasting av moduler - enkel Webserver
Nå kan vi prøve å gjøre noe litt mer avansert, kjøre igang en enkel webserver som svarer på alle requests med "Hello World". Endre program.js til å inneholde følgende:

program.js:
```javascript
var http = require('http'); // Last inn modulen "http"
var port = 8080;            // Definer en port

// Opprett et server-objekt, med et callback som vil bli kalt ved nye requests
var server = http.createServer(function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end('Hello World!');
});

// Begynn å lytt på en port
server.listen(port);

// Skriv ut info om at vi har startet
console.log('Server listening on http://localhost:'+port);
```
"response" er et objekt som representerer det som blir sendt til klienten når vi kaller "response.end()", så vi ønsker å skrive til headeren at statuskode er 200 (OK), og content-type er plaintekst.

Kjør dette med `node program.js`, se at den printer ut melding, og prøv å åpne http://localhost:8080 i en nettleser. Du skal nå få se meldingen.

Legg merke til at selv om server.listen() ble kjørt, som er funksjonen som gjør at programmet aldri avslutter, så ble likevel linjen console.log kjørt. Det er fordi JavaScript alltid eksekverer all kode i funksjonen du kjører (i dette tilfellet hele filen, inkl console.log). Eventuelle callbacks som registreres, som er det som skjer behind the scenes når du skriver server.listen(), vil gjøre at programmet ikke avsluttes før de er kjørt.

### Lasting av egne moduler/filer

La oss dra ut definisjonen av meldingen som printes ut i en egen fil. Lag en fil som heter greeting.js, og skriv følgende inn i den.

greeting.js:
```javascript
function sayHello(){
  return 'Hello World!';
}

module.exports = sayHello;
```

Endre så program.js til følgende:
```javascript
var greeting = require('./greeting'); // Last vår modul
var http = require('http');
var port = 8080;

var server = http.createServer(function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end(greeting()); // Kall vår modul
});

server.listen(port);

console.log('Server listening on http://localhost:'+port);
```

I motsetning til i nettleseren er alle filer helt isolert, så vi har ikke et globalt "Window"-objekt vi kan registrere greeting-funksjonen på. Istedet har vi objektet "module" tilgjengelig, hvor vi kan sette propertyen "exports" til å være det vi ønsker å eksportere fra funksjonen.

Vi kan enten sette exports til å være en funksjon, slik vi akkurat gjorde, så vi kan kalle greeting direkte, eller så kan vi sette flere properties på exports-objektet, som vi skal gjøre senere.

Når vi skal laste vår modul må vi prefixe den med "./" for å indikere at den ligger relativt til filen vi er i, og ikke er en registrert modul som f.eks "http".

### Lasting av eksterne moduler

I node er moduler laget så små som mulig, og vil man gjøre noe mer må man finne andre moduler som gjør dette eller skrive det selv.

Hvis vi nå for eksempel ønsker å returnere forskjellige ting avhengig av hvilken URL brukeren besøkte, er vi nødt til å håndtere dette selv, siden http-modulen ikke har denne funksjonaliteten.

Oppdater callbacket til "http.createServer" til følgende:

```javascript
var server = http.createServer(function(request, response){
  if (request.url == '/') {
    response.writeHeader(200, { 'Content-Type': 'text/plain' });
    response.end(greeting());
  } else if(request.url == '/data') {
    var obj = { data: 'Hello' };
    response.writeHeader(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(obj));
  }
});
```

"request" er objektet som representerer http-requesten som kommer inn, og har blant annet propertyen "url". Ved å sjekke hva den er kan vi håndtere requestene forskjellig. Her hadde det også vært naturlig å legge inn en "else"-statement som returnerer statuskode 404, og kanskje meldingen "Page not found".

I tillegg ser du et eksempel på hvordan du kan returnere JSON. Serialiser et objekt ved å skrive `JSON.stringify(objekt)`, og sett riktig content-type.

Koden begynner å bli litt stygg her, så nå bør vi vurdere å dra inn en modul som kan hjelpe oss med routing, "Express" er et av mange alternativer her. Den følger ikke med node, så vi må installere den via npm først.

For å kunne bruke npm bør vi først initialisere prosjektet vårt til å kjenne til npm, slik at vi kan lagre hvilke moduler vi laster. Gjør dette ved å skrive `npm init`. Spesifiser hva du vil på spørsmålene du får, men standardalternativene er som regel bra.

Nå kan du installere "Express" ved å skrive `npm install express --save`. Dette installerer modulen "Express" og dens avhengigheter, og lagrer en referanse til modulen i filen package.json, som ble opprettet i sted.

Oppdater program.js til å referer til express istedet for http, og endre definisjonen av handlerne.

program.js:
```javascript
var greeting = require('./greeting');
var express = require('express');   // Last express
var app = express();                // Initialiser express
var port = 8080;

// Registrer handler for URLen "/"
app.get('/', function(request, response){
    response.writeHeader(200, { 'Content-Type': 'text/plain' });
    response.end(greeting());
});

// Registrer handler for URLen "/data"
app.get('/data', function(request, response){
    var obj = { data: 'Hello' };
    response.writeHeader(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(obj));
});

// Lytt på den definerte porten
app.listen(port);

console.log('Server listening on http://localhost:'+port);
```
Dette begynner å se bedre ut. I tillegg kan vi vurdere å dra ut logikken vår i en egen fil, slik at program.js er så liten som mulig. Det gjør det lettere å teste logikken vår senere.

Lag en fil som du kaller f.eks "handler.js" hvor du definerer funksjoner for å håndtere URL'ene "/" og "/data".

handler.js:
```javascript
var greeting = require('./greeting');

var hello = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain'});
  response.end(greeting());
};

var data = function(request, response){
  var obj = { data: 'Hello' };
  response.writeHeader(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(obj));
};

module.exports = {
  hello: hello,
  data: data
};
```

Endre program.js til å laste denne modulen, og bruke handlerne definert her:
```javascript
var handler = require('./handler'); // Last vår modul
var express = require('express');
var app = express();
var port = 8080;

app.get('/', handler.hello);        // Gi referanse til våre handlere
app.get('/data', handler.data);

app.listen(port);

console.log('Server listening on http://localhost:'+port);
```

Legg merke til at vi også måtte flytte referansen til modulen "greeting", siden det nå er handler.js som bruker den.

### Lesing av fil

Nå er det enkelt å legge til nye handlere, så kan også prøve å lese opp en fil fra disk. Oppdater handler.js til å laste inn modulen 'fs, lese inn filen ved kall til metoden "file", og legg til referanse i "module.exports":

```javascript
var greeting = require('./greeting');
var fs = require('fs');

var hello = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain'});
  response.end(greeting());
};

var data = function(request, response){
  var obj = { data: 'Hello' };
  response.writeHeader(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(obj));
};

var file = function(request, response){
  fs.readFile(__dirname + '/image.jpeg', function(error, data){
    response.writeHeader(200, { 'Content-Type': 'image/jpeg'});
    response.end(data);
  });
};

module.exports = {
  hello: hello,
  data: data,
  file: file
};
```
- "fs" er en innebygd modul i node, så den trenger ikke installeres som vi måtte gjøre med "express".
- "__dirname" er en variabel som er satt til å referere til katalogen programmet kjører fra.
- "image.jpeg" er filnavnet til et bilde som ligger i katalogen til scriptet.
- callbacket til readFile får et error-objekt som første parameter. Dette er et vanlig pattern i node, slik at man alltid blir påmint at man bør sjekke om error er noe annet enn null, isåfall håndtere feilen. Nå hopper vi elegant over det steget, og bare returnerer data, som vi forventer finnes.

Nå kan vi legge til en enkelt linje i program.js under våre andre url-definisjoner for å kalle vår nye handler:
```javascript
...
app.get('/data', handler.data);
app.get('/file', handler.file); // vår nye handler
...
```

Merk at vi her først laster opp en fil, for så å returnere den når den er ferdig lest opp i minnet. Hvis denne filen skulle være stor vil den begynne å ta opp endel minne når vi får mange parallelle requests inn.. Dette kan løses bedre ved hjelp av streams!

Uten å gå nærmere inn på hva streams er i node, så kan det nevnes at veldig mye som leser inn eller sender data egentlig er streams. Så modulen "fs" lar oss lese inn en fil som en stream, som vi så kan sende rett inn i response, som også er en stream. Du kan oppdatere handleren til å utnytte dette ved å endre den til følgende:

```javascript
var file = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'image/jpeg'});
  fs.createReadStream(__dirname + '/image.jpeg')
    .pipe(response);
};
```

Kjør programmet og se at det oppfører seg likt.

## Deployment til Azure

Her anbefaler jeg å følge Microsoft sine tutorials, som du finner her: http://www.windowsazure.com/en-us/develop/nodejs/

Jeg fulgte følgende guide, som er for å gjøre en deployment fra Mac:    http://www.windowsazure.com/en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/

Den gir en fin innføring i hva man må gjøre for å kunne gjøre en git push deployment av en Node.js-applikasjon til en Azure website.

Merk: For at applikasjonen du har laget frem til nå skal fungere på Azure er du nødt til å støtte dynamisk allokering av port. Du har nå kanskje hardkodet port 8080, som beskrevet i denne guiden. Dette må du endre i program.js til følgende:

```javascript
var port = process.env.PORT || 8080;
```
Dette setter port til å være hva som eventuelt er definert i prosessens environment-variabel med navn PORT. Hvis det ikke er satt noe, typisk ved lokal utvikling, er det fallback til port 8080. Azure setter denne til ett eller annet (sannsynligvis noe annet enn 8080) når applikasjonen kjører i shared environment, og ruter requests som gjøres til nettstedet ditt til den porten.

Etter at du har satt opp alt som guiden beskriver skal det holde å skrive følgende for å opprette en ny site (med git deployment), pushe koden du allerede har committet til master til azure, og så åpne siten i nettleseren.
Dette forutsetter at filene dine ligger i et git-repository på lokal disk, og er committet. Dette er litt utenfor scopet til denne introen..


```javascript
azure site create webstepfagkveld --git
git push azure master
azure site browse (eller bare åpne i browser)
```

## Et par nyttige lenker
- [Video av presentasjonen](http://youtu.be/XFGvJwKfIcE)
- [Nodejs.org](http://nodejs.org)
- [Azure deployment på Mac](http://www.windowsazure.com/en-us/documentation/articles/web-sites-nodejs-develop-deploy-mac/)
- [High level style in JavaScript](https://gist.github.com/dominictarr/2401787)
