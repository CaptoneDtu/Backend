const { z } = require('zod');

const exampleZ = z.object({
  zh: z.string().trim().max(500).optional(),
  pinyin: z.string().trim().max(500).optional(),
  vi: z.string().trim().max(500).optional(),

  sentence: z.string().trim().max(500).optional(),
  translation: z.string().trim().max(500).optional(),
}).refine(obj => (obj.zh || obj.sentence), {
  message: 'Cần ít nhất zh hoặc sentence cho ví dụ.'
});

const base = {
  title: z.string().trim().max(200),
  structure: z.string().trim().max(1000),
  description: z.string().trim().max(2000).optional(),
  examples: z.array(exampleZ).max(50).optional(),
  level: z.enum(['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6']).default('HSK1'),
  tags: z.array(z.string().trim().max(40)).optional(),
};

const createGrammarZ = z.object({
  ...base,
});

const updateGrammarZ = z.object({
  title: base.title.optional(),
  structure: base.structure.optional(),
  description: base.description,
  examples: base.examples,
  level: base.level.optional(),
  tags: base.tags,
}).refine(obj => Object.keys(obj).length > 0, { message: 'Không có trường nào để cập nhật.' });

module.exports = { createGrammarZ, updateGrammarZ };