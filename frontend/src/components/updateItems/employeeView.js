/**
 * @module EmployeeView
 */
import React, { useEffect, useState } from "react";
// import Link from 'next/link'
import Image from 'next/image'
import { useTransaction } from "@/components/transactions/TransactionContext";
import { toast } from 'react-toastify';

/**
 * Provides an interactive modal for customizing and adding an item to the cart.
 * The modal allows users to modify ingredients of a dish before adding it to their transaction.
 * It supports removing ingredients and dynamically updates the transaction context upon user confirmation.
 *
 * @function UpdateModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {Object} props.item - The item to be customized and added to the cart.
 * @returns {React.Component|null} The modal component for updating the transaction or null if the modal is not open.
 */
export default function UpdateModal({ isOpen, onClose, item }) {
    const [deleteMessage, setDeleteMessage] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    // Other ingredients contains non-removable ingredients like bags, utensils, etc.
    // removable ingredients contains those that CAN be removed
    // ingredientsRemoved is mainly a boolean array to track which ingredients have been removed by the User
    const [otherIngredients, setOtherIngredients] = useState()
    const [removableIngredients, setRemovableIngredients] = useState()
    const [ingredientsRemoved, setIngredientsRemoved] = useState([]);


    const { updateTransaction, transactions } = useTransaction();

    /**
     * Submits a modified dish to the transaction context to update the cart.
     * This function constructs the modification details based on user selections of ingredients to remove or keep.
     * It compiles a list of inventory items that are not removed for stock management and appends the dish with
     * the modification string to the transaction list. Also, it displays a toast notification indicating the successful addition.
     *
     * @memberOf module:EmployeeView
     * @param {Object} dish - The dish object containing the necessary identifiers like menuid and itemname.
     * @param {string} modificationString - A string detailing the modifications made by the user, such as removed ingredients.
     * @param {Array} inventToRemove - An array of objects detailing the ingredients that were not removed by the user, 
     *                                 each containing an inventid, ingredientname, and quantity.
     */
    const sendToTransaction = (dish, modificationString, inventToRemove) => {
        var quantity = 0;
        if (transactions) {
            transactions.forEach(item => {
                if (dish.menuid === item.id && dish.modif === item.modif) {
                    quantity = item.quantity + 1;
                }
            });
        }
        if (quantity === 0) {
            quantity = 1;
        }
        updateTransaction({
            "id": dish.menuid, "itemname": dish.itemname, "price": dish.price,
            "quantity": quantity, "modif": modificationString, "inventToRemove": inventToRemove
        });
        toast.success(`${dish.itemname} added to cart!`, {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    };

    useEffect(() => {
        setIngredientsRemoved([])
        const getMenuItemIngredients = async () => {
            try {

                const name = item.itemname
                const params = name.split(' ').join("+")

                const response = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/getIngreds?itemName=${params}`);

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                const data = await response.json();

                const itemsFilterOut = ["Utensils", "To Go Boxes", "Bags", "Napkins"];
                const isItemFilterOut = (item) => itemsFilterOut.includes(item)

                setOtherIngredients(data.filter(item => isItemFilterOut(item.ingredientname)))

                const filteredData = data.filter(item => !isItemFilterOut(item.ingredientname));

                setRemovableIngredients(filteredData)
                setIngredientsRemoved(new Array(filteredData.length).fill(false))

            } catch (error) {
                console.error("Error fetching ingredient for menu item:", error);
                throw error;
            }
        };

        if (isOpen) {
            getMenuItemIngredients()
        }

    }, [item, isOpen]);



    /**
     * Toggles the removal state of an ingredient based on its index in the list.
     * This allows users to select or deselect ingredients they want to remove from their dish.
     *
     * @memberOf module:EmployeeView
     * @param {number} index - The index of the ingredient in the removable ingredients list.
     */
    const handleIngredientClick = (index) => {
        setIngredientsRemoved(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });

    };

    /**
     * Prepares and sends the customized item to the transaction context.
     * Builds a string of modifications (e.g., "No Salt, No Pepper") and collects the IDs of non-removed items
     * for inventory control, then sends the item to the transaction system.
     * @memberOf module:EmployeeView
     */
    const handleAddCart = () => {
        let temp = "";
        const inventToRemove = []
        for (let i = 0; i < ingredientsRemoved.length; i++) {
            const ingred = removableIngredients[i]
            if (ingredientsRemoved[i]) {
                temp += "No " + ingred.ingredientname.toString() + ", ";
            }
            else {
                inventToRemove.push({ "inventid": ingred.inventid, "ingredientname": ingred.ingredientname, "quantity": ingred.quantity })
            }
        }
        for (let i = 0; i < otherIngredients.length; i++){
            const item = otherIngredients[i]
            inventToRemove.push({ "inventid": item.inventid, "ingredientname": item.ingredientname, "quantity": item.quantity })
        }
        temp = temp.slice(0, temp.length - 1)
        sendToTransaction(item, temp, inventToRemove)
    }


    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
                <div className="max-w-lg bg-white p-12 pb-4 rounded-lg shadow-lg">
                    <button
                        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="flex flex-col">


                        <div className="flex flex-col">
                            {/* <div className="mb-8">
                                <h3 className="font-semibold text-3xl">
                                    {item.itemname}
                                </h3>
                                <hr className="border-[3px] border-black my-2" />
                                <h5 className="text-md"> {item.description}</h5>
                            </div> */}


                            <span className="ml-1 font-semibold text-2xl">
                                Customize
                                <hr className="border-[3px] border-black mb-1" />

                            </span>
                            <div>
                                {removableIngredients && removableIngredients.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`rounded-md px-3 py-1 m-1 transition duration-100 ease-in-out 
                                                        ${ingredientsRemoved[index] ? 'line-through' : 'bg-gray-300 hover:bg-gray-400'}`}
                                        onClick={() => { handleIngredientClick(index) }}
                                    >
                                        {item.ingredientname}
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div className="mt-5 flex flex-row-reverse">
                            <button
                                className="bg-red-800 font-semibold text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 hover:text-black 
                                        transition duration-200 ease-in-out"
                                onClick={() => handleAddCart()}
                            >
                                Add to Bag
                            </button>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}
