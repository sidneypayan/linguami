import { configureStore } from '@reduxjs/toolkit'
import contentSlice from './content/contentSlice'
// ✅ MIGRATION STATUS:
// - wordsSlice → React Query + TranslationContext (COMPLETED)
// - lessonsSlice → React Query (lib/lessons-client.js) (COMPLETED)
// - coursesSlice → React Query (lib/courses-client.js) (COMPLETED)
// - cardsSlice → React Context (context/flashcards.js) (COMPLETED)
// - contentSlice → Pending migration to React Query

export const store = configureStore({
	reducer: {
		content: contentSlice, // ⚠️ Admin CRUD operations - pending migration
	},
})
