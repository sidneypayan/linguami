const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../app/[locale]/teacher/page.js')
let content = fs.readFileSync(filePath, 'utf8')

// Définir les reviews pour référence
const reviewsArray = `[
								{
									name: 'David',
									text: "Natacha se donne beaucoup de mal pour préparer le cours suivant en fonction du besoin du moment. Les moyens pour apprendre sont sur mesure. Super ambiance. J'attends chaque cours avec impatience",
									color: '#8b5cf6',
								},
								{
									name: 'Carole',
									text: "Je suis très satisfaite du cours. Natalia est attentive aux différents besoins des élèves, gentille et agréable. L'apprentissage est rapide et facile grâce à sa pedagogie. Autres points forts, la flexibilité pour les horaires et le bon matériel didactique (livres, audios) mis à disposition",
									color: '#06b6d4',
								},
								{
									name: 'Daniel',
									text: "Depuis 1 an j'apprends le Russe avec Natacha et je suis très satisfait de ma professeure, je progresse facilement et j'ai pu commencer quelques dialogues lors de 2 voyages à Saint Petersbourg. Sa méthode d'apprentissage est facile et complète",
									color: '#8b5cf6',
								},
							]`

// Remplacer la section Swiper
content = content.replace(
	/<Box sx={{ position: 'relative' }}>[\s\S]*?<\/Swiper>\s*<\/Box>/,
	`<Box sx={{ overflow: 'hidden', py: { xs: 3, md: 4 } }}>
							<Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
								<Box
									sx={{
										display: 'flex',
										gap: { xs: 2, sm: 3, md: 4 },
										'& > *': {
											flex: '0 0 100%',
											minWidth: 0,
											'@media (min-width: 768px)': {
												flex: '0 0 calc(50% - 12px)',
											},
											'@media (min-width: 1024px)': {
												flex: '0 0 calc(33.333% - 21.333px)',
											},
										},
									}}>
									{${reviewsArray}.map((review, index) => (
										<Box key={review.name}>
											<Card
												sx={{
													width: '100%',
													position: 'relative',
													borderRadius: 4,
													overflow: 'visible',
													background: isDark
														? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
														: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
													boxShadow: isDark
														? '0 4px 20px rgba(139, 92, 246, 0.25)'
														: '0 4px 20px rgba(139, 92, 246, 0.15)',
													border: isDark
														? '1px solid rgba(139, 92, 246, 0.3)'
														: '1px solid rgba(139, 92, 246, 0.2)',
													transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
													'&:hover': {
														transform: 'translateY(-8px)',
														boxShadow: isDark
															? '0 12px 40px rgba(139, 92, 246, 0.4)'
															: '0 12px 40px rgba(139, 92, 246, 0.3)',
														borderColor: 'rgba(139, 92, 246, 0.4)',
													},
												}}>
												<Box
													sx={{
														position: 'absolute',
														top: -20,
														left: 24,
														width: 48,
														height: 48,
														borderRadius: '50%',
														background: \`linear-gradient(135deg, \${review.color} 0%, \${review.color === '#8b5cf6' ? '#06b6d4' : '#8b5cf6'} 100%)\`,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														boxShadow: \`0 4px 12px \${review.color}40\`,
														border: '2px solid rgba(255, 255, 255, 0.3)',
													}}>
													<FormatQuote sx={{ color: 'white', fontSize: 28 }} />
												</Box>
												<CardContent sx={{ pt: 5, pb: 4, px: 3 }}>
													<Typography
														variant='h5'
														align='center'
														sx={{
															fontWeight: 700,
															mb: 2,
															color: isDark ? '#f1f5f9' : '#2d3748',
															fontSize: { xs: '1.25rem', sm: '1.5rem' },
														}}>
														{review.name}
													</Typography>
													<Typography
														variant='body1'
														sx={{
															color: isDark ? '#cbd5e1' : '#718096',
															lineHeight: 1.7,
															fontSize: { xs: '0.9375rem', sm: '1rem' },
															textAlign: 'center',
														}}>
														{review.text}
													</Typography>
												</CardContent>
											</Card>
										</Box>
									))}
								</Box>
							</Box>
						</Box>`
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Teacher carousel migré vers Embla')
