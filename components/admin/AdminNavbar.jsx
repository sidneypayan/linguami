import { Link } from '@/i18n/navigation'
import { Box, Container, Typography, Button } from '@mui/material'
import { Add, People, School, Article } from '@mui/icons-material'
import { useTranslations, useLocale } from 'next-intl'

const AdminNavbar = ({ activePage = 'dashboard' }) => {
	const t = useTranslations('admin')

	const navButtons = [
		{
			id: 'dashboard',
			label: t('adminDashboard'),
			href: '/admin',
			variant: 'text',
		},
		{
			id: 'create',
			label: t('newContent'),
			href: '/admin/create',
			icon: <Add />,
			variant: 'contained',
		},
		{
			id: 'blog',
			label: 'Blog',
			href: '/admin/blog',
			icon: <Article />,
			variant: 'contained',
		},
		{
			id: 'exercises',
			label: t('exercises'),
			href: '/admin/exercises',
			icon: <School />,
			variant: 'contained',
		},
		{
			id: 'users',
			label: t('users'),
			href: '/admin/users',
			icon: <People />,
			variant: 'contained',
		},
	]

	return (
		<Box
			sx={{
				bgcolor: 'white',
				borderBottom: '1px solid',
				borderColor: 'divider',
				position: 'sticky',
				top: 0,
				zIndex: 1100,
				boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
			}}>
			<Container maxWidth="xl">
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						py: 2,
					}}>
					{/* Logo and Title */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'white',
								fontWeight: 800,
								fontSize: '1.5rem',
							}}>
							L
						</Box>
						<Box>
							<Typography
								variant='h5'
								sx={{
									fontWeight: 700,
									color: '#1E293B',
									letterSpacing: '-0.5px',
								}}>
								{t('adminDashboard')}
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: '#64748B',
								}}>
								{t('manageContent')}
							</Typography>
						</Box>
					</Box>

					{/* Navigation Buttons */}
					<Box sx={{ display: 'flex', gap: { xs: 1, md: 2 } }}>
						{navButtons
							.filter(btn => btn.variant === 'contained')
							.map(btn => (
								<Link key={btn.id} href={btn.href} passHref style={{ textDecoration: 'none' }}>
									<Button
										variant={btn.variant}
										sx={{
											bgcolor: activePage === btn.id ? '#5568d3' : '#667eea',
											color: 'white',
											minWidth: { xs: '48px', md: 'auto' },
											px: { xs: 0, md: 3 },
											py: 1.2,
											borderRadius: 2,
											textTransform: 'none',
											fontWeight: 600,
											boxShadow: activePage === btn.id ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none',
											'&:hover': {
												bgcolor: '#5568d3',
												boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
											},
											'& .MuiButton-startIcon': {
												margin: { xs: 0, md: '0 8px 0 -4px' },
											},
										}}>
										{btn.icon}
										<Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, ml: 1 }}>
											{btn.label}
										</Box>
									</Button>
								</Link>
							))}
					</Box>
				</Box>
			</Container>
		</Box>
	)
}

export default AdminNavbar
