'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import { updateReportStatus, deleteReport } from '@/app/actions/admin'
import { Link } from '@/i18n/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { cn } from '@/lib/utils'
import {
	Flag,
	ExternalLink,
	MoreVertical,
	CheckCircle,
	XCircle,
	PlayCircle,
	Trash2,
} from 'lucide-react'

const ReportsClient = ({ initialReports }) => {
	const t = useTranslations('admin')
	const [reports, setReports] = useState(initialReports || [])
	const [statusFilter, setStatusFilter] = useState('all')
	const [openMenuId, setOpenMenuId] = useState(null)

	const updateStatusMutation = useMutation({
		mutationFn: ({ reportId, status }) => updateReportStatus(reportId, status),
		onSuccess: (result) => {
			if (result.success) {
				setReports(prev =>
					prev.map(r => (r.id === result.report.id ? result.report : r))
				)
				setOpenMenuId(null)
			}
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (reportId) => deleteReport(reportId),
		onSuccess: (result, reportId) => {
			if (result.success) {
				setReports(prev => prev.filter(r => r.id !== reportId))
				setOpenMenuId(null)
			}
		},
	})

	const handleStatusChange = (reportId, status) => {
		updateStatusMutation.mutate({ reportId, status })
	}

	const handleDelete = (reportId) => {
		deleteMutation.mutate(reportId)
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending':
				return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' }
			case 'in_progress':
				return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
			case 'resolved':
				return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
			case 'dismissed':
				return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' }
			default:
				return { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' }
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

	const tabs = [
		{ id: 'all', label: `All (${statusCounts.all})` },
		{ id: 'pending', label: `Pending (${statusCounts.pending})` },
		{ id: 'in_progress', label: `In Progress (${statusCounts.in_progress})` },
		{ id: 'resolved', label: `Resolved (${statusCounts.resolved})` },
		{ id: 'dismissed', label: `Dismissed (${statusCounts.dismissed})` },
	]

	return (
		<div className="min-h-screen bg-slate-50 pt-16">
			<AdminNavbar activePage="reports" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Status Tabs */}
				<div className="bg-white rounded-xl border border-violet-200 mb-6 overflow-hidden">
					<div className="flex overflow-x-auto border-b border-violet-200">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setStatusFilter(tab.id)}
								className={cn(
									'px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors',
									statusFilter === tab.id
										? 'text-violet-700 border-b-2 border-violet-500 bg-violet-50'
										: 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Reports Table */}
				{filteredReports.length === 0 ? (
					<div className="bg-white rounded-xl border border-violet-200 p-16 text-center">
						<p className="text-lg text-slate-500">{t('noReportsFound') || 'No reports found'}</p>
					</div>
				) : (
					<div className="bg-white rounded-xl border border-violet-200 shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-violet-50">
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Material</th>
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Report Type</th>
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Comment</th>
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Reporter</th>
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Status</th>
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Date</th>
										<th className="px-6 py-3 text-left text-xs font-bold text-violet-700 uppercase tracking-wider">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredReports.map((report) => {
										const material = report.materials
										const materialTitle = material?.title_en || material?.title_fr || material?.title_ru || material?.title || 'Unknown'
										const statusStyle = getStatusColor(report.status)

										return (
											<tr
												key={report.id}
												className="hover:bg-violet-50/50 border-b border-slate-100 transition-colors"
											>
												<td className="px-6 py-4">
													<div className="flex items-center gap-2">
														<span className="font-semibold text-slate-800">{materialTitle}</span>
														{material && (
															<Link
																href={`/materials/${material.section}/${material.id}`}
																target="_blank"
																className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
															>
																<ExternalLink className="w-4 h-4" />
															</Link>
														)}
													</div>
													<p className="text-xs text-slate-500">{material?.section || 'Unknown'} &bull; {material?.lang || 'Unknown'}</p>
												</td>
												<td className="px-6 py-4">
													<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
														{getReportTypeLabel(report.report_type)}
													</span>
												</td>
												<td className="px-6 py-4">
													<p className="text-sm text-slate-600 max-w-[250px] truncate">
														{report.comment || '-'}
													</p>
												</td>
												<td className="px-6 py-4 text-sm text-slate-500">
													{report.user_id ? `User ${report.user_id.substring(0, 8)}...` : 'Guest'}
												</td>
												<td className="px-6 py-4">
													<span className={cn(
														'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize border',
														statusStyle.bg,
														statusStyle.text,
														statusStyle.border
													)}>
														{report.status}
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-slate-500">
													{new Date(report.created_at).toLocaleDateString()}
												</td>
												<td className="px-6 py-4 relative">
													<button
														onClick={() => setOpenMenuId(openMenuId === report.id ? null : report.id)}
														className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
													>
														<MoreVertical className="w-4 h-4 text-slate-500" />
													</button>

													{/* Dropdown Menu */}
													{openMenuId === report.id && (
														<>
															<div
																className="fixed inset-0 z-10"
																onClick={() => setOpenMenuId(null)}
															/>
															<div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-20 overflow-hidden">
																<button
																	onClick={() => handleStatusChange(report.id, 'pending')}
																	className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
																>
																	<PlayCircle className="w-4 h-4 text-amber-500" />
																	Mark as Pending
																</button>
																<button
																	onClick={() => handleStatusChange(report.id, 'in_progress')}
																	className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
																>
																	<PlayCircle className="w-4 h-4 text-blue-500" />
																	Mark as In Progress
																</button>
																<button
																	onClick={() => handleStatusChange(report.id, 'resolved')}
																	className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
																>
																	<CheckCircle className="w-4 h-4 text-emerald-500" />
																	Mark as Resolved
																</button>
																<button
																	onClick={() => handleStatusChange(report.id, 'dismissed')}
																	className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
																>
																	<XCircle className="w-4 h-4 text-slate-500" />
																	Mark as Dismissed
																</button>
																<div className="border-t border-slate-200" />
																<button
																	onClick={() => handleDelete(report.id)}
																	className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
																>
																	<Trash2 className="w-4 h-4" />
																	Delete Report
																</button>
															</div>
														</>
													)}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ReportsClient
