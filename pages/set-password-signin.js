import { useRouter } from 'next/router'
import Link from 'next/link'
import { Stack, Box, Button, Typography } from '@mui/material'


const SignInBeforePasswordUpdate = () => {

    const { query: { confirmation_url } } = useRouter()

    return (
        <>
            <Stack height='calc(100vh - 144px)' alignItems='center' justifyContent='center'>
                <Box width='500px'>
                    <Typography variant='h4' textAlign='center' mb={4}>Veuillez cliquer afin de redéfinir votre mot de passe</Typography>
                    <Link href={`${confirmation_url + '/set-password' ?? ''}`}>
                        <Button fullWidth variant="contained" size="large">Redéfinir mon mot de passe</Button>
                    </Link>
                </Box>

            </Stack>
        </>
    )
}

export default SignInBeforePasswordUpdate