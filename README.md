# Cosmos Odyssey

Kosmose reisimise broneerimissüsteem, mis võimaldab otsida ja broneerida lende erinevate planeetide vahel.

Mõned mõtted: 
1. Kui olete broneeringu teinud, siis tehtud broneeringuid kuvatakse ka eraldi lehele, http://localhost:3000/reservations

Tahaksin välja tuua ka selle, et kui panna clientis npm install, siis annab 8 vulnerabilitit. Üritasin seda parandada, aga ei tulnud välja. Mulle tundus probleem on vist selles, et :react-scripts -> @svgr/webpack -> @svgr/plugin-svgo -> svgo -> css-select kasutab nth-check@1.0.2 aga mul on nth 2.1.1. Ja react-scripts on 5.0.1. 

## Eeldused

Enne alustamist peab olema installitud:
- Node.js (v14 või uuem)
- MongoDB (v4.4 või uuem)
- npm (tavaliselt tuleb Node.js-iga kaasa)

### Installimisjuhised

#### Node.js ja npm installimine
1. Mine [Node.js ametlikule lehele](https://nodejs.org/)
2. Lae alla LTS (Long Term Support) versioon
3. Järgi installeri juhiseid
4. Kontrolli installimist:
```bash
node --version
npm --version
```

#### MongoDB installimine
1. Mine [MongoDB ametlikule lehele](https://www.mongodb.com/try/download/community)
2. Lae alla MongoDB Community Server
3. Järgi installeri juhiseid
4. Windows: Veendu, et MongoDB teenus on käivitatud (Services rakenduses)
5. Mac/Linux: Käivita MongoDB:
```bash
sudo systemctl start mongod    # Linux
brew services start mongodb    # MacOS
```
6. Kontrolli installimist:
```bash
mongod --version
```

## Paigaldamine

1. Klooni repositoorium:
```bash
git clone https://github.com/jooseplaus/cosmos-odyssey.git
```

2. Installi backend sõltuvused:
```bash
cd server
npm install
```

3. Installi frontend sõltuvused:
```bash
cd client
npm install
```

4. Seadista MongoDB:
- Veendu, et MongoDB teenus töötab
  - Windows: Kontrolli Services rakendusest, et "MongoDB Server" on käivitatud
  - Linux: `sudo systemctl status mongod`
  - MacOS: `brew services list | grep mongodb`
- Vaikimisi ühendub rakendus `mongodb://localhost:27017/cosmos-odyssey`
- Andmebaas luuakse automaatselt esimesel käivitamisel
- Kui soovid kontrollida ühendust:
```bash
# Ava MongoDB shell
mongosh

# Vaata olemasolevaid andmebaase
show dbs

# Vali cosmos-odyssey andmebaas
use cosmos-odyssey
```

## Käivitamine

1. Käivita backend server:
```bash
cd server
npm start
```

2. Käivita frontend:
```bash
cd client
npm start
```

Rakendus on nüüd aadressil `http://localhost:3000`

## Stackid

- Frontend: React.js
- Backend: Node.js, Express
- Andmebaas: MongoDB 
