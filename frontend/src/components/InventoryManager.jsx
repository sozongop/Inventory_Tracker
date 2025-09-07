import { useState, useEffect } from "react";
import axios from "axios";

const InventoryManager = () => {
  const [product, setProduct] = useState({
    number: "",
    name: "",
    type: "",
    quantity: ""
  });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null); // ✅ track editing

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update product
  const handleSave = async () => {
    if (!product.number || !product.name || !product.type || !product.quantity) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        // Update product
        await axios.put(`http://localhost:5000/api/products/${editingId}`, product);
        setProducts(
          products.map((p) => (p.id === editingId ? { ...product, id: editingId } : p))
        );
        setEditingId(null);
      } else {
        // Add new product
        const res = await axios.post("http://localhost:5000/api/products", product);
        setProducts([...products, { ...product, id: res.data.productId }]);
      }
      setProduct({ number: "", name: "", type: "", quantity: "" });
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const editProduct = (p) => {
    setProduct({
      number: p.number,
      name: p.name,
      type: p.type,
      quantity: p.quantity
    });
    setEditingId(p.id);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    Object.values(p).some((val) =>
      val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">📦 Inventory Manager</span>
        </div>
      </nav>

      <div className="container">
        {/* Add/Edit Product Form */}
        <div className="card shadow-lg p-4 mb-4 rounded-4">
          <h5 className="mb-3">
            {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h5>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="number"
                placeholder="Product Number"
                value={product.number}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="type"
                placeholder="Product Type"
                value={product.type}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                name="quantity"
                placeholder="Quantity"
                value={product.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1 d-grid">
              <button className="btn btn-success" onClick={handleSave}>
                {editingId ? "💾 Save" : "Add"}
              </button>
            </div>
          </div>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm rounded-pill px-4"
            placeholder="🔍 Search products by number, name, type, or quantity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Product Table */}
        <div className="card shadow-lg p-4 rounded-4">
          <h5 className="mb-3">📋 Product List</h5>
          {filteredProducts.length === 0 ? (
            <p className="text-muted">No matching products found.</p>
          ) : (
            <table className="table table-hover table-bordered text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Product Number</th>
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.number}</td>
                    <td>{p.name}</td>
                    <td>{p.type}</td>
                    <td>{p.quantity}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editProduct(p)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteProduct(p.id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;