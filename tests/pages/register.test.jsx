import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Register from '../../pages/register'
import UserProvider from '../../context/user'

import { toast } from 'react-toastify'

test('alert is triggered on submit if name field is empty', async () => {
	render(
		<UserProvider>
			<Register />
		</UserProvider>
	)

	const error = userEvent.type(screen.getByLabelText(/name/i), 'Sidney')
	userEvent.type(screen.getByLabelText(/email/i), '')
	userEvent.type(screen.getByLabelText(/password/i), '11111111')
	userEvent.click(screen.getByTestId('form'))
	expect(
		await screen.getByText('Veuillez renseigner tous les champs')
	).toBeInTheDocument()
})
