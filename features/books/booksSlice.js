import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const initialState = {
	books: [],
	books_loading: false,
	books_error: false,
	filtered_books: [],
	chapters: [],
	chapters_loading: false,
	chapters_error: false,
	level: 'all',
	totalBooks: 0,
	numOfPages: 1,
	page: 1,
	booksPerPage: 10,
	sliceStart: 0,
	sliceEnd: 10,
}

export const getBooks = createAsyncThunk(
	'books/getBooks',
	async (param, thunkAPI) => {
		const { userLearningLanguage: lang } = param

		try {
			let { data: books, error } = await supabase
				.from('books')
				.select('*')
				.eq('lang', lang)
				.order('id', { ascending: false })
			return books
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getBookChapters = createAsyncThunk(
	'books/getBookChapters',
	async (param, thunkAPI) => {
		const { userLearningLanguage: lang } = param

		try {
			let { data: bookChapters, error } = await supabase
				.from('book-chapters')
				.select('*')
				.eq('lang', lang)
				.order('id', { ascending: false })
			return bookChapters
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const resetPagination = state => {
	state.totalBooks = state.filtered_books.length
	state.numOfPages = Math.ceil(state.totalBooks / state.BooksPerPage)

	state.sliceStart = 0
	state.sliceEnd = 10
	state.page = 1
}

const booksSlice = createSlice({
	name: 'books',
	initialState,
	reducers: {
		filterBooks: (state, { payload }) => {
			const { section, level } = payload
			state.level = level

			state.filtered_books = state.books.filter(
				item => item.section === section && item.level === level
			)
			resetPagination(state)
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getBooks.pending, state => {
				state.books_loading = true
			})
			.addCase(getBooks.fulfilled, (state, { payload }) => {
				state.books_loading = false
				state.books = payload
				state.filtered_books = payload
				state.totalBooks = state.filtered_books.length
				state.numOfPages = Math.ceil(state.totalBooks / state.booksPerPage)
			})
			.addCase(getBooks.rejected, (state, { payload }) => {
				state.books_loading = false
				state.books_error = payload
			})
			.addCase(getBookChapters.pending, state => {
				state.chapters_loading = true
			})
			.addCase(getBookChapters.fulfilled, (state, { payload }) => {
				state.chapters_loading = false
				state.chapters = payload
			})
			.addCase(getBookChapters.rejected, (state, { payload }) => {
				state.chapters_loading = false
				state.chapters_error = payload
			})
	},
})

export default booksSlice.reducer

export const { filterBooks } = booksSlice.actions
