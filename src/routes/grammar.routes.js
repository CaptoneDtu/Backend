

const router = require('express').Router();
const GrammarController = require('../controllers/grammar.controller');
const auth = require('../middleware/auth.middleware');
const { createGrammarZ , updateGrammarZ} = require('../validators/grammar.validator');
const { validateBody } = require('../middleware/validateBody');


router.post("/create", auth(['teacher']), validateBody(createGrammarZ), GrammarController.createGrammar);
router.patch("/update/:grammarId", auth(['teacher']), validateBody(updateGrammarZ), GrammarController.updateGrammar);
router.delete("/delete/:grammarId", auth(['teacher']), GrammarController.deleteGrammar);




module.exports = router;