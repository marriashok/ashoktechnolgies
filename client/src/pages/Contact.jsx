import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const Contact = () => {
    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Contact Us</h2>
            <Row className="justify-content-center">
                <Col md={5} className="mb-4 mb-md-0">
                    <div className="p-4 h-100">
                        <h3 className="mb-4">Get In Touch</h3>
                        <p className="lead text-muted mb-4">
                            Have questions about our courses? Reach out to us directly or fill out the form.
                        </p>

                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary text-white p-3 rounded-circle me-3">
                                <i className="bi bi-telephone-fill fs-4"></i>
                            </div>
                            <div>
                                <h6 className="mb-0 text-muted">Phone</h6>
                                <p className="mb-0 fs-5 fw-bold">8074660157</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary text-white p-3 rounded-circle me-3">
                                <i className="bi bi-envelope-fill fs-4"></i>
                            </div>
                            <div>
                                <h6 className="mb-0 text-muted">Email</h6>
                                <p className="mb-0 fs-5 fw-bold">marry.ashok@gmail.com</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <div className="bg-primary text-white p-3 rounded-circle me-3">
                                <i className="bi bi-geo-alt-fill fs-4"></i>
                            </div>
                            <div>
                                <h6 className="mb-0 text-muted">Location</h6>
                                <p className="mb-0 fs-5 fw-bold">Hyderabad, India</p>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col md={6}>
                    <div className="p-4 shadow rounded bg-white">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Your Name" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Your Email" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control as="textarea" rows={4} />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">Send Message</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
export default Contact;
