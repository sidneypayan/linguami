import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import { useUserContext } from '../context/user'
import { Box, Divider, Stack, Button, TextField, Typography, InputAdornment } from '@mui/material'
import Link from 'next/link'

const initialState = {
    email: '',
    password: '',
}

const Signin = () => {
    const { t } = useTranslation('register')
    const [values, setValues] = useState(initialState)
    const [formState, setFormState] = useState('signin')

    const { login, register, loginWithThirdPartyOAuth } = useUserContext()

    const handleChange = e => {
        const name = e.target.name
        const value = e.target.value

        setValues({ ...values, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()

        const { email, password } = values

        if (!email || !password) {
            toast.error('Veuillez renseigner tous les champs')
        }

        if (formState === 'signup') {
            if (password && password.length < 6) {
                toast.error("Veuillez saisir un mot de passe d'au moins 6 charactères")
                return
            }

            return register(values)
        }

        return login(values)
    }

    return <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Box width='300px' >
            <Typography textAlign='center' mb={2} variant="h5">{formState === 'signin' ? t('signin') : t('signup')}</Typography>
            <Stack width='100%' gap={2} mb={2} sx={{ flexDirection: 'row' }}>
                <Button variant="outlined"
                    fullWidth
                    sx={{ padding: '0.75rem 1rem' }}
                    onClick={() => loginWithThirdPartyOAuth('facebook')}>
                    <Image
                        src='/img/facebook.png'
                        alt='facebook'
                        width={25}
                        height={25}
                    ></Image>

                </Button>
                <Button variant="outlined"
                    fullWidth
                    sx={{ padding: '0.75rem 1rem' }}
                    onClick={() => loginWithThirdPartyOAuth('google')}>
                    <Image
                        src='/img/google.png'
                        alt='google'
                        width={25}
                        height={25}
                    ></Image>

                </Button>
            </Stack>
            <Divider sx={{ marginBottom: '1rem' }}>{t('or')}</Divider>
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

                <TextField
                    fullWidth
                    onChange={handleChange}
                    type='password'
                    label={t('password')}
                    name='password'
                    value={values.password}
                    autoComplete='current-password'
                    id='password'
                    InputProps={{
                        endAdornment: (
                            formState === 'signin' ? <InputAdornment position='end'>
                                <Link href='/update-password'>
                                    <Button>Oublié ?</Button>
                                </Link>
                            </InputAdornment> : null
                        ),
                    }}
                />

                <Button fullWidth type='submit' variant="contained" size='large'>
                    {formState === 'signin' ? t('signin') : t('signup')}
                </Button>

                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {formState === 'signin' ? t('noaccount') : t('haveaccount')}
                    <Button onClick={() => setFormState(formState === 'signin' ? 'signup' : 'signin')} sx={{ marginLeft: '.5rem', textTransform: 'capitalize', textDecoration: 'underline' }} size='small'  >Cliquez ici</Button>
                </Typography>
            </form>
        </Box>
    </Stack >
}

export default Signin