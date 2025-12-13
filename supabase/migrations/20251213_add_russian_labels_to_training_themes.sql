-- Migration: Add Russian labels to training themes
-- Date: 2025-12-13
-- Description: Populates label_ru column with Russian translations for all training themes

-- Update beginner level themes
UPDATE training_themes SET label_ru = 'Приветствия' WHERE key = 'greetings' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Числа' WHERE key = 'numbers' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Семья' WHERE key = 'family' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Еда' WHERE key = 'food' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Цвета' WHERE key = 'colors' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Животные' WHERE key = 'animals' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Части тела' WHERE key = 'body' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Одежда' WHERE key = 'clothes' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Время' WHERE key = 'time' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Дни и месяцы' WHERE key = 'days' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Места' WHERE key = 'places' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Профессии' WHERE key = 'professions' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Дом' WHERE key = 'house' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Транспорт' WHERE key = 'transport' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Общие глаголы' WHERE key = 'verbs' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Прилагательные' WHERE key = 'adjectives' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Погода' WHERE key = 'weather' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Эмоции' WHERE key = 'emotions' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Хобби' WHERE key = 'hobbies' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Школа' WHERE key = 'school' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Природа' WHERE key = 'nature' AND level = 'beginner';
UPDATE training_themes SET label_ru = 'Напитки' WHERE key = 'drinks' AND level = 'beginner';

-- Update intermediate level themes
UPDATE training_themes SET label_ru = 'Путешествия' WHERE key = 'travel' AND level = 'intermediate';
UPDATE training_themes SET label_ru = 'Работа' WHERE key = 'work' AND level = 'intermediate';
UPDATE training_themes SET label_ru = 'Здоровье' WHERE key = 'health' AND level = 'intermediate';
UPDATE training_themes SET label_ru = 'Хобби' WHERE key = 'hobbies' AND level = 'intermediate';
UPDATE training_themes SET label_ru = 'Дом' WHERE key = 'home' AND level = 'intermediate';
UPDATE training_themes SET label_ru = 'Погода' WHERE key = 'weather' AND level = 'intermediate';

-- Update advanced level themes
UPDATE training_themes SET label_ru = 'Политика' WHERE key = 'politics' AND level = 'advanced';
UPDATE training_themes SET label_ru = 'Бизнес' WHERE key = 'business' AND level = 'advanced';
UPDATE training_themes SET label_ru = 'Наука' WHERE key = 'science' AND level = 'advanced';
UPDATE training_themes SET label_ru = 'Культура' WHERE key = 'culture' AND level = 'advanced';
UPDATE training_themes SET label_ru = 'Эмоции' WHERE key = 'emotions' AND level = 'advanced';
UPDATE training_themes SET label_ru = 'Идиомы' WHERE key = 'idioms' AND level = 'advanced';

-- Update the stats view to include label_ru
CREATE OR REPLACE VIEW training_stats AS
SELECT
    t.id as theme_id,
    t.lang,
    t.level,
    t.key,
    t.label_fr,
    t.label_en,
    t.label_ru,  -- Added Russian label
    t.icon,
    COUNT(q.id) as question_count,
    COUNT(CASE WHEN q.type = 'mcq' THEN 1 END) as mcq_count,
    COUNT(CASE WHEN q.type = 'dropdown' THEN 1 END) as dropdown_count,
    COUNT(CASE WHEN q.type = 'multi_fill' THEN 1 END) as multi_fill_count
FROM training_themes t
LEFT JOIN training_questions q ON q.theme_id = t.id AND q.is_active = true
WHERE t.is_active = true
GROUP BY t.id, t.lang, t.level, t.key, t.label_fr, t.label_en, t.label_ru, t.icon
ORDER BY t.lang, t.level, t.display_order;
