import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import supabase from '../../utils/supabase'

const initialState = {
	userData: supabase.auth.user() || null,
}

console.log(initialState.userData)

export const registerUser = createAsyncThunk(
	'user/registerUser',
	async (data, thunkAPI) => {
		const { email, password } = data
		let { user, error } = await supabase.auth.signUp({ email, password })

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return user
	}
)

export const loginUser = createAsyncThunk(
	'user/loginUser',
	async (data, thunkAPI) => {
		console.log(data)
		const { email, password } = data
		let { user, error } = await supabase.auth.signIn({
			email,
			password,
		})

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return user
	}
)

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logoutUser: (state, { payload }) => {
			state.userData = null
			supabase.auth.signOut()

			if (payload) {
				toast.success(payload)
			}
		},
	},
	extraReducers: {
		[registerUser.pending]: state => {},
		[registerUser.fulfilled]: (state, { payload }) => {
			const { identities } = payload
			state.userData = payload
			if (identities.length) {
				toast.success(
					'Vous êtes bien enregistré, veuillez vérifier votre email'
				)
			} else {
				toast.error('Un utilisateur est déjà enregistré avec cet email')
			}
		},
		[registerUser.rejected]: (state, { payload }) => {
			toast.error(payload)
		},
		[loginUser.pending]: state => {},
		[loginUser.fulfilled]: (state, { payload }) => {
			state.userData = payload
			toast.success('Vous êtes bien connecté')
		},
		[loginUser.rejected]: (state, { payload }) => {
			const { message } = payload
			toast.error(message)
		},
	},
})

export const { logoutUser } = userSlice.actions
export default userSlice.reducer
