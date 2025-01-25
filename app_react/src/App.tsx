import { useState, FormEvent } from "react";
import axios from "axios";
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
    if (data.products) {
      return (
        <div>
          <h6 className="text-lg font-semibold mb-2">Products Found:</h6>
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Brand</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Category</th>
                <th className="border px-2 py-1">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product: any, index: number) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{product.name}</td>
                  <td className="border px-2 py-1">{product.brand}</td>
                  <td className="border px-2 py-1">${product.price}</td>
                  <td className="border px-2 py-1">{product.category}</td>
                  <td className="border px-2 py-1">{product.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.summary && (
            <div className="mt-2 bg-blue-100 text-blue-700 p-2 rounded">
              <strong>Summary:</strong> {data.summary}
            </div>
          )}
        </div>
      );
    }

    if (data.suppliers) {
      return (
        <div>
          <h6 className="text-lg font-semibold mb-2">Suppliers Found:</h6>
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Contact Info</th>
                <th className="border px-2 py-1">Product Categories</th>
              </tr>
            </thead>
            <tbody>
              {data.suppliers.map((supplier: any, index: number) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{supplier.id}</td>
                  <td className="border px-2 py-1">{supplier.name}</td>
                  <td className="border px-2 py-1">{supplier.contact_info}</td>
                  <td className="border px-2 py-1">
                    {supplier.product_categories}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.summary && (
            <div className="mt-2 bg-blue-100 text-blue-700 p-2 rounded">
              <strong>Summary:</strong> {data.summary}
            </div>
          )}
        </div>
      );
    }

    if (data.error) {
      return (
        <>
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
            {data.error}
          </div>
          {data.summary && (
            <div className="bg-blue-100 text-blue-700 p-2 rounded">
              <strong>Summary:</strong> {data.summary}
            </div>
          )}
        </>
      );
    }

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      dispatch(
        addMessage({
          text: "Query cannot be blank. Please type something.",
          sender: "bot",
        })
      );
      return;
    }

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
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="bg-blue-500 text-white text-lg font-bold p-4 rounded-t-lg">
          Supplier & Product Chatbot
        </div>
        <div className="p-4 overflow-y-scroll" style={{ height: "400px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.sender === "bot"
                ? renderResponse(JSON.parse(msg.text))
                : msg.text}
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Ask about products or suppliers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            {query && (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
