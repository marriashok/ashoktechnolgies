import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={6} className="text-center text-md-start">
                        <p>&copy; {new Date().getFullYear()} Ashok Technologies. All Rights Reserved.</p>
                        <p>Empowering Students with Cutting Edge Technical Skills.</p>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <div className="social-links">
                            <a href="https://github.com/marriashok/ashoktechnolgies" target="_blank" rel="noopener noreferrer" className="text-white me-3"><i className="fab fa-github"></i> GitHub</a>
                            <a href="#" className="text-white me-3"><i className="fab fa-linkedin"></i> LinkedIn</a>
                            <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i> Twitter</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
