import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
	Box,
	Paper,
	Typography,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
	useTheme,
	IconButton,
} from '@mui/material'
import { MenuBook, VolumeUp } from '@mui/icons-material'

const GrammarBlock = ({ block }) => {
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null)
	const audioRefs = useRef({})

	const { title, explanation, examples, table } = block

	// Play audio for an example
	const handlePlayExample = (index, audioUrl) => {
		if (!audioUrl) return

		// Stop any currently playing audio
		if (currentPlayingIndex !== null && audioRefs.current[currentPlayingIndex]) {
			audioRefs.current[currentPlayingIndex].pause()
		}

		setCurrentPlayingIndex(index)

		if (!audioRefs.current[index]) {
			audioRefs.current[index] = new Audio(audioUrl)
			audioRefs.current[index].addEventListener('ended', () => {
				setCurrentPlayingIndex(null)
			})
		}

		audioRefs.current[index].play()
	}

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			Object.values(audioRefs.current).forEach((audio) => {
				if (audio) {
					audio.pause()
				}
			})
		}
	}, [])

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(109, 40, 217, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(243, 232, 255, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
				<MenuBook sx={{ fontSize: 32, color: '#8b5cf6' }} />
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: isDark ? '#a78bfa' : '#7c3aed',
					}}>
					{title}
				</Typography>
			</Box>

			{/* Explanation */}
			{explanation && (
				<Typography
					sx={{
						mb: 3,
						lineHeight: 1.8,
						color: isDark ? '#cbd5e1' : '#475569',
					}}
					dangerouslySetInnerHTML={{ __html: explanation }}
				/>
			)}

			{/* Examples */}
			{examples && examples.length > 0 && (
				<Box sx={{ mb: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
						{t('methode_examples')}
					</Typography>
					{examples.map((ex, index) => (
						<Box
							key={index}
							sx={{
								p: 2,
								mb: 1.5,
								borderRadius: 2,
								background: currentPlayingIndex === index
									? isDark
										? 'rgba(139, 92, 246, 0.25)'
										: 'rgba(124, 58, 237, 0.15)'
									: isDark
									? 'rgba(139, 92, 246, 0.1)'
									: 'rgba(124, 58, 237, 0.05)',
								borderLeft: '4px solid #8b5cf6',
								transition: 'all 0.3s ease',
							}}>
							<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
								{ex.audioUrl && (
									<IconButton
										size="small"
										onClick={() => handlePlayExample(index, ex.audioUrl)}
										sx={{
											color: '#8b5cf6',
											mt: -0.5,
										}}>
										<VolumeUp fontSize="small" />
									</IconButton>
								)}
								<Box sx={{ flex: 1 }}>
									<Typography
										sx={{
											fontWeight: 600,
											mb: 0.5,
											color: 'text.primary',
										}}>
										{ex.sentence}
									</Typography>
									<Typography
										sx={{
											color: isDark ? '#94a3b8' : '#64748b',
											fontStyle: 'italic',
											fontSize: '0.9rem',
											mb: ex.note ? 0.5 : 0,
										}}>
										{ex.translation}
									</Typography>
									{ex.note && (
										<Typography
											sx={{
												color: '#8b5cf6',
												fontSize: '0.85rem',
												fontWeight: 500,
											}}>
											→ {ex.note}
										</Typography>
									)}
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			)}

			{/* Table */}
			{table && (
				<Box>
					{table.title && (
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
							{table.title}
						</Typography>
					)}
					<Table
						sx={{
							'& .MuiTableCell-root': {
								borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
								py: 1.5,
							},
						}}>
						{table.headers && (
							<TableHead>
								<TableRow
									sx={{
										background: isDark
											? 'rgba(139, 92, 246, 0.2)'
											: 'rgba(124, 58, 237, 0.1)',
									}}>
									{table.headers.map((header, index) => (
										<TableCell
											key={index}
											sx={{
												fontWeight: 700,
												color: '#8b5cf6',
											}}>
											{header}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
						)}
						<TableBody>
							{table.rows?.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
									hover
									sx={{
										background: currentPlayingIndex === `table-${rowIndex}`
											? isDark
												? 'rgba(139, 92, 246, 0.25)'
												: 'rgba(124, 58, 237, 0.15)'
											: 'transparent',
										transition: 'all 0.3s ease',
									}}>
									{row.map((cell, cellIndex) => {
										// Check if this cell has audio
										const cellAudio = table.rowsAudio?.[rowIndex]?.[cellIndex]

										return (
											<TableCell key={cellIndex}>
												{cellAudio ? (
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														<IconButton
															size="small"
															onClick={() => handlePlayExample(`table-${rowIndex}-${cellIndex}`, cellAudio)}
															sx={{
																color: '#8b5cf6',
																p: 0.5,
															}}>
															<VolumeUp fontSize="small" />
														</IconButton>
														<Typography>{cell}</Typography>
													</Box>
												) : (
													cell
												)}
											</TableCell>
										)
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			)}
		</Paper>
	)
}

export default GrammarBlock
