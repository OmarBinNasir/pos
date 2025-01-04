import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InventoryList() {
  const [inventory, setInventory] = useState([]);

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

  return (
    <div>
      <h2>Inventory List</h2>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Unit Price</th>
            <th>Company Name</th>
            <th>Units in Box</th>
            <th>Description</th>
            {/* Add more headers if there are more attributes */}
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.unitPrice}</td>
              <td>{item.companyName}</td>
              <td>{item.unitsInBox}</td>
              <td>{item.description}</td>
              {/* Add more columns if there are more attributes */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;