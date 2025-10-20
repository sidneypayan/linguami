// /pages/set-password.js
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Stack, Box, Button, Typography, TextField } from '@mui/material'
import { useUserContext } from '../context/user'
import { supabase } from '../lib/supabase' // ⬅️ important

const AskPassword = () => {
	const { t } = useTranslation('register')
	const router = useRouter()
	const { setNewPassword } = useUserContext()

	const [password, setPassword] = useState('')
	// const [confirm, setConfirm] = useState('') // optionnel
	const [canUpdate, setCanUpdate] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		// 1) Vérifie qu'une session est active (elle est créée par le lien "recovery")
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!mounted) return
			setCanUpdate(!!session)
			setLoading(false)
			if (!session) {
				toast.error(
					'Lien invalide ou expiré. Merci de relancer la procédure depuis « Mot de passe oublié ».'
				)
			}
		})

		// 2) Optionnel : active le formulaire si l'event PASSWORD_RECOVERY arrive après coup
		const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
			event => {
				if (event === 'PASSWORD_RECOVERY') {
					setCanUpdate(true)
					setLoading(false)
				}
			}
		)

		return () => {
			mounted = false
			subscription?.unsubscribe?.()
		}
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		if (!canUpdate) {
			toast.error(
				"Session de récupération absente — recommencez depuis l'email."
			)
			return
		}
		if (!password) {
			toast.error('Veuillez saisir un mot de passe')
			return
		}
		if (password.length < 8) {
			toast.error("Veuillez saisir un mot de passe d'au moins 8 caractères")
			return
		}
		// if (password !== confirm) { toast.error('Les mots de passe ne correspondent pas'); return }

		try {
			setLoading(true)
			await setNewPassword(password) // appelle supabase.auth.updateUser({ password }) + redirect
			// setNewPassword gère déjà la redirection et le toast dans ton UserContext
		} finally {
			setLoading(false)
		}
	}

	return (
		<Stack
			height='calc(100vh - 144px)'
			alignItems='center'
			justifyContent='center'>
			<Box width='500px' maxWidth='90vw'>
				<Typography variant='h4' textAlign='center' mb={4}>
					{t('updatePassword')}
				</Typography>

				<form
					style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}
					onSubmit={handleSubmit}>
					<TextField
						fullWidth
						onChange={e => setPassword(e.target.value)}
						type='password'
						placeholder='Nouveau mot de passe'
						name='password'
						value={password}
						label={t('password')}
						disabled={loading || !canUpdate}
					/>
					{/* <TextField
            fullWidth
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Confirmer le mot de passe"
            name="confirm"
            value={confirm}
            label={t('confirmPassword')}
            disabled={loading || !canUpdate}
          /> */}
					<Button
						fullWidth
						type='submit'
						variant='contained'
						size='large'
						disabled={loading || !canUpdate}>
						{t('confirm')}
					</Button>

					{!canUpdate && !loading && (
						<Typography
							variant='body2'
							color='text.secondary'
							textAlign='center'>
							Ce lien ne permet plus de modifier le mot de passe. Relancez la
							procédure « Mot de passe oublié ».
						</Typography>
					)}
				</form>
			</Box>
		</Stack>
	)
}

export default AskPassword
