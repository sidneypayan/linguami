import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUserContext } from '../context/user'

const ProtectedRoute = ({ protectedRoutes, children }) => {
	const router = useRouter()
	const { user } = useUserContext()

	const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1

	useEffect(() => {
		if (!user && pathIsProtected) {
			return router.push('/')
		}
	}, [])

	return children
}

export default ProtectedRoute
