'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import { reportMaterialIssue } from '@/app/actions/materials'
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	TextField,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Typography,
	Alert,
	Snackbar,
	Fade,
	Fab,
	Tooltip,
} from '@mui/material'
import {
	FlagOutlined,
	Close,
	BrokenImageOutlined,
	VolumeOffOutlined,
	TranslateOutlined,
} from '@mui/icons-material'

const ReportButton = ({ materialId }) => {
	const t = useTranslations('materials')
	const [open, setOpen] = useState(false)
	const [reportType, setReportType] = useState('broken_audio')
	const [comment, setComment] = useState('')
	const [showSuccess, setShowSuccess] = useState(false)
	const [showError, setShowError] = useState(false)

	const reportMutation = useMutation({
		mutationFn: () => reportMaterialIssue(materialId, reportType, comment || null),
		onSuccess: (result) => {
			if (result.success) {
				setShowSuccess(true)
				setOpen(false)
				setComment('')
				setReportType('broken_audio')
			} else {
				setShowError(true)
			}
		},
		onError: () => {
			setShowError(true)
		},
	})

	const reportOptions = [
		{ value: 'broken_audio', icon: VolumeOffOutlined, labelKey: 'report_broken_audio' },
		{ value: 'broken_video', icon: BrokenImageOutlined, labelKey: 'report_broken_video' },
		{ value: 'missing_image', icon: BrokenImageOutlined, labelKey: 'report_missing_image' },
		{ value: 'missing_translation', icon: TranslateOutlined, labelKey: 'report_missing_translation' },
	]

	return (
		<>
			{/* Floating Action Button */}
			<Tooltip title={t('report_issue')} placement="left">
				<Fab
					color="error"
					onClick={() => setOpen(true)}
					sx={{
						background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
						color: 'white',
						boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
						transition: 'all 0.3s ease',
						'&:hover': {
							background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
							boxShadow: '0 12px 32px rgba(220, 38, 38, 0.5)',
							transform: 'scale(1.05)',
						},
						'&:active': {
							transform: 'scale(0.95)',
						},
					}}>
					<FlagOutlined />
				</Fab>
			</Tooltip>

			{/* Report Dialog */}
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="sm"
				fullWidth
				TransitionComponent={Fade}
				TransitionProps={{ timeout: 300 }}
				PaperProps={{
					sx: {
						borderRadius: 3,
						background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						boxShadow: '0 20px 60px rgba(139, 92, 246, 0.25)',
					},
				}}>
				{/* Header */}
				<DialogTitle
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 2,
						pb: 2,
						borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					}}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 48,
							height: 48,
							borderRadius: '50%',
							background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
							border: '2px solid rgba(220, 38, 38, 0.2)',
						}}>
						<FlagOutlined sx={{ fontSize: '1.5rem', color: '#dc2626' }} />
					</Box>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
							{t('report_issue')}
						</Typography>
						<Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
							{t('report_description')}
						</Typography>
					</Box>
					<IconButton
						onClick={() => setOpen(false)}
						sx={{
							color: 'text.secondary',
							'&:hover': {
								backgroundColor: 'rgba(139, 92, 246, 0.1)',
								color: '#8b5cf6',
							},
						}}>
						<Close />
					</IconButton>
				</DialogTitle>

				{/* Content */}
				<DialogContent sx={{ pt: 3, pb: 2 }}>
					<FormControl component="fieldset" fullWidth>
						<Typography
							variant="subtitle2"
							sx={{
								fontWeight: 600,
								color: '#1e1b4b',
								mb: 2,
							}}>
							{t('report_type_label')}
						</Typography>
						<RadioGroup value={reportType} onChange={(e) => setReportType(e.target.value)}>
							{reportOptions.map((option) => {
								const Icon = option.icon
								return (
									<FormControlLabel
										key={option.value}
										value={option.value}
										control={
											<Radio
												sx={{
													color: 'rgba(139, 92, 246, 0.6)',
													'&.Mui-checked': {
														color: '#8b5cf6',
													},
												}}
											/>
										}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
												<Icon sx={{ fontSize: '1.25rem', color: '#8b5cf6' }} />
												<Typography variant="body2">{t(option.labelKey)}</Typography>
											</Box>
										}
										sx={{
											ml: 0,
											mb: 1,
											py: 1,
											px: 2,
											borderRadius: 2,
											border: '1px solid transparent',
											transition: 'all 0.2s ease',
											'&:hover': {
												backgroundColor: 'rgba(139, 92, 246, 0.05)',
												borderColor: 'rgba(139, 92, 246, 0.2)',
											},
										}}
									/>
								)
							})}
						</RadioGroup>
					</FormControl>

					{/* Optional Comment */}
					<TextField
						fullWidth
						multiline
						rows={3}
						label={t('report_comment_label')}
						placeholder={t('report_comment_placeholder')}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						sx={{
							mt: 3,
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								'&:hover fieldset': {
									borderColor: '#8b5cf6',
								},
								'&.Mui-focused fieldset': {
									borderColor: '#8b5cf6',
								},
							},
						}}
					/>
				</DialogContent>

				{/* Actions */}
				<DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
					<Button
						onClick={() => setOpen(false)}
						sx={{
							color: 'text.secondary',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.05)',
							},
						}}>
						{t('cancel')}
					</Button>
					<Button
						variant="contained"
						onClick={() => reportMutation.mutate()}
						disabled={reportMutation.isPending}
						sx={{
							background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
							color: 'white',
							px: 3,
							boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
							transition: 'all 0.3s ease',
							'&:hover': {
								background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
								boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
								transform: 'translateY(-2px)',
							},
							'&:disabled': {
								background: 'rgba(0, 0, 0, 0.12)',
								color: 'rgba(0, 0, 0, 0.26)',
							},
						}}>
						{reportMutation.isPending ? t('report_sending') : t('report_submit')}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Success Snackbar */}
			<Snackbar
				open={showSuccess}
				autoHideDuration={4000}
				onClose={() => setShowSuccess(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert
					onClose={() => setShowSuccess(false)}
					severity="success"
					variant="filled"
					sx={{
						borderRadius: 2,
						boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
					}}>
					{t('report_success')}
				</Alert>
			</Snackbar>

			{/* Error Snackbar */}
			<Snackbar
				open={showError}
				autoHideDuration={4000}
				onClose={() => setShowError(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert
					onClose={() => setShowError(false)}
					severity="error"
					variant="filled"
					sx={{
						borderRadius: 2,
						boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)',
					}}>
					{t('report_error')}
				</Alert>
			</Snackbar>
		</>
	)
}

export default ReportButton
