Fagkveld Webstep 3. mars 2014
-----------------------------
Introduksjon
============

Hvorfor er JavaScript hot? Hva er greia med Nodejs?

### Technology Radar January 2014

#### Node.js - Adopt

http://www.thoughtworks.com/radar/#/platforms/280

> Node.js is a lightweight web container that is a strong option for development of micro services and as a server to mobile and single-page web applications. Due to the asynchronous nature of node.js, developers are turning to promise libraries to simplify their application code. As the use of promises mature within the node.js community, we expect to see more applications developed for node.js. For those teams that are reluctant to try node.js in production, it is still worthwhile to consider node.js for development tasks like running JavaScript tests outside of the browser or generating static web content from tools like CoffeeScript, SASS, and LESS.

#### Yeoman - Assess

> Yeoman attempts to make web application developers more productive by simplifying activities like scaffold, build and package management. It is a collection of the tools Yo, Grunt and Bower that work well as a set.

#### Grunt.js - Trial

> Several of our ThoughtWorks teams developing Node.js apps are using Grunt to automate most of the development activities like minification, compilation, and linting. Many of the common tasks are available as Grunt plugins. You can even programmatically generate the configuration if necessary.

### Introduksjon

Node.js dukket i januar 2011 opp på Thoughtwork's techradar, og ble i januar i år endret til statusen Adopt, som betyr at de mener at man kan begynne å ta det i bruk, hvis man har applikasjoner som tar nytte av fordelene det gir.

Mange store selskaper har hatt suksess med Node.js, blant annet LinkedIn, eBay, Walmart, Groupon, Netflix, HBO. Selv Microsoft har etter hvert begynt å tilby god støtte for Node.js i Visual Studio, bruker det internt, og har bidratt ressurser til Windows-porten av Node.js. Det siste er at Paypal og Netflix nå også kaster seg på bølgen, og ønsker å flytte over ting fra Java til Node.

I dag ønsker vi at dere skal gå herfra med litt kunnskap om hvordan dere kan begynne å leke med Node.js. Den ene måten er å benytte Node.js for å kjøre egen JavaScript-kode, i første omgang for de fleste av oss kanskje mest aktuelt for testing, prototyping eller utprøving til enkle løsninger. Den andre måten som flere og flere allerede har begynt å gjøre, er å bruke verktøy som Grunt og Bower, som begge baserer seg på Node.js, i utviklingsprosessen. Det er en fin måte å bli mer kjent med Node.js, uten at det får direkte konsekvenser hvordan utviklerne jobber til daglig, og hvordan applikasjonen etterhvert blir hostet.

Jeg skal starte med å fortelle om Node og NPM, og kjapt vise deployment til Azure om det blir tid. Etter det skal Olav fortsette med Grunt og Bower, før Henning forteller om streams i Node og hvordan det brukes i Gulp. Til slutt skal David demonstrere hvor enkelt man kan komme igang med testing i JavaScript i Visual Studio og TeamCity.

Node.js
=======

### Hva er egentlig Node.js?

Som tatt ut fra websidene til Node, Node.js er en plattform bygd på Chromes JavaScript runtime for å enkelt kunne bygge raske og skalerbare nettverksapplikasjoner. Node.js bruker en event-drevet, ikke-blokkende I/O-modell som gjør det lettvekts og enkelt, perfekt for data-intensive sanntidsapplikasjoner som kjører på distribuerte enheter.

Det betyr i praksis at hvis du ønsker å løse et I/O-begrenset problem, kan node hjelpe deg. F.eks en applikasjon som må snakke med flere databaser, utføre caching, load balancing, webservices, autentisering..

### How to node?

#### REPL
Vise at man kan kjøre vilkårlige kommandoer i REPL. Definer en funksjon og kjør den.

#### Kjøre fra fil
Flytt logikken inn i `server.js` og kjør med `node server.js`
```javascript
hello.js:
function sayHello(){
  return 'Hello World!';
}

module.exports = sayHello;

server.js:
var sayHello = require('./hello');

console.log(sayHello());
```

#### Skrive om til enkel Webserver
```javascript
var http = require('http');
var port = 8080;

var server = http.createServer(function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end('Hello World!');
});

server.listen(port);

console.log('Server listening on http://localhost:'+port);
```

Endre til å bruke sayhello istedet for å hardkode streng, for å vise lasting av moduler.

Forklare at moduler er så små som mulig, så f.eks routing ikke er inkludert i http-modulen, så hvis man vil ha en "Hi" må man fikse selv.

```javascript
if (request.url == '/') {
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end(sayHello());
} else if(request.url == '/hi') {
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end('Hi');
}
```

#### npm
Men nå begynner ting å bli litt grøtete her.. La oss dra inn et rammeverk for å gjøre det enklere å lage en liten webserver. Express!

```
npm init
npm install express --save
```

server.js:
```javascript
var express = require('express');
var app = express();

app.get(..)
app.listen(port);
```

I tillegg er det litt mye blanding av oppsett og logikk, la oss flytte logikken ut i en egen fil.

handler.js:
```javascript
var sayHello = require('./hello');

var hello = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end(sayHello());
};

var hi = function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end('Hi');
};

module.exports = {
  hello: hello,
  hi: hi
};
```

### lesing av fil, om tid

Bare for å vise hvor asynkront node er, hvis man ønsker å lese en fil er det som med andre async api, f.eks ajax get.

Først må vi dra inn modulen `fs`.

handler.js:
```javascript
var image = function(request, response){
  fs.readFile(__dirname + '/image.jpeg', function(err, data){
    response.writeHeader(200, { 'Content-Type': 'image/jpeg' });
    response.end(data);
  });
};

module.exports = {
  hello: hello,
  hi: hi,
  image: image
};

```

server.js:
```javascript
app.get('/aww', requestHandler.image);
```

Vis frem at det funker, og forklar hvorfor den koden ikke er såå smooth, da den må laste bildet opp i minnet før den kan sende det. Og at Henning skal vise mer om pipes senere.

#### Node.js deploy til Azure

For at dette skal funke må man gjøre et engangsoppsett av konto i azure, konfigurere passord for git. Men etter det er det rett frem. Må først installere azure-cli, kan gjøres kjapt med `npm install azure-cli`, noe jeg ikke trenger nå. Deretter må man opprette azure website, og så pushe katalogen.

HUSK Å OPPDATERE PORT til `process.env.PORT`.

```
azure site create webstepfagkveld --git
git push azure master
azure site browse (eller bare åpne i browser)
```

#### Nyttige lenker
- [High level style in JavaScript](https://gist.github.com/dominictarr/2401787)
