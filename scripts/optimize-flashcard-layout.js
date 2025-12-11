const fs = require('fs');

const filePath = 'C:/Users/Sidney/Documents/linguami/components/flashcards/FlashcardReviewCard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the header section with optimized layout
const oldHeaderSection = `	return (
		<div className={isDark ? styles.containerDark : styles.container}>
			{/* Close button */}
			<button
				onClick={onClose}
				className={cn(
					"absolute top-4 right-4 z-50 p-2 rounded-lg transition-all duration-200",
					isDark
						? "text-violet-400 hover:bg-violet-500/20"
						: "text-violet-600 hover:bg-violet-500/10",
					"hover:rotate-90 hover:scale-110"
				)}
			>
				<X className="w-8 h-8" />
			</button>

			{/* Time up banner */}
			{isTimeUp && (
				<div className={styles.timeUpBanner}>
					{t('time_up_last_card')}
				</div>
			)}

			{/* Header with stats and controls */}
			<div className={styles.header}>
				<div className={styles.progressInfo}>
					{/* Timer display for time-based sessions */}
					{timeLimit && remainingTime !== null && !isTimeUp && (
						<span className={\`\${styles.timerDisplay} \${remainingTime <= 30 ? styles.timerWarning : ''}\`}>
							{formatTime(remainingTime)}
						</span>
					)}
					{/* Show cards remaining only for card-based sessions (not time-based) */}
					{!timeLimit && (
						<span className={styles.cardsRemaining}>
							{sessionCards.length}{' '}
							{sessionCards.length > 1 ? t('cards_remaining_plural') : t('cards_remaining')}
						</span>
					)}
					{/* Show "last card" message when time is up */}
					{isTimeUp && (
						<span className={styles.cardsRemaining}>
							{t('last_card')}
						</span>
					)}
					{currentCard.card_state === CARD_STATES.NEW && (
						<span className={styles.newBadge}>{t('new_badge')}</span>
					)}
					{currentCard.card_state === CARD_STATES.RELEARNING && (
						<span className={styles.relearningBadge}>{t('relearning_badge')}</span>
					)}
				</div>

				<div className={styles.controlsContainer}>
					<button
						className={styles.reverseBtn}
						onClick={onToggleReversed}
						title={t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}>
						<ArrowLeftRight className="w-5 h-5 mr-1" />
						{t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
					</button>
				</div>
			</div>`;

const newHeaderSection = `	return (
		<div className={isDark ? styles.containerDark : styles.container}>
			{/* Top left: Badges + Language switch */}
			<div className={styles.topLeftControls}>
				{/* Badges */}
				{currentCard.card_state === CARD_STATES.NEW && (
					<span className={styles.newBadge}>{t('new_badge')}</span>
				)}
				{currentCard.card_state === CARD_STATES.RELEARNING && (
					<span className={styles.relearningBadge}>{t('relearning_badge')}</span>
				)}

				{/* Language switch button */}
				<button
					className={styles.reverseBtn}
					onClick={onToggleReversed}
					title={t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}>
					<ArrowLeftRight className="w-5 h-5 mr-1" />
					{t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
				</button>
			</div>

			{/* Close button - Top right */}
			<button
				onClick={onClose}
				className={cn(
					"absolute top-4 right-4 z-50 p-2 rounded-lg transition-all duration-200",
					isDark
						? "text-violet-400 hover:bg-violet-500/20"
						: "text-violet-600 hover:bg-violet-500/10",
					"hover:rotate-90 hover:scale-110"
				)}
			>
				<X className="w-8 h-8" />
			</button>

			{/* Time up banner */}
			{isTimeUp && (
				<div className={styles.timeUpBanner}>
					{t('time_up_last_card')}
				</div>
			)}

			{/* Cards counter - Centered */}
			<div className={styles.centerInfo}>
				{/* Timer display for time-based sessions */}
				{timeLimit && remainingTime !== null && !isTimeUp && (
					<span className={\`\${styles.timerDisplay} \${remainingTime <= 30 ? styles.timerWarning : ''}\`}>
						{formatTime(remainingTime)}
					</span>
				)}
				{/* Show cards remaining only for card-based sessions (not time-based) */}
				{!timeLimit && (
					<span className={styles.cardsRemaining}>
						{sessionCards.length}{' '}
						{sessionCards.length > 1 ? t('cards_remaining_plural') : t('cards_remaining')}
					</span>
				)}
				{/* Show "last card" message when time is up */}
				{isTimeUp && (
					<span className={styles.cardsRemaining}>
						{t('last_card')}
					</span>
				)}
			</div>`;

content = content.replace(oldHeaderSection, newHeaderSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Component layout optimized - badges and switch moved to top left');
