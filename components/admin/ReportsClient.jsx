'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateReportStatus, deleteReport } from '@/app/actions/admin'
import { Link } from '@/i18n/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
	Box,
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	IconButton,
	Button,
	Menu,
	MenuItem,
	Tooltip,
	Alert,
	Tabs,
	Tab,
} from '@mui/material'
import {
	MoreVertOutlined,
	CheckCircleOutline,
	CancelOutlined,
	PlayCircleOutline,
	DeleteOutline,
	FlagOutlined,
	OpenInNew,
} from '@mui/icons-material'

const ReportsClient = ({ initialReports }) => {
	const t = useTranslations('admin')
	const queryClient = useQueryClient()
	const [reports, setReports] = useState(initialReports || [])
	const [statusFilter, setStatusFilter] = useState('all')
	const [anchorEl, setAnchorEl] = useState(null)
	const [selectedReport, setSelectedReport] = useState(null)

	const updateStatusMutation = useMutation({
		mutationFn: ({ reportId, status }) => updateReportStatus(reportId, status),
		onSuccess: (result) => {
			if (result.success) {
				// Update local state
				setReports(prev =>
					prev.map(r => (r.id === result.report.id ? result.report : r))
				)
				setAnchorEl(null)
			}
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (reportId) => deleteReport(reportId),
		onSuccess: (result, reportId) => {
			if (result.success) {
				setReports(prev => prev.filter(r => r.id !== reportId))
				setAnchorEl(null)
			}
		},
	})

	const handleMenuOpen = (event, report) => {
		setAnchorEl(event.currentTarget)
		setSelectedReport(report)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
		setSelectedReport(null)
	}

	const handleStatusChange = (status) => {
		if (selectedReport) {
			updateStatusMutation.mutate({ reportId: selectedReport.id, status })
		}
	}

	const handleDelete = () => {
		if (selectedReport) {
			deleteMutation.mutate(selectedReport.id)
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending':
				return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '#f59e0b' }
			case 'in_progress':
				return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '#3b82f6' }
			case 'resolved':
				return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '#10b981' }
			case 'dismissed':
				return { bg: 'rgba(107, 114, 128, 0.15)', color: '#6b7280', border: '#6b7280' }
			default:
				return { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', border: '#8b5cf6' }
		}
	}

	const getReportTypeLabel = (type) => {
		const labels = {
			broken_video: t('report_broken_video') || 'Broken video',
			broken_link: t('report_broken_link') || 'Broken link',
			broken_audio: t('report_broken_audio') || 'Broken audio',
			inappropriate_content: t('report_inappropriate') || 'Inappropriate',
			translation_error: t('report_translation_error') || 'Translation error',
			other: t('report_other') || 'Other',
		}
		return labels[type] || type
	}

	const filteredReports = statusFilter === 'all'
		? reports
		: reports.filter(r => r.status === statusFilter)

	const statusCounts = {
		all: reports.length,
		pending: reports.filter(r => r.status === 'pending').length,
		in_progress: reports.filter(r => r.status === 'in_progress').length,
		resolved: reports.filter(r => r.status === 'resolved').length,
		dismissed: reports.filter(r => r.status === 'dismissed').length,
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'background.paper',
			}}>
			<AdminNavbar activePage="reports" />

			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 56,
							height: 56,
							borderRadius: '50%',
							background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
							border: '2px solid rgba(220, 38, 38, 0.2)',
						}}>
						<FlagOutlined sx={{ fontSize: '1.75rem', color: '#dc2626' }} />
					</Box>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
							{t('materialReports') || 'Material Reports'}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('manageUserReports') || 'Manage user-reported issues with materials'}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Status Tabs */}
			<Paper
				sx={{
					mb: 3,
					borderRadius: 3,
					overflow: 'hidden',
					border: '1px solid rgba(139, 92, 246, 0.2)',
				}}>
				<Tabs
					value={statusFilter}
					onChange={(e, newValue) => setStatusFilter(newValue)}
					variant="scrollable"
					scrollButtons="auto"
					sx={{
						borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
						'& .MuiTab-root': {
							textTransform: 'none',
							fontWeight: 600,
							minHeight: 64,
						},
						'& .Mui-selected': {
							color: '#8b5cf6',
						},
						'& .MuiTabs-indicator': {
							backgroundColor: '#8b5cf6',
							height: 3,
						},
					}}>
					<Tab label={`All (${statusCounts.all})`} value="all" />
					<Tab label={`Pending (${statusCounts.pending})`} value="pending" />
					<Tab label={`In Progress (${statusCounts.in_progress})`} value="in_progress" />
					<Tab label={`Resolved (${statusCounts.resolved})`} value="resolved" />
					<Tab label={`Dismissed (${statusCounts.dismissed})`} value="dismissed" />
				</Tabs>
			</Paper>

			{/* Reports Table */}
			{filteredReports.length === 0 ? (
				<Paper
					sx={{
						p: 8,
						textAlign: 'center',
						borderRadius: 3,
						border: '1px solid rgba(139, 92, 246, 0.2)',
					}}>
					<Typography variant="h6" color="text.secondary">
						{t('noReportsFound') || 'No reports found'}
					</Typography>
				</Paper>
			) : (
				<TableContainer
					component={Paper}
					sx={{
						borderRadius: 3,
						border: '1px solid rgba(139, 92, 246, 0.2)',
						boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
					}}>
					<Table>
						<TableHead>
							<TableRow sx={{ bgcolor: 'rgba(139, 92, 246, 0.05)' }}>
								<TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Report Type</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Comment</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Reporter</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredReports.map((report) => {
								const material = report.materials
								const materialTitle = material?.title_en || material?.title_fr || material?.title_ru || material?.title || 'Unknown'
								const statusStyle = getStatusColor(report.status)

								return (
									<TableRow
										key={report.id}
										sx={{
											'&:hover': {
												bgcolor: 'rgba(139, 92, 246, 0.02)',
											},
										}}>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													{materialTitle}
												</Typography>
												{material && (
													<Link href={`/materials/${material.section}/${material.id}`} target="_blank">
														<IconButton size="small">
															<OpenInNew fontSize="small" />
														</IconButton>
													</Link>
												)}
											</Box>
											<Typography variant="caption" color="text.secondary">
												{material?.section || 'Unknown'} • {material?.lang || 'Unknown'}
											</Typography>
										</TableCell>
										<TableCell>
											<Chip
												label={getReportTypeLabel(report.report_type)}
												size="small"
												sx={{
													bgcolor: 'rgba(139, 92, 246, 0.1)',
													color: '#8b5cf6',
													fontWeight: 600,
												}}
											/>
										</TableCell>
										<TableCell>
											<Typography
												variant="body2"
												sx={{
													maxWidth: 250,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
												}}>
												{report.comment || '-'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2">
												{report.user_id ? `User ${report.user_id.substring(0, 8)}...` : 'Guest'}
											</Typography>
										</TableCell>
										<TableCell>
											<Chip
												label={report.status}
												size="small"
												sx={{
													bgcolor: statusStyle.bg,
													color: statusStyle.color,
													border: `1px solid ${statusStyle.border}`,
													fontWeight: 600,
													textTransform: 'capitalize',
												}}
											/>
										</TableCell>
										<TableCell>
											<Typography variant="body2">
												{new Date(report.created_at).toLocaleDateString()}
											</Typography>
										</TableCell>
										<TableCell>
											<IconButton
												size="small"
												onClick={(e) => handleMenuOpen(e, report)}>
												<MoreVertOutlined />
											</IconButton>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{/* Actions Menu */}
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				PaperProps={{
					sx: {
						borderRadius: 2,
						boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)',
						minWidth: 200,
					},
				}}>
				<MenuItem onClick={() => handleStatusChange('pending')}>
					<PlayCircleOutline sx={{ mr: 1, color: '#f59e0b' }} />
					Mark as Pending
				</MenuItem>
				<MenuItem onClick={() => handleStatusChange('in_progress')}>
					<PlayCircleOutline sx={{ mr: 1, color: '#3b82f6' }} />
					Mark as In Progress
				</MenuItem>
				<MenuItem onClick={() => handleStatusChange('resolved')}>
					<CheckCircleOutline sx={{ mr: 1, color: '#10b981' }} />
					Mark as Resolved
				</MenuItem>
				<MenuItem onClick={() => handleStatusChange('dismissed')}>
					<CancelOutlined sx={{ mr: 1, color: '#6b7280' }} />
					Mark as Dismissed
				</MenuItem>
				<MenuItem onClick={handleDelete} sx={{ color: '#dc2626' }}>
					<DeleteOutline sx={{ mr: 1 }} />
					Delete Report
				</MenuItem>
			</Menu>
		</Container>
		</Box>
	)
}

export default ReportsClient
