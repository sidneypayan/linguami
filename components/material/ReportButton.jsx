'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import { reportMaterialIssue } from '@/app/actions/materials'
import { Flag, X, VolumeX, ImageOff, Languages } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import toast from '@/utils/toast'

const ReportButton = ({ materialId }) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()
	const [open, setOpen] = useState(false)
	const [reportType, setReportType] = useState('broken_audio')
	const [comment, setComment] = useState('')
	const dialogRef = useRef(null)

	const reportMutation = useMutation({
		mutationFn: () => reportMaterialIssue(materialId, reportType, comment || null),
		onSuccess: (result) => {
			if (result.success) {
				toast.success(t('report_success'))
				setOpen(false)
				setComment('')
				setReportType('broken_audio')
			} else {
				toast.error(t('report_error'))
			}
		},
		onError: () => {
			toast.error(t('report_error'))
		},
	})

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dialogRef.current && !dialogRef.current.contains(e.target)) {
				setOpen(false)
			}
		}
		if (open) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [open])

	// Close on escape
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') setOpen(false)
		}
		if (open) {
			document.addEventListener('keydown', handleEscape)
		}
		return () => document.removeEventListener('keydown', handleEscape)
	}, [open])

	const reportOptions = [
		{ value: 'broken_audio', icon: VolumeX, labelKey: 'report_broken_audio' },
		{ value: 'broken_video', icon: ImageOff, labelKey: 'report_broken_video' },
		{ value: 'missing_image', icon: ImageOff, labelKey: 'report_missing_image' },
		{ value: 'missing_translation', icon: Languages, labelKey: 'report_missing_translation' },
	]

	return (
		<>
			{/* Floating Action Button */}
			<button
				onClick={() => setOpen(true)}
				title={t('report_issue')}
				className={cn(
					'w-11 h-11 rounded-full',
					'bg-gradient-to-br from-red-600 to-red-500',
					'text-white',
					'shadow-[0_8px_24px_rgba(220,38,38,0.4)]',
					'transition-all duration-300',
					'hover:from-red-700 hover:to-red-600',
					'hover:shadow-[0_12px_32px_rgba(220,38,38,0.5)]',
					'hover:scale-105',
					'active:scale-95',
					'flex items-center justify-center'
				)}
			>
				<Flag className="w-5 h-5" />
			</button>

			{/* Modal Overlay */}
			{open && (
				<div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-black/50">
					{/* Dialog */}
					<div
						ref={dialogRef}
						className={cn(
							'w-full max-w-md rounded-2xl overflow-hidden',
							'border border-violet-500/20',
							'shadow-[0_20px_60px_rgba(139,92,246,0.25)]',
							'animate-in fade-in zoom-in-95 duration-200',
							isDark
								? 'bg-gradient-to-br from-slate-800 to-slate-900'
								: 'bg-gradient-to-br from-white to-slate-50'
						)}
					>
						{/* Header */}
						<div className={cn(
							'flex items-center gap-4 p-4',
							'border-b',
							isDark ? 'border-violet-500/20' : 'border-violet-200/50'
						)}>
							<div className={cn(
								'w-12 h-12 rounded-full flex items-center justify-center',
								'bg-gradient-to-br from-red-500/10 to-red-600/10',
								'border-2 border-red-500/20'
							)}>
								<Flag className="w-6 h-6 text-red-600" />
							</div>
							<div className="flex-1">
								<h2 className={cn(
									'font-bold text-lg',
									isDark ? 'text-slate-100' : 'text-indigo-950'
								)}>
									{t('report_issue')}
								</h2>
								<p className={cn(
									'text-sm mt-0.5',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									{t('report_description')}
								</p>
							</div>
							<button
								onClick={() => setOpen(false)}
								className={cn(
									'p-2 rounded-lg transition-colors',
									isDark
										? 'text-slate-400 hover:text-violet-400 hover:bg-violet-500/10'
										: 'text-slate-500 hover:text-violet-600 hover:bg-violet-100'
								)}
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Content */}
						<div className="p-4">
							<p className={cn(
								'font-semibold text-sm mb-3',
								isDark ? 'text-slate-200' : 'text-indigo-950'
							)}>
								{t('report_type_label')}
							</p>

							{/* Radio Options */}
							<div className="space-y-2">
								{reportOptions.map((option) => {
									const Icon = option.icon
									const isSelected = reportType === option.value
									return (
										<label
											key={option.value}
											className={cn(
												'flex items-center gap-3 p-3 rounded-xl cursor-pointer',
												'border transition-all duration-200',
												isSelected
													? isDark
														? 'bg-violet-500/10 border-violet-500/30'
														: 'bg-violet-50 border-violet-300'
													: isDark
														? 'border-transparent hover:bg-slate-700/50 hover:border-slate-600'
														: 'border-transparent hover:bg-slate-100 hover:border-slate-200'
											)}
										>
											<input
												type="radio"
												name="reportType"
												value={option.value}
												checked={isSelected}
												onChange={(e) => setReportType(e.target.value)}
												className="sr-only"
											/>
											<div className={cn(
												'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
												isSelected
													? 'border-violet-500 bg-violet-500'
													: isDark
														? 'border-slate-500'
														: 'border-slate-400'
											)}>
												{isSelected && (
													<div className="w-2 h-2 rounded-full bg-white" />
												)}
											</div>
											<Icon className={cn(
												'w-5 h-5',
												isSelected ? 'text-violet-500' : isDark ? 'text-slate-400' : 'text-slate-500'
											)} />
											<span className={cn(
												'text-sm',
												isDark ? 'text-slate-200' : 'text-slate-700'
											)}>
												{t(option.labelKey)}
											</span>
										</label>
									)
								})}
							</div>

							{/* Comment */}
							<div className="mt-4">
								<label className={cn(
									'block text-sm font-medium mb-2',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{t('report_comment_label')}
								</label>
								<textarea
									rows={3}
									placeholder={t('report_comment_placeholder')}
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									className={cn(
										'w-full px-3 py-2 rounded-xl text-sm resize-none',
										'border-2 transition-colors',
										'focus:outline-none',
										isDark
											? 'bg-slate-900 text-slate-100 placeholder-slate-500 border-slate-600 focus:border-violet-500'
											: 'bg-white text-slate-800 placeholder-slate-400 border-slate-300 focus:border-violet-500'
									)}
								/>
							</div>
						</div>

						{/* Actions */}
						<div className={cn(
							'flex justify-end gap-3 p-4',
							'border-t',
							isDark ? 'border-slate-700' : 'border-slate-200'
						)}>
							<button
								onClick={() => setOpen(false)}
								className={cn(
									'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
									isDark
										? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
										: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
								)}
							>
								{t('cancel')}
							</button>
							<button
								onClick={() => reportMutation.mutate()}
								disabled={reportMutation.isPending}
								className={cn(
									'px-5 py-2 rounded-lg text-sm font-semibold text-white',
									'bg-gradient-to-r from-red-600 to-red-500',
									'shadow-[0_4px_12px_rgba(220,38,38,0.3)]',
									'transition-all duration-300',
									'hover:from-red-700 hover:to-red-600',
									'hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]',
									'hover:-translate-y-0.5',
									'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
								)}
							>
								{reportMutation.isPending ? t('report_sending') : t('report_submit')}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ReportButton
