import React from 'react';
import Image from "next/image";

/**
 * AboutPage is a React component that presents information about Rev's American Grill.
 * It displays an overview of the restaurant, including its location, food offerings, and ambience.
 * This component uses the `Image` component from Next.js to showcase a high-quality image of the restaurant.
 *
 * @component
 * @module AboutPage
 * @returns {React.Component} The AboutPage component, which includes a heading, descriptive text, and an image.
 */
export default function AboutPage() {
    return (
        <div className="bg-gray-100 py-16" role = "main">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8" id = "about heading">About Rev&apos;s American Grill</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center" aria-labelledby='about-heading'>
                    <div className="md:order-2">
                        <Image src="/revs-restaurant-image.jpg" alt="Rev's American Grilled Restaurant" className="rounded-lg shadow-lg" width={2000} height={3000}/>
                    </div>
                    <div className="md:order-1 text-lg [&>*]:mb-4">
                        <p>Welcome to Rev&apos;s American Grill, located in the Memorial Student Center (MSC) at Texas A&M University!</p>
                        <p>We specialize in serving delicious American-style grilled dishes, featuring mouthwatering burgers, sandwiches, tenders,  and more.</p>
                        <p>Our restaurant offers a cozy and inviting atmosphere, perfect for enjoying a meal with friends and family.</p>
                        <p>Come visit us at the MSC and experience the taste of Rev&apos;s American Grill!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
