import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NewOrder() {
  const [inventory, setInventory] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error.message);
      }
    };

    fetchInventory();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      const existingProduct = prevSelectedProducts.find((p) => p._id === product._id);
      if (existingProduct) {
        return prevSelectedProducts.filter((p) => p._id !== product._id);
      } else {
        return [...prevSelectedProducts, { ...product, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (productId, delta) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((product) =>
        product._id === productId
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleProcessOrder = async () => {
    try {
      const orderItems = selectedProducts.map((product) => ({
        productId: product._id,
        quantity: product.quantity,
      }));

      const orderData = {
        customerName: 'Customer Name', // Replace with actual customer name
        orderDate: new Date(),
        orderStatus: 'Pending',
        orderItems,
        totalAmount: totalCheckoutPrice,
        customerNumber: 'Customer Number', // Replace with actual customer number
      };

      await axios.post('http://localhost:5000/order/new-order', orderData);

      // Update inventory
      for (const product of selectedProducts) {
        const updatedUnitsInBox = product.unitsInBox - product.quantity;
        await axios.post(`http://localhost:5000/inventory/update/${product._id}`, {
          unitsInBox: updatedUnitsInBox,
        });
      }

      alert('Order processed successfully!');
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error processing order:', error.message);
    }
  };

  const totalCheckoutPrice = selectedProducts.reduce(
    (total, product) => total + product.unitPrice * product.quantity,
    0
  );

  return (
    <div>
      <h2>New Order</h2>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Unit Price</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr
              key={item._id}
              onClick={() => handleProductClick(item)}
              style={{
                backgroundColor: selectedProducts.some((p) => p._id === item._id) ? '#d3d3d3' : 'transparent',
              }}
            >
              <td>{item.name}</td>
              <td>{item.unitPrice}</td>
              <td>{item.companyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedProducts.length > 0 && (
        <div>
          <h3>Selected Products</h3>
          {selectedProducts.map((product) => (
            <div key={product._id}>
              <p>Name: {product.name}</p>
              <p>Unit Price: {product.unitPrice}</p>
              <p>Company Name: {product.companyName}</p>
              <p>
                Quantity: 
                <button onClick={() => handleQuantityChange(product._id, -1)}>-</button>
                {product.quantity}
                <button onClick={() => handleQuantityChange(product._id, 1)}>+</button>
              </p>
            </div>
          ))}
          <h3>Total Checkout Price: ${totalCheckoutPrice.toFixed(2)}</h3>
          <button onClick={handleProcessOrder}>Process Order</button>
        </div>
      )}
    </div>
  );
}

export default NewOrder;