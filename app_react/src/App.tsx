import { useState, FormEvent } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import { addMessage, setLoading } from "./redux/chatbotSlice";

function App() {
  const [query, setQuery] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading } = useSelector(
    (state: RootState) => state.chatbot
  );

  const renderResponse = (data: any) => {
    // Render products
    if (data.products) {
      return (
        <div>
          <h6>Products Found:</h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product: any, index: number) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {data.summary && (
            <Alert variant="info">
              <strong>Summary:</strong> {data.summary}
            </Alert>
          )}
        </div>
      );
    }

    // Render suppliers
    if (data.suppliers) {
      return (
        <div>
          <h6>Suppliers Found:</h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Product Categories</th>
              </tr>
            </thead>
            <tbody>
              {data.suppliers.map((supplier: any, index: number) => (
                <tr key={index}>
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_info}</td>
                  <td>{supplier.product_categories}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {data.summary && (
            <Alert variant="info">
              <strong>Summary:</strong> {data.summary}
            </Alert>
          )}
        </div>
      );
    }

    // Render error
    if (data.error) {
      return (
        <>
          <Alert variant="danger">{data.error}</Alert>
          {data.summary && (
            <Alert variant="info">
              <strong>Summary:</strong> {data.summary}
            </Alert>
          )}
        </>
      );
    }

    // Fallback to raw JSON for unexpected responses
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trim the query to remove leading and trailing whitespace
    const trimmedQuery = query.trim();

    // Prevent blank queries
    if (!trimmedQuery) {
      dispatch(
        addMessage({
          text: "Query cannot be blank. Please type something.",
          sender: "bot",
        })
      );
      return;
    }

    // Add user message to the state
    dispatch(
      addMessage({
        text: trimmedQuery,
        sender: "user",
      })
    );

    try {
      dispatch(setLoading(true));

      const response = await axios.post("http://127.0.0.1:5000/api/query", {
        query,
      });

      dispatch(
        addMessage({
          text: JSON.stringify(response.data, null, 2),
          sender: "bot",
        })
      );
    } catch (error: any) {
      dispatch(
        addMessage({
          text: `Error: ${error.message}`,
          sender: "bot",
        })
      );
    } finally {
      dispatch(setLoading(false));
      setQuery("");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Card>
            <Card.Header>Supplier & Product Chatbot</Card.Header>
            <Card.Body style={{ height: "500px", overflowY: "scroll" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded ${
                    msg.sender === "user" ? "bg-primary text-white" : "bg-light"
                  }`}
                >
                  {msg.sender === "bot"
                    ? renderResponse(JSON.parse(msg.text))
                    : msg.text}
                </div>
              ))}
              {loading && <div>Loading...</div>}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="d-flex align-items-center justify-content-between">
                  <Form.Control
                    type="text"
                    placeholder="Ask about products or suppliers"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="me-2" // Add margin between input and button
                  />
                  {query && (
                    <Button variant="primary" type="submit" className="mt-0">
                      Send
                    </Button>
                  )}
                </Form.Group>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
