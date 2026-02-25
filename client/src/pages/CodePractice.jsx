import { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import alasql from 'alasql';
import Editor from '@monaco-editor/react';

const CodePractice = () => {
    const [mode, setMode] = useState('web'); // 'web' or 'sql'

    // Web State
    const [html, setHtml] = useState('<h1>Hello World</h1>');
    const [css, setCss] = useState('body { background-color: #f4f4f4; text-align: center; font-family: sans-serif; } h1 { color: #333; }');
    const [js, setJs] = useState('console.log("Hello from JS");');
    const [srcDoc, setSrcDoc] = useState('');

    // SQL State
    const [sqlQuery, setSqlQuery] = useState('CREATE TABLE students (id INT, name STRING, age INT);\nINSERT INTO students VALUES (1, "John", 20), (2, "Mary", 21);\nSELECT * FROM students;');
    const [sqlOutput, setSqlOutput] = useState([]);
    const [sqlError, setSqlError] = useState('');

    useEffect(() => {
        if (mode === 'web') {
            const timeout = setTimeout(() => {
                setSrcDoc(`
                    <html>
                    <body>${html}</body>
                    <style>${css}</style>
                    <script>${js}</script>
                    </html>
                `);
            }, 250);
            return () => clearTimeout(timeout);
        }
    }, [html, css, js, mode]);

    const runSql = () => {
        try {
            setSqlError('');
            // Alasql runs in-memory. We might want to reset potential previous state if we want a fresh run every time,
            // or keep it persistent. For simplicity, let's create a fresh database instance each run if possible, 
            // or just run the query. Alasql default is global.
            // A clearer way for "playground" is to create a new database context or just run.
            // Let's wrapping it to ensure we capture output.

            // Note: alasql can return multiple results if multiple queries.
            const res = alasql(sqlQuery);
            setSqlOutput(Array.isArray(res) ? res : [res]);
        } catch (err) {
            setSqlError(err.message);
            setSqlOutput([]);
        }
    };

    return (
        <Container fluid className="py-3 vh-100 d-flex flex-column">
            <h2 className="mb-3 text-center">Interactive Code Playground</h2>

            <div className="d-flex justify-content-center mb-3">
                <div className="btn-group">
                    <button
                        className={`btn ${mode === 'web' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setMode('web')}
                    >
                        Web (HTML/CSS/JS)
                    </button>
                    <button
                        className={`btn ${mode === 'sql' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setMode('sql')}
                    >
                        SQL & PL/SQL
                    </button>
                </div>
            </div>

            {mode === 'web' ? (
                <>
                    <Row className="flex-grow-1">
                        <Col md={4} className="d-flex flex-column">
                            <Form.Group className="mb-2 flex-grow-1 d-flex flex-column">
                                <Form.Label className="fw-bold text-danger">HTML</Form.Label>
                                <div className="flex-grow-1 border rounded overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="html"
                                        value={html}
                                        onChange={(value) => setHtml(value || '')}
                                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex flex-column">
                            <Form.Group className="mb-2 flex-grow-1 d-flex flex-column">
                                <Form.Label className="fw-bold text-primary">CSS</Form.Label>
                                <div className="flex-grow-1 border rounded overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="css"
                                        value={css}
                                        onChange={(value) => setCss(value || '')}
                                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex flex-column">
                            <Form.Group className="mb-2 flex-grow-1 d-flex flex-column">
                                <Form.Label className="fw-bold text-warning">JavaScript</Form.Label>
                                <div className="flex-grow-1 border rounded overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        value={js}
                                        onChange={(value) => setJs(value || '')}
                                        options={{ minimap: { enabled: false }, fontSize: 14 }}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="h-50 mt-3 border-top pt-3">
                        <Col>
                            <h5 className="text-secondary">Output</h5>
                            <iframe
                                srcDoc={srcDoc}
                                title="output"
                                sandbox="allow-scripts"
                                frameBorder="0"
                                width="100%"
                                height="100%"
                                className="bg-white border rounded shadow-sm"
                            />
                        </Col>
                    </Row>
                </>
            ) : (
                <Row className="h-100">
                    <Col md={6} className="d-flex flex-column h-100">
                        <Form.Group className="mb-2 flex-grow-1 d-flex flex-column">
                            <Form.Label className="fw-bold text-info">SQL Query</Form.Label>
                            <div className="flex-grow-1 border rounded overflow-hidden">
                                <Editor
                                    height="100%"
                                    defaultLanguage="sql"
                                    value={sqlQuery}
                                    onChange={(value) => setSqlQuery(value || '')}
                                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                                />
                            </div>
                            <button className="btn btn-success mt-2" onClick={runSql}>
                                <i className="bi bi-play-fill"></i> Run SQL
                            </button>
                        </Form.Group>
                    </Col>
                    <Col md={6} className="h-100 overflow-auto">
                        <h5 className="text-secondary">Result</h5>
                        {sqlError && <div className="alert alert-danger">{sqlError}</div>}
                        {sqlOutput.length > 0 ? (
                            sqlOutput.map((res, idx) => (
                                <div key={idx} className="mb-4">
                                    <h6>Query {idx + 1} Result:</h6>
                                    {Array.isArray(res) && res.length > 0 ? (
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    {Object.keys(res[0]).map(key => (
                                                        <th key={key}>{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {res.map((row, rIdx) => (
                                                    <tr key={rIdx}>
                                                        {Object.values(row).map((val, cIdx) => (
                                                            <td key={cIdx}>{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="alert alert-info">
                                            {typeof res === 'object' ? JSON.stringify(res) : 'Query executed successfully.'}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            !sqlError && <div className="text-muted">Run a query to see results...</div>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default CodePractice;
