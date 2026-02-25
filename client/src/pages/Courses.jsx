import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/courses');
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Get unique categories
    const categories = ['All', ...new Set(courses.map(course => course.category))];

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Our Courses</h2>

            {/* Search and Filter Section */}
            <Row className="mb-4 justify-content-center">
                <Col md={8}>
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="form-select w-auto"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </Col>
            </Row>

            <Row>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
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
                                    <Card.Text className="text-muted small">
                                        {course.description.substring(0, 100)}...
                                    </Card.Text>
                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 text-primary">
                                            {course.price === 0 ? <span className="text-success">Free</span> : `₹${course.price}`}
                                        </h5>
                                        <Link to={`/courses/${course.slug}`}>
                                            <Button variant="outline-primary">View Details</Button>
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center py-5">
                        <h4 className="text-muted">No courses found matching your criteria.</h4>
                        <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>Clear Filters</Button>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Courses;
