

const Deck = require('../models/Deck.model');  
const FlashCard = require('../models/FlashCard.model'); 

exports.createDeck = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newDeck = new Deck({ title, description, createdBy: req.user._id });
        await newDeck.save();
        res.status(201).json(newDeck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateDeck = async (req, res) => {
    try {
        const { deckId } = req.params;
        const { title, description } = req.body;
        const deck = await Deck.findOneAndUpdate(
            { _id: deckId, createdBy: req.user._id },
            { title, description, updatedAt: Date.now() },
            { new: true }
        );
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }
        res.json(deck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteDeck = async (req, res) => {
    try {
        const { deckId } = req.params;
        const deck = await Deck.findOneAndDelete({ _id: deckId, createdBy: req.user._id });
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }
        res.json({ message: 'Deck deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserDecks = async (req, res) => {
    // Api dành cho teacher lấy flashcard decks của chính họ
    try {
        const decks = await Deck.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.json(decks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.createCard = async (req, res) => {
    try {
        const { deckId } = req.params;
        const { front, back } = req.body;
        const deck = await Deck.findOne({ _id: deckId, createdBy: req.user._id });
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }
        const newCard = new FlashCard({ front, back, deck: deckId });
        await newCard.save();

        deck.stat.flashCardCount += 1;
        await deck.save();

        res.status(201).json(newCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getDeckCards = async (req, res) => {
    try {
        const { deckId } = req.params;
        const deck = await Deck.findOne({ _id: deckId, createdBy: req.user._id });
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }
        const cards = await FlashCard.find({ deck: deckId });
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await FlashCard.findOneAndDelete({ _id: cardId });
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { front, back } = req.body;
        const card = await FlashCard.findOneAndUpdate(
            { _id: cardId },
            { front, back },
            { new: true }
        );
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        res.json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

