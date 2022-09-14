import mongoose from 'mongoose'

const MaterialSchema = new mongoose.Schema(
	{
		lang: {
			type: String,
			required: true,
		},
		section: {
			type: String,
			required: true,
		},
		level: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		img: {
			type: String,
		},
		audio: {
			type: String,
		},
		video: {
			type: String,
		},
		text: {
			type: String,
			required: true,
		},
		textwithaccents: {
			type: String,
		},
	},
	{ timestamps: true }
)

export default mongoose.models.Material ||
	mongoose.model('Material', MaterialSchema)
