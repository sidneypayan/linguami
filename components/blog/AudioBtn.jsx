'use client'

import { Button } from '@/components/ui/button'

const AudioBtn = ({ audio, children }) => {
	return (
		<Button onClick={() => audio?.play()} variant="outline">
			{children}
		</Button>
	)
}

export default AudioBtn
