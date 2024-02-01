const express = require('express');
const liveRouter = require('./routes/live');

const app = express();


app.use('/live', liveRouter);


app.get('/', (req, res) => {
    res.send('Bienvenue sur votre API Express !');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
