import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Stack, Box, Button, Typography, useTheme } from '@mui/material'
import { MarkEmailReadRounded } from '@mui/icons-material'
import AuthLayout from '@/components/auth/AuthLayout'
import Head from 'next/head'


const ConfirmSignUp = () => {
    const { t } = useTranslation('register')
    const { query: { confirmation_url } } = useRouter()
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    return (
        <>
            <Head>
                <title>{`${t('confirmSignUp')} | Linguami`}</title>
                <meta name="description" content={t('confirmSignUp')} />
            </Head>

            <AuthLayout icon={<MarkEmailReadRounded sx={{ fontSize: { xs: '2rem', sm: '2.25rem' }, color: 'white' }} />}>
                {/* Title */}
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        fontWeight: 800,
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '1.5rem', sm: '2.125rem' },
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                    {t('confirmSignUp')}
                </Typography>

                {/* Button */}
                <Link href={confirmation_url ?? ''} style={{ textDecoration: 'none' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: { xs: 1.75, sm: 2 },
                            borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 700,
                            fontSize: '1.0625rem',
                            textTransform: 'none',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            },
                        }}>
                        {t('confirmSignUp')}
                    </Button>
                </Link>
            </AuthLayout>
        </>
    )
}

export default ConfirmSignUp