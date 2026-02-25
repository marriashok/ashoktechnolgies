import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Accordion, Card, Badge, Modal } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const CourseDetail = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Auth & Navigation
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/courses/${slug}`);
                setCourse(data);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [slug]);

    const handleLessonShow = (lesson) => {
        // If course is not free and not enrolled (logic pending), maybe restrict? 
        // For now, assuming Free courses allow viewing or Preview enabled.
        if (course.price === 0 || lesson.isFree) {
            setSelectedLesson(lesson);
            setShowModal(true);
        } else {
            alert('Please enroll to view this lesson.');
        }
    };

    const handleClose = () => setShowModal(false);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setEnrolling(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.post(`http://localhost:5000/api/courses/${course._id}/enroll`, {}, config);
            alert('Enrolled successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const handleDownloadSyllabus = () => {
        const syllabusContent = `
Course: ${course.title}
Level: ${course.level}
Category: ${course.category}

Description:
${course.description}

Curriculum:
${course.modules.map((m, i) => `\nModule ${i + 1}: ${m.title}\n${m.lessons.map(l => ` - ${l.title} (${l.duration})`).join('\n')}`).join('\n')}
        `;

        const element = document.createElement("a");
        const file = new Blob([syllabusContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${course.slug}-syllabus.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    const handleDownloadLesson = () => {
        if (!selectedLesson) return;
        const content = `
Lesson: ${selectedLesson.title}
Duration: ${selectedLesson.duration}

Content:
${selectedLesson.content}
        `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedLesson.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (!course) return <div className="text-center py-5">Course not found</div>;

    return (
        <Container className="py-5">
            <Row>
                <Col md={8}>
                    <h1 className="mb-3">{course.title}</h1>
                    <p className="lead">{course.description}</p>

                    <div className="mb-4">
                        <Badge bg="primary" className="me-2">{course.category}</Badge>
                        <Badge bg="info">{course.level}</Badge>
                    </div>

                    <h3>Curriculum</h3>
                    <Accordion defaultActiveKey="0" className="mb-4">
                        {course.modules.map((module, index) => (
                            <Accordion.Item eventKey={String(index)} key={index}>
                                <Accordion.Header>{module.title}</Accordion.Header>
                                <Accordion.Body>
                                    <ul className="list-unstyled mb-0">
                                        {module.lessons.map((lesson, lIndex) => (
                                            <li
                                                key={lIndex}
                                                className="py-2 border-bottom cursor-pointer"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleLessonShow(lesson)}
                                            >
                                                <i className={`bi bi-${lesson.type === 'video' ? 'play-circle' : 'file-text'} me-2`}></i>
                                                {lesson.title}
                                                {course.price === 0 || lesson.isFree ? <Badge bg="success" className="ms-2">Preview</Badge> : <i className="bi bi-lock-fill ms-2 text-secondary"></i>}
                                                <span className="float-end text-muted small">{lesson.duration}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
                        <Card.Img variant="top" src={course.thumbnail} />
                        <Card.Body>
                            <h2 className="text-primary mb-3">
                                {course.price === 0 ? <span className="text-success">Free</span> : `₹${course.price}`}
                            </h2>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="lg"
                                    className="mt-2"
                                    onClick={handleDownloadSyllabus}
                                >
                                    <i className="bi bi-file-earmark-pdf me-2"></i> Download Syllabus
                                </Button>
                                <Link to="/practice">
                                    <Button variant="outline-dark" size="lg" className="w-100 mt-2">Try Code Practice</Button>
                                </Link>
                            </div>
                            <ul className="list-unstyled mt-4">
                                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Full Lifetime Access</li>
                                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Access on Mobile</li>
                                <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Certificate of Completion</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Lesson Viewer Modal */}
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedLesson?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" style={{ fontFamily: 'Segoe UI' }}>
                    {selectedLesson?.type === 'video' && selectedLesson.videoUrl ? (
                        <div className="ratio ratio-16x9 mb-3">
                            <iframe
                                src={selectedLesson.videoUrl}
                                title={selectedLesson.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : null}

                    <div dangerouslySetInnerHTML={{ __html: selectedLesson?.content?.replace(/\n/g, '<br />') }} />

                    <div className="mt-4 pt-3 border-top">
                        <h5>Resources</h5>
                        <Button variant="outline-primary" size="sm" onClick={handleDownloadLesson}>
                            <i className="bi bi-file-earmark-pdf me-2"></i> Download Notes (Text/PDF)
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CourseDetail;
