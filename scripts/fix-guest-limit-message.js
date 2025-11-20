const fs = require('fs')

const filePath = 'components/material/Translation.jsx'
const content = fs.readFileSync(filePath, 'utf8')

// Replace the conditional rendering to show guest limit message even when no translation found
const newContent = content.replace(
	/(\) : null\})\s*<\/Paper>/,
	`) : (
				/* No translation found - still show guest limit message if applicable */
				!isUserLoggedIn && hasDictionaryLimit && (
					<Box sx={{ p: 2 }}>
						<Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
							Aucune traduction trouvée
						</Typography>
						<GuestLimitMessage hasReachedLimit={true} />
					</Box>
				)
			)}
			</Paper>`
)

fs.writeFileSync(filePath, newContent)
console.log('✓ Updated Translation.jsx to show guest limit message even without translation')
