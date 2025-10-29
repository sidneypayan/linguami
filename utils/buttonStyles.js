/**
 * Système de styles de boutons cohérent et moderne pour Linguami
 * Utilise Material UI avec des gradients modernes et des effets de transition
 */

// Styles de base communs à tous les boutons
const baseButtonStyles = {
	fontWeight: 600,
	textTransform: 'none',
	borderRadius: 2,
	transition: 'all 0.3s ease',
	fontSize: '1rem',
	minHeight: '48px',
	px: { xs: 2.5, sm: 3 },
}

// Bouton principal - Gradient violet (actions principales)
export const primaryButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
		background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: '#ccc',
		color: 'white',
	},
}

// Bouton secondaire - Gradient rose (actions importantes)
export const secondaryButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
	boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 20px rgba(245, 87, 108, 0.6)',
		background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: '#ccc',
		color: 'white',
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

// Bouton succès - Gradient vert
export const successButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
	boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 20px rgba(67, 233, 123, 0.6)',
		background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
	},
	'&:active': {
		transform: 'scale(0.98)',
	},
	'&.Mui-disabled': {
		background: '#ccc',
		color: 'white',
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

// Bouton outlined - Pour actions secondaires
export const outlinedButton = {
	...baseButtonStyles,
	borderWidth: 2,
	borderColor: '#667eea',
	color: '#667eea',
	'&:hover': {
		borderWidth: 2,
		borderColor: '#764ba2',
		backgroundColor: 'rgba(102, 126, 234, 0.08)',
		transform: 'translateY(-2px)',
		boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
	},
}

// Bouton outlined secondaire
export const outlinedSecondaryButton = {
	...baseButtonStyles,
	borderWidth: 2,
	borderColor: '#f093fb',
	color: '#f093fb',
	'&:hover': {
		borderWidth: 2,
		borderColor: '#f5576c',
		backgroundColor: 'rgba(240, 147, 251, 0.08)',
		transform: 'translateY(-2px)',
		boxShadow: '0 4px 12px rgba(240, 147, 251, 0.2)',
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

// Bouton de suppression - Rouge
export const deleteButton = {
	...baseButtonStyles,
	background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
	boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 6px 20px rgba(255, 107, 107, 0.6)',
		background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
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
