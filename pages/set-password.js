import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Stack, Box, Button, Typography, TextField } from '@mui/material'
import { useUserContext } from '../context/user'


const AskPassword = () => {
    const { t } = useTranslation('register')
    const { setNewPassword } = useUserContext()

    const [password, setPassword] = useState('')



    const handleSubmit = e => {
        e.preventDefault()
        if (!password) {
            toast.error('Veuillez saisir un mot de passe')
            return
        }

        if (password && password.length < 8) {
            toast.error("Veuillez saisir un mot de passe d'au moins 8 charactères")
            return
        }
        setNewPassword(password)
    }



    return (
        <>
            <Stack height='calc(100vh - 144px)' alignItems='center' justifyContent='center'>
                <Box width='500px'>
                    <Typography variant='h4' textAlign='center' mb={4}>{t('updatePassword')}</Typography>
                    <form style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }} onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            onChange={e => setPassword(e.target.value)}
                            type='password'
                            placeholder='Nouveau mot de passe'
                            name='password'
                            value={password}
                            label={t('password')}
                        />
                        <Button fullWidth type='submit' variant="contained" size='large'>
                            {t('confirm')}
                        </Button>
                    </form>
                </Box>

            </Stack>
        </>
    )
}

export default AskPassword