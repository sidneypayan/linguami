import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers':
		'authorization, x-client-info, apikey, content-type',
}

// Templates d'email par langue
const emailTemplates = {
	fr: {
		subject: 'Confirmez votre compte - Linguami',
		html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmez votre compte - Linguami</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15); overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; backdrop-filter: blur(10px); line-height: 80px; font-size: 40px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
                                    🌍
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                                Linguami
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                                Apprentissage des langues
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                                Bienvenue sur Linguami ! 🎉
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Nous sommes ravis de vous accueillir dans notre communauté d'apprenants passionnés !
                                Pour commencer votre aventure linguistique, veuillez confirmer votre adresse email.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{confirmationUrl}}"
                                           style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            Confirmer mon compte
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                    Le bouton ne fonctionne pas ?
                                </p>
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; line-height: 1.5;">
                                    Copiez et collez ce lien dans votre navigateur :
                                </p>
                                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-weight: 500;">
                                    {{confirmationUrl}}
                                </p>
                            </div>
                            <div style="margin-top: 35px; padding-top: 30px; border-top: 2px solid #e9ecef;">
                                <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                                    Ce qui vous attend sur Linguami :
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">📚</span>
                                            <span style="color: #4a5568; font-size: 14px;">Des matériels d'apprentissage variés et authentiques</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">💬</span>
                                            <span style="color: #4a5568; font-size: 14px;">Un système de traduction interactif et personnalisé</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">🎯</span>
                                            <span style="color: #4a5568; font-size: 14px;">Des exercices adaptés à votre niveau</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">🏆</span>
                                            <span style="color: #4a5568; font-size: 14px;">Un suivi de vos progrès avec le système XP</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%); text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px;">
                                Ce lien de confirmation expire dans <strong>24 heures</strong>
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                Vous recevez cet email car vous vous êtes inscrit sur Linguami.<br>
                                Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
                            </p>
                            <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px 0; color: #667eea; font-size: 20px; font-weight: 800;">
                                    Linguami
                                </p>
                                <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                                    © 2025 Linguami. Tous droits réservés.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
	},
	en: {
		subject: 'Confirm your account - Linguami',
		html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm your account - Linguami</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15); overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; backdrop-filter: blur(10px); line-height: 80px; font-size: 40px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
                                    🌍
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                                Linguami
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                                Language Learning
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                                Welcome to Linguami! 🎉
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                We're excited to welcome you to our community of passionate learners!
                                To begin your language journey, please confirm your email address.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{confirmationUrl}}"
                                           style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            Confirm my account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                    Button not working?
                                </p>
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; line-height: 1.5;">
                                    Copy and paste this link into your browser:
                                </p>
                                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-weight: 500;">
                                    {{confirmationUrl}}
                                </p>
                            </div>
                            <div style="margin-top: 35px; padding-top: 30px; border-top: 2px solid #e9ecef;">
                                <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                                    What awaits you on Linguami:
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">📚</span>
                                            <span style="color: #4a5568; font-size: 14px;">Diverse and authentic learning materials</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">💬</span>
                                            <span style="color: #4a5568; font-size: 14px;">An interactive and personalized translation system</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">🎯</span>
                                            <span style="color: #4a5568; font-size: 14px;">Exercises adapted to your level</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">🏆</span>
                                            <span style="color: #4a5568; font-size: 14px;">Track your progress with the XP system</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%); text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px;">
                                This confirmation link expires in <strong>24 hours</strong>
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                You received this email because you signed up on Linguami.<br>
                                If you didn't create an account, you can safely ignore this email.
                            </p>
                            <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px 0; color: #667eea; font-size: 20px; font-weight: 800;">
                                    Linguami
                                </p>
                                <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                                    © 2025 Linguami. All rights reserved.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
	},
	ru: {
		subject: 'Подтвердите аккаунт - Linguami',
		html: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтвердите аккаунт - Linguami</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15); overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; backdrop-filter: blur(10px); line-height: 80px; font-size: 40px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
                                    🌍
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                                Linguami
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                                Изучение языков
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                                Добро пожаловать в Linguami! 🎉
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Мы рады приветствовать вас в нашем сообществе увлеченных учеников!
                                Чтобы начать свое языковое путешествие, пожалуйста, подтвердите адрес электронной почты.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{confirmationUrl}}"
                                           style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            Подтвердить аккаунт
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                    Кнопка не работает?
                                </p>
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; line-height: 1.5;">
                                    Скопируйте и вставьте эту ссылку в браузер:
                                </p>
                                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-weight: 500;">
                                    {{confirmationUrl}}
                                </p>
                            </div>
                            <div style="margin-top: 35px; padding-top: 30px; border-top: 2px solid #e9ecef;">
                                <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 15px; font-weight: 600;">
                                    Что вас ждет на Linguami:
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">📚</span>
                                            <span style="color: #4a5568; font-size: 14px;">Разнообразные аутентичные учебные материалы</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">💬</span>
                                            <span style="color: #4a5568; font-size: 14px;">Интерактивная персонализированная система перевода</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">🎯</span>
                                            <span style="color: #4a5568; font-size: 14px;">Упражнения, адаптированные к вашему уровню</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="display: inline-block; font-size: 20px; margin-right: 12px;">🏆</span>
                                            <span style="color: #4a5568; font-size: 14px;">Отслеживание прогресса с помощью системы XP</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%); text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px;">
                                Срок действия этой ссылки истекает через <strong>24 часа</strong>
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                Вы получили это письмо, потому что зарегистрировались на Linguami.<br>
                                Если вы не создавали аккаунт, можете смело проигнорировать это письмо.
                            </p>
                            <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px 0; color: #667eea; font-size: 20px; font-weight: 800;">
                                    Linguami
                                </p>
                                <p style="margin: 0; color: #a0aec0; font-size: 11px;">
                                    © 2025 Linguami. Все права защищены.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
	},
}

serve(async req => {
	// Handle CORS
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}

	try {
		const supabaseClient = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			{
				global: {
					headers: { Authorization: req.headers.get('Authorization')! },
				},
			}
		)

		const { email, confirmationUrl, language = 'fr' } = await req.json()

		if (!email || !confirmationUrl) {
			throw new Error('Missing required fields: email or confirmationUrl')
		}

		// Sélectionner le template selon la langue
		const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.fr
		const htmlContent = template.html.replace(/\{\{confirmationUrl\}\}/g, confirmationUrl)

		// Envoyer l'email via Resend
		const resendApiKey = Deno.env.get('RESEND_API_KEY')
		if (!resendApiKey) {
			throw new Error('RESEND_API_KEY not configured')
		}

		const resendResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${resendApiKey}`,
			},
			body: JSON.stringify({
				from: 'Linguami <onboarding@resend.dev>',
				to: [email],
				subject: template.subject,
				html: htmlContent,
			}),
		})

		if (!resendResponse.ok) {
			const error = await resendResponse.text()
			throw new Error(`Resend API error: ${error}`)
		}

		const data = await resendResponse.json()

		return new Response(JSON.stringify({ success: true, data }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 200,
		})
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: error.message,
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 400,
			}
		)
	}
})
