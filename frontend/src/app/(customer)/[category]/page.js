"use client";

import { useEffect, useState } from 'react';
import { TransactionContext, TransactionProvider, useTransaction } from "@/components/transactions/TransactionContext";
import Image from 'next/image'
import { toast } from 'react-toastify';
import UpdateModal from "@/components/updateItems/customerView";
import moment from 'moment';

/**
 * Asynchronously fetches the seasonal availability of a given menu item from the backend.
 * Constructs a query string from the menuItem object, sends a GET request, and handles the response.
 *
 * @async
 * @memberOf module:CustomerMenuItems
 * @function
 * @param {Object} menuItem - Contains information about the menu item, used to construct the query string.
 * @returns {Promise<Array>} A promise that resolves to an array of seasonal data for the menu item.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export const getMenuItemSeasonal = async (menuItem) => {
    try {

        // Construct the query string from the menuItem object
        const queryString = new URLSearchParams(menuItem).toString();
        // Append the query string to the URL
        const url = `https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/seasonal?${queryString}`;
        // Make the GET request
        const response = await fetch(url);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching seasonal info for menu item:", error);
        throw error;
    }
};


const categories = [
    "Burgers",
    "Dogs",
    "Tenders",
    "Sides",
    "Desserts",
    "Beverages",
    "Seasonal"
]

/**
 * Page is a React component that dynamically loads and displays menu items for a selected category
 * in a restaurant's point of sale system. It fetches both the menu items and their seasonal data,
 * applies UI effects, and manages item customization through a modal.
 *
 * @component
 * @module CustomerMenuItems
 * @param {Object} props - Component props.
 * @param {Object} props.params - URL parameters containing the category of menu items.
 * @returns {React.Component} The main section containing a grid of menu items and a modal for item updates.
 */
export default function Page({ params }) {
    const [itemType, setItemType] = useState([]);
    const { updateTransaction, transactions } = useTransaction();
    const [scaleStates, setScaleStates] = useState({});
    const [seasonalItems, setSeasonalItems] = useState(new Map());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);


    useEffect(() => {
        const fetchMenuItems = async () => {
            const response = await fetch('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
            const data = await response.json();
            const items = data.filter(item => item.category === parseInt(categories.indexOf(params.category)));
            setItemType(items);

            let initialScales = {};
            const seasonalInfoMap = new Map();

            for (const item of items) {
                const seasonalData = await getMenuItemSeasonal({ itemName: item.itemname });
                const isSeasonal = seasonalData.length === 0 || (seasonalData.length > 0 && new Date(seasonalData[0].expirationdate) >= new Date());
                seasonalInfoMap.set(item.menuid, isSeasonal);
                initialScales[item.menuid] = 'normal';
            }

            setScaleStates(initialScales);
            setSeasonalItems(seasonalInfoMap);
        };
    
        fetchMenuItems();
      }, [params.category]);


    /**
     * Handles the click on a menu item. Sets the selected item and opens the customization modal.
     *
     * @function
     * @memberOf module:CustomerMenuItems
     * @param {Object} item - The item that was clicked.
     */
    const handleItemClick = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    /**
     * Closes the item update modal and resets relevant state.
     *
     * @function
     * @memberOf module:CustomerMenuItems
     */
    const closeUpdateModal = () => {
        setIsModalOpen(false);
    }

    /**
     * Determines if an item is customizable based on a predefined list of non-customizable items.
     *
     * @function
     * @memberOf module:CustomerMenuItems
     * @param {Object|null} item - The item to check for customizability.
     * @returns {boolean} True if the item is customizable, false otherwise.
     */
    const isCustomizable = (item) => {
        if (item == null){
            return true;
        }

        const nonCustomizable = ["16 oz aquafina water", "20 oz aquafina water", "20 oz fountain drink", "20 oz Aquafina", "French Fries"]
        if (nonCustomizable.indexOf(item.itemname) !== -1) {
            return false
        }
        return true
    }

    /**
     * Determines the CSS class for scaling animation based on the item's click state.
     *
     * @function
     * @memberOf module:CustomerMenuItems
     * @param {number} menuId - The ID of the menu item to check.
     * @returns {string} The CSS class for the item's scaling animation.
     */
    const getItemScale = (menuId) => {
        return scaleStates[menuId] === 'clicked' ? 'pulse' : 'hover-effect';
    };

    return (
        <main className="min-h-screen py-10">
            <style jsx>{`
                .hover-effect {
                    transition: transform 0.3s ease-in-out;
                    transform: scale(1);
                }
                .hover-effect:hover {
                    transform: scale(1.03);
                }
                @keyframes pulse-animation {
                    0% { transform: scale(1.03); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1.03); }
                }
                .pulse {
                    animation: pulse-animation 0.3s ease-in-out;
                }
                .info-text {
                    padding: 8px;
                    background-color: rgba(255, 255, 255, 1);
                    border-radius: 8px;
                }
            `}</style>

            <div className="container px-10 mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">{params.category}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {itemType.map((item, index) => (
    seasonalItems.get(item.menuid) && (
        <div
            key={index}
            className={`relative bg-white rounded-lg shadow-lg transition duration-300 ease-in-out aspect-square flex flex-col items-center space-evenly border-4 border-gray ${getItemScale(item.menuid)}`}
            onClick={() => handleItemClick(item)}
            aria-label={'Select ${item.itemname}'}
        >
            <>
                <Image
                    src={`/menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`}
                    alt={item.itemname}
                    className="object-cover w-2/3 h-2/3 rounded-lg mt-12"
                    width={150}
                    height={150}
                />
                <div className="absolute bottom-0 w-full text-center p-2">
                    <div className="info-text">
                        <h5 className="text-xl font-bold text-gray-900">{item.itemname}</h5>
                        <h5 className="text-lg font-semibold text-gray-700">${item.price}</h5>
                    </div>
                </div>
            </>
        </div>
    )
))}
                </div>

                <UpdateModal
                    isCustomizable={isCustomizable(selectedItem)}
                    isOpen={isModalOpen}
                    onClose={closeUpdateModal}
                    categoryIndex={categories.indexOf(params.category)}
                    item = {selectedItem}
                    ariaLabel="Update Item Modal"
                />

            </div>
        </main>
    );
}