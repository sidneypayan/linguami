import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Stack, Box, Button, Typography, TextField } from '@mui/material'
import { useUserContext } from '../context/user'

const initialState = {
    email: '',

}


const AskPassword = () => {
    const { t } = useTranslation('register')
    const [values, setValues] = useState(initialState)
    const { askNewPassword } = useUserContext()

    const handleChange = e => {
        const name = e.target.name
        const value = e.target.value

        setValues({ ...values, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()

        const { email } = values

        if (!email) {
            toast.error('Veuillez renseigner tous les champs')
        }

        return askNewPassword(email)
    }



    return (
        <>
            <Stack height='calc(100vh - 144px)' alignItems='center' justifyContent='center'>
                <Box width='500px'>
                    <Typography variant='h4' textAlign='center' mb={4}>Réinitialiser son mot de passe</Typography>
                    <form style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }} onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            onChange={handleChange}
                            type='email'
                            label={t('email')}
                            name='email'
                            value={values.email}
                            autoComplete='email'
                            id='email'
                        />
                        <Button fullWidth type='submit' variant="contained" size='large'>
                            Envoyer une demande
                        </Button>
                    </form>
                </Box>

            </Stack>
        </>
    )
}

export default AskPassword