const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.pioupiou.fr/v1/live/110');

        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

module.exports = router;
