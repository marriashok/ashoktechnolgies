import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [featuredCourses, setFeaturedCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/courses');
                // Just take the first 3 for "Featured"
                setFeaturedCourses(data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-gradient text-white py-5 mb-5 text-center position-relative overflow-hidden" style={{ minHeight: '600px', display: 'flex', alignItems: 'center' }}>
                <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
                    <h1 className="display-2 fw-bold underline-gold mb-3">Ashok Technologies</h1>
                    <p className="lead mb-5 fs-3 text-secondary" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        Mastering the future of tech. Learn HTML, React, Node.js, Python, and SQL with industry experts.
                    </p>
                    <div className="d-flex justify-content-center gap-4">
                        <Link to="/courses">
                            <Button variant="primary" size="lg" className="px-5 py-3 shadow-lg">Start Learning Now</Button>
                        </Link>
                        <Link to="/practice">
                            <Button variant="outline-light" size="lg" className="px-5 py-3">Try Code Editor</Button>
                        </Link>
                    </div>
                </Container>
                {/* Visual elements */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
            </div>

            {/* Featured Courses */}
            <Container className="mb-5">
                <h2 className="text-center mb-4">Featured Courses</h2>
                <Row>
                    {featuredCourses.map(course => (
                        <Col key={course._id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 transition-hover">
                                <Card.Img variant="top" src={course.thumbnail} style={{ height: '200px', objectFit: 'cover' }} />
                                <Card.Body className="d-flex flex-column">
                                    <div className="mb-2">
                                        <span className={`badge me-2 ${course.category === 'Frontend' ? 'bg-info' : course.category === 'Backend' ? 'bg-dark' : 'bg-primary'}`}>
                                            {course.category}
                                        </span>
                                        <span className="badge bg-secondary">{course.level}</span>
                                    </div>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Link to={`/courses/${course.slug}`} className="mt-auto">
                                        <Button variant="outline-primary" className="w-100">View Course</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="text-center">
                    <Link to="/courses">
                        <Button variant="link">View All Courses</Button>
                    </Link>
                </div>
            </Container>

            {/* Categories / Features */}
            <Container className="mb-5">
                <h2 className="text-center mb-4">Why Choose Us?</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center">
                                <div className="display-4 text-primary mb-3"><i className="bi bi-laptop"></i></div>
                                <Card.Title>Expert Instructors</Card.Title>
                                <Card.Text>Learn from industry experts with real-world experience.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center">
                                <div className="display-4 text-primary mb-3"><i className="bi bi-code-slash"></i></div>
                                <Card.Title>Hands-on Practice</Card.Title>
                                <Card.Text>Practice coding directly in your browser with our interactive editor.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body className="text-center">
                                <div className="display-4 text-primary mb-3"><i className="bi bi-award"></i></div>
                                <Card.Title>Certificates</Card.Title>
                                <Card.Text>Earn certificates upon completion to showcase your skills.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Reference Resources */}
            <Container className="mb-5 py-4">
                <h2 className="text-center mb-4 underline-gold">Important Reference Links</h2>
                <Row className="g-4">
                    <Col md={3}>
                        <Card className="h-100 text-center border-0 bg-light p-3">
                            <Card.Body>
                                <i className="fab fa-html5 fs-1 text-danger mb-3"></i>
                                <h6>MDN Web Docs</h6>
                                <a href="https://developer.mozilla.org/" target="_blank" className="btn btn-sm btn-outline-dark">Visit</a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="h-100 text-center border-0 bg-light p-3">
                            <Card.Body>
                                <i className="fab fa-react fs-1 text-info mb-3"></i>
                                <h6>React Documentation</h6>
                                <a href="https://react.dev/" target="_blank" className="btn btn-sm btn-outline-dark">Visit</a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="h-100 text-center border-0 bg-light p-3">
                            <Card.Body>
                                <i className="fab fa-python fs-1 text-primary mb-3"></i>
                                <h6>Python Official Docs</h6>
                                <a href="https://docs.python.org/" target="_blank" className="btn btn-sm btn-outline-dark">Visit</a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="h-100 text-center border-0 bg-light p-3">
                            <Card.Body>
                                <i className="fas fa-database fs-1 text-warning mb-3"></i>
                                <h6>W3Schools SQL</h6>
                                <a href="https://www.w3schools.com/sql/" target="_blank" className="btn btn-sm btn-outline-dark">Visit</a>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <div className="bg-light py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h2>Ready to start learning?</h2>
                            <p className="lead">Register now and get unlimited access to our top-rated courses.</p>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <Link to="/register">
                                <Button variant="primary" size="lg">Join For Free</Button>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;
