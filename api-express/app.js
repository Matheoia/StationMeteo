const express = require('express');
const cors = require('cors');
const liveRouter = require('./routes/live');
const archiveRouter = require('./routes/archive');


const app = express();

app.use(cors());

app.use('/live', liveRouter);
app.use('/archive', archiveRouter);


app.get('/', (req, res) => {
    res.send('Bienvenue sur votre API Express !');
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
