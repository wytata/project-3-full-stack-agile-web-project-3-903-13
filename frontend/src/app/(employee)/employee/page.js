"use client"

import { useEffect, useState } from "react";

export const getMenuItems = async () => {
  const items = await fetch("http://localhost:5000/api/menuitems");
  const data = await items.json();

  return data;
};

export const addMenuItem = async (menuItem) => {
  const response = await fetch("http://localhost:5000/api/menuitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } else {
    return { success: true, message: "Menu item added successfully" };
  }
};

export const updateMenuItem = async (menuItem) => {
  const response = await fetch("http://localhost:5000/api/menuitems", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } else {
    return { success: true, message: "Menu item updated successfully" };
  }
};

const categories = [
  { label: "Burgers/Sandwiches", value: 0 },
  { label: "Corn Dogs/Hot Dogs", value: 1 },
  { label: "Chicken Tenders", value: 2 },
  { label: "French Fries", value: 3 },
  { label: "Shakes/Ice Cream", value: 4 },
  { label: "Beverages", value: 5 },
  { label: "Seasonal", value: 6 },
];

export default function EmployeePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [addItemName, setAddItemName] = useState(""); // Separate state variable for Add Menu Item form
  const [addPrice, setAddPrice] = useState(""); // Separate state variable for Add Menu Item form
  const [addItemCategory, setAddItemCategory] = useState(0); // Separate state variable for Add Menu Item form
  const [updateItemName, setUpdateItemName] = useState(""); // Separate state variable for Update Menu Item form
  const [updatePrice, setUpdatePrice] = useState(""); // Separate state variable for Update Menu Item form
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [addSuccessMessage, setAddSuccessMessage] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    if (!validateItemName(addItemName) || !validatePrice(addPrice)) {
      setAddErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await addMenuItem({ itemName: addItemName, price: addPrice, category: addItemCategory });
      setAddSuccessMessage(response.message);
      setAddErrorMessage("");
      setAddItemName("");
      setAddPrice("");
      setAddItemCategory(0); // Reset category to default value after successful submission
      fetchMenuItems();
    } catch (error) {
      setAddErrorMessage(error.message);
    }
  };

  const handleUpdateMenuItemPrice = async (e) => {
    e.preventDefault();

    if (!validateItemName(updateItemName) || !validatePrice(updatePrice)) {
      setUpdateErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await updateMenuItem({ itemName: updateItemName, newPrice: updatePrice });
      setUpdateSuccessMessage(response.message);
      setUpdateErrorMessage("");
      setUpdateItemName("");
      setUpdatePrice("");
      fetchMenuItems();
    } catch (error) {
      setUpdateErrorMessage(error.message);
    }
  };

  const validateItemName = (itemName) => {
    return itemName.trim() !== "";
  };

  const validatePrice = (price) => {
    return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
  };

  return (
    <main className="min-h-screen flex flex-column items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1>MENU ITEMS</h1>
        {addErrorMessage && (
          <p className="text-red-500">{addErrorMessage}</p>
        )}
        {addSuccessMessage && (
          <p className="text-green-500">{addSuccessMessage}</p>
        )}
        <form onSubmit={handleAddMenuItem} className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Item Name"
            value={addItemName}
            onChange={(e) => setAddItemName(e.target.value)}
            className="mb-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={addPrice}
            onChange={(e) => setAddPrice(e.target.value)}
            className="mb-2"
            required
          />
          <select
            value={addItemCategory}
            onChange={(e) => setAddItemCategory(parseInt(e.target.value))}
            className="mb-2"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Add Menu Item</button>
        </form>
        <h2>Update Menu Item Price</h2>
        {updateErrorMessage && (
          <p className="text-red-500">{updateErrorMessage}</p>
        )}
        {updateSuccessMessage && (
          <p className="text-green-500">{updateSuccessMessage}</p>
        )}
        <form onSubmit={handleUpdateMenuItemPrice} className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Item Name"
            value={updateItemName}
            onChange={(e) => setUpdateItemName(e.target.value)}
            className="mb-2"
            required
          />
          <input
            type="number"
            placeholder="New Price"
            value={updatePrice}
            onChange={(e) => setUpdatePrice(e.target.value)}
            className="mb-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Update Price</button>
        </form>
        {menuItems.map((item) => (
          <a
            href="#"
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            key={item.menuid}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.itemname}
            </h5>
            <p>Price: {item.price}</p>
          </a>
        ))}
      </div>
    </main>
  );
}