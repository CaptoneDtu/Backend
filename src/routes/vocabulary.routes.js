const router = require('express').Router();
const vocabularyController = require('../controllers/vocabulary.controller');
const auth = require('../middleware/auth.middleware');
const { createVocabularySchema, updateVocabularySchema } = require('../validators/vocabulary.validator');
const { validateBody } = require('../middleware/validate');


router.post('/create', auth(['teacher']), validateBody(createVocabularySchema), vocabularyController.createVocabulary);
router.get('/my-vocabularies', auth(['teacher']), vocabularyController.getMyVocabularies);
router.put('/update/:vocabularyId', auth(['teacher']), validateBody(updateVocabularySchema), vocabularyController.updateVocabulary);
router.delete('/delete/:vocabularyId', auth(['teacher']), vocabularyController.deleteVocabulary);

module.exports = router;
