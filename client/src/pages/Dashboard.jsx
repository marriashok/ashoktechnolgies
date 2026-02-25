import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'; // Import Badge here
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, setUser } = useContext(AuthContext); // Assuming setUser is available to update context if needed, or we just fetch local state
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/auth/me', config);
                // setEnrolledCourses(data.enrolledCourses); 
                // Updating global user context might be better if the context supports it, 
                // but for now let's just use local state for the course list to be safe and fast.
                setEnrolledCourses(data.enrolledCourses || []);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user]);

    if (!user) return <div className="text-center py-5">Please login to view dashboard</div>;

    return (
        <Container className="py-5">
            <h1 className="mb-4">My Dashboard</h1>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    className="rounded-circle"
                                    alt="Profile"
                                    width="100"
                                />
                            </div>
                            <h4>{user.name}</h4>
                            <p className="text-muted">{user.email}</p>
                            <Badge bg={user.role === 'admin' ? 'danger' : 'success'}>{user.role.toUpperCase()}</Badge>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <h3 className="mb-4">Enrolled Courses</h3>
                            {loading ? (
                                <p>Loading courses...</p>
                            ) : enrolledCourses.length > 0 ? (
                                <Row>
                                    {enrolledCourses.map(course => (
                                        <Col key={course._id} md={6} className="mb-3">
                                            <Card className="h-100 shadow-sm">
                                                <Card.Img variant="top" src={course.thumbnail} style={{ height: '150px', objectFit: 'cover' }} />
                                                <Card.Body>
                                                    <Card.Title className="h6">{course.title}</Card.Title>
                                                    <div className="mb-2">
                                                        <Badge bg="primary" className="me-1">{course.category}</Badge>
                                                        <Badge bg="info">{course.level}</Badge>
                                                    </div>
                                                    <Link to={`/courses/${course.slug}`}>
                                                        <Button variant="outline-primary" size="sm" className="w-100">Continue Learning</Button>
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                                    <Link to="/courses">
                                        <Button variant="primary">Browse Courses</Button>
                                    </Link>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
