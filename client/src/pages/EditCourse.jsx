import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Accordion, ListGroup, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Module State
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [moduleTitle, setModuleTitle] = useState('');

    // Lesson State
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [lessonData, setLessonData] = useState({ title: '', type: 'text', content: '', videoUrl: '', duration: '' });

    const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchCourse();
    }, [id, user]);

    const fetchCourse = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
            setCourse(data);
        } catch (error) {
            console.error(error);
            alert('Error fetching course');
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = async () => {
        try {
            await axios.post(`http://localhost:5000/api/courses/${id}/modules`, { title: moduleTitle }, config);
            setShowModuleModal(false);
            setModuleTitle('');
            fetchCourse();
        } catch (error) {
            alert('Failed to add module');
        }
    };

    const handleAddLesson = async () => {
        try {
            await axios.post(`http://localhost:5000/api/courses/${id}/modules/${currentModuleId}/lessons`, lessonData, config);
            setShowLessonModal(false);
            setLessonData({ title: '', type: 'text', content: '', videoUrl: '', duration: '' });
            fetchCourse();
        } catch (error) {
            alert('Failed to add lesson');
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Are you sure you want to delete this module?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}/modules/${moduleId}`, config);
            fetchCourse();
        } catch (error) {
            alert('Failed to delete module');
        }
    };

    const handleDeleteLesson = async (moduleId, lessonId) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}/modules/${moduleId}/lessons/${lessonId}`, config);
            fetchCourse();
        } catch (error) {
            alert('Failed to delete lesson');
        }
    };

    const handleMoveModule = async (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= course.modules.length) return;
        try {
            await axios.put(`http://localhost:5000/api/courses/${id}/reorder-modules`, { sourceIndex: index, destinationIndex: newIndex }, config);
            fetchCourse();
        } catch (error) {
            alert('Failed to move module');
        }
    };

    const handleMoveLesson = async (moduleId, index, direction) => {
        const module = course.modules.find(m => m._id === moduleId);
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= module.lessons.length) return;
        try {
            await axios.put(`http://localhost:5000/api/courses/${id}/modules/${moduleId}/reorder-lessons`, { sourceIndex: index, destinationIndex: newIndex }, config);
            fetchCourse();
        } catch (error) {
            alert('Failed to move lesson');
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (!course) return <div className="text-center py-5">Course not found</div>;

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Content: {course.title}</h2>
                <Button variant="success" onClick={() => setShowModuleModal(true)}>+ Add Module</Button>
            </div>

            <Accordion defaultActiveKey="0">
                {course.modules.map((module, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={module._id}>
                        <Accordion.Header>
                            <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="d-flex flex-column me-2">
                                        <i className="bi bi-caret-up-fill" style={{ cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }} onClick={(e) => { e.stopPropagation(); handleMoveModule(idx, 'up'); }}></i>
                                        <i className="bi bi-caret-down-fill" style={{ cursor: 'pointer', opacity: idx === course.modules.length - 1 ? 0.3 : 1 }} onClick={(e) => { e.stopPropagation(); handleMoveModule(idx, 'down'); }}></i>
                                    </div>
                                    <span className="fw-bold">{module.title}</span>
                                </div>
                                <div>
                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={(e) => { e.stopPropagation(); setCurrentModuleId(module._id); setShowLessonModal(true); }}>
                                        + Add Lesson
                                    </Button>
                                    <Button size="sm" variant="outline-danger" onClick={(e) => { e.stopPropagation(); handleDeleteModule(module._id); }}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ListGroup>
                                {module.lessons.map((lesson, lIdx) => (
                                    <ListGroup.Item key={lesson._id} className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-column me-3">
                                                <i className="bi bi-caret-up-fill small" style={{ cursor: 'pointer', opacity: lIdx === 0 ? 0.3 : 1 }} onClick={() => handleMoveLesson(module._id, lIdx, 'up')}></i>
                                                <i className="bi bi-caret-down-fill small" style={{ cursor: 'pointer', opacity: lIdx === module.lessons.length - 1 ? 0.3 : 1 }} onClick={() => handleMoveLesson(module._id, lIdx, 'down')}></i>
                                            </div>
                                            <i className={`bi bi-${lesson.type === 'video' ? 'play-circle' : 'file-text'} me-2`}></i>
                                            {lesson.title}
                                        </div>
                                        <div>
                                            <span className="text-muted small me-3">{lesson.duration}</span>
                                            <Button size="sm" variant="link" className="text-danger p-0" onClick={() => handleDeleteLesson(module._id, lesson._id)}>
                                                <i className="bi bi-x-circle"></i>
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

            {/* Add Module Modal */}
            <Modal show={showModuleModal} onHide={() => setShowModuleModal(false)}>
                <Modal.Header closeButton><Modal.Title>Add Module</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Module Title</Form.Label>
                        <Form.Control value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAddModule}>Add</Button>
                </Modal.Footer>
            </Modal>

            {/* Add Lesson Modal */}
            <Modal show={showLessonModal} onHide={() => setShowLessonModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Add Lesson</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={lessonData.title} onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select value={lessonData.type} onChange={(e) => setLessonData({ ...lessonData, type: e.target.value })}>
                            <option value="text">Text/Article</option>
                            <option value="video">Video</option>
                        </Form.Select>
                    </Form.Group>
                    {lessonData.type === 'video' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Video URL (YouTube Embed)</Form.Label>
                            <Form.Control value={lessonData.videoUrl} onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control value={lessonData.duration} onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })} placeholder="e.g. 10 mins" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <ReactQuill theme="snow" value={lessonData.content} onChange={(val) => setLessonData({ ...lessonData, content: val })} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAddLesson}>Save Lesson</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EditCourse;
