"use client";

import "../../globals.css";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

const MenuBoard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

   


    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
                setMenuItems(response.data);
                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();

        const interval = setInterval(fetchMenuItems, 35000);

        return () => clearInterval(interval);
    }, []);


    if (isLoading) {
        return <div className="text-center text-lg font-bold">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center text-lg font-bold">Error: {error.message}</div>;
    }

    // Group menu items by category
    const groupedMenuItems = menuItems.reduce((acc, item) => {
        if (item.category === 6 || item.category === 3 || item.category === 4) {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
        }
        return acc;
    }, {});

    // Function to split menu items into two columns
    const splitIntoColumns = (items) => {
        const middleIndex = Math.ceil(items.length / 2);
        const firstHalf = items.slice(0, middleIndex);
        const secondHalf = items.slice(middleIndex);
        return [firstHalf, secondHalf];
    };

    return (
        <div className="min-h-screen max-h-screen bg-white text-black p-6">
            {Object.keys(groupedMenuItems).map(category => (
                <div key={category} className="category_container">
                    <div className="text-2xl font-bold uppercase pb-2 flex items-center">
                        {category === '6' && (
                            <>
                                <span>Seasonal</span>
                                <div className="ml-2 ">
                                    
                                    <Image
                                        src="/menu_board_icons/seasonalm_icon.jpeg"
                                        alt="Seasonal Icon"
                                        className="object-cover rounded-lg"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </>
                        )}
                        {category === '3' && (
                            <>
                                <span>Sides</span>
                                <div className="ml-2 ">
                                    
                                    <Image
                                        src="/menu_board_icons/sidesm_icon.jpeg"
                                        alt="Sides Icon"
                                        className="object-cover rounded-lg"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </>
                        )}
                        {category === '4' && (
                            <>
                                <span>Shakes</span>
                                <div className="ml-2 ">
                                    
                                    <Image
                                        src="/menu_board_icons/shakesm_icon.jpeg"
                                        alt="Shakes Icon"
                                        className="object-cover rounded-lg"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 ">
                        {splitIntoColumns(groupedMenuItems[category]).map((column, index) => (
                            <div key={index} className="menu_column">
                                {column.map(item => (
                                    <div key={item.id} className="menu_item bg-[#800000] rounded-lg shadow-md flex border border-4 border-gray-800">
                                        <div className="object-cover w-20 h-20 rounded-lg overflow-hidden">
                                            <img src={`/menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`} alt={item.itemname} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg text-white font-bold">{item.itemname}</div>
                                            <div className="text-sm text-white">{item.description}</div>
                                            <div className="text-lg text-white font-bold mt-2">${item.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

};


const HomePage = () => {
    return (
        <div className="min-h-screen max-h-screen overflow-hidden text-white">
            <div className="bg-[#800000] text-white text-center text-3xl font-bold">Rev&apos;s Menu</div>
            <MenuBoard />
        </div>
    );
};

export default HomePage;
