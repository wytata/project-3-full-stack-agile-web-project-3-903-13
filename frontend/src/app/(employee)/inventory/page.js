"use client"

import { useEffect, useState } from "react";


export const getInventoryItems = async () => {
  const items = await fetch("http://localhost:5000/api/inventory");
  const data = await items.json();

  return data;
};

export const updateInventCount = async (inventItem) => {
  const response = await fetch("http://localhost:5000/api/inventory/updateQuantity", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } else {
    return { success: true, message: "Inventory item count updated successfully" };
  }
};

export const updateInventPrice = async (inventItem) => {
    const response = await fetch("http://localhost:5000/api/inventory/updatePrice", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inventItem),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Inventory item price updated successfully" };
    }
  };


  export const updateInventMin = async (inventItem) => {
    const response = await fetch("http://localhost:5000/api/inventory/updateMinCount", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inventItem),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Inventory item minimum count updated successfully" };
    }
  };


export const addInventoryItem = async (inventItem) => {
  const response = await fetch("http://localhost:5000/api/inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } else {
    return { success: true, message: "Inventory item added successfully" };
  }
};

export const removeInventoryItem = async (inventItem) => {
    const response = await fetch("http://localhost:5000/api/inventory", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inventItem),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Inventory item removed successfully" };
    }
  };

  const categories = [
    { label: "Update Item Count", value: 0 },
    { label: "Update Item Price ", value: 1 },
    { label: "Update Item Min Count", value: 2 },
  ];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [addItemName, setAddItemName] = useState(""); 
  const [addCount, setAddCount] = useState(""); 
  const [addPrice, setAddPrice] = useState(""); 
  const [addMinCount, setAddMinCount] = useState(""); 
  const [updateItemName, setUpdateItemName] = useState(""); 
  const [updateCount, setUpdateCount] = useState(""); 
  const [updatePrice, setUpdatePrice] = useState(""); 
  const [updateMinCount, setUpdateMinCount] = useState(""); 
  const [updateCategory, setUpdateCategory] = useState(""); 
  const [removeItemName, setRemoveItemName] = useState(""); 
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [addSuccessMessage, setAddSuccessMessage] = useState("");
  const [removeErrorMessage, setRemoveErrorMessage] = useState("");
  const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");
  

  useEffect(() => {
    fetchInventoryItems();
  }, []);


  const fetchInventoryItems = async () => {
    try {
      const data = await getInventoryItems();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleAddInventoryItem = async (e) => {
    e.preventDefault();

    if (!validateItemName(addItemName) || !validatePrice(addPrice) || !validateCount(addCount) || !validateMinCount(addMinCount)) {
      setAddErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await addInventoryItem({ itemName: addItemName, count: addCount, price: addPrice, mincount: addMinCount  });
      setAddSuccessMessage(response.message);
      setAddErrorMessage("");
      setAddItemName("");
      setAddCount("");
      setAddMinCount("");
      setAddPrice("");
      setUpdateErrorMessage("");
      setUpdateSuccessMessage("");
      setRemoveErrorMessage("");
      setRemoveSuccessMessage("");
      fetchInventoryItems();
    } catch (error) {
      setAddErrorMessage(error.message);
      setAddSuccessMessage("");
      setUpdateErrorMessage("");
      setUpdateSuccessMessage("");
      setRemoveErrorMessage("");
      setRemoveSuccessMessage("");
    }
  };
    

  const handleUpdateInventoryItem = async (e) => {
    e.preventDefault();

    try {
        let response;
        if (updateCategory == 0){
            if (!validateItemName(updateItemName) || !validateCount(updateCount)) {
              setUpdateErrorMessage("Please fill out all fields correctly.");
              return;
            }
            response = await updateInventCount({ itemName: updateItemName, newCount: updateCount });
        } else if (updateCategory == 1){
            if (!validateItemName(updateItemName) || !validatePrice(updatePrice)) {
              setUpdateErrorMessage("Please fill out all fields correctly.");
              return;
            }
          response = await updateInventPrice({ itemName: updateItemName, newPrice: updatePrice });
        } else if (updateCategory == 2){
            if (!validateItemName(updateItemName) || !validateMinCount(updateMinCount)) {
              setUpdateErrorMessage("Please fill out all fields correctly.");
              return;
            }
          response = await updateInventMin({ itemName: updateItemName, newCount: updateMinCount });
        }
      setUpdateSuccessMessage(response.message);
      setUpdateErrorMessage("");
      setUpdateItemName("");
      setUpdatePrice("");
      setUpdateCount("");
      setUpdateMinCount("");
      setAddErrorMessage("");
      setAddSuccessMessage("");
      setRemoveErrorMessage("");
      setRemoveSuccessMessage("");
      fetchInventoryItems();
    } catch (error) {
      setUpdateErrorMessage(error.message);
      setUpdateSuccessMessage("");
      setAddErrorMessage("");
      setAddSuccessMessage("");
      setRemoveErrorMessage("");
      setRemoveSuccessMessage("");
    }
  };

  const handleRemoveInventoryItem = async (e) => {
    e.preventDefault();

    if (!validateItemName(removeItemName)) {
      setAddErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await removeInventoryItem({ itemName: removeItemName });
      setRemoveSuccessMessage(response.message);
      setRemoveErrorMessage("");
      setRemoveItemName("");
      setAddErrorMessage("");
      setAddSuccessMessage("");
      setUpdateErrorMessage("");
      setUpdateSuccessMessage("");
      fetchInventoryItems();
    } catch (error) {
      setRemoveErrorMessage(error.message);
      setRemoveSuccessMessage("");
      setAddErrorMessage("");
      setAddSuccessMessage("");
      setUpdateErrorMessage("");
      setUpdateSuccessMessage("");
    }
  };

  const validateItemName = (itemName) => {
    return itemName.trim() !== "";
  };

  const validatePrice = (price) => {
    return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
  };

  const validateCount = (count) => {
    return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
  };

  const validateMinCount = (count) => {
    return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
  };

  return (
    <main className="min-h-screen flex flex-column items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="p-3 md:p">ADDING INVENTORY ITEMS</h1>
        {addErrorMessage && (
          <p className="text-red-500">{addErrorMessage}</p>
        )}
        {addSuccessMessage && (
          <p className="text-green-500">{addSuccessMessage}</p>
        )}
        <form onSubmit={handleAddInventoryItem} className="flex flex-col items-center justify-center">
          <input 
            type="text"
            placeholder="Item Name"
            value={addItemName}
            onChange={(e) => setAddItemName(e.target.value)}
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          <input
            type="number"
            placeholder="Count"
            value={addCount}
            onChange={(e) => setAddCount(e.target.value)}
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={addPrice}
            onChange={(e) => setAddPrice(e.target.value)}
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          <input
            type="number"
            placeholder="Minimum count required in inventory"
            value={addMinCount}
            onChange={(e) => setAddMinCount(e.target.value)}
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Add</button>
        </form>
        <h2>UPDATE INVENTORY ITEM</h2>
        {updateErrorMessage && (
          <p className="text-red-500">{updateErrorMessage}</p>
        )}
        {updateSuccessMessage && (
          <p className="text-green-500">{updateSuccessMessage}</p>
        )}
        <form onSubmit={handleUpdateInventoryItem} className="flex flex-col items-center justify-center">
        <select
            value={updateCategory}
            onChange={(e) => setUpdateCategory(parseInt(e.target.value))}
            className="mb-2"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
            </select>
          <input
            type="text"
            placeholder="Item Name"
            value={updateItemName}
            onChange={(e) => setUpdateItemName(e.target.value)}
            className="mb-2"
            required
          />
          {updateCategory == 0 && (
            <input
              type="number"
              placeholder="New Count"
              value={updateCount}
              onChange={(e) => setUpdateCount(e.target.value)}
              className="mb-2"
              required
            />
          )}
          {updateCategory == 1 && (
            <input
              type="number"
              placeholder="New Price"
              value={updatePrice}
              onChange={(e) => setUpdatePrice(e.target.value)}
              className="mb-2"
              required
            />
          )}
          {updateCategory == 2 && (
            <input
              type="number"
              placeholder="New minimum count"
              value={updateMinCount}
              onChange={(e) => setUpdateMinCount(e.target.value)}
              className="mb-2"
              required
            />
          )}

          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Update</button>
        </form>
        <h2>REMOVE INVENTORY ITEM</h2>
        {removeErrorMessage && (
          <p className="text-red-500">{removeErrorMessage}</p>
        )}
        {removeSuccessMessage && (
          <p className="text-green-500">{removeSuccessMessage}</p>
        )}
        <form onSubmit={handleRemoveInventoryItem} className="flex flex-col items-center justify-center">
          <input 
            type="text"
            placeholder="Item Name"
            value={removeItemName}
            onChange={(e) => setRemoveItemName(e.target.value)}
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">REMOVE</button>
        </form>
        {inventoryItems.map((item) => (
          <a
            href="#"
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            key={item.inventid}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.ingredientname}
            </h5>
            <p>Count {item.count}</p>
            <p>Price: {item.price}</p>
            <p>Min Count: {item.mincount}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
``