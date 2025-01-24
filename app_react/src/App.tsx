import { useState, FormEvent } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Table, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the types for messages
interface Message {
  text: string;
  sender: "user" | "bot";
}

function App() {
  const [query, setQuery] = useState<string>(""); 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);

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
        <Alert variant="danger">
          {data.error}
        </Alert>
      );
    }

    // Fallback to raw JSON for unexpected responses
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add user message
    const userMessage: Message = {
      text: query,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/api/query", {
        query,
      });

      // botmessage
      const botMessage: Message = {
        text: JSON.stringify(response.data, null, 2),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error: any) {
      // errorMessage
      const errorMessage: Message = {
        text: `Error: ${error.message}`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      
    } finally {
      setLoading(false);
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
                  {msg.sender === "bot" ? renderResponse(JSON.parse(msg.text)) : msg.text}
                </div>
              ))}
              {loading && <div>Loading...</div>}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Ask about products or suppliers"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Send
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;