import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Stack, Box, Button, Typography } from '@mui/material'


const ConfirmSignUp = () => {
    const { t } = useTranslation('register')
    const { query: { confirmation_url } } = useRouter()

    return (
        <>
            <Stack height='calc(100vh - 144px)' alignItems='center' justifyContent='center'>
                <Box width='500px'>
                    {/* <Typography variant='h4' textAlign='center' mb={4}>${t('confirmSignUp')}</Typography> */}
                    <Link href={confirmation_url ?? ''}>
                        <Button fullWidth variant="contained" size="large">{t('confirmSignUp')}</Button>
                    </Link>
                </Box>

            </Stack>
        </>
    )
}

export default ConfirmSignUp