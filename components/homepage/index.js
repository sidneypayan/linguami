import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import Image from 'next/image'
import Hero from './Hero'
import Link from 'next/link'
import {
	Box,
	Button,
	Container,
	Grid,
	styled,
	Typography,
	Modal,
	Chip,
	IconButton,
	Backdrop,
} from '@mui/material'

import { Stack } from '@mui/system'
import { primaryButton } from '../../utils/buttonStyles'
import { PlayArrow, AutoAwesome, Close } from '@mui/icons-material'

const StyledGridItem = styled(Grid)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '1rem',
	textAlign: 'center',
	marginBottom: '2rem',
	[theme.breakpoints.down('sm')]: {
		marginBottom: '1rem',
	},
}))

const FeatureCard = ({ title, subtitle, imageSrc, imageAlt, onShowClick, reverse, marginTop, badge, offsetDirection, buttonText }) => {
	const getOffset = () => {
		if (!offsetDirection || offsetDirection === 'center') return {};
		return {
			marginLeft: offsetDirection === 'left' ? { xs: 0, md: '0' } : { xs: 0, md: 'auto' },
			marginRight: offsetDirection === 'right' ? { xs: 0, md: '0' } : { xs: 0, md: 'auto' },
			transform: {
				xs: 'translateX(0)',
				md: offsetDirection === 'left' ? 'translateX(-25px)' : offsetDirection === 'right' ? 'translateX(25px)' : 'translateX(0)'
			}
		};
	};

	return (
		<Box
			sx={{
				width: '1000px',
				maxWidth: '100%',
				margin: '0 auto',
				marginTop: { xs: '3rem', md: marginTop || '5rem' },
				position: 'relative',
				...getOffset(),
				transition: 'transform 0.4s ease',
			}}>
			{/* Decorative corners */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '40px',
					height: '40px',
					borderTop: '3px solid rgba(139, 92, 246, 0.4)',
					borderLeft: '3px solid rgba(139, 92, 246, 0.4)',
					borderRadius: '20px 0 0 0',
					zIndex: 2,
					transition: 'all 0.4s ease',
				}}
				className="corner-tl"
			/>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					right: 0,
					width: '40px',
					height: '40px',
					borderTop: '3px solid rgba(6, 182, 212, 0.4)',
					borderRight: '3px solid rgba(6, 182, 212, 0.4)',
					borderRadius: '0 20px 0 0',
					zIndex: 2,
					transition: 'all 0.4s ease',
				}}
				className="corner-tr"
			/>
			<Box
				sx={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '40px',
					height: '40px',
					borderBottom: '3px solid rgba(139, 92, 246, 0.4)',
					borderLeft: '3px solid rgba(139, 92, 246, 0.4)',
					borderRadius: '0 0 0 20px',
					zIndex: 2,
					transition: 'all 0.4s ease',
				}}
				className="corner-bl"
			/>
			<Box
				sx={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					width: '40px',
					height: '40px',
					borderBottom: '3px solid rgba(6, 182, 212, 0.4)',
					borderRight: '3px solid rgba(6, 182, 212, 0.4)',
					borderRadius: '0 0 20px 0',
					zIndex: 2,
					transition: 'all 0.4s ease',
				}}
				className="corner-br"
			/>
			{/* Glow effect background */}
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '120%',
					height: '120%',
					background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
					filter: 'blur(60px)',
					pointerEvents: 'none',
					opacity: 0,
					transition: 'opacity 0.5s ease',
				}}
				className="glow-bg"
			/>

			<Stack
				sx={{
					flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' },
					alignItems: 'center',
					gap: { xs: 3, md: 5 },
					padding: { xs: '1.5rem 2rem', sm: '2.5rem', md: '3.5rem 4rem' },
					borderRadius: 5,
					background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(139, 92, 246, 0.15)',
					boxShadow: '0 8px 32px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
					position: 'relative',
					overflow: 'hidden',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%)',
						opacity: 0,
						transition: 'opacity 0.4s ease',
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						top: '-50%',
						left: '-50%',
						width: '200%',
						height: '200%',
						background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
						opacity: 0,
						transition: 'opacity 0.4s ease',
						pointerEvents: 'none',
					},
				}}>
				{/* Image Section */}
				<Box
					sx={{
						width: { xs: '100%', md: '45%' },
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
						zIndex: 1,
					}}>
					<Box
						sx={{
							position: 'relative',
							width: { xs: 200, md: 240 },
							height: { xs: 200, md: 240 },
							animation: 'float 3s ease-in-out infinite',
							'@keyframes float': {
								'0%, 100%': {
									transform: 'translateY(0px)',
								},
								'50%': {
									transform: 'translateY(-10px)',
								},
							},
						}}>
						{/* Cercle de fond animé blur */}
						<Box
							sx={{
								position: 'absolute',
								width: '120%',
								height: '120%',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
								borderRadius: '50%',
								filter: 'blur(60px)',
								animation: 'pulse 3s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': {
										opacity: 0.5,
										transform: 'translate(-50%, -50%) scale(1)',
									},
									'50%': {
										opacity: 0.8,
										transform: 'translate(-50%, -50%) scale(1.1)',
									},
								},
							}}
						/>

						{/* Cadre stylisé avec glassmorphism */}
						<Box
							sx={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
								border: '3px solid rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(10px)',
								boxShadow: `
									0 0 40px rgba(139, 92, 246, 0.5),
									inset 0 0 40px rgba(6, 182, 212, 0.2),
									0 8px 32px rgba(0, 0, 0, 0.2)
								`,
								animation: 'rotate 20s linear infinite',
								'@keyframes rotate': {
									'0%': {
										transform: 'rotate(0deg)',
									},
									'100%': {
										transform: 'rotate(360deg)',
									},
								},
								'&::before': {
									content: '""',
									position: 'absolute',
									inset: '-3px',
									borderRadius: '50%',
									padding: '3px',
									background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #8b5cf6)',
									WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
									WebkitMaskComposite: 'xor',
									maskComposite: 'exclude',
									opacity: 0.6,
									animation: 'rotateGradient 3s linear infinite',
								},
								'@keyframes rotateGradient': {
									'0%': {
										transform: 'rotate(0deg)',
									},
									'100%': {
										transform: 'rotate(360deg)',
									},
								},
							}}
						/>

						{/* Conteneur de l'image avec overflow hidden */}
						<Box
							className="feature-image-container"
							sx={{
								position: 'relative',
								width: '90%',
								height: '90%',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								borderRadius: '50%',
								overflow: 'hidden',
								zIndex: 2,
								transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
							}}>
							<Box
								component='img'
								src={imageSrc}
								alt={imageAlt}
								sx={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.4))',
								}}
							/>
						</Box>
					</Box>
				</Box>

				{/* Content Section */}
				<Stack
					gap={2.5}
					sx={{
						width: { xs: '100%', md: '55%' },
						textAlign: { xs: 'center', md: 'left' },
						position: 'relative',
						zIndex: 1,
					}}>
					{/* Badge */}
					{badge && (
						<Chip
							className="feature-badge"
							icon={<AutoAwesome sx={{ fontSize: '1rem !important', color: '#8b5cf6 !important' }} />}
							label={badge}
							size="small"
							sx={{
								alignSelf: { xs: 'center', md: 'flex-start' },
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								color: '#8b5cf6',
								fontWeight: 700,
								fontSize: '0.75rem',
								height: 28,
								transition: 'all 0.3s ease',
								'& .MuiChip-label': {
									px: 1.5,
								},
							}}
						/>
					)}

					{/* Title */}
					<Typography
						variant='h3'
						sx={{
							fontSize: { xs: '1.875rem', md: '2.5rem' },
							fontWeight: 800,
							background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							lineHeight: 1.2,
							mb: 0.5,
						}}>
						{title}
					</Typography>

					{/* Subtitle */}
					<Typography
						variant='body1'
						sx={{
							color: '#64748b',
							fontWeight: 500,
							lineHeight: 1.8,
							fontSize: { xs: '0.95rem', md: '1.05rem' },
						}}>
						{subtitle}
					</Typography>

					{/* Button */}
					<Button
						onClick={onShowClick}
						variant='contained'
						size='large'
						startIcon={<PlayArrow />}
						sx={{
							alignSelf: { xs: 'center', md: 'flex-start' },
							minWidth: { xs: '180px', md: '220px' },
							height: 56,
							fontSize: { xs: '0.95rem', md: '1.05rem' },
							fontWeight: 700,
							textTransform: 'none',
							borderRadius: 3,
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
							border: '1px solid rgba(139, 92, 246, 0.5)',
							position: 'relative',
							overflow: 'hidden',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: '-100%',
								width: '100%',
								height: '100%',
								background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
								transition: 'left 0.5s ease',
							},
							'&:hover': {
								background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
								transform: 'translateY(-2px) scale(1.02)',
								boxShadow: '0 8px 40px rgba(139, 92, 246, 0.6)',
								border: '1px solid rgba(139, 92, 246, 0.7)',
								'&::before': {
									left: '100%',
								},
							},
							'&:active': {
								transform: 'translateY(0) scale(1)',
							},
						}}>
						{buttonText}
					</Button>
				</Stack>
			</Stack>
		</Box>
	)
}

const Homepage = () => {
	const { t } = useTranslation('home')
	const [open, setOpen] = useState(false)
	const [videoSrc, setVideoSrc] = useState('')
	const [modalName, setModalName] = useState('')

	const handleOpen = (src, name = '') => {
		setVideoSrc(src)
		setModalName(name)
		setOpen(true)
	}
	const handleClose = () => {
		setVideoSrc('')
		setModalName('')
		setOpen(false)
	}

	const multimedia = [
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/video-mini.png`,
			title: t('video'),
			subtitle: t('videosubtitle'),
			subtitleMobile: t('videosubtitleMobile'),
			link: '/materials#videos',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/audio-mini.png`,
			title: t('audio'),
			subtitle: t('audiosubtitle'),
			subtitleMobile: t('audiosubtitleMobile'),
			link: '/materials#audio',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/text-mini.png`,
			title: t('text'),
			subtitle: t('textsubtitle'),
			subtitleMobile: t('textsubtitleMobile'),
			link: '/materials#texts',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/dictionary-mini.png`,
			title: t('dictionary'),
			subtitle: t('dictionarysubtitle'),
			subtitleMobile: t('dictionarysubtitleMobile'),
			link: '/dictionary',
		},
		{
			img: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/flashcards-mini.png`,
			title: t('flashcards'),
			subtitle: t('flashcardssubtitle'),
			subtitleMobile: t('flashcardssubtitleMobile'),
			link: '/dictionary',
		},
	]

	return (
		<>
			<Hero />
			<Box
				sx={{
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundImage: `
							radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
							radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
							linear-gradient(90deg, rgba(139, 92, 246, 0.02) 1px, transparent 1px),
							linear-gradient(rgba(139, 92, 246, 0.02) 1px, transparent 1px)
						`,
						backgroundSize: '100% 100%, 100% 100%, 100px 100px, 100px 100px',
						pointerEvents: 'none',
						zIndex: 0,
					},
				}}>
				<Container
					maxWidth={false}
					sx={{
						margin: { xs: '3rem auto', md: '5rem auto' },
						padding: { xs: '0 0.25rem', md: '0 1.5rem' },
						maxWidth: '1350px',
						position: 'relative',
						zIndex: 1,
					}}>
					{/* Section Apprentissage multisupport */}
					<Box
						sx={{
							position: 'relative',
							mb: 6,
							'&::before': {
								content: '""',
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: { xs: '90%', md: '70%' },
								height: '150%',
								background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
								borderRadius: '50%',
								filter: 'blur(40px)',
								pointerEvents: 'none',
								zIndex: 0,
							},
						}}>
						<Box>
				<Typography
					variant='h3'
					align='center'
					sx={{
						fontSize: { xs: '2rem', md: '3rem' },
						fontWeight: 800,
						mb: 2,
						background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
						backgroundSize: '200% 200%',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						position: 'relative',
						animation: 'gradientShift 8s ease infinite',
						filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
						letterSpacing: '-0.02em',
						'@keyframes gradientShift': {
							'0%': {
								backgroundPosition: '0% 50%',
							},
							'50%': {
								backgroundPosition: '100% 50%',
							},
							'100%': {
								backgroundPosition: '0% 50%',
							},
						},
					}}>
					{t('multimedia')}
				</Typography>

				<Typography
					variant='subtitle1'
					align='center'
					sx={{
						color: '#64748b',
						fontSize: { xs: '1rem', md: '1.125rem' },
						mb: 6,
						maxWidth: '600px',
						mx: 'auto',
						fontWeight: 500,
						lineHeight: 1.6,
						letterSpacing: '0.01em',
					}}>
					{t('discoverResources')}
				</Typography>

				<Grid
					container
					spacing={{ xs: 2, sm: 0, md: 0 }}
					justifyContent='center'
					sx={{
						margin: { xs: '2rem auto', md: '4rem auto' },
						maxWidth: { xs: '100%', sm: '100%' },
						perspective: { xs: 'none', md: '2000px' },
						perspectiveOrigin: 'center center',
					}}>
					{multimedia.map((icon, index) => {
						// Effet de profondeur 3D - la carte centrale (index 2) est la plus avancée
						const centerIndex = 2
						const distance = Math.abs(index - centerIndex)
						const scale = 1 + (0.25 - distance * 0.08) // Centre: 1.25, -1: 1.17, -2: 1.09
						const translateZ = 80 - distance * 30 // Centre: 80px, -1: 50px, -2: 20px
						const zIndex = 10 - distance // Centre: 10, extérieurs: 8, 6
						const shadowIntensity = 0.4 - distance * 0.1

						// Marges négatives pour créer le chevauchement
						const marginLeft = index === 1 || index === 4 ? { sm: '-20px', md: '-30px' } : '0'

						return (
						<Grid
							key={index}
							item
							xs={6}
							sm={4}
							lg={2.4}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								zIndex: zIndex,
								ml: marginLeft,
							}}>
							<Link href={icon.link} style={{ textDecoration: 'none', width: '100%', maxWidth: '280px' }}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: 2,
										textAlign: 'center',
										p: { xs: 2.5, md: 3 },
										height: '100%',
										width: '100%',
										minHeight: { xs: '280px', sm: '300px', md: '320px' },
										borderRadius: 4,
										background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
										border: '1px solid rgba(139, 92, 246, 0.2)',
										boxShadow: `0 ${4 + translateZ * 0.4}px ${20 + translateZ}px rgba(139, 92, 246, ${shadowIntensity})`,
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										cursor: 'pointer',
										position: 'relative',
										overflow: 'hidden',
										transform: {
											xs: 'scale(1)',
											md: `scale(${scale}) translateZ(${translateZ}px)`
										},
										transformStyle: 'preserve-3d',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
											transition: 'left 0.5s ease',
										},
										'&:hover': {
											transform: {
												xs: 'scale(1.05)',
												md: `scale(${scale * 1.05}) translateZ(${translateZ}px)`
											},
											boxShadow: '0 8px 32px rgba(139, 92, 246, 0.35), 0 0 24px rgba(6, 182, 212, 0.2)',
											borderColor: 'rgba(139, 92, 246, 0.5)',
											'&::before': {
												left: '100%',
											},
											'& .outer-frame': {
												transform: 'translate(-3px, -3px) rotate(-2deg)',
											},
											'& .icon-container': {
												transform: 'translate(-47%, -47%) rotate(2deg)',
											},
										},
									}}>
									<Box
										sx={{
											position: 'relative',
											width: { xs: 90, md: 110 },
											height: { xs: 90, md: 110 },
										}}>
										{/* Cercle de fond animé blur */}
										<Box
											sx={{
												position: 'absolute',
												width: '120%',
												height: '120%',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
												borderRadius: 4,
												filter: 'blur(40px)',
												animation: 'pulse 3s ease-in-out infinite',
												'@keyframes pulse': {
													'0%, 100%': {
														opacity: 0.5,
														transform: 'translate(-50%, -50%) scale(1)',
													},
													'50%': {
														opacity: 0.8,
														transform: 'translate(-50%, -50%) scale(1.1)',
													},
												},
											}}
										/>

										{/* Cadre stylisé avec glassmorphism */}
										<Box
											className="outer-frame"
											sx={{
												position: 'absolute',
												width: '100%',
												height: '100%',
												borderRadius: 3,
												background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
												border: '3px solid rgba(255, 255, 255, 0.2)',
												backdropFilter: 'blur(10px)',
												boxShadow: `
													0 0 30px rgba(139, 92, 246, 0.5),
													inset 0 0 30px rgba(6, 182, 212, 0.2),
													0 6px 24px rgba(0, 0, 0, 0.2)
												`,
												transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
												'&::before': {
													content: '""',
													position: 'absolute',
													inset: '-3px',
													borderRadius: 3,
													padding: '3px',
													background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #8b5cf6)',
													WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
													WebkitMaskComposite: 'xor',
													maskComposite: 'exclude',
													opacity: 0.6,
												},
											}}
										/>

										{/* Conteneur de l'image avec overflow hidden */}
										<Box
											className="icon-container"
											sx={{
												position: 'relative',
												width: '90%',
												height: '90%',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
												borderRadius: 2.5,
												overflow: 'hidden',
												zIndex: 2,
												transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
											}}>
											<Image
												src={icon.img}
												alt={icon.title}
												fill
												quality={100}
												sizes="(max-width: 600px) 110px, (max-width: 960px) 130px, 150px"
												style={{
													objectFit: 'cover',
													imageRendering: '-webkit-optimize-contrast',
													WebkitFontSmoothing: 'antialiased',
													backfaceVisibility: 'hidden',
													transform: 'translateZ(0)',
												}}
												priority={index < 3}
												unoptimized={false}
											/>

											{/* Overlay pour masquer le logo Gemini en bas à droite */}
											<Box
												sx={{
													position: 'absolute',
													bottom: 0,
													right: 0,
													width: '40%',
													height: '25%',
													background: 'linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.15) 40%)',
													zIndex: 3,
												}}
											/>
										</Box>
									</Box>
									<Box>
										<Typography
											variant='h6'
											sx={{
												fontSize: { xs: '0.95rem', md: '1.05rem' },
												fontWeight: 700,
												color: '#1e1b4b',
												mb: 0.5,
											}}>
											{icon.title}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												color: '#64748b',
												fontWeight: 500,
												fontSize: { xs: '0.8rem', md: '0.85rem' },
												lineHeight: 1.5,
											}}>
											<Box component='span' sx={{ display: { xs: 'inline', sm: 'none' } }}>
												{icon.subtitleMobile}
											</Box>
											<Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
												{icon.subtitle}
											</Box>
										</Typography>
									</Box>
								</Box>
							</Link>
						</Grid>
						)
					})}
				</Grid>
						</Box>
					</Box>

				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'
					closeAfterTransition
					slots={{ backdrop: Backdrop }}
					slotProps={{
						backdrop: {
							timeout: 500,
							sx: {
								backgroundColor: 'rgba(15, 23, 42, 0.8)',
								backdropFilter: 'blur(12px)',
							},
						},
					}}>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: {
								xs: '95%',
								sm: '85%',
								md: '75%',
								lg: '65%',
							},
							maxWidth: '1100px',
							outline: 'none',
							animation: open ? 'modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
							'@keyframes modalFadeIn': {
								'0%': {
									opacity: 0,
									transform: 'translate(-50%, -48%) scale(0.95)',
								},
								'100%': {
									opacity: 1,
									transform: 'translate(-50%, -50%) scale(1)',
								},
							},
						}}>
						{/* Modal Container */}
						<Box
							sx={{
								position: 'relative',
								background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
								backdropFilter: 'blur(20px)',
								borderRadius: 5,
								border: '1px solid rgba(139, 92, 246, 0.2)',
								boxShadow: '0 20px 80px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
									pointerEvents: 'none',
									zIndex: 0,
								},
							}}>
							{/* Header */}
							<Box
								sx={{
									position: 'relative',
									zIndex: 1,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									p: { xs: 2, md: 3 },
									borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.03) 100%)',
								}}>
								{modalName && (
									<Typography
										id='modal-modal-title'
										variant='h5'
										sx={{
											fontWeight: 700,
											background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
											fontSize: { xs: '1.25rem', md: '1.5rem' },
										}}>
										{modalName}
									</Typography>
								)}
								<IconButton
									onClick={handleClose}
									sx={{
										ml: 'auto',
										width: 42,
										height: 42,
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
											transform: 'rotate(90deg) scale(1.1)',
											boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
										},
									}}>
									<Close sx={{ color: '#8b5cf6' }} />
								</IconButton>
							</Box>

							{/* Video Container */}
							<Box
								sx={{
									position: 'relative',
									zIndex: 1,
									p: { xs: 2, md: 3 },
								}}>
								<Box
									sx={{
										position: 'relative',
										borderRadius: 3,
										overflow: 'hidden',
										boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
										border: '1px solid rgba(139, 92, 246, 0.2)',
										'&::after': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											border: '1px solid rgba(255, 255, 255, 0.3)',
											borderRadius: 3,
											pointerEvents: 'none',
										},
									}}>
									<video
										controls
										autoPlay
										loop
										style={{
											width: '100%',
											display: 'block',
											borderRadius: '12px',
										}}
										src={`${process.env.NEXT_PUBLIC_SUPABASE_VIDEO}/${videoSrc}`}
									/>
								</Box>
							</Box>
						</Box>
					</Box>
				</Modal>

				{/* Séparateur élégant entre les sections */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						my: { xs: '5rem', md: '8rem' },
						position: 'relative',
					}}>
					{/* Ligne gauche */}
					<Box
						sx={{
							flex: 1,
							height: '2px',
							background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3) 50%, rgba(139, 92, 246, 0.6))',
							maxWidth: { xs: '30%', md: '40%' },
						}}
					/>
					{/* Élément central décoratif */}
					<Box
						sx={{
							mx: 3,
							width: { xs: 50, md: 70 },
							height: { xs: 50, md: 70 },
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{/* Cercle externe pulsant */}
						<Box
							sx={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								border: '2px solid rgba(139, 92, 246, 0.3)',
								animation: 'expandPulse 3s ease-in-out infinite',
								'@keyframes expandPulse': {
									'0%, 100%': {
										transform: 'scale(1)',
										opacity: 0.5,
									},
									'50%': {
										transform: 'scale(1.2)',
										opacity: 0.8,
									},
								},
							}}
						/>
						{/* Cercle interne avec gradient */}
						<Box
							sx={{
								width: '70%',
								height: '70%',
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)',
								position: 'relative',
								'&::before': {
									content: '""',
									position: 'absolute',
									inset: 4,
									borderRadius: '50%',
									background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)',
								},
							}}
						/>
					</Box>
					{/* Ligne droite */}
					<Box
						sx={{
							flex: 1,
							height: '2px',
							background: 'linear-gradient(to left, transparent, rgba(6, 182, 212, 0.3) 50%, rgba(6, 182, 212, 0.6))',
							maxWidth: { xs: '30%', md: '40%' },
						}}
					/>
				</Box>

				{/* Section Outils d'apprentissage */}
				<Box
					sx={{
						position: 'relative',
						mt: 0,
						mb: { xs: '3rem', md: '5rem' },
						'&::before': {
							content: '""',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: { xs: '90%', md: '70%' },
							height: '150%',
							background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
							borderRadius: '50%',
							filter: 'blur(40px)',
							pointerEvents: 'none',
							zIndex: 0,
						},
					}}>
					<Box>
					<Typography
						variant='h3'
						align='center'
						sx={{
							fontSize: { xs: '2rem', md: '3rem' },
							fontWeight: 800,
							mb: 2,
							background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							animation: 'gradientShift 8s ease infinite',
							filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
							letterSpacing: '-0.02em',
							'@keyframes gradientShift': {
								'0%': {
									backgroundPosition: '0% 50%',
								},
								'50%': {
									backgroundPosition: '100% 50%',
								},
								'100%': {
									backgroundPosition: '0% 50%',
								},
							},
						}}>
						Vos outils d'apprentissage
					</Typography>

					<Typography
						variant='subtitle1'
						align='center'
						sx={{
							color: '#64748b',
							fontSize: { xs: '1rem', md: '1.125rem' },
							maxWidth: '700px',
							mx: 'auto',
							fontWeight: 500,
							lineHeight: 1.6,
							letterSpacing: '0.01em',
						}}>
						Découvrez nos outils interactifs conçus pour enrichir votre expérience d'apprentissage
					</Typography>
					</Box>
				</Box>

				<FeatureCard
					title={t('translator')}
					subtitle={t('translatorsubtitle')}
					imageSrc={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/translator.png`}
					imageAlt="translator"
					onShowClick={() => handleOpen('translator.mp4', t('translator'))}
					reverse={true}
					marginTop="0"
					badge={t('badgeEssential')}
					offsetDirection="center"
					buttonText={t('viewDemo')}
				/>

				<FeatureCard
					title={t('dictionary')}
					subtitle={t('giftranslatorsubtitle')}
					imageSrc={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/dictionary.png`}
					imageAlt="dictionary"
					onShowClick={() => handleOpen('dictionary.mp4', t('dictionary'))}
					reverse={false}
					marginTop="8rem"
					badge={t('badgeNew')}
					offsetDirection="left"
					buttonText={t('viewDemo')}
				/>

				<FeatureCard
					title={t('flashcards')}
					subtitle={t('gifflashcardssubtitle')}
					imageSrc={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/flashcards.png`}
					imageAlt="flashcards"
					onShowClick={() => handleOpen('flashcards.mp4', t('flashcards'))}
					reverse={true}
					marginTop="8rem"
					badge={t('badgePopular')}
					offsetDirection="right"
					buttonText={t('viewDemo')}
				/>

				<Link href='/teacher' style={{ textDecoration: 'none' }}>
					<FeatureCard
						title={t('teacher')}
						subtitle={t('teachersubtitle')}
						imageSrc={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/teacher.png`}
						imageAlt="teacher"
						onShowClick={() => {}}
						reverse={false}
						marginTop="8rem"
						badge={t('badgePremium')}
						offsetDirection="left"
						buttonText={t('viewDemo')}
					/>
				</Link>
			</Container>
			</Box>
		</>
	)
}

export default Homepage
