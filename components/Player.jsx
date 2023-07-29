import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

const Player = ({ src }) => {
	return (
		<AudioPlayer
			url='https://fxadatcycupiinjjdzpe.supabase.co/storage/v1/object/public/linguami/audio/l_ami_d_enfance_ru.mp3?t=2022-10-22T13%3A34%3A00.892Z'
			controls={true}
			style={{
				// backgroundColor: '#fff',
				boxShadow: 'none',
			}}
			src={src}
		/>
	)
}

export default Player
