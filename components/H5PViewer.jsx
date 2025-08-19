import { useEffect, useRef } from 'react'
import { H5P } from 'h5p-standalone'

const H5PViewer = ({ h5pJsonPath }) => {
	const containerRef = useRef(null)
	const hasInitializedRef = useRef(false)

	useEffect(() => {
		if (containerRef.current && !hasInitializedRef.current) {
			hasInitializedRef.current = true
			containerRef.current.innerHTML = ''
			new H5P(containerRef.current, {
				h5pJsonPath,
				frameJs:
					'https://cdn.jsdelivr.net/npm/h5p-standalone@latest/dist/frame.bundle.js',
				frameCss:
					'https://cdn.jsdelivr.net/npm/h5p-standalone@latest/dist/styles/h5p.css',
			})
		}
	}, [h5pJsonPath])

	return <div ref={containerRef} />
}

export default H5PViewer
