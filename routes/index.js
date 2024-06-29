var express = require('express');
var router = express.Router();
const questionsController = require('../controllers/questionsController');


router.get('/', async (req, res) => {
  try {
      // Kličemo metodo getRecentQuestions iz kontrolerja
      const recentQuestions = await questionsController.getRecentQuestions(req, res);
      // Renderiramo predlogo z rezultati in layoutom
      res.render('index', { 
          recentQuestions: recentQuestions,
          layout: 'layouts/layout' // Dodajte layout
      });
  } catch (error) {
      console.error('Napaka pri pridobivanju nedavnih vprašanj:', error);
      res.status(500).send('Napaka na strežniku.');
  }
});


module.exports = router;

