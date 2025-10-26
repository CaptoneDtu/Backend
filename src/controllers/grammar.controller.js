const Grammar = require('../models/Grammar.model');

exports.createGrammar = async (req, res) => {
    try {
        const { title, structure, examples, level } = req.body;
        const newGrammar = new Grammar({ title, structure, examples, level, createBy: req.user._id });
        await newGrammar.save();
        res.status(201).json(newGrammar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGrammars = async (req, res) => {
    try {
        const { level, page = 1, limit = 10 } = req.query;
        const filter = level ? { level } : {};
        const skip = (page - 1) * limit;
        const grammars = await Grammar.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json(grammars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGrammar = async (req, res) => {
    try {
        const { grammarId } = req.params;
        const { title, structure, examples, level } = req.body;
        const filter = { _id: grammarId , createBy: req.user._id};
        const updatedGrammar = await Grammar.findByIdAndUpdate(
            filter,
            { title, structure, examples, level, updatedAt: Date.now()},
            { new: true }
        );
        res.status(200).json(updatedGrammar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGrammar = async (req, res) => {
    try {
        const { grammarId } = req.params;
        const filter = { _id: grammarId , createBy: req.user._id};
        await Grammar.findByIdAndDelete(filter);
        res.status(200).json({ message: 'Grammar entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};