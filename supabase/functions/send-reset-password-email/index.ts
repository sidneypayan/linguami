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
		subject: 'Réinitialisation de mot de passe - Linguami',
		html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe - Linguami</title>
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
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; backdrop-filter: blur(10px); line-height: 80px; font-size: 40px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
                                    🔐
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 800;">
                                Linguami
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                                Apprentissage des langues
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 26px; font-weight: 700;">
                                Réinitialisation de votre mot de passe
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe sécurisé.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{resetUrl}}"
                                           style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%); border-radius: 12px; border-left: 4px solid #ef4444;">
                                <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                    ⚠️ Important
                                </p>
                                <p style="margin: 0; color: #7f1d1d; font-size: 13px; line-height: 1.5;">
                                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email ou contactez notre support si vous avez des inquiétudes concernant la sécurité de votre compte.
                                </p>
                            </div>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                    Le bouton ne fonctionne pas ?
                                </p>
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px;">
                                    Copiez ce lien dans votre navigateur :
                                </p>
                                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-weight: 500;">
                                    {{resetUrl}}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%); text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px;">
                                Ce lien expire dans <strong>1 heure</strong>
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                Pour des raisons de sécurité, ce lien ne peut être utilisé qu'une seule fois.
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
		subject: 'Password Reset - Linguami',
		html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Linguami</title>
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
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; backdrop-filter: blur(10px); line-height: 80px; font-size: 40px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
                                    🔐
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 800;">
                                Linguami
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                                Language Learning
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 26px; font-weight: 700;">
                                Reset your password
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                You requested to reset your password. Click the button below to choose a new secure password.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{resetUrl}}"
                                           style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            Reset my password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%); border-radius: 12px; border-left: 4px solid #ef4444;">
                                <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                    ⚠️ Important
                                </p>
                                <p style="margin: 0; color: #7f1d1d; font-size: 13px; line-height: 1.5;">
                                    If you didn't request this password reset, please ignore this email or contact our support if you have concerns about your account security.
                                </p>
                            </div>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                    Button not working?
                                </p>
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px;">
                                    Copy this link into your browser:
                                </p>
                                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-weight: 500;">
                                    {{resetUrl}}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%); text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px;">
                                This link expires in <strong>1 hour</strong>
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                For security reasons, this link can only be used once.
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
		subject: 'Сброс пароля - Linguami',
		html: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Сброс пароля - Linguami</title>
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
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; backdrop-filter: blur(10px); line-height: 80px; font-size: 40px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
                                    🔐
                                </div>
                            </div>
                            <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 800;">
                                Linguami
                            </h1>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                                Изучение языков
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 26px; font-weight: 700;">
                                Сброс пароля
                            </h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Вы запросили сброс пароля. Нажмите на кнопку ниже, чтобы выбрать новый безопасный пароль.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{resetUrl}}"
                                           style="display: inline-block; padding: 18px 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                                            Сбросить пароль
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%); border-radius: 12px; border-left: 4px solid #ef4444;">
                                <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                    ⚠️ Важно
                                </p>
                                <p style="margin: 0; color: #7f1d1d; font-size: 13px; line-height: 1.5;">
                                    Если вы не запрашивали сброс пароля, проигнорируйте это письмо или свяжитесь с нашей службой поддержки, если у вас есть опасения по поводу безопасности вашего аккаунта.
                                </p>
                            </div>
                            <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 12px; border-left: 4px solid #667eea;">
                                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                    Кнопка не работает?
                                </p>
                                <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px;">
                                    Скопируйте эту ссылку в браузер:
                                </p>
                                <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-weight: 500;">
                                    {{resetUrl}}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%); text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px;">
                                Срок действия этой ссылки истекает через <strong>1 час</strong>
                            </p>
                            <p style="margin: 0 0 20px 0; color: #718096; font-size: 12px; line-height: 1.6;">
                                В целях безопасности эта ссылка может быть использована только один раз.
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

		const { email, resetUrl, language = 'fr' } = await req.json()

		if (!email || !resetUrl) {
			throw new Error('Missing required fields: email or resetUrl')
		}

		// Sélectionner le template selon la langue
		const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.fr
		const htmlContent = template.html.replace(/\{\{resetUrl\}\}/g, resetUrl)

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
				from: 'Linguami <noreply@linguami.com>',
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
