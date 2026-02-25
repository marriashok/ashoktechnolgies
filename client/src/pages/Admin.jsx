import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Admin = () => {
    const [courses, setCourses] = useState([]);
    const [show, setShow] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Form states
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);

    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchCourses();
    }, [user, navigate]);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/courses');
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/courses/${id}`, config);
                fetchCourses();
            } catch (error) {
                console.error(error);
                alert('Failed to delete course');
            }
        }
    };

    // Note: To fully implement Lesson Management, we would need a dedicated /admin/course/:id/edit page.
    // For now, adding Quill to the 'Create Course' description.

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/courses', {
                title, slug, description, category, price,
                thumbnail: 'https://placehold.co/600x400',
                modules: []
            }, config);
            setShow(false);
            fetchCourses();
            // Reset form
            setTitle(''); setSlug(''); setDescription('');
        } catch (error) {
            console.error(error);
            alert('Failed to create course');
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
                <Button variant="success" onClick={handleShow}>+ Add New Course</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course._id}>
                            <td>{course.title}</td>
                            <td>{course.category}</td>
                            <td>₹{course.price}</td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/admin/course/${course._id}/edit`)}>Edit Content</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(course._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug (URL)</Form.Label>
                            <Form.Control type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description (Rich Text)</Form.Label>
                            <ReactQuill theme="snow" value={description} onChange={setDescription} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create Course
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Admin;
