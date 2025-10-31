/**
 * Système de styles de boutons cohérent et moderne pour Linguami
 * Utilise Material UI avec des gradients modernes et des effets de transition
 */

// Styles de base communs à tous les boutons
const baseButtonStyles = {
	fontWeight: 700,
	textTransform: 'none',
	borderRadius: 3,
	transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
	fontSize: '1rem',
	minHeight: '48px',
	px: { xs: 2.5, sm: 3 },
	position: 'relative',
	overflow: 'hidden',
}

// Bouton principal - Gaming gradient violet/cyan (actions principales)
export const primaryButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
	border: '1px solid rgba(139, 92, 246, 0.4)',
	boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
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
		transform: 'translateY(-3px) scale(1.02)',
		boxShadow: '0 6px 25px rgba(139, 92, 246, 0.6), 0 0 30px rgba(6, 182, 212, 0.4)',
		background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)',
		'&::before': {
			left: '100%',
		},
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: 'rgba(100, 116, 139, 0.5)',
		color: 'rgba(255, 255, 255, 0.5)',
		border: '1px solid rgba(100, 116, 139, 0.3)',
	},
}

// Bouton secondaire - Gaming gradient cyan/violet inversé (actions importantes)
export const secondaryButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%)',
	border: '1px solid rgba(6, 182, 212, 0.4)',
	boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)',
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
		transform: 'translateY(-3px) scale(1.02)',
		boxShadow: '0 6px 25px rgba(6, 182, 212, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
		background: 'linear-gradient(135deg, rgba(6, 182, 212, 1) 0%, rgba(139, 92, 246, 0.9) 100%)',
		'&::before': {
			left: '100%',
		},
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: 'rgba(100, 116, 139, 0.5)',
		color: 'rgba(255, 255, 255, 0.5)',
		border: '1px solid rgba(100, 116, 139, 0.3)',
	},
}

// Bouton tertiaire - Gradient bleu cyan (actions standard)
export const tertiaryButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
	boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 20px rgba(79, 172, 254, 0.6)',
		background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: '#ccc',
		color: 'white',
	},
}

// Bouton succès - Gaming gradient vert émeraude
export const successButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.8) 100%)',
	border: '1px solid rgba(16, 185, 129, 0.4)',
	boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4), 0 0 20px rgba(5, 150, 105, 0.2)',
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
		transform: 'translateY(-3px) scale(1.02)',
		boxShadow: '0 6px 25px rgba(16, 185, 129, 0.6), 0 0 30px rgba(5, 150, 105, 0.4)',
		background: 'linear-gradient(135deg, rgba(16, 185, 129, 1) 0%, rgba(5, 150, 105, 0.9) 100%)',
		'&::before': {
			left: '100%',
		},
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: 'rgba(100, 116, 139, 0.5)',
		color: 'rgba(255, 255, 255, 0.5)',
		border: '1px solid rgba(100, 116, 139, 0.3)',
	},
}

// Bouton warning - Gradient orange
export const warningButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
	boxShadow: '0 4px 15px rgba(250, 112, 154, 0.4)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 20px rgba(250, 112, 154, 0.6)',
		background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: '#ccc',
		color: 'white',
	},
}

// Bouton outlined - Gaming style pour actions secondaires
export const outlinedButton = {
	...baseButtonStyles,
	background: 'transparent',
	borderWidth: 2,
	borderColor: 'rgba(139, 92, 246, 0.6)',
	color: '#8b5cf6',
	'&:hover': {
		borderWidth: 2,
		borderColor: 'rgba(139, 92, 246, 0.9)',
		backgroundColor: 'rgba(139, 92, 246, 0.15)',
		transform: 'translateY(-2px)',
		boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)',
		color: '#a78bfa',
	},
}

// Bouton outlined secondaire - Gaming style cyan
export const outlinedSecondaryButton = {
	...baseButtonStyles,
	background: 'transparent',
	borderWidth: 2,
	borderColor: 'rgba(6, 182, 212, 0.6)',
	color: '#06b6d4',
	'&:hover': {
		borderWidth: 2,
		borderColor: 'rgba(6, 182, 212, 0.9)',
		backgroundColor: 'rgba(6, 182, 212, 0.15)',
		transform: 'translateY(-2px)',
		boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3), 0 0 20px rgba(6, 182, 212, 0.2)',
		color: '#67e8f9',
	},
}

// Bouton text - Pour actions subtiles
export const textButton = {
	...baseButtonStyles,
	color: '#667eea',
	'&:hover': {
		backgroundColor: 'rgba(102, 126, 234, 0.08)',
		transform: 'translateY(-2px)',
	},
}

// Bouton glassmorphisme - Pour la navbar et overlays
export const glassButton = {
	...baseButtonStyles,
	background: 'rgba(255, 255, 255, 0.15)',
	backdropFilter: 'blur(10px)',
	color: 'white',
	border: '1px solid rgba(255, 255, 255, 0.2)',
	'&:hover': {
		background: 'rgba(255, 255, 255, 0.25)',
		transform: 'translateY(-2px)',
	},
}

// Bouton large - Pour actions importantes avec taille augmentée
export const largeButton = {
	minHeight: '56px',
	px: 3,
}

// Bouton avec icône - Padding ajusté pour les icônes
export const iconButton = {
	px: 2,
	gap: 1,
}

// Bouton pleine largeur - Pour mobile
export const fullWidthButton = {
	width: '100%',
}

// Styles pour OAuth buttons (Google, etc.)
export const oauthButton = {
	...baseButtonStyles,
	backgroundColor: 'white',
	color: '#333',
	border: '2px solid #e0e0e0',
	boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
	'&:hover': {
		backgroundColor: '#f5f5f5',
		borderColor: '#ccc',
		transform: 'translateY(-2px)',
		boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
	},
}

// Bouton de suppression - Gaming gradient rouge
export const deleteButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.8) 100%)',
	border: '1px solid rgba(239, 68, 68, 0.4)',
	boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4), 0 0 20px rgba(185, 28, 28, 0.2)',
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
		transform: 'translateY(-3px) scale(1.02)',
		boxShadow: '0 6px 25px rgba(239, 68, 68, 0.6), 0 0 30px rgba(185, 28, 28, 0.4)',
		background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(185, 28, 28, 0.9) 100%)',
		'&::before': {
			left: '100%',
		},
	},
}

// Bouton neutre - Gris
export const neutralButton = {
	...baseButtonStyles,
	borderWidth: 2,
	borderColor: '#e0e0e0',
	color: '#666',
	'&:hover': {
		borderWidth: 2,
		borderColor: '#bbb',
		backgroundColor: 'rgba(0,0,0,0.02)',
		transform: 'translateY(-2px)',
	},
}

// Export d'un objet pour faciliter l'import
export const buttonStyles = {
	primary: primaryButton,
	secondary: secondaryButton,
	tertiary: tertiaryButton,
	success: successButton,
	warning: warningButton,
	outlined: outlinedButton,
	outlinedSecondary: outlinedSecondaryButton,
	text: textButton,
	glass: glassButton,
	large: largeButton,
	icon: iconButton,
	fullWidth: fullWidthButton,
	oauth: oauthButton,
	delete: deleteButton,
	neutral: neutralButton,
}

export default buttonStyles
