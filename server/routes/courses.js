const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({}).select('-modules.lessons.content'); // Exclude heavy content for listing
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/courses/:slug
// @desc    Get single course by slug
// @access  Public / Private (Logic for paying students vs guests? For now Public sees outline)
router.get('/:slug', async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug });
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/courses
// @desc    Create a course
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, slug, description, category, price, thumbnail, modules, level } = req.body;

        const course = new Course({
            title,
            slug,
            description,
            category,
            price,
            thumbnail,
            level,
            modules
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            Object.assign(course, req.body);
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = req.user;

        // Check if already enrolled
        if (user.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        user.enrolledCourses.push(course._id);
        await user.save();

        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   POST /api/courses/:id/modules
// @desc    Add a module to a course
// @access  Private/Admin
router.post('/:id/modules', protect, admin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const newModule = {
            title: req.body.title,
            lessons: []
        };

        course.modules.push(newModule);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/courses/:id/modules/:moduleId/lessons
// @desc    Add a lesson to a module
// @access  Private/Admin
router.post('/:id/modules/:moduleId/lessons', protect, admin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(req.params.moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const newLesson = {
            title: req.body.title,
            type: req.body.type,
            content: req.body.content,
            videoUrl: req.body.videoUrl,
            duration: req.body.duration,
            isFree: req.body.isFree || false
        };

        module.lessons.push(newLesson);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/courses/:id/modules/:moduleId
// @desc    Delete a module
// @access  Private/Admin
router.delete('/:id/modules/:moduleId', protect, admin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.modules = course.modules.filter(m => m._id.toString() !== req.params.moduleId);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/courses/:id/modules/:moduleId/lessons/:lessonId
// @desc    Delete a lesson
// @access  Private/Admin
router.delete('/:id/modules/:moduleId/lessons/:lessonId', protect, admin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(req.params.moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        module.lessons = module.lessons.filter(l => l._id.toString() !== req.params.lessonId);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/courses/:id/reorder-modules
// @desc    Reorder modules (swap indices)
// @access  Private/Admin
router.put('/:id/reorder-modules', protect, admin, async (req, res) => {
    try {
        const { sourceIndex, destinationIndex } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const modules = [...course.modules];
        const [removed] = modules.splice(sourceIndex, 1);
        modules.splice(destinationIndex, 0, removed);

        course.modules = modules;
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/courses/:id/modules/:moduleId/reorder-lessons
// @desc    Reorder lessons within a module
// @access  Private/Admin
router.put('/:id/modules/:moduleId/reorder-lessons', protect, admin, async (req, res) => {
    try {
        const { sourceIndex, destinationIndex } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(req.params.moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const lessons = [...module.lessons];
        const [removed] = lessons.splice(sourceIndex, 1);
        lessons.splice(destinationIndex, 0, removed);

        module.lessons = lessons;
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
