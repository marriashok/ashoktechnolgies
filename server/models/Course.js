const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'video'], default: 'text' },
    content: { type: String }, // For text: markdown/html.
    videoUrl: { type: String }, // For video lessons
    duration: { type: String }, // e.g. "10 mins"
    isFree: { type: Boolean, default: false } // For preview
});

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    price: { type: Number, default: 0 },
    category: { type: String, required: true },
    thumbnail: { type: String }, // URL to image
    modules: [moduleSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
