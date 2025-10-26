
const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validateBody');

const flashcardController = require('../controllers/flashCard.controller');

router.post('/decks/create', auth(['teacher']), validateBody(flashcardController.createDeckSchema), flashcardController.createDeck);
router.put('/decks/update/:deckId', auth(['teacher']), validateBody(flashcardController.updateDeckSchema), flashcardController.updateDeck);
router.delete('/decks/delete/:deckId', auth(['teacher']), flashcardController.deleteDeck);
router.get('/decks', auth(['teacher']), flashcardController.getUserDecks);


router.post('/flashcards/create', auth(['teacher']), validateBody(flashcardController.createFlashCardSchema), flashcardController.createFlashCard);
router.put('/flashcards/update/:flashCardId', auth(['teacher']), validateBody(flashcardController.updateFlashCardSchema), flashcardController.updateFlashCard);
router.delete('/flashcards/delete/:flashCardId', auth(['teacher']), flashcardController.deleteFlashCard);
router.get('/flashcards/deck/:deckId', auth(['teacher']), flashcardController.getFlashCardsByDeck);