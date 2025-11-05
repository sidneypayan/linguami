/**
 * Composants de drapeaux pour les sélecteurs de langue
 */

export const FrenchFlag = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<circle cx="16" cy="16" r="16" fill="#ED2939"/>
		<path d="M 16 0 A 16 16 0 0 0 16 32 L 16 0" fill="#002395"/>
		<path d="M 16 0 L 16 32 A 16 16 0 0 0 16 0" fill="#ED2939"/>
		<rect x="10.67" width="10.67" height="32" fill="white"/>
	</svg>
)

export const RussianFlag = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<circle cx="16" cy="16" r="16" fill="#0039A6"/>
		<rect width="32" height="10.67" fill="white"/>
		<rect y="10.67" width="32" height="10.67" fill="#0039A6"/>
		<rect y="21.33" width="32" height="10.67" fill="#D52B1E"/>
	</svg>
)

export const EnglishFlag = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<clipPath id="circle-clip-auth">
			<circle cx="16" cy="16" r="16"/>
		</clipPath>
		<g clipPath="url(#circle-clip-auth)">
			<rect width="32" height="32" fill="#012169"/>
			<path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke="white" strokeWidth="5.3"/>
			<path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke="#C8102E" strokeWidth="3.2"/>
			<path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="white" strokeWidth="8.5"/>
			<path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="#C8102E" strokeWidth="5.3"/>
		</g>
	</svg>
)
