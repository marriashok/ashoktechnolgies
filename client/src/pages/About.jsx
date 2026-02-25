import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-dark text-white py-5 mb-5">
                <Container className="text-center">
                    <h1 className="display-4 fw-bold">About Ashok Technologies</h1>
                    <p className="lead">Empowering the next generation of tech leaders with industry-ready skills.</p>
                </Container>
            </div>

            <Container className="mb-5">
                <Row className="align-items-center mb-5">
                    <Col md={6}>
                        <img
                            src="https://placehold.co/600x400?text=Institute+Campus"
                            alt="Institute"
                            className="img-fluid rounded shadow-sm"
                        />
                    </Col>
                    <Col md={6}>
                        <h2 className="mb-3">Who We Are</h2>
                        <p className="lead text-muted">
                            We are a premier training institute dedicated to bridging the gap between academic learning and industry requirements.
                            Founded in 2024, we have trained over 5000+ students in cutting-edge technologies.
                        </p>
                        <p>
                            Our curriculum is designed by industry experts to ensure you learn what matters most.
                            Whether you are a beginner looking to start a career in IT or a professional aiming to upskill, we have the right course for you.
                        </p>
                        <Link to="/courses">
                            <Button variant="primary">Explore Courses</Button>
                        </Link>
                    </Col>
                </Row>

                <div className="bg-light p-5 rounded mb-5 text-center">
                    <h2 className="mb-4">Our Mission</h2>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <p className="fs-5 fst-italic">
                                "To provide affordable, high-quality, and accessible technology education to everyone,
                                fostering a community of lifelong learners and innovators."
                            </p>
                        </Col>
                    </Row>
                </div>

                <h2 className="text-center mb-4">Meet Our Expert Trainers</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="text-center h-100 border-0 shadow-sm">
                            <Card.Body>
                                <img
                                    src="https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff&size=128"
                                    className="rounded-circle mb-3"
                                    alt="Trainer"
                                />
                                <Card.Title>Alex Johnson</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Full Stack Architect</Card.Subtitle>
                                <Card.Text>10+ years of experience in MERN stack and Cloud Computing. Ex-Google.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="text-center h-100 border-0 shadow-sm">
                            <Card.Body>
                                <img
                                    src="https://ui-avatars.com/api/?name=Sarah+Lee&background=E91E63&color=fff&size=128"
                                    className="rounded-circle mb-3"
                                    alt="Trainer"
                                />
                                <Card.Title>Sarah Lee</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">UI/UX Designer & Frontend Lead</Card.Subtitle>
                                <Card.Text>Expert in React, Figma, and modern Design Systems. Passionate about user-centric design.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="text-center h-100 border-0 shadow-sm">
                            <Card.Body>
                                <img
                                    src="https://ui-avatars.com/api/?name=Rahul+Verma&background=4CAF50&color=fff&size=128"
                                    className="rounded-circle mb-3"
                                    alt="Trainer"
                                />
                                <Card.Title>Rahul Verma</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Backend Specialist (Python/Node)</Card.Subtitle>
                                <Card.Text>Specializes in scalable backend systems, APIs, and Database Management.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
