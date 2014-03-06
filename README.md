Fagkveld Webstep 3. mars 2014
-----------------------------
Introduksjon
============

Hei og velkommen!

I morgen er det nøyaktig ett år siden vi hadde en åpen fagkveld med tema JavaScript. Den gangen gikk vi også igjennom noen ulike verktøy og teknikker, men da var fokuset på nettleseren og ikke noe på Node. På det året er det veldig mye som har skjedd som gjør JavaScript mer aktuelt på serversiden.

SLIDE
Etter at Ryan Dahl presenterte første versjon av Node.js i 2011 er det veldig mange rundt omkring som har lekt seg med Node.js for å finne ut hva man egentlig kan gjøre med det, og det siste året har det helt tatt av når det kommer til tooling for utviklere og mer avanserte workflows når man utvikler i JavaScript, både for klienten og på serversiden. Vi skal prøve å dekke litt av dette i kveld.

La meg først bare fortelle litt om hva Node.js er, og hva det er som gjør det ganske forskjellig fra andre utviklingsplattformer. Hjemmesiden til Node sier det som står her SLIDE
> Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

Det viktige her er at Node.js bruker en event-drevet, ikke-blokkerende I/O-modell, likt hva vi er vant med fra JavaScript på klientsiden. I Node er altså alle operasjoner ikke-blokkerende, dette inkluderer nettverks- , database- og til og med fil-aksess. Dette gjør at det er veldig godt egnet til å bygge web-tjenester som trenger høy grad av skalerbarhet, siden det klarer å ta unna veldig høy last med relativt sett lav grad av ressursbruk. Det som også er interessant er at det er event-drevet, så koden din kjører som en eneste event-loop, og du slipper å forholde deg til multithreading og alle morsomme problemer som dukker opp i forbindelse med det.

Det som også gjør at Node er veldig godt egnet til å lage verktøy, som strengt tatt ikke trenger den samme skalerbarheten, er at Node-runtimen kjører på Linux, OSX og Windows, og selv om det finnes noen få unntak, er veldig mye skrevet for å kjøre på alle plattformer. Så mens verktøy skrevet i f.eks Ruby tidligere har vært litt knot å bruke for Windowsutviklere kan man med Node nå lett dele på verktøy og erfaringer mellom utviklere uavhengig av plattform!

Det er mange selskap som har gått ut og annonsert at de bruker Node, eller ønsker å begynne å bruke Node, et lite utvalg av disse står på veggen. SLIDE
> LinkedIn, eBay, Walmart, Groupon, Netflix, HBO, Microsoft, Paypal, Netflix.
> I tillegg ser vi jo Webstep helt nederst til høyre der.

SLIDE
I tillegg kan det være verdt å nevne at Thoughtworks, som hvert kvartal lanserer sin Technology Radar, siden 2011 har plassert Node.js i kategoriene Assess, Trial, og nå senest i Januar i kategorien Adopt. Og som vi ser på veggen,SLIDE foreslår de å bruke Node.js til utviklingstasks hvis man ikke føler seg helt klar for å bruke Node.js i produksjon.

Planen for kvelden er at jeg nå skal vise dere litt hvordan dere kan komme igang med Node.js og npm selv, og kjapt vise deployment til Azure om det blir tid. Etter det skal Olav fortsette med Grunt og Bower, før Henning forteller om streams i Node og hvordan det brukes i Gulp. Til slutt skal David demonstrere hvor enkelt man kan komme igang med testing i JavaScript i Visual Studio og TeamCity.

Node.js
=======
#### REPL
Vise at man kan kjøre vilkårlige kommandoer i REPL. Definer en funksjon og kjør den.

#### Kjøre fra fil
Flytt logikken inn i `server.js` og kjør med `node server.js`
```javascript
console.log('Hello world'!);
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

Endre til å bruke sayhello istedet for å hardkode streng, for å vise lasting av egne moduler.

hello.js:
```javascript
function sayHello(){
  return 'Hello World!';
}

module.exports = sayHello;
```
server.js:
```javascript

var sayHello = require('./hello');
var http = require('http');
var port = 8080;

var server = http.createServer(function(request, response){
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end(sayHello());
});

server.listen(port);

console.log('Server listening on http://localhost:'+port);
```

Forklare at moduler er så små som mulig, så f.eks routing ikke er inkludert i http-modulen, så hvis man vil ha en "/data" må man fikse selv.

```javascript
if (request.url == '/') {
  response.writeHeader(200, { 'Content-Type': 'text/plain' });
  response.end(sayHello());
} else if(request.url == '/data') {
  var obj = { data: 'Hello' };
  response.writeHeader(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
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

var data = function(request, response){
  var obj = { data: 'Hello' };
  response.writeHeader(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
};

module.exports = {
  hello: hello,
  data: data
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
  data: data,
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
