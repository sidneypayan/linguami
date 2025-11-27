'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { completeTrainingSessionAction } from '@/app/actions/training'
import {
	Dumbbell,
	Brain,
	BookOpen,
	Clock,
	Hash,
	SignalLow,
	SignalMedium,
	SignalHigh,
	Play,
	ChevronLeft,
	CheckCircle2,
	XCircle,
	Trophy,
	Target,
	Sparkles,
	RotateCcw,
	Coins,
	Zap,
	Languages,
} from 'lucide-react'

// Helper function to get localized text
const getLocalizedText = (text, locale) => {
	if (typeof text === 'string') return text
	if (typeof text === 'object' && text !== null) {
		return text[locale] || text.en || text.fr || ''
	}
	return ''
}

// Helper function to get localized options
const getLocalizedOptions = (options, locale) => {
	if (Array.isArray(options)) return options
	if (typeof options === 'object' && options !== null) {
		return options[locale] || options.en || options.fr || []
	}
	return []
}

// Vocabulary themes by level
const vocabularyThemes = {
	ru: {
		beginner: [
			{ key: 'greetings', icon: '👋', label: { fr: 'Salutations', en: 'Greetings' } },
			{ key: 'numbers', icon: '🔢', label: { fr: 'Nombres', en: 'Numbers' } },
			{ key: 'family', icon: '👨‍👩‍👧‍👦', label: { fr: 'Famille', en: 'Family' } },
			{ key: 'food', icon: '🍎', label: { fr: 'Nourriture', en: 'Food' } },
			{ key: 'colors', icon: '🎨', label: { fr: 'Couleurs', en: 'Colors' } },
			{ key: 'animals', icon: '🐾', label: { fr: 'Animaux', en: 'Animals' } },
			{ key: 'body', icon: '🫀', label: { fr: 'Corps humain', en: 'Body parts' } },
			{ key: 'clothes', icon: '👕', label: { fr: 'Vetements', en: 'Clothes' } },
			{ key: 'time', icon: '🕐', label: { fr: 'Temps', en: 'Time' } },
			{ key: 'days', icon: '📅', label: { fr: 'Jours et mois', en: 'Days & months' } },
			{ key: 'places', icon: '🏪', label: { fr: 'Lieux', en: 'Places' } },
			{ key: 'professions', icon: '👨‍⚕️', label: { fr: 'Metiers', en: 'Professions' } },
			{ key: 'house', icon: '🛋️', label: { fr: 'Maison', en: 'House' } },
			{ key: 'transport', icon: '🚌', label: { fr: 'Transports', en: 'Transport' } },
			{ key: 'verbs', icon: '🏃', label: { fr: 'Verbes courants', en: 'Common verbs' } },
			{ key: 'adjectives', icon: '✨', label: { fr: 'Adjectifs', en: 'Adjectives' } },
			{ key: 'weather', icon: '☀️', label: { fr: 'Meteo', en: 'Weather' } },
			{ key: 'emotions', icon: '😊', label: { fr: 'Emotions', en: 'Emotions' } },
			{ key: 'hobbies', icon: '⚽', label: { fr: 'Loisirs', en: 'Hobbies' } },
			{ key: 'school', icon: '📚', label: { fr: 'Ecole', en: 'School' } },
			{ key: 'nature', icon: '🌳', label: { fr: 'Nature', en: 'Nature' } },
			{ key: 'drinks', icon: '🥤', label: { fr: 'Boissons', en: 'Drinks' } },
		],
		intermediate: [
			{ key: 'travel', icon: '✈️', label: { fr: 'Voyages', en: 'Travel' } },
			{ key: 'work', icon: '💼', label: { fr: 'Travail', en: 'Work' } },
			{ key: 'health', icon: '🏥', label: { fr: 'Sante', en: 'Health' } },
			{ key: 'hobbies', icon: '🎸', label: { fr: 'Loisirs', en: 'Hobbies' } },
			{ key: 'home', icon: '🏠', label: { fr: 'Maison', en: 'Home' } },
			{ key: 'weather', icon: '🌤️', label: { fr: 'Meteo', en: 'Weather' } },
		],
		advanced: [
			{ key: 'politics', icon: '🏛️', label: { fr: 'Politique', en: 'Politics' } },
			{ key: 'business', icon: '📊', label: { fr: 'Affaires', en: 'Business' } },
			{ key: 'science', icon: '🔬', label: { fr: 'Sciences', en: 'Science' } },
			{ key: 'culture', icon: '🎭', label: { fr: 'Culture', en: 'Culture' } },
			{ key: 'emotions', icon: '💭', label: { fr: 'Emotions', en: 'Emotions' } },
			{ key: 'idioms', icon: '📚', label: { fr: 'Expressions', en: 'Idioms' } },
		],
	},
}

// Verbs themes by level (synced with training_themes DB)
const verbsThemes = {
	ru: {
		beginner: [
			{ key: 'aspects', icon: '🔄', label: { fr: 'Aspects verbaux', en: 'Verbal aspects' } },
			{ key: 'prefixes', icon: '🔗', label: { fr: 'Prefixes verbaux', en: 'Verb prefixes' } },
			{ key: 'motion', icon: '🚶', label: { fr: 'Verbes de mouvement', en: 'Verbs of motion' } },
			{ key: 'reflexive', icon: '🪞', label: { fr: 'Verbes reflechis (-ся)', en: 'Reflexive verbs (-ся)' } },
		],
		intermediate: [],
		advanced: [],
	},
}

// Training questions data organized by theme
// Questions and explanations are multilingual (fr/en)
const trainingQuestions = {
	ru: {
		beginner: {
			vocabulary: {
				greetings: [
					{
						id: 'v1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "bonjour" en russe ?',
							en: 'How do you say "hello" in Russian?',
						},
						options: ['Привет', 'Пока', 'Спасибо', 'Пожалуйста'],
						correctAnswer: 0,
						explanation: {
							fr: 'Привет (Privet) signifie "Salut" ou "Bonjour" de maniere informelle.',
							en: 'Привет (Privet) means "Hi" or "Hello" in an informal way.',
						},
					},
					{
						id: 'v2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "Спасибо" ?',
							en: 'What does "Спасибо" mean?',
						},
						options: {
							fr: ['Au revoir', 'Bonjour', 'Merci', 'Pardon'],
							en: ['Goodbye', 'Hello', 'Thank you', 'Sorry'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Спасибо (Spasibo) signifie "Merci".',
							en: 'Спасибо (Spasibo) means "Thank you".',
						},
					},
					{
						id: 'v3',
						type: 'dropdown',
						sentence: 'Меня ___ Анна.',
						blank: 'зовут',
						options: ['зовут', 'есть', 'люблю', 'хочу'],
						correctAnswer: 0,
						explanation: {
							fr: 'Меня зовут = Je m\'appelle. "Зовут" est le verbe utilise pour dire son prenom.',
							en: 'Меня зовут = My name is. "Зовут" is the verb used to say your name.',
						},
					},
					{
						id: 'v4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "oui" en russe ?',
							en: 'How do you say "yes" in Russian?',
						},
						options: ['Нет', 'Да', 'Может', 'Хорошо'],
						correctAnswer: 1,
						explanation: {
							fr: 'Да signifie "oui" en russe.',
							en: 'Да means "yes" in Russian.',
						},
					},
					{
						id: 'v5',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "au revoir" en russe ?',
							en: 'How do you say "goodbye" in Russian?',
						},
						options: ['Привет', 'Пока', 'Спасибо', 'Здравствуйте'],
						correctAnswer: 1,
						explanation: {
							fr: 'Пока (Poka) signifie "Au revoir" de maniere informelle.',
							en: 'Пока (Poka) means "Bye" in an informal way.',
						},
					},
				],
				numbers: [
					{
						id: 'n1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "un" en russe ?',
							en: 'How do you say "one" in Russian?',
						},
						options: ['один', 'два', 'три', 'четыре'],
						correctAnswer: 0,
						explanation: {
							fr: 'Один (odin) = un.',
							en: 'Один (odin) = one.',
						},
					},
					{
						id: 'n2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "пять" ?',
							en: 'What does "пять" mean?',
						},
						options: {
							fr: ['Trois', 'Quatre', 'Cinq', 'Six'],
							en: ['Three', 'Four', 'Five', 'Six'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Пять (pyat) = cinq.',
							en: 'Пять (pyat) = five.',
						},
					},
					{
						id: 'n3',
						type: 'dropdown',
						sentence: 'У меня ___ кошки.',
						blank: 'две',
						options: ['один', 'две', 'два', 'три'],
						correctAnswer: 1,
						explanation: {
							fr: 'Две (dve) s\'utilise avec les noms feminins. Кошка (chat) est feminin.',
							en: 'Две (dve) is used with feminine nouns. Кошка (cat) is feminine.',
						},
					},
					{
						id: 'n4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "dix" en russe ?',
							en: 'How do you say "ten" in Russian?',
						},
						options: ['семь', 'восемь', 'девять', 'десять'],
						correctAnswer: 3,
						explanation: {
							fr: 'Десять (desyat) = dix.',
							en: 'Десять (desyat) = ten.',
						},
					},
					{
						id: 'n5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "ноль" ?',
							en: 'What does "ноль" mean?',
						},
						options: {
							fr: ['Un', 'Zero', 'Cent', 'Mille'],
							en: ['One', 'Zero', 'Hundred', 'Thousand'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Ноль (nol) = zero.',
							en: 'Ноль (nol) = zero.',
						},
					},
				],
				family: [
					{
						id: 'f1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "mere" en russe ?',
							en: 'How do you say "mother" in Russian?',
						},
						options: ['папа', 'мама', 'брат', 'сестра'],
						correctAnswer: 1,
						explanation: {
							fr: 'Мама = mere/maman.',
							en: 'Мама = mother/mom.',
						},
					},
					{
						id: 'f2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "брат" ?',
							en: 'What does "брат" mean?',
						},
						options: {
							fr: ['Soeur', 'Frere', 'Pere', 'Mere'],
							en: ['Sister', 'Brother', 'Father', 'Mother'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Брат = frere.',
							en: 'Брат = brother.',
						},
					},
					{
						id: 'f3',
						type: 'dropdown',
						sentence: 'Моя ___ красивая.',
						blank: 'сестра',
						options: ['брат', 'сестра', 'папа', 'дедушка'],
						correctAnswer: 1,
						explanation: {
							fr: 'Моя (ma) s\'utilise avec les noms feminins. Сестра (soeur) est feminin.',
							en: 'Моя (my) is used with feminine nouns. Сестра (sister) is feminine.',
						},
					},
					{
						id: 'f4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "grand-mere" en russe ?',
							en: 'How do you say "grandmother" in Russian?',
						},
						options: ['дедушка', 'бабушка', 'тётя', 'дядя'],
						correctAnswer: 1,
						explanation: {
							fr: 'Бабушка = grand-mere.',
							en: 'Бабушка = grandmother.',
						},
					},
					{
						id: 'f5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "дети" ?',
							en: 'What does "дети" mean?',
						},
						options: {
							fr: ['Parents', 'Enfants', 'Freres', 'Soeurs'],
							en: ['Parents', 'Children', 'Brothers', 'Sisters'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Дети = enfants (pluriel de ребёнок).',
							en: 'Дети = children (plural of ребёнок).',
						},
					},
				],
				food: [
					{
						id: 'fo1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "pain" en russe ?',
							en: 'How do you say "bread" in Russian?',
						},
						options: ['хлеб', 'молоко', 'мясо', 'рыба'],
						correctAnswer: 0,
						explanation: {
							fr: 'Хлеб (khleb) = pain.',
							en: 'Хлеб (khleb) = bread.',
						},
					},
					{
						id: 'fo2',
						type: 'dropdown',
						sentence: 'Я ___ воду.',
						blank: 'пью',
						options: ['ем', 'пью', 'читаю', 'говорю'],
						correctAnswer: 1,
						explanation: {
							fr: 'Я пью воду = Je bois de l\'eau. "Пью" est le verbe boire conjugue.',
							en: 'Я пью воду = I drink water. "Пью" is the conjugated verb "to drink".',
						},
					},
					{
						id: 'fo3',
						type: 'mcq',
						question: {
							fr: 'Que signifie "яблоко" ?',
							en: 'What does "яблоко" mean?',
						},
						options: {
							fr: ['Orange', 'Pomme', 'Banane', 'Raisin'],
							en: ['Orange', 'Apple', 'Banana', 'Grape'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Яблоко = pomme.',
							en: 'Яблоко = apple.',
						},
					},
					{
						id: 'fo4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "cafe" (boisson) en russe ?',
							en: 'How do you say "coffee" in Russian?',
						},
						options: ['чай', 'кофе', 'сок', 'вода'],
						correctAnswer: 1,
						explanation: {
							fr: 'Кофе = cafe.',
							en: 'Кофе = coffee.',
						},
					},
					{
						id: 'fo5',
						type: 'dropdown',
						sentence: 'Я люблю ___ суп.',
						blank: 'есть',
						options: ['пить', 'есть', 'читать', 'смотреть'],
						correctAnswer: 1,
						explanation: {
							fr: 'Есть = manger. On mange (есть) la soupe en russe.',
							en: 'Есть = to eat. You eat (есть) soup in Russian.',
						},
					},
				],
				colors: [
					{
						id: 'c1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "rouge" en russe ?',
							en: 'How do you say "red" in Russian?',
						},
						options: ['синий', 'красный', 'зелёный', 'жёлтый'],
						correctAnswer: 1,
						explanation: {
							fr: 'Красный = rouge.',
							en: 'Красный = red.',
						},
					},
					{
						id: 'c2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "белый" ?',
							en: 'What does "белый" mean?',
						},
						options: {
							fr: ['Noir', 'Blanc', 'Gris', 'Marron'],
							en: ['Black', 'White', 'Grey', 'Brown'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Белый = blanc.',
							en: 'Белый = white.',
						},
					},
					{
						id: 'c3',
						type: 'dropdown',
						sentence: 'Небо ___ .',
						blank: 'голубое',
						options: ['красное', 'голубое', 'зелёное', 'чёрное'],
						correctAnswer: 1,
						explanation: {
							fr: 'Голубой = bleu ciel. Le ciel (небо) est bleu ciel.',
							en: 'Голубой = light blue/sky blue. The sky (небо) is light blue.',
						},
					},
					{
						id: 'c4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "vert" en russe ?',
							en: 'How do you say "green" in Russian?',
						},
						options: ['жёлтый', 'оранжевый', 'зелёный', 'фиолетовый'],
						correctAnswer: 2,
						explanation: {
							fr: 'Зелёный = vert.',
							en: 'Зелёный = green.',
						},
					},
					{
						id: 'c5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "чёрный" ?',
							en: 'What does "чёрный" mean?',
						},
						options: {
							fr: ['Blanc', 'Noir', 'Rouge', 'Bleu'],
							en: ['White', 'Black', 'Red', 'Blue'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Чёрный = noir.',
							en: 'Чёрный = black.',
						},
					},
				],
				animals: [
					{
						id: 'a1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "chat" en russe ?',
							en: 'How do you say "cat" in Russian?',
						},
						options: ['собака', 'кошка', 'птица', 'рыба'],
						correctAnswer: 1,
						explanation: {
							fr: 'Кошка = chat (femelle) / кот = chat (male).',
							en: 'Кошка = cat (female) / кот = cat (male).',
						},
					},
					{
						id: 'a2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "собака" ?',
							en: 'What does "собака" mean?',
						},
						options: {
							fr: ['Chat', 'Chien', 'Oiseau', 'Cheval'],
							en: ['Cat', 'Dog', 'Bird', 'Horse'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Собака = chien.',
							en: 'Собака = dog.',
						},
					},
					{
						id: 'a3',
						type: 'dropdown',
						sentence: 'Моя ___ маленькая.',
						blank: 'собака',
						options: ['кот', 'собака', 'конь', 'слон'],
						correctAnswer: 1,
						explanation: {
							fr: 'Моя (ma) s\'utilise avec les noms feminins. Собака (chien) est feminin en russe.',
							en: 'Моя (my) is used with feminine nouns. Собака (dog) is feminine in Russian.',
						},
					},
					{
						id: 'a4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "oiseau" en russe ?',
							en: 'How do you say "bird" in Russian?',
						},
						options: ['рыба', 'змея', 'птица', 'медведь'],
						correctAnswer: 2,
						explanation: {
							fr: 'Птица = oiseau.',
							en: 'Птица = bird.',
						},
					},
					{
						id: 'a5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "медведь" ?',
							en: 'What does "медведь" mean?',
						},
						options: {
							fr: ['Loup', 'Ours', 'Lion', 'Tigre'],
							en: ['Wolf', 'Bear', 'Lion', 'Tiger'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Медведь = ours. C\'est un symbole de la Russie.',
							en: 'Медведь = bear. It is a symbol of Russia.',
						},
					},
				],
				body: [
					{
						id: 'b1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "tete" en russe ?',
							en: 'How do you say "head" in Russian?',
						},
						options: ['рука', 'голова', 'нога', 'глаз'],
						correctAnswer: 1,
						explanation: {
							fr: 'Голова = tete.',
							en: 'Голова = head.',
						},
					},
					{
						id: 'b2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "рука" ?',
							en: 'What does "рука" mean?',
						},
						options: {
							fr: ['Jambe', 'Main/Bras', 'Pied', 'Doigt'],
							en: ['Leg', 'Hand/Arm', 'Foot', 'Finger'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Рука = main ou bras (le meme mot en russe).',
							en: 'Рука = hand or arm (same word in Russian).',
						},
					},
					{
						id: 'b3',
						type: 'dropdown',
						sentence: 'У меня болит ___ .',
						blank: 'живот',
						options: ['живот', 'стол', 'дом', 'книга'],
						correctAnswer: 0,
						explanation: {
							fr: 'Живот = ventre. "У меня болит живот" = J\'ai mal au ventre.',
							en: 'Живот = stomach/belly. "У меня болит живот" = My stomach hurts.',
						},
					},
					{
						id: 'b4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "oeil" en russe ?',
							en: 'How do you say "eye" in Russian?',
						},
						options: ['ухо', 'нос', 'глаз', 'рот'],
						correctAnswer: 2,
						explanation: {
							fr: 'Глаз = oeil. Pluriel: глаза (yeux).',
							en: 'Глаз = eye. Plural: глаза (eyes).',
						},
					},
					{
						id: 'b5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "сердце" ?',
							en: 'What does "сердце" mean?',
						},
						options: {
							fr: ['Poumon', 'Foie', 'Coeur', 'Estomac'],
							en: ['Lung', 'Liver', 'Heart', 'Stomach'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Сердце = coeur.',
							en: 'Сердце = heart.',
						},
					},
				],
				clothes: [
					{
						id: 'cl1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "chemise" en russe ?',
							en: 'How do you say "shirt" in Russian?',
						},
						options: ['брюки', 'рубашка', 'юбка', 'платье'],
						correctAnswer: 1,
						explanation: {
							fr: 'Рубашка = chemise.',
							en: 'Рубашка = shirt.',
						},
					},
					{
						id: 'cl2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "шапка" ?',
							en: 'What does "шапка" mean?',
						},
						options: {
							fr: ['Chaussures', 'Bonnet/Chapeau', 'Gants', 'Echarpe'],
							en: ['Shoes', 'Hat/Cap', 'Gloves', 'Scarf'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Шапка = bonnet ou chapeau d\'hiver.',
							en: 'Шапка = winter hat or cap.',
						},
					},
					{
						id: 'cl3',
						type: 'dropdown',
						sentence: 'Я надеваю ___ .',
						blank: 'куртку',
						options: ['куртку', 'стул', 'окно', 'книгу'],
						correctAnswer: 0,
						explanation: {
							fr: 'Куртка = veste/blouson. "Я надеваю куртку" = Je mets ma veste.',
							en: 'Куртка = jacket. "Я надеваю куртку" = I put on my jacket.',
						},
					},
					{
						id: 'cl4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "chaussures" en russe ?',
							en: 'How do you say "shoes" in Russian?',
						},
						options: ['носки', 'перчатки', 'обувь', 'шарф'],
						correctAnswer: 2,
						explanation: {
							fr: 'Обувь = chaussures (terme general).',
							en: 'Обувь = shoes/footwear (general term).',
						},
					},
					{
						id: 'cl5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "платье" ?',
							en: 'What does "платье" mean?',
						},
						options: {
							fr: ['Pantalon', 'Jupe', 'Robe', 'Pull'],
							en: ['Pants', 'Skirt', 'Dress', 'Sweater'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Платье = robe.',
							en: 'Платье = dress.',
						},
					},
				],
				time: [
					{
						id: 't1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "heure" en russe ?',
							en: 'How do you say "hour" in Russian?',
						},
						options: ['минута', 'час', 'секунда', 'день'],
						correctAnswer: 1,
						explanation: {
							fr: 'Час = heure.',
							en: 'Час = hour.',
						},
					},
					{
						id: 't2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "сегодня" ?',
							en: 'What does "сегодня" mean?',
						},
						options: {
							fr: ['Hier', 'Aujourd\'hui', 'Demain', 'Maintenant'],
							en: ['Yesterday', 'Today', 'Tomorrow', 'Now'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Сегодня = aujourd\'hui.',
							en: 'Сегодня = today.',
						},
					},
					{
						id: 't3',
						type: 'dropdown',
						sentence: '___ я иду в школу.',
						blank: 'Завтра',
						options: ['Завтра', 'Стол', 'Книга', 'Красный'],
						correctAnswer: 0,
						explanation: {
							fr: 'Завтра = demain. "Завтра я иду в школу" = Demain je vais a l\'ecole.',
							en: 'Завтра = tomorrow. "Завтра я иду в школу" = Tomorrow I go to school.',
						},
					},
					{
						id: 't4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "matin" en russe ?',
							en: 'How do you say "morning" in Russian?',
						},
						options: ['вечер', 'ночь', 'утро', 'день'],
						correctAnswer: 2,
						explanation: {
							fr: 'Утро = matin. "Доброе утро" = Bonjour (le matin).',
							en: 'Утро = morning. "Доброе утро" = Good morning.',
						},
					},
					{
						id: 't5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "вчера" ?',
							en: 'What does "вчера" mean?',
						},
						options: {
							fr: ['Demain', 'Aujourd\'hui', 'Hier', 'Toujours'],
							en: ['Tomorrow', 'Today', 'Yesterday', 'Always'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Вчера = hier.',
							en: 'Вчера = yesterday.',
						},
					},
				],
				days: [
					{
						id: 'd1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "lundi" en russe ?',
							en: 'How do you say "Monday" in Russian?',
						},
						options: ['вторник', 'понедельник', 'среда', 'пятница'],
						correctAnswer: 1,
						explanation: {
							fr: 'Понедельник = lundi.',
							en: 'Понедельник = Monday.',
						},
					},
					{
						id: 'd2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "суббота" ?',
							en: 'What does "суббота" mean?',
						},
						options: {
							fr: ['Vendredi', 'Samedi', 'Dimanche', 'Jeudi'],
							en: ['Friday', 'Saturday', 'Sunday', 'Thursday'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Суббота = samedi.',
							en: 'Суббота = Saturday.',
						},
					},
					{
						id: 'd3',
						type: 'dropdown',
						sentence: 'Мой день рождения в ___ .',
						blank: 'январе',
						options: ['январе', 'столе', 'книге', 'красном'],
						correctAnswer: 0,
						explanation: {
							fr: 'Январь = janvier. En russe, les mois prennent le cas prepositif apres "в".',
							en: 'Январь = January. In Russian, months take prepositional case after "в".',
						},
					},
					{
						id: 'd4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "decembre" en russe ?',
							en: 'How do you say "December" in Russian?',
						},
						options: ['ноябрь', 'октябрь', 'декабрь', 'сентябрь'],
						correctAnswer: 2,
						explanation: {
							fr: 'Декабрь = decembre.',
							en: 'Декабрь = December.',
						},
					},
					{
						id: 'd5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "воскресенье" ?',
							en: 'What does "воскресенье" mean?',
						},
						options: {
							fr: ['Samedi', 'Dimanche', 'Lundi', 'Mercredi'],
							en: ['Saturday', 'Sunday', 'Monday', 'Wednesday'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Воскресенье = dimanche.',
							en: 'Воскресенье = Sunday.',
						},
					},
				],
				places: [
					{
						id: 'pl1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "magasin" en russe ?',
							en: 'How do you say "shop/store" in Russian?',
						},
						options: ['школа', 'магазин', 'больница', 'аптека'],
						correctAnswer: 1,
						explanation: {
							fr: 'Магазин = magasin.',
							en: 'Магазин = shop/store.',
						},
					},
					{
						id: 'pl2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "вокзал" ?',
							en: 'What does "вокзал" mean?',
						},
						options: {
							fr: ['Aeroport', 'Gare', 'Hotel', 'Restaurant'],
							en: ['Airport', 'Train station', 'Hotel', 'Restaurant'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Вокзал = gare (ferroviaire).',
							en: 'Вокзал = train station.',
						},
					},
					{
						id: 'pl3',
						type: 'dropdown',
						sentence: 'Я иду в ___ .',
						blank: 'библиотеку',
						options: ['библиотеку', 'красную', 'большой', 'быстро'],
						correctAnswer: 0,
						explanation: {
							fr: 'Библиотека = bibliotheque. Avec "в" + accusatif pour indiquer la direction.',
							en: 'Библиотека = library. With "в" + accusative to indicate direction.',
						},
					},
					{
						id: 'pl4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "pharmacie" en russe ?',
							en: 'How do you say "pharmacy" in Russian?',
						},
						options: ['больница', 'поликлиника', 'аптека', 'магазин'],
						correctAnswer: 2,
						explanation: {
							fr: 'Аптека = pharmacie.',
							en: 'Аптека = pharmacy.',
						},
					},
					{
						id: 'pl5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "ресторан" ?',
							en: 'What does "ресторан" mean?',
						},
						options: {
							fr: ['Cafe', 'Restaurant', 'Bar', 'Cantine'],
							en: ['Cafe', 'Restaurant', 'Bar', 'Canteen'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Ресторан = restaurant.',
							en: 'Ресторан = restaurant.',
						},
					},
				],
				professions: [
					{
						id: 'pr1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "medecin" en russe ?',
							en: 'How do you say "doctor" in Russian?',
						},
						options: ['учитель', 'врач', 'инженер', 'повар'],
						correctAnswer: 1,
						explanation: {
							fr: 'Врач = medecin.',
							en: 'Врач = doctor.',
						},
					},
					{
						id: 'pr2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "учитель" ?',
							en: 'What does "учитель" mean?',
						},
						options: {
							fr: ['Etudiant', 'Professeur', 'Directeur', 'Eleve'],
							en: ['Student', 'Teacher', 'Director', 'Pupil'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Учитель = professeur/enseignant.',
							en: 'Учитель = teacher.',
						},
					},
					{
						id: 'pr3',
						type: 'dropdown',
						sentence: 'Мой папа - ___ .',
						blank: 'инженер',
						options: ['инженер', 'красивый', 'быстро', 'книга'],
						correctAnswer: 0,
						explanation: {
							fr: 'Инженер = ingenieur. "Мой папа - инженер" = Mon pere est ingenieur.',
							en: 'Инженер = engineer. "Мой папа - инженер" = My dad is an engineer.',
						},
					},
					{
						id: 'pr4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "cuisinier" en russe ?',
							en: 'How do you say "cook/chef" in Russian?',
						},
						options: ['официант', 'повар', 'продавец', 'водитель'],
						correctAnswer: 1,
						explanation: {
							fr: 'Повар = cuisinier/chef.',
							en: 'Повар = cook/chef.',
						},
					},
					{
						id: 'pr5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "программист" ?',
							en: 'What does "программист" mean?',
						},
						options: {
							fr: ['Journaliste', 'Programmeur', 'Musicien', 'Avocat'],
							en: ['Journalist', 'Programmer', 'Musician', 'Lawyer'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Программист = programmeur/developpeur.',
							en: 'Программист = programmer/developer.',
						},
					},
				],
				house: [
					{
						id: 'ho1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "cuisine" en russe ?',
							en: 'How do you say "kitchen" in Russian?',
						},
						options: ['спальня', 'кухня', 'ванная', 'гостиная'],
						correctAnswer: 1,
						explanation: {
							fr: 'Кухня = cuisine.',
							en: 'Кухня = kitchen.',
						},
					},
					{
						id: 'ho2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "кровать" ?',
							en: 'What does "кровать" mean?',
						},
						options: {
							fr: ['Table', 'Chaise', 'Lit', 'Armoire'],
							en: ['Table', 'Chair', 'Bed', 'Wardrobe'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Кровать = lit.',
							en: 'Кровать = bed.',
						},
					},
					{
						id: 'ho3',
						type: 'dropdown',
						sentence: 'Я сижу на ___ .',
						blank: 'стуле',
						options: ['стуле', 'книге', 'воде', 'красном'],
						correctAnswer: 0,
						explanation: {
							fr: 'Стул = chaise. "На стуле" = sur la chaise (cas prepositif).',
							en: 'Стул = chair. "На стуле" = on the chair (prepositional case).',
						},
					},
					{
						id: 'ho4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "fenetre" en russe ?',
							en: 'How do you say "window" in Russian?',
						},
						options: ['дверь', 'окно', 'стена', 'пол'],
						correctAnswer: 1,
						explanation: {
							fr: 'Окно = fenetre.',
							en: 'Окно = window.',
						},
					},
					{
						id: 'ho5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "ванная" ?',
							en: 'What does "ванная" mean?',
						},
						options: {
							fr: ['Chambre', 'Salon', 'Salle de bain', 'Couloir'],
							en: ['Bedroom', 'Living room', 'Bathroom', 'Hallway'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Ванная = salle de bain.',
							en: 'Ванная = bathroom.',
						},
					},
				],
				transport: [
					{
						id: 'tr1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "bus" en russe ?',
							en: 'How do you say "bus" in Russian?',
						},
						options: ['поезд', 'автобус', 'самолёт', 'метро'],
						correctAnswer: 1,
						explanation: {
							fr: 'Автобус = bus.',
							en: 'Автобус = bus.',
						},
					},
					{
						id: 'tr2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "самолёт" ?',
							en: 'What does "самолёт" mean?',
						},
						options: {
							fr: ['Train', 'Voiture', 'Avion', 'Bateau'],
							en: ['Train', 'Car', 'Airplane', 'Boat'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Самолёт = avion.',
							en: 'Самолёт = airplane.',
						},
					},
					{
						id: 'tr3',
						type: 'dropdown',
						sentence: 'Я еду на ___ .',
						blank: 'машине',
						options: ['машине', 'книге', 'столе', 'красной'],
						correctAnswer: 0,
						explanation: {
							fr: 'Машина = voiture. "На машине" = en voiture.',
							en: 'Машина = car. "На машине" = by car.',
						},
					},
					{
						id: 'tr4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "metro" en russe ?',
							en: 'How do you say "metro/subway" in Russian?',
						},
						options: ['трамвай', 'такси', 'метро', 'велосипед'],
						correctAnswer: 2,
						explanation: {
							fr: 'Метро = metro.',
							en: 'Метро = metro/subway.',
						},
					},
					{
						id: 'tr5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "велосипед" ?',
							en: 'What does "велосипед" mean?',
						},
						options: {
							fr: ['Moto', 'Velo', 'Scooter', 'Trottinette'],
							en: ['Motorcycle', 'Bicycle', 'Scooter', 'Kick scooter'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Велосипед = velo.',
							en: 'Велосипед = bicycle.',
						},
					},
				],
				verbs: [
					{
						id: 'vb1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "faire" en russe ?',
							en: 'How do you say "to do/make" in Russian?',
						},
						options: ['идти', 'делать', 'говорить', 'видеть'],
						correctAnswer: 1,
						explanation: {
							fr: 'Делать = faire.',
							en: 'Делать = to do/make.',
						},
					},
					{
						id: 'vb2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "читать" ?',
							en: 'What does "читать" mean?',
						},
						options: {
							fr: ['Ecrire', 'Lire', 'Ecouter', 'Parler'],
							en: ['To write', 'To read', 'To listen', 'To speak'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Читать = lire.',
							en: 'Читать = to read.',
						},
					},
					{
						id: 'vb3',
						type: 'dropdown',
						sentence: 'Я ___ по-русски.',
						blank: 'говорю',
						options: ['говорю', 'большой', 'красный', 'книга'],
						correctAnswer: 0,
						explanation: {
							fr: 'Говорить = parler. "Я говорю по-русски" = Je parle russe.',
							en: 'Говорить = to speak. "Я говорю по-русски" = I speak Russian.',
						},
					},
					{
						id: 'vb4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "vouloir" en russe ?',
							en: 'How do you say "to want" in Russian?',
						},
						options: ['мочь', 'хотеть', 'знать', 'любить'],
						correctAnswer: 1,
						explanation: {
							fr: 'Хотеть = vouloir.',
							en: 'Хотеть = to want.',
						},
					},
					{
						id: 'vb5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "работать" ?',
							en: 'What does "работать" mean?',
						},
						options: {
							fr: ['Jouer', 'Dormir', 'Travailler', 'Manger'],
							en: ['To play', 'To sleep', 'To work', 'To eat'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Работать = travailler.',
							en: 'Работать = to work.',
						},
					},
				],
				adjectives: [
					{
						id: 'adj1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "grand" en russe ?',
							en: 'How do you say "big" in Russian?',
						},
						options: ['маленький', 'большой', 'новый', 'старый'],
						correctAnswer: 1,
						explanation: {
							fr: 'Большой = grand.',
							en: 'Большой = big.',
						},
					},
					{
						id: 'adj2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "красивый" ?',
							en: 'What does "красивый" mean?',
						},
						options: {
							fr: ['Laid', 'Beau', 'Petit', 'Vieux'],
							en: ['Ugly', 'Beautiful', 'Small', 'Old'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Красивый = beau.',
							en: 'Красивый = beautiful.',
						},
					},
					{
						id: 'adj3',
						type: 'dropdown',
						sentence: 'Это ___ дом.',
						blank: 'новый',
						options: ['новый', 'быстро', 'книга', 'идти'],
						correctAnswer: 0,
						explanation: {
							fr: 'Новый = nouveau. "Это новый дом" = C\'est une nouvelle maison.',
							en: 'Новый = new. "Это новый дом" = This is a new house.',
						},
					},
					{
						id: 'adj4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "petit" en russe ?',
							en: 'How do you say "small" in Russian?',
						},
						options: ['большой', 'высокий', 'маленький', 'длинный'],
						correctAnswer: 2,
						explanation: {
							fr: 'Маленький = petit.',
							en: 'Маленький = small.',
						},
					},
					{
						id: 'adj5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "хороший" ?',
							en: 'What does "хороший" mean?',
						},
						options: {
							fr: ['Mauvais', 'Bon', 'Rapide', 'Lent'],
							en: ['Bad', 'Good', 'Fast', 'Slow'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Хороший = bon.',
							en: 'Хороший = good.',
						},
					},
				],
				weather: [
					{
						id: 'we1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "soleil" en russe ?',
							en: 'How do you say "sun" in Russian?',
						},
						options: ['дождь', 'снег', 'солнце', 'ветер'],
						correctAnswer: 2,
						explanation: {
							fr: 'Солнце = soleil.',
							en: 'Солнце = sun.',
						},
					},
					{
						id: 'we2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "холодно" ?',
							en: 'What does "холодно" mean?',
						},
						options: {
							fr: ['Chaud', 'Froid', 'Humide', 'Sec'],
							en: ['Hot', 'Cold', 'Humid', 'Dry'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Холодно = il fait froid.',
							en: 'Холодно = it\'s cold.',
						},
					},
					{
						id: 'we3',
						type: 'dropdown',
						sentence: 'Сегодня идёт ___ .',
						blank: 'дождь',
						options: ['дождь', 'стол', 'книга', 'большой'],
						correctAnswer: 0,
						explanation: {
							fr: 'Дождь = pluie. "Идёт дождь" = Il pleut.',
							en: 'Дождь = rain. "Идёт дождь" = It\'s raining.',
						},
					},
					{
						id: 'we4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "neige" en russe ?',
							en: 'How do you say "snow" in Russian?',
						},
						options: ['лёд', 'снег', 'туман', 'облако'],
						correctAnswer: 1,
						explanation: {
							fr: 'Снег = neige.',
							en: 'Снег = snow.',
						},
					},
					{
						id: 'we5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "жарко" ?',
							en: 'What does "жарко" mean?',
						},
						options: {
							fr: ['Froid', 'Chaud', 'Venteux', 'Nuageux'],
							en: ['Cold', 'Hot', 'Windy', 'Cloudy'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Жарко = il fait chaud.',
							en: 'Жарко = it\'s hot.',
						},
					},
				],
				emotions: [
					{
						id: 'em1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "content" en russe ?',
							en: 'How do you say "happy" in Russian?',
						},
						options: ['грустный', 'счастливый', 'злой', 'усталый'],
						correctAnswer: 1,
						explanation: {
							fr: 'Счастливый = content/heureux.',
							en: 'Счастливый = happy.',
						},
					},
					{
						id: 'em2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "грустный" ?',
							en: 'What does "грустный" mean?',
						},
						options: {
							fr: ['Content', 'Triste', 'Fache', 'Surpris'],
							en: ['Happy', 'Sad', 'Angry', 'Surprised'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Грустный = triste.',
							en: 'Грустный = sad.',
						},
					},
					{
						id: 'em3',
						type: 'dropdown',
						sentence: 'Я очень ___ .',
						blank: 'устал',
						options: ['устал', 'книга', 'большой', 'быстро'],
						correctAnswer: 0,
						explanation: {
							fr: 'Устал = fatigue. "Я очень устал" = Je suis tres fatigue.',
							en: 'Устал = tired. "Я очень устал" = I\'m very tired.',
						},
					},
					{
						id: 'em4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "en colere" en russe ?',
							en: 'How do you say "angry" in Russian?',
						},
						options: ['рад', 'злой', 'спокойный', 'весёлый'],
						correctAnswer: 1,
						explanation: {
							fr: 'Злой = en colere/fache.',
							en: 'Злой = angry.',
						},
					},
					{
						id: 'em5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "рад" ?',
							en: 'What does "рад" mean?',
						},
						options: {
							fr: ['Triste', 'Content', 'Inquiet', 'Ennuye'],
							en: ['Sad', 'Glad', 'Worried', 'Bored'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Рад = content/ravi.',
							en: 'Рад = glad.',
						},
					},
				],
				hobbies: [
					{
						id: 'hob1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "sport" en russe ?',
							en: 'How do you say "sport" in Russian?',
						},
						options: ['музыка', 'спорт', 'кино', 'танцы'],
						correctAnswer: 1,
						explanation: {
							fr: 'Спорт = sport.',
							en: 'Спорт = sport.',
						},
					},
					{
						id: 'hob2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "музыка" ?',
							en: 'What does "музыка" mean?',
						},
						options: {
							fr: ['Danse', 'Cinema', 'Musique', 'Peinture'],
							en: ['Dance', 'Cinema', 'Music', 'Painting'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Музыка = musique.',
							en: 'Музыка = music.',
						},
					},
					{
						id: 'hob3',
						type: 'dropdown',
						sentence: 'Я люблю ___ в футбол.',
						blank: 'играть',
						options: ['играть', 'большой', 'книга', 'красный'],
						correctAnswer: 0,
						explanation: {
							fr: 'Играть = jouer. "Играть в футбол" = jouer au football.',
							en: 'Играть = to play. "Играть в футбол" = to play football.',
						},
					},
					{
						id: 'hob4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "cinema" en russe ?',
							en: 'How do you say "cinema" in Russian?',
						},
						options: ['театр', 'кино', 'концерт', 'музей'],
						correctAnswer: 1,
						explanation: {
							fr: 'Кино = cinema.',
							en: 'Кино = cinema.',
						},
					},
					{
						id: 'hob5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "рисовать" ?',
							en: 'What does "рисовать" mean?',
						},
						options: {
							fr: ['Chanter', 'Danser', 'Dessiner', 'Cuisiner'],
							en: ['To sing', 'To dance', 'To draw', 'To cook'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Рисовать = dessiner.',
							en: 'Рисовать = to draw.',
						},
					},
				],
				school: [
					{
						id: 'sc1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "livre" en russe ?',
							en: 'How do you say "book" in Russian?',
						},
						options: ['тетрадь', 'книга', 'ручка', 'карандаш'],
						correctAnswer: 1,
						explanation: {
							fr: 'Книга = livre.',
							en: 'Книга = book.',
						},
					},
					{
						id: 'sc2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "ручка" ?',
							en: 'What does "ручка" mean?',
						},
						options: {
							fr: ['Crayon', 'Stylo', 'Gomme', 'Regle'],
							en: ['Pencil', 'Pen', 'Eraser', 'Ruler'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Ручка = stylo.',
							en: 'Ручка = pen.',
						},
					},
					{
						id: 'sc3',
						type: 'dropdown',
						sentence: 'Я учусь в ___ .',
						blank: 'школе',
						options: ['школе', 'большой', 'книга', 'красный'],
						correctAnswer: 0,
						explanation: {
							fr: 'Школа = ecole. "Я учусь в школе" = J\'etudie a l\'ecole.',
							en: 'Школа = school. "Я учусь в школе" = I study at school.',
						},
					},
					{
						id: 'sc4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "etudiant" en russe ?',
							en: 'How do you say "student" in Russian?',
						},
						options: ['учитель', 'студент', 'директор', 'ученик'],
						correctAnswer: 1,
						explanation: {
							fr: 'Студент = etudiant (universite). Ученик = eleve (ecole).',
							en: 'Студент = student (university). Ученик = pupil (school).',
						},
					},
					{
						id: 'sc5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "урок" ?',
							en: 'What does "урок" mean?',
						},
						options: {
							fr: ['Examen', 'Lecon', 'Pause', 'Devoir'],
							en: ['Exam', 'Lesson', 'Break', 'Homework'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Урок = lecon/cours.',
							en: 'Урок = lesson.',
						},
					},
				],
				nature: [
					{
						id: 'na1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "arbre" en russe ?',
							en: 'How do you say "tree" in Russian?',
						},
						options: ['цветок', 'дерево', 'трава', 'лист'],
						correctAnswer: 1,
						explanation: {
							fr: 'Дерево = arbre.',
							en: 'Дерево = tree.',
						},
					},
					{
						id: 'na2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "море" ?',
							en: 'What does "море" mean?',
						},
						options: {
							fr: ['Lac', 'Riviere', 'Mer', 'Ocean'],
							en: ['Lake', 'River', 'Sea', 'Ocean'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Море = mer.',
							en: 'Море = sea.',
						},
					},
					{
						id: 'na3',
						type: 'dropdown',
						sentence: 'В лесу много ___ .',
						blank: 'деревьев',
						options: ['деревьев', 'столов', 'книг', 'красных'],
						correctAnswer: 0,
						explanation: {
							fr: 'Дерево = arbre. "Много деревьев" = beaucoup d\'arbres (genitif pluriel).',
							en: 'Дерево = tree. "Много деревьев" = many trees (genitive plural).',
						},
					},
					{
						id: 'na4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "montagne" en russe ?',
							en: 'How do you say "mountain" in Russian?',
						},
						options: ['река', 'озеро', 'гора', 'поле'],
						correctAnswer: 2,
						explanation: {
							fr: 'Гора = montagne.',
							en: 'Гора = mountain.',
						},
					},
					{
						id: 'na5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "цветок" ?',
							en: 'What does "цветок" mean?',
						},
						options: {
							fr: ['Arbre', 'Fleur', 'Herbe', 'Feuille'],
							en: ['Tree', 'Flower', 'Grass', 'Leaf'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Цветок = fleur.',
							en: 'Цветок = flower.',
						},
					},
				],
				drinks: [
					{
						id: 'dr1',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "eau" en russe ?',
							en: 'How do you say "water" in Russian?',
						},
						options: ['молоко', 'вода', 'сок', 'чай'],
						correctAnswer: 1,
						explanation: {
							fr: 'Вода = eau.',
							en: 'Вода = water.',
						},
					},
					{
						id: 'dr2',
						type: 'mcq',
						question: {
							fr: 'Que signifie "чай" ?',
							en: 'What does "чай" mean?',
						},
						options: {
							fr: ['Cafe', 'The', 'Jus', 'Lait'],
							en: ['Coffee', 'Tea', 'Juice', 'Milk'],
						},
						correctAnswer: 1,
						explanation: {
							fr: 'Чай = the.',
							en: 'Чай = tea.',
						},
					},
					{
						id: 'dr3',
						type: 'dropdown',
						sentence: 'Я пью ___ каждое утро.',
						blank: 'кофе',
						options: ['кофе', 'стол', 'книгу', 'большой'],
						correctAnswer: 0,
						explanation: {
							fr: 'Кофе = cafe. "Я пью кофе" = Je bois du cafe.',
							en: 'Кофе = coffee. "Я пью кофе" = I drink coffee.',
						},
					},
					{
						id: 'dr4',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "lait" en russe ?',
							en: 'How do you say "milk" in Russian?',
						},
						options: ['вода', 'сок', 'молоко', 'пиво'],
						correctAnswer: 2,
						explanation: {
							fr: 'Молоко = lait.',
							en: 'Молоко = milk.',
						},
					},
					{
						id: 'dr5',
						type: 'mcq',
						question: {
							fr: 'Que signifie "сок" ?',
							en: 'What does "сок" mean?',
						},
						options: {
							fr: ['Eau', 'The', 'Jus', 'Vin'],
							en: ['Water', 'Tea', 'Juice', 'Wine'],
						},
						correctAnswer: 2,
						explanation: {
							fr: 'Сок = jus.',
							en: 'Сок = juice.',
						},
					},
				],
			},
			grammar: [
				{
					id: 'g1',
					type: 'mcq',
					question: {
						fr: 'Quel est le pronom personnel pour "je" en russe ?',
						en: 'What is the personal pronoun for "I" in Russian?',
					},
					options: ['Ты', 'Он', 'Я', 'Мы'],
					correctAnswer: 2,
					explanation: {
						fr: 'Я = Je, Ты = Tu, Он = Il, Мы = Nous',
						en: 'Я = I, Ты = You, Он = He, Мы = We',
					},
				},
				{
					id: 'g2',
					type: 'dropdown',
					sentence: '___ студент.',
					blank: 'Я',
					options: ['Я', 'Меня', 'Мне', 'Мной'],
					correctAnswer: 0,
					explanation: {
						fr: 'Я студент = Je suis etudiant. Le sujet "Я" est au nominatif.',
						en: 'Я студент = I am a student. The subject "Я" is in the nominative case.',
					},
				},
				{
					id: 'g3',
					type: 'mcq',
					question: {
						fr: 'Comment forme-t-on le pluriel de "книга" (livre) ?',
						en: 'How do you form the plural of "книга" (book)?',
					},
					options: ['книги', 'книгы', 'книгаи', 'книгас'],
					correctAnswer: 0,
					explanation: {
						fr: 'Le pluriel de книга est книги. Les noms feminins en -а prennent -и au pluriel.',
						en: 'The plural of книга is книги. Feminine nouns ending in -а take -и in the plural.',
					},
				},
				{
					id: 'g4',
					type: 'dropdown',
					sentence: 'Это ___ дом.',
					blank: 'мой',
					options: ['моя', 'мой', 'моё', 'мои'],
					correctAnswer: 1,
					explanation: {
						fr: 'Дом (maison) est masculin, donc on utilise "мой" (mon).',
						en: 'Дом (house) is masculine, so we use "мой" (my).',
					},
				},
				{
					id: 'g5',
					type: 'mcq',
					question: {
						fr: 'Quel genre est le mot "окно" (fenetre) ?',
						en: 'What gender is the word "окно" (window)?',
					},
					options: {
						fr: ['Masculin', 'Feminin', 'Neutre', 'Pluriel'],
						en: ['Masculine', 'Feminine', 'Neuter', 'Plural'],
					},
					correctAnswer: 2,
					explanation: {
						fr: 'Окно se termine par -о, c\'est donc un mot neutre.',
						en: 'Окно ends in -о, so it is a neuter word.',
					},
				},
			],
			// Verbs and conjugation exercises
			verbs: {
				aspects: [
					{
						id: 'va1',
						type: 'mcq',
						question: {
							fr: 'Quelle forme est imperfective ?',
							en: 'Which form is imperfective?',
						},
						options: ['читать', 'прочитать', 'прочитал', 'прочитаю'],
						correctAnswer: 0,
						explanation: {
							fr: 'Читать est imperfectif (action en cours/repetee). Прочитать est perfectif (action achevee).',
							en: 'Читать is imperfective (ongoing/repeated action). Прочитать is perfective (completed action).',
						},
					},
					{
						id: 'va2',
						type: 'dropdown',
						sentence: 'Каждый день он ___ книгу.',
						blank: 'читает',
						options: ['читает', 'прочитает', 'прочитал', 'читал'],
						correctAnswer: 0,
						explanation: {
							fr: 'Avec "каждый день" (chaque jour), on utilise l\'imperfectif pour une action repetee.',
							en: 'With "каждый день" (every day), we use imperfective for repeated action.',
						},
					},
					{
						id: 'va3',
						type: 'mcq',
						question: {
							fr: 'Quelle paire est correcte (imperfectif/perfectif) ?',
							en: 'Which pair is correct (imperfective/perfective)?',
						},
						options: ['писать/написать', 'написать/писать', 'писать/писал', 'написать/напишу'],
						correctAnswer: 0,
						explanation: {
							fr: 'Писать (imperfectif) / Написать (perfectif). L\'imperfectif vient toujours en premier.',
							en: 'Писать (imperfective) / Написать (perfective). Imperfective always comes first.',
						},
					},
					{
						id: 'va4',
						type: 'dropdown',
						sentence: 'Вчера он ___ письмо и отправил его.',
						blank: 'написал',
						options: ['писал', 'написал', 'пишет', 'напишет'],
						correctAnswer: 1,
						explanation: {
							fr: 'Avec une action achevee dans le passe + resultat, on utilise le perfectif.',
							en: 'With a completed past action + result, we use perfective.',
						},
					},
					{
						id: 'va5',
						type: 'mcq',
						question: {
							fr: 'Quel verbe utiliser: "Я долго ___ эту книгу" (J\'ai lu ce livre longtemps) ?',
							en: 'Which verb to use: "Я долго ___ эту книгу" (I read this book for a long time)?',
						},
						options: ['читал', 'прочитал', 'читаю', 'прочитаю'],
						correctAnswer: 0,
						explanation: {
							fr: '"Долго" (longtemps) indique une duree, donc on utilise l\'imperfectif.',
							en: '"Долго" (for a long time) indicates duration, so we use imperfective.',
						},
					},
				],
				prefixes: [
					{
						id: 'vp1',
						type: 'mcq',
						question: {
							fr: 'Que signifie le prefixe "вы-" dans "выходить" ?',
							en: 'What does the prefix "вы-" mean in "выходить"?',
						},
						options: {
							fr: ['Sortir de', 'Entrer dans', 'Passer a travers', 'Arriver'],
							en: ['Exit from', 'Enter into', 'Pass through', 'Arrive'],
						},
						correctAnswer: 0,
						explanation: {
							fr: 'Вы- indique le mouvement vers l\'exterieur. Выходить = sortir.',
							en: 'Вы- indicates movement outward. Выходить = to exit.',
						},
					},
					{
						id: 'vp2',
						type: 'dropdown',
						sentence: 'Он ___ в комнату.',
						blank: 'входит',
						options: ['входит', 'выходит', 'уходит', 'приходит'],
						correctAnswer: 0,
						explanation: {
							fr: 'В- indique l\'entree. Входит в комнату = entre dans la piece.',
							en: 'В- indicates entry. Входит в комнату = enters the room.',
						},
					},
					{
						id: 'vp3',
						type: 'mcq',
						question: {
							fr: 'Quel prefixe signifie "arriver" ?',
							en: 'Which prefix means "to arrive"?',
						},
						options: ['при-', 'у-', 'вы-', 'в-'],
						correctAnswer: 0,
						explanation: {
							fr: 'При- indique l\'arrivee. Приходить = arriver (a pied).',
							en: 'При- indicates arrival. Приходить = to arrive (on foot).',
						},
					},
					{
						id: 'vp4',
						type: 'dropdown',
						sentence: 'Поезд ___ из Москвы в 9 часов.',
						blank: 'уезжает',
						options: ['приезжает', 'уезжает', 'въезжает', 'выезжает'],
						correctAnswer: 1,
						explanation: {
							fr: 'У- indique le depart definitif. Уезжает из = part de.',
							en: 'У- indicates permanent departure. Уезжает из = leaves from.',
						},
					},
					{
						id: 'vp5',
						type: 'mcq',
						question: {
							fr: 'Completez: "Самолёт ___ в аэропорт" (L\'avion atterrit)',
							en: 'Complete: "Самолёт ___ в аэропорт" (The plane lands)',
						},
						options: ['прилетает', 'улетает', 'вылетает', 'залетает'],
						correctAnswer: 0,
						explanation: {
							fr: 'При- + летать = arriver en volant. Прилетает = atterrit/arrive.',
							en: 'При- + летать = to arrive by flying. Прилетает = lands/arrives.',
						},
					},
				],
				motion: [
					{
						id: 'vm1',
						type: 'mcq',
						question: {
							fr: 'Quelle est la difference entre "идти" et "ходить" ?',
							en: 'What is the difference between "идти" and "ходить"?',
						},
						options: {
							fr: ['Unidirectionnel vs Multidirectionnel', 'Passe vs Present', 'Perfectif vs Imperfectif', 'Formel vs Informel'],
							en: ['Unidirectional vs Multidirectional', 'Past vs Present', 'Perfective vs Imperfective', 'Formal vs Informal'],
						},
						correctAnswer: 0,
						explanation: {
							fr: 'Идти = aller dans une direction. Ходить = aller regulierement ou dans plusieurs directions.',
							en: 'Идти = to go in one direction. Ходить = to go regularly or in multiple directions.',
						},
					},
					{
						id: 'vm2',
						type: 'dropdown',
						sentence: 'Сейчас я ___ в школу.',
						blank: 'иду',
						options: ['иду', 'хожу', 'шёл', 'ходил'],
						correctAnswer: 0,
						explanation: {
							fr: 'Avec "сейчас" (maintenant), on utilise "идти" car c\'est un mouvement en cours dans une direction.',
							en: 'With "сейчас" (now), we use "идти" because it\'s ongoing movement in one direction.',
						},
					},
					{
						id: 'vm3',
						type: 'mcq',
						question: {
							fr: 'Completez: "Каждый день я ___ на работу" (Je vais au travail chaque jour)',
							en: 'Complete: "Каждый день я ___ на работу" (I go to work every day)',
						},
						options: ['хожу', 'иду', 'пойду', 'шёл'],
						correctAnswer: 0,
						explanation: {
							fr: 'Avec "каждый день", on utilise le verbe multidirectionnel "ходить" pour une action habituelle.',
							en: 'With "каждый день", we use multidirectional "ходить" for a habitual action.',
						},
					},
					{
						id: 'vm4',
						type: 'dropdown',
						sentence: 'Машина ___ по улице.',
						blank: 'едет',
						options: ['идёт', 'едет', 'ходит', 'ездит'],
						correctAnswer: 1,
						explanation: {
							fr: 'Pour les vehicules, on utilise "ехать/ездить" (pas "идти/ходить").',
							en: 'For vehicles, we use "ехать/ездить" (not "идти/ходить").',
						},
					},
					{
						id: 'vm5',
						type: 'mcq',
						question: {
							fr: 'Quel verbe pour "nager" (unidirectionnel) ?',
							en: 'Which verb for "to swim" (unidirectional)?',
						},
						options: ['плыть', 'плавать', 'плывать', 'плынуть'],
						correctAnswer: 0,
						explanation: {
							fr: 'Плыть = nager dans une direction. Плавать = nager en general ou regulierement.',
							en: 'Плыть = to swim in one direction. Плавать = to swim in general or regularly.',
						},
					},
				],
				reflexive: [
					{
						id: 'vr1',
						type: 'mcq',
						question: {
							fr: 'Que signifie "-ся" a la fin d\'un verbe ?',
							en: 'What does "-ся" at the end of a verb mean?',
						},
						options: {
							fr: ['Action sur soi-meme', 'Action passee', 'Action future', 'Action negative'],
							en: ['Action on oneself', 'Past action', 'Future action', 'Negative action'],
						},
						correctAnswer: 0,
						explanation: {
							fr: '-Ся rend le verbe reflechi: мыть (laver) → мыться (se laver).',
							en: '-Ся makes the verb reflexive: мыть (to wash) → мыться (to wash oneself).',
						},
					},
					{
						id: 'vr2',
						type: 'dropdown',
						sentence: 'Утром я ___.',
						blank: 'умываюсь',
						options: ['умываю', 'умываюсь', 'умывать', 'умыться'],
						correctAnswer: 1,
						explanation: {
							fr: 'Умываюсь = je me lave (le visage). Action sur soi-meme.',
							en: 'Умываюсь = I wash myself (face). Action on oneself.',
						},
					},
					{
						id: 'vr3',
						type: 'mcq',
						question: {
							fr: 'Quelle est la forme reflechie de "одевать" (habiller) ?',
							en: 'What is the reflexive form of "одевать" (to dress)?',
						},
						options: ['одеваться', 'одеватся', 'одевасься', 'одеватьсья'],
						correctAnswer: 0,
						explanation: {
							fr: 'Одевать → Одеваться. Le -ть se transforme en -ться.',
							en: 'Одевать → Одеваться. The -ть changes to -ться.',
						},
					},
					{
						id: 'vr4',
						type: 'dropdown',
						sentence: 'Дети ___ в парке.',
						blank: 'играют',
						options: ['играют', 'играются', 'играть', 'играться'],
						correctAnswer: 0,
						explanation: {
							fr: 'Играть n\'a pas besoin de -ся car jouer n\'est pas une action sur soi-meme.',
							en: 'Играть doesn\'t need -ся because playing is not an action on oneself.',
						},
					},
					{
						id: 'vr5',
						type: 'mcq',
						question: {
							fr: 'Comment dit-on "Je me leve" ?',
							en: 'How do you say "I get up"?',
						},
						options: ['Я встаю', 'Я встаюсь', 'Я вставаюсь', 'Я встанусь'],
						correctAnswer: 0,
						explanation: {
							fr: 'Встаю (je me leve) - ce verbe n\'est pas reflechi malgre le sens.',
							en: 'Встаю (I get up) - this verb is not reflexive despite the meaning.',
						},
					},
				],
			},
		},
		intermediate: {
			vocabulary: [],
			grammar: [],
			verbs: {
				aspects: [],
				prefixes: [],
				motion: [],
			},
		},
		advanced: {
			vocabulary: [],
			grammar: [],
			verbs: {
				aspects: [],
				idioms: [],
			},
		},
	},
}

// ============================================
// DECORATIVE COMPONENTS
// ============================================
const OrnateFrame = ({ children, className, isDark }) => {
	return (
		<div className={cn(
			'relative rounded-2xl overflow-hidden',
			'border-2',
			isDark ? 'border-violet-500/20 bg-slate-900/80' : 'border-violet-600/10 bg-white/90',
			'shadow-lg',
			isDark ? 'shadow-black/20' : 'shadow-slate-200/50',
			className
		)}>
			{children}
		</div>
	)
}

// ============================================
// LEVEL SELECTOR
// ============================================
const LevelSelector = ({ selectedLevel, onSelectLevel, isDark, t }) => {
	const levels = [
		{ key: 'beginner', icon: SignalLow, color: 'emerald', label: t('beginner') },
		{ key: 'intermediate', icon: SignalMedium, color: 'violet', label: t('intermediate') },
		{ key: 'advanced', icon: SignalHigh, color: 'amber', label: t('advanced') },
	]

	const colorClasses = {
		emerald: {
			active: 'from-emerald-500 to-teal-600 border-emerald-400/50',
			inactive: isDark ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-400/50 text-emerald-600',
		},
		violet: {
			active: 'from-violet-500 to-purple-600 border-violet-400/50',
			inactive: isDark ? 'border-violet-500/30 text-violet-400' : 'border-violet-400/50 text-violet-600',
		},
		amber: {
			active: 'from-amber-500 to-orange-600 border-amber-400/50',
			inactive: isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-400/50 text-amber-600',
		},
	}

	return (
		<div className="space-y-4">
			<h3 className={cn(
				'text-lg font-bold flex items-center gap-2',
				isDark ? 'text-slate-200' : 'text-slate-700'
			)}>
				<Target className="w-5 h-5" />
				{t('selectLevel')}
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{levels.map((level) => {
					const Icon = level.icon
					const isSelected = selectedLevel === level.key
					const colors = colorClasses[level.color]

					return (
						<button
							key={level.key}
							onClick={() => onSelectLevel(level.key)}
							className={cn(
								'p-4 rounded-xl font-bold text-sm',
								'border-2 transition-all duration-300',
								'flex flex-col items-center gap-2',
								isSelected
									? ['bg-gradient-to-br text-white shadow-lg', colors.active, 'scale-105']
									: [isDark ? 'bg-slate-800/50' : 'bg-white', colors.inactive, 'hover:scale-102']
							)}
						>
							<Icon className="w-8 h-8" />
							<span>{level.label}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}

// ============================================
// MODE SELECTOR (Questions or Duration)
// ============================================
const ModeSelector = ({ mode, setMode, questionCount, setQuestionCount, duration, setDuration, isDark, t }) => {
	const questionOptions = [10, 15, 20, 30, 50]
	const durationOptions = [5, 10, 15, 20] // minutes

	return (
		<div className="space-y-4">
			<h3 className={cn(
				'text-lg font-bold flex items-center gap-2',
				isDark ? 'text-slate-200' : 'text-slate-700'
			)}>
				<Clock className="w-5 h-5" />
				{t('selectMode')}
			</h3>

			{/* Mode toggle */}
			<div className={cn(
				'flex gap-2 p-1 rounded-xl',
				isDark ? 'bg-slate-800/50' : 'bg-slate-100'
			)}>
				<button
					onClick={() => setMode('questions')}
					className={cn(
						'flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all',
						'flex items-center justify-center gap-2',
						mode === 'questions'
							? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
							: isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'
					)}
				>
					<Hash className="w-4 h-4" />
					{t('byQuestions')}
				</button>
				<button
					onClick={() => setMode('duration')}
					className={cn(
						'flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all',
						'flex items-center justify-center gap-2',
						mode === 'duration'
							? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
							: isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'
					)}
				>
					<Clock className="w-4 h-4" />
					{t('byDuration')}
				</button>
			</div>

			{/* Options */}
			<div className="flex flex-wrap gap-2 justify-center">
				{mode === 'questions' ? (
					questionOptions.map((count) => (
						<button
							key={count}
							onClick={() => setQuestionCount(count)}
							className={cn(
								'px-4 py-2 rounded-xl font-bold text-sm',
								'border-2 transition-all',
								questionCount === count
									? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg'
									: isDark
										? 'bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
										: 'bg-white border-cyan-200 text-cyan-600 hover:bg-cyan-50'
							)}
						>
							{count} {t('questions')}
						</button>
					))
				) : (
					durationOptions.map((mins) => (
						<button
							key={mins}
							onClick={() => setDuration(mins)}
							className={cn(
								'px-4 py-2 rounded-xl font-bold text-sm',
								'border-2 transition-all',
								duration === mins
									? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-lg'
									: isDark
										? 'bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
										: 'bg-white border-cyan-200 text-cyan-600 hover:bg-cyan-50'
							)}
						>
							{mins} min
						</button>
					))
				)}
			</div>
		</div>
	)
}

// ============================================
// TYPE SELECTOR (Vocabulary or Grammar)
// ============================================
const TypeSelector = ({ selectedType, onSelectType, isDark, t }) => {
	const types = [
		{ key: 'vocabulary', icon: BookOpen, color: 'emerald', label: t('vocabulary') },
		{ key: 'grammar', icon: Brain, color: 'violet', label: t('grammar') },
		{ key: 'verbs', icon: Languages, color: 'amber', label: t('verbs') },
	]

	return (
		<div className="space-y-4">
			<h3 className={cn(
				'text-lg font-bold flex items-center gap-2',
				isDark ? 'text-slate-200' : 'text-slate-700'
			)}>
				<Sparkles className="w-5 h-5" />
				{t('selectType')}
			</h3>
			<div className="grid grid-cols-3 gap-3">
				{types.map((type) => {
					const Icon = type.icon
					const isSelected = selectedType === type.key

					return (
						<button
							key={type.key}
							onClick={() => onSelectType(type.key)}
							className={cn(
								'p-4 rounded-xl font-bold text-sm',
								'border-2 transition-all duration-300',
								'flex flex-col items-center gap-2',
								isSelected
									? type.color === 'emerald'
										? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400/50 shadow-lg scale-105'
										: type.color === 'amber'
											? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400/50 shadow-lg scale-105'
											: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-400/50 shadow-lg scale-105'
									: isDark
										? 'bg-slate-800/50 hover:scale-102'
										: 'bg-white hover:scale-102',
								!isSelected && type.color === 'emerald' && (isDark ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-200 text-emerald-600'),
								!isSelected && type.color === 'violet' && (isDark ? 'border-violet-500/30 text-violet-400' : 'border-violet-200 text-violet-600'),
								!isSelected && type.color === 'amber' && (isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-200 text-amber-600')
							)}
						>
							<Icon className="w-8 h-8" />
							<span>{type.label}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}

// ============================================
// THEME SELECTOR (For Vocabulary)
// ============================================
const ThemeSelector = ({ themes, selectedTheme, onSelectTheme, isDark, t, locale }) => {
	const allThemesLabel = getLocalizedText({ fr: 'Tous les themes', en: 'All themes' }, locale)
	const isAllSelected = selectedTheme === 'all'

	return (
		<div className="space-y-4">
			<h3 className={cn(
				'text-lg font-bold flex items-center gap-2',
				isDark ? 'text-slate-200' : 'text-slate-700'
			)}>
				<BookOpen className="w-5 h-5" />
				{t('selectTheme')}
			</h3>

			{/* All themes option */}
			<button
				onClick={() => onSelectTheme('all')}
				className={cn(
					'w-full p-4 rounded-xl font-bold text-sm',
					'border-2 transition-all duration-300',
					'flex items-center justify-center gap-3',
					isAllSelected
						? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-400/50 shadow-lg scale-[1.02]'
						: isDark
							? 'bg-slate-800/50 border-violet-500/30 text-violet-400 hover:scale-[1.01] hover:border-violet-400/50'
							: 'bg-white border-violet-200 text-violet-600 hover:scale-[1.01] hover:border-violet-300'
				)}
			>
				<span className="text-2xl">🎯</span>
				<span>{allThemesLabel}</span>
				<span className={cn(
					'text-xs px-2 py-0.5 rounded-full',
					isAllSelected
						? 'bg-white/20 text-white'
						: isDark
							? 'bg-violet-500/20 text-violet-300'
							: 'bg-violet-100 text-violet-600'
				)}>
					{themes.length} {getLocalizedText({ fr: 'themes', en: 'themes' }, locale)}
				</span>
			</button>

			{/* Individual themes */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{themes.map((theme) => {
					const isSelected = selectedTheme === theme.key
					const label = getLocalizedText(theme.label, locale)

					return (
						<button
							key={theme.key}
							onClick={() => onSelectTheme(theme.key)}
							className={cn(
								'p-4 rounded-xl font-bold text-sm',
								'border-2 transition-all duration-300',
								'flex flex-col items-center gap-2',
								isSelected
									? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-teal-400/50 shadow-lg scale-105'
									: isDark
										? 'bg-slate-800/50 border-teal-500/30 text-teal-400 hover:scale-102 hover:border-teal-400/50'
										: 'bg-white border-teal-200 text-teal-600 hover:scale-102 hover:border-teal-300'
							)}
						>
							<span className="text-2xl">{theme.icon}</span>
							<span>{label}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}

// ============================================
// MCQ QUESTION COMPONENT
// ============================================
const MCQQuestion = ({ question, onAnswer, answered, selectedAnswer, isDark, t, locale }) => {
	const isCorrect = selectedAnswer === question.correctAnswer
	const questionText = getLocalizedText(question.question, locale)
	const options = getLocalizedOptions(question.options, locale)
	const explanation = getLocalizedText(question.explanation, locale)

	return (
		<div className="space-y-6">
			<h3 className={cn(
				'text-xl font-bold text-center',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				{questionText}
			</h3>

			<div className="grid gap-3">
				{options.map((option, index) => {
					const isSelected = selectedAnswer === index
					const isCorrectOption = index === question.correctAnswer

					return (
						<button
							key={index}
							onClick={() => !answered && onAnswer(index)}
							disabled={answered}
							className={cn(
								'p-4 rounded-xl font-semibold text-left',
								'border-2 transition-all duration-300',
								'flex items-center gap-3',
								answered
									? isCorrectOption
										? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
										: isSelected
											? 'bg-rose-500/20 border-rose-500 text-rose-400'
											: isDark
												? 'bg-slate-800/50 border-slate-700 text-slate-500'
												: 'bg-slate-100 border-slate-200 text-slate-400'
									: isSelected
										? 'bg-violet-500/20 border-violet-500 text-violet-400 scale-102'
										: isDark
											? 'bg-slate-800/50 border-slate-600 text-slate-200 hover:border-violet-500/50 hover:scale-102'
											: 'bg-white border-slate-200 text-slate-700 hover:border-violet-400 hover:scale-102'
							)}
						>
							<span className={cn(
								'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
								answered && isCorrectOption
									? 'bg-emerald-500 text-white'
									: answered && isSelected
										? 'bg-rose-500 text-white'
										: isSelected
											? 'bg-violet-500 text-white'
											: isDark
												? 'bg-slate-700 text-slate-300'
												: 'bg-slate-200 text-slate-600'
							)}>
								{String.fromCharCode(65 + index)}
							</span>
							<span className="flex-1">{option}</span>
							{answered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
							{answered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500" />}
						</button>
					)
				})}
			</div>

			{answered && explanation && (
				<div className={cn(
					'p-4 rounded-xl',
					isCorrect
						? 'bg-emerald-500/10 border border-emerald-500/30'
						: 'bg-amber-500/10 border border-amber-500/30'
				)}>
					<p className={cn(
						'text-sm',
						isDark ? 'text-slate-300' : 'text-slate-600'
					)}>
						💡 {explanation}
					</p>
				</div>
			)}
		</div>
	)
}

// ============================================
// MULTI-FILL QUESTION COMPONENT
// ============================================
const MultiFillQuestion = ({ question, onAnswer, answered, selectedAnswer, isDark, t, locale }) => {
	const [answers, setAnswers] = useState({})
	const options = question.options || []
	const sentences = question.sentences || []
	const questionText = getLocalizedText(question.question, locale)
	const explanation = getLocalizedText(question.explanation, locale)

	// Check if all answers are correct
	const allCorrect = sentences.every((s, i) => answers[i] === s.correct)
	const allAnswered = Object.keys(answers).length === sentences.length

	const handleSelectAnswer = (sentenceIndex, optionIndex) => {
		if (answered) return
		const newAnswers = { ...answers, [sentenceIndex]: optionIndex }
		setAnswers(newAnswers)

		// If all sentences are answered, submit
		if (Object.keys(newAnswers).length === sentences.length) {
			// Calculate how many are correct
			const correctCount = sentences.filter((s, i) => newAnswers[i] === s.correct).length
			// For multi_fill, we pass the number of correct answers
			onAnswer(correctCount)
		}
	}

	return (
		<div className="space-y-6">
			<h3 className={cn(
				'text-xl font-bold text-center',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				{questionText}
			</h3>

			{/* Options to choose from */}
			<div className="flex flex-wrap justify-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
				{options.map((opt, i) => (
					<span
						key={i}
						className={cn(
							'px-3 py-1.5 rounded-lg font-medium text-sm',
							isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'
						)}
					>
						{opt}
					</span>
				))}
			</div>

			{/* Sentences to complete */}
			<div className="space-y-4">
				{sentences.map((sentence, sIndex) => {
					const parts = sentence.text.split('___')
					const selectedOpt = answers[sIndex]
					const isCorrectAnswer = answered && selectedOpt === sentence.correct
					const isWrongAnswer = answered && selectedOpt !== undefined && selectedOpt !== sentence.correct

					return (
						<div
							key={sIndex}
							className={cn(
								'p-4 rounded-xl border-2 transition-all',
								answered
									? isCorrectAnswer
										? 'bg-emerald-500/10 border-emerald-500'
										: isWrongAnswer
										? 'bg-rose-500/10 border-rose-500'
										: isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
									: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
							)}
						>
							<div className="flex items-center flex-wrap gap-2">
								<span className={cn(
									'text-lg',
									isDark ? 'text-slate-200' : 'text-slate-800'
								)}>
									{parts[0]}
								</span>

								{/* Dropdown for this sentence */}
								<select
									value={selectedOpt ?? ''}
									onChange={(e) => handleSelectAnswer(sIndex, parseInt(e.target.value))}
									disabled={answered}
									className={cn(
										'px-3 py-2 rounded-lg font-semibold text-center min-w-[120px]',
										'border-2 transition-all cursor-pointer',
										answered
											? isCorrectAnswer
												? 'bg-emerald-500 text-white border-emerald-600'
												: isWrongAnswer
												? 'bg-rose-500 text-white border-rose-600'
												: isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-600'
											: selectedOpt !== undefined
											? 'bg-violet-500 text-white border-violet-600'
											: isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
									)}
								>
									<option value="" disabled>___</option>
									{options.map((opt, oIndex) => (
										<option key={oIndex} value={oIndex}>{opt}</option>
									))}
								</select>

								<span className={cn(
									'text-lg',
									isDark ? 'text-slate-200' : 'text-slate-800'
								)}>
									{parts[1] || ''}
								</span>

								{/* Show correct answer if wrong */}
								{answered && isWrongAnswer && (
									<span className="ml-2 text-sm text-emerald-500 font-medium">
										→ {options[sentence.correct]}
									</span>
								)}
							</div>
						</div>
					)
				})}
			</div>

			{answered && explanation && (
				<div className={cn(
					'p-4 rounded-xl',
					allCorrect
						? 'bg-emerald-500/10 border border-emerald-500/30'
						: 'bg-amber-500/10 border border-amber-500/30'
				)}>
					<p className={cn(
						'text-sm',
						isDark ? 'text-slate-300' : 'text-slate-600'
					)}>
						💡 {explanation}
					</p>
				</div>
			)}
		</div>
	)
}

// ============================================
// DROPDOWN QUESTION COMPONENT
// ============================================
const DropdownQuestion = ({ question, onAnswer, answered, selectedAnswer, isDark, t, locale }) => {
	const isCorrect = selectedAnswer === question.correctAnswer
	const parts = question.sentence.split('___')
	const options = getLocalizedOptions(question.options, locale)
	const explanation = getLocalizedText(question.explanation, locale)

	return (
		<div className="space-y-6">
			<h3 className={cn(
				'text-lg font-medium text-center mb-2',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				{t('completeTheSentence')}
			</h3>

			<div className={cn(
				'text-2xl font-bold text-center flex items-center justify-center gap-2 flex-wrap',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				<span>{parts[0]}</span>
				<select
					value={selectedAnswer !== null ? selectedAnswer : ''}
					onChange={(e) => !answered && onAnswer(parseInt(e.target.value))}
					disabled={answered}
					className={cn(
						'px-4 py-2 rounded-xl font-bold text-lg',
						'border-2 transition-all cursor-pointer',
						'focus:outline-none focus:ring-2 focus:ring-violet-500/50',
						answered
							? isCorrect
								? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
								: 'bg-rose-500/20 border-rose-500 text-rose-400'
							: isDark
								? 'bg-slate-800 border-violet-500/30 text-violet-400'
								: 'bg-white border-violet-200 text-violet-600'
					)}
				>
					<option value="" disabled>___</option>
					{options.map((option, index) => (
						<option key={index} value={index}>{option}</option>
					))}
				</select>
				<span>{parts[1]}</span>
			</div>

			{answered && (
				<div className="text-center">
					{isCorrect ? (
						<div className="flex items-center justify-center gap-2 text-emerald-500">
							<CheckCircle2 className="w-6 h-6" />
							<span className="font-bold">{t('correct')}</span>
						</div>
					) : (
						<div className="space-y-2">
							<div className="flex items-center justify-center gap-2 text-rose-500">
								<XCircle className="w-6 h-6" />
								<span className="font-bold">{t('incorrect')}</span>
							</div>
							<p className={cn(
								'text-sm',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}>
								{t('correctAnswerWas')}: <strong className="text-emerald-500">{options[question.correctAnswer]}</strong>
							</p>
						</div>
					)}
				</div>
			)}

			{answered && explanation && (
				<div className={cn(
					'p-4 rounded-xl',
					isCorrect
						? 'bg-emerald-500/10 border border-emerald-500/30'
						: 'bg-amber-500/10 border border-amber-500/30'
				)}>
					<p className={cn(
						'text-sm',
						isDark ? 'text-slate-300' : 'text-slate-600'
					)}>
						💡 {explanation}
					</p>
				</div>
			)}
		</div>
	)
}

// ============================================
// TRAINING SESSION
// ============================================
const TrainingSession = ({ questions, onFinish, isDark, t, locale, isLoggedIn }) => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [answered, setAnswered] = useState(false)
	const [selectedAnswer, setSelectedAnswer] = useState(null)
	const [results, setResults] = useState([])
	const [startTime] = useState(Date.now())

	const currentQuestion = questions[currentIndex]
	const progress = ((currentIndex + 1) / questions.length) * 100

	// Count current correct answers for display
	const currentCorrectCount = results.filter(r => r.correct).length

	const handleAnswer = (answer) => {
		// For multi_fill, answer is the count of correct answers in that question
		// For mcq/dropdown, answer is the selected index
		const isMultiFill = currentQuestion.type === 'multi_fill'
		const isCorrect = isMultiFill
			? answer === currentQuestion.sentences?.length // All correct
			: answer === currentQuestion.correctAnswer

		setSelectedAnswer(answer)
		setAnswered(true)
		setResults([...results, {
			questionId: currentQuestion.id,
			correct: isCorrect,
			// For multi_fill, store partial score
			partialScore: isMultiFill ? answer : (isCorrect ? 1 : 0),
			maxScore: isMultiFill ? currentQuestion.sentences?.length : 1,
		}])
	}

	const handleNext = async () => {
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(currentIndex + 1)
			setAnswered(false)
			setSelectedAnswer(null)
		} else {
			// Session complete - calculate results
			const duration = Math.round((Date.now() - startTime) / 1000)

			// For multi_fill, count partial scores
			const isCurrentMultiFill = currentQuestion.type === 'multi_fill'
			const currentScore = isCurrentMultiFill
				? selectedAnswer
				: (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)

			// Sum up all correct answers (including partial for multi_fill)
			const correctCount = results.reduce((sum, r) => sum + (r.partialScore || (r.correct ? 1 : 0)), 0) + currentScore

			// Award XP at end of session if logged in
			let xpEarned = 0
			let goldEarned = 0

			if (isLoggedIn && correctCount > 0) {
				try {
					const result = await completeTrainingSessionAction(correctCount, questions.length)
					if (result.success) {
						xpEarned = result.xpAwarded
						goldEarned = result.goldAwarded
					}
				} catch (error) {
					console.error('Error completing training session:', error)
				}
			}

			onFinish({
				totalQuestions: questions.length,
				correctAnswers: correctCount,
				duration,
				xpEarned,
				goldEarned,
			})
		}
	}

	return (
		<div className="space-y-6">
			{/* Progress bar */}
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
						{t('question')} {currentIndex + 1} / {questions.length}
					</span>
					<div className="flex items-center gap-3">
						{currentCorrectCount > 0 && (
							<span className="flex items-center gap-1 text-emerald-500 font-semibold">
								<CheckCircle2 className="w-4 h-4" />
								{currentCorrectCount}
							</span>
						)}
						<span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
							{Math.round(progress)}%
						</span>
					</div>
				</div>
				<div className={cn(
					'h-2 rounded-full overflow-hidden',
					isDark ? 'bg-slate-800' : 'bg-slate-200'
				)}>
					<div
						className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Question */}
			<OrnateFrame isDark={isDark} className="p-6">
				{currentQuestion.type === 'mcq' ? (
					<MCQQuestion
						question={currentQuestion}
						onAnswer={handleAnswer}
						answered={answered}
						selectedAnswer={selectedAnswer}
						isDark={isDark}
						t={t}
						locale={locale}
					/>
				) : currentQuestion.type === 'multi_fill' ? (
					<MultiFillQuestion
						question={currentQuestion}
						onAnswer={handleAnswer}
						answered={answered}
						selectedAnswer={selectedAnswer}
						isDark={isDark}
						t={t}
						locale={locale}
					/>
				) : (
					<DropdownQuestion
						question={currentQuestion}
						onAnswer={handleAnswer}
						answered={answered}
						selectedAnswer={selectedAnswer}
						isDark={isDark}
						t={t}
						locale={locale}
					/>
				)}
			</OrnateFrame>

			{/* Next button */}
			{answered && (
				<div className="flex justify-center">
					<button
						onClick={handleNext}
						className={cn(
							'px-8 py-3 rounded-xl font-bold',
							'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
							'border-2 border-violet-400/50',
							'shadow-lg shadow-violet-500/30',
							'hover:scale-105 transition-all duration-300',
							'flex items-center gap-2'
						)}
					>
						{currentIndex < questions.length - 1 ? (
							<>
								{t('next')}
								<ChevronLeft className="w-5 h-5 rotate-180" />
							</>
						) : (
							<>
								{t('finish')}
								<Trophy className="w-5 h-5" />
							</>
						)}
					</button>
				</div>
			)}
		</div>
	)
}

// ============================================
// RESULTS SCREEN
// ============================================
const ResultsScreen = ({ results, onRestart, onBack, isDark, t }) => {
	const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100)
	const minutes = Math.floor(results.duration / 60)
	const seconds = results.duration % 60
	const hasXpRewards = results.xpEarned > 0 || results.goldEarned > 0

	return (
		<OrnateFrame isDark={isDark} className="p-8 text-center">
			<div className={cn(
				'w-24 h-24 mx-auto mb-6 rounded-full',
				'bg-gradient-to-br from-amber-400 to-amber-600',
				'flex items-center justify-center',
				'shadow-lg shadow-amber-500/30'
			)}>
				<Trophy className="w-12 h-12 text-white" />
			</div>

			<h2 className={cn(
				'text-3xl font-black mb-2',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				{t('sessionComplete')}
			</h2>

			<p className={cn(
				'text-lg mb-4',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				{percentage >= 80 ? t('excellent') : percentage >= 60 ? t('goodJob') : t('keepPracticing')}
			</p>

			{/* XP/Gold Rewards Banner */}
			{hasXpRewards && (
				<div className={cn(
					'mb-6 p-4 rounded-xl',
					'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
					'border-2 border-amber-400/50'
				)}>
					<div className="flex items-center justify-center gap-6">
						{results.xpEarned > 0 && (
							<div className="flex items-center gap-2">
								<Zap className="w-6 h-6 text-amber-500" />
								<span className="text-2xl font-black text-amber-500">+{results.xpEarned} XP</span>
							</div>
						)}
						{results.goldEarned > 0 && (
							<div className="flex items-center gap-2">
								<Coins className="w-6 h-6 text-yellow-500" />
								<span className="text-2xl font-black text-yellow-500">+{results.goldEarned}</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				<div className={cn(
					'p-4 rounded-xl',
					isDark ? 'bg-slate-800/50' : 'bg-slate-100'
				)}>
					<div className={cn(
						'text-3xl font-black',
						percentage >= 80 ? 'text-emerald-500' : percentage >= 60 ? 'text-amber-500' : 'text-rose-500'
					)}>
						{percentage}%
					</div>
					<div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
						{t('score')}
					</div>
				</div>
				<div className={cn(
					'p-4 rounded-xl',
					isDark ? 'bg-slate-800/50' : 'bg-slate-100'
				)}>
					<div className={cn(
						'text-3xl font-black',
						isDark ? 'text-cyan-400' : 'text-cyan-600'
					)}>
						{results.correctAnswers}/{results.totalQuestions}
					</div>
					<div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
						{t('correctAnswers')}
					</div>
				</div>
				<div className={cn(
					'p-4 rounded-xl',
					isDark ? 'bg-slate-800/50' : 'bg-slate-100'
				)}>
					<div className={cn(
						'text-3xl font-black',
						isDark ? 'text-violet-400' : 'text-violet-600'
					)}>
						{minutes}:{seconds.toString().padStart(2, '0')}
					</div>
					<div className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
						{t('time')}
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-4 justify-center">
				<button
					onClick={onBack}
					className={cn(
						'px-6 py-3 rounded-xl font-bold',
						'border-2 transition-all duration-300',
						isDark
							? 'bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-500'
							: 'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
						'flex items-center gap-2'
					)}
				>
					<ChevronLeft className="w-5 h-5" />
					{t('backToSetup')}
				</button>
				<button
					onClick={onRestart}
					className={cn(
						'px-6 py-3 rounded-xl font-bold',
						'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
						'border-2 border-violet-400/50',
						'shadow-lg shadow-violet-500/30',
						'hover:scale-105 transition-all duration-300',
						'flex items-center gap-2'
					)}
				>
					<RotateCcw className="w-5 h-5" />
					{t('tryAgain')}
				</button>
			</div>
		</OrnateFrame>
	)
}

// ============================================
// MAIN COMPONENT
// ============================================
const TrainingPageClient = () => {
	const t = useTranslations('training')
	const tCommon = useTranslations('common')
	const locale = useLocale()
	const { isDark } = useThemeMode()
	const { userLearningLanguage, isUserLoggedIn, isUserAdmin } = useUserContext()

	// All hooks must be called before any early returns
	const [step, setStep] = useState('setup') // setup, theme-select, training, results
	const [selectedLevel, setSelectedLevel] = useState('beginner')
	const [mode, setMode] = useState('questions')
	const [questionCount, setQuestionCount] = useState(10)
	const [duration, setDuration] = useState(5)
	const [selectedType, setSelectedType] = useState('vocabulary')
	const [selectedTheme, setSelectedTheme] = useState(null)
	const [questions, setQuestions] = useState([])
	const [results, setResults] = useState(null)

	// Get available themes based on selected type and level
	const availableThemes = useMemo(() => {
		const lang = userLearningLanguage || 'ru'
		if (selectedType === 'verbs') {
			return verbsThemes[lang]?.[selectedLevel] || verbsThemes.ru?.[selectedLevel] || []
		}
		return vocabularyThemes[lang]?.[selectedLevel] || vocabularyThemes.ru?.[selectedLevel] || []
	}, [selectedLevel, selectedType, userLearningLanguage])

	const startTraining = useCallback(() => {
		const lang = userLearningLanguage || 'ru'
		let questionsPool = []

		if ((selectedType === 'vocabulary' || selectedType === 'verbs') && selectedTheme) {
			const dataKey = selectedType === 'vocabulary' ? 'vocabulary' : 'verbs'
			if (selectedTheme === 'all') {
				// Get questions from ALL themes
				const typeData = trainingQuestions[lang]?.[selectedLevel]?.[dataKey] || {}
				const fallbackData = trainingQuestions.ru?.beginner?.[dataKey] || {}

				// Collect questions from all themes
				Object.keys(typeData).forEach(themeKey => {
					const themeQuestions = typeData[themeKey] || []
					questionsPool = [...questionsPool, ...themeQuestions]
				})

				// Fallback to Russian if no questions
				if (questionsPool.length === 0) {
					Object.keys(fallbackData).forEach(themeKey => {
						const themeQuestions = fallbackData[themeKey] || []
						questionsPool = [...questionsPool, ...themeQuestions]
					})
				}
			} else {
				// Get questions for the selected theme
				questionsPool = trainingQuestions[lang]?.[selectedLevel]?.[dataKey]?.[selectedTheme] || []

				// Fallback to Russian if no questions for this language
				if (questionsPool.length === 0) {
					questionsPool = trainingQuestions.ru?.beginner?.[dataKey]?.[selectedTheme] || []
				}
			}
		} else if (selectedType === 'grammar') {
			questionsPool = trainingQuestions[lang]?.[selectedLevel]?.grammar || []

			// Fallback to Russian grammar if no questions
			if (questionsPool.length === 0) {
				questionsPool = trainingQuestions.ru?.beginner?.grammar || []
			}
		}

		const shuffled = [...questionsPool].sort(() => Math.random() - 0.5)
		setQuestions(shuffled.slice(0, Math.min(questionCount, shuffled.length)))
		setStep('training')
	}, [selectedLevel, selectedType, selectedTheme, questionCount, userLearningLanguage])

	// Handle type selection - if vocabulary or verbs, go to theme selection
	const handleTypeSelect = (type) => {
		setSelectedType(type)
		if (type === 'vocabulary' || type === 'verbs') {
			// Reset theme when changing to vocabulary or verbs
			setSelectedTheme(null)
		}
	}

	// Proceed to next step after setup
	const handleProceed = () => {
		if (selectedType === 'vocabulary' || selectedType === 'verbs') {
			setStep('theme-select')
		} else {
			startTraining()
		}
	}

	// Admin-only access for now (beta feature) - early return AFTER all hooks
	if (!isUserAdmin) {
		return (
			<div className={cn(
				'min-h-screen flex items-center justify-center p-4',
				isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-violet-50'
			)}>
				<OrnateFrame isDark={isDark} className="max-w-md p-8 text-center">
					<div className="text-6xl mb-4">🔒</div>
					<h1 className={cn(
						'text-2xl font-bold mb-2',
						isDark ? 'text-white' : 'text-slate-800'
					)}>
						{tCommon('accessDenied')}
					</h1>
					<p className={cn(
						'text-sm',
						isDark ? 'text-slate-400' : 'text-slate-600'
					)}>
						{tCommon('accessDeniedMessage')}
					</p>
				</OrnateFrame>
			</div>
		)
	}

	const handleFinish = (sessionResults) => {
		setResults(sessionResults)
		setStep('results')
	}

	const handleRestart = () => {
		setQuestions([])
		setResults(null)
		startTraining()
	}

	const handleBackToSetup = () => {
		setStep('setup')
		setQuestions([])
		setResults(null)
		setSelectedTheme(null)
	}

	const handleBackToThemes = () => {
		setStep('theme-select')
		setQuestions([])
		setResults(null)
	}

	return (
		<div className={cn(
			'min-h-screen pt-16 md:pt-24 pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
				: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-violet-50/30 to-slate-50'
		)}>
			<div className="relative max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-4">
						<div className={cn(
							'w-14 h-14 rounded-full flex items-center justify-center',
							'bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600',
							'shadow-lg shadow-violet-500/40'
						)}>
							<Dumbbell className="w-7 h-7 text-white" />
						</div>
					</div>
					<h1 className={cn(
						'text-3xl sm:text-4xl font-black mb-2',
						isDark ? 'text-slate-100' : 'text-slate-800'
					)}>
						{t('pageTitle')}
					</h1>
					<p className={cn(
						'text-sm md:text-base',
						isDark ? 'text-slate-400' : 'text-slate-600'
					)}>
						{t('pageSubtitle')}
					</p>
				</div>

				{/* Content */}
				{step === 'setup' && (
					<OrnateFrame isDark={isDark} className="p-6 space-y-8">
						<LevelSelector
							selectedLevel={selectedLevel}
							onSelectLevel={setSelectedLevel}
							isDark={isDark}
							t={t}
						/>

						<ModeSelector
							mode={mode}
							setMode={setMode}
							questionCount={questionCount}
							setQuestionCount={setQuestionCount}
							duration={duration}
							setDuration={setDuration}
							isDark={isDark}
							t={t}
						/>

						<TypeSelector
							selectedType={selectedType}
							onSelectType={handleTypeSelect}
							isDark={isDark}
							t={t}
						/>

						{/* Next/Start button */}
						<div className="flex justify-center pt-4">
							<button
								onClick={handleProceed}
								className={cn(
									'px-8 py-4 rounded-xl font-bold text-lg',
									'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
									'border-2 border-emerald-400/50',
									'shadow-lg shadow-emerald-500/30',
									'hover:scale-105 transition-all duration-300',
									'flex items-center gap-3'
								)}
							>
								{selectedType === 'vocabulary' || selectedType === 'verbs' ? (
									<>
										{t('chooseTheme')}
										<ChevronLeft className="w-6 h-6 rotate-180" />
									</>
								) : (
									<>
										<Play className="w-6 h-6" />
										{t('startTraining')}
									</>
								)}
							</button>
						</div>
					</OrnateFrame>
				)}

				{/* Theme Selection Step */}
				{step === 'theme-select' && (
					<OrnateFrame isDark={isDark} className="p-6 space-y-8">
						{/* Back button */}
						<button
							onClick={() => setStep('setup')}
							className={cn(
								'flex items-center gap-2 text-sm font-semibold',
								isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700',
								'transition-colors'
							)}
						>
							<ChevronLeft className="w-4 h-4" />
							{t('backToSetup')}
						</button>

						<ThemeSelector
							themes={availableThemes}
							selectedTheme={selectedTheme}
							onSelectTheme={setSelectedTheme}
							isDark={isDark}
							t={t}
							locale={locale}
						/>

						{/* Start button */}
						<div className="flex justify-center pt-4">
							<button
								onClick={startTraining}
								disabled={!selectedTheme}
								className={cn(
									'px-8 py-4 rounded-xl font-bold text-lg',
									'border-2 transition-all duration-300',
									'flex items-center gap-3',
									selectedTheme
										? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30 hover:scale-105'
										: isDark
											? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
											: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
								)}
							>
								<Play className="w-6 h-6" />
								{t('startTraining')}
							</button>
						</div>
					</OrnateFrame>
				)}

				{step === 'training' && questions.length > 0 && (
					<TrainingSession
						questions={questions}
						onFinish={handleFinish}
						isDark={isDark}
						t={t}
						locale={locale}
						isLoggedIn={isUserLoggedIn}
					/>
				)}

				{step === 'results' && results && (
					<ResultsScreen
						results={results}
						onRestart={handleRestart}
						onBack={handleBackToSetup}
						isDark={isDark}
						t={t}
					/>
				)}
			</div>
		</div>
	)
}

export default TrainingPageClient
