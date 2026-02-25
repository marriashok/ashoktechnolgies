import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navigation = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar variant="dark" expand="lg" collapseOnSelect className="py-3 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
                    <span style={{ color: 'var(--primary)' }}>ASHOK</span> TECHNOLOGIES
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                        <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/practice">Code Practice</Nav.Link>

                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                                )}
                                <Button variant="outline-light" size="sm" className="ms-2" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline-light" size="sm" className="ms-2">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="light" size="sm" className="ms-2">Register</Button>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
