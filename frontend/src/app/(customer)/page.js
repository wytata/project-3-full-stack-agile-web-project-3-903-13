"use client";

import React from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WeatherWidget from "@/components/WeatherAPI";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: "block",
        fontSize: "36px",
        lineHeight: "60px",
        height: "60px",
        color: "black",
        right: "-30px",
      }}
      onClick={onClick}
    >
      &gt;
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: "block",
        fontSize: "36px",
        lineHeight: "60px",
        height: "60px",
        color: "black",
        left: "-30px",
      }}
      onClick={onClick}
    >
      &lt;
    </div>
  );
}

const buttonCategories = [
  { name: "Burgers", path: "/Burgers", image: "/images/burgers.png" },
  {
    name: "Hotdogs/Corndogs",
    path: "/Dogs",
    image: "/images/hotdogs-corndogs.jpg",
  },
  {
    name: "Chicken Tenders",
    path: "/Tenders",
    image: "/images/chicken-tenders.jpg",
  },
  { name: "Sides", path: "/Sides", image: "/images/sides.jpg" },
  { name: "Shakes", path: "/Desserts", image: "/images/shakes.jpg" },
  { name: "Beverages", path: "/Beverages", image: "/images/beverages.jpg" },
  { name: "Seasonal", path: "/Seasonal", image: "/images/seasonal.jpg" },
];

const carouselCategories = [
  {
    name: "Order the classic hamburger today!",
    description:
      "Cheese, Lettuce, Tomatoes, Onions, and our signature patty all on artisan bread. Handcrafted with love by Rev's Grill!",
    image: "/menuitems/ClassicHamburger.jpeg",
  },
  {
    name: "Try the all new Gig Em Patty Melt!",
    description:
      "This revolutionary sandwich will turn even the staunchest of 2%ers into redasses in no time!",
    image: "/menuItems/GigEmPattyMelt.jpeg",
  },
];

const Home = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <main className="min-h-screen flex flex-col items-center">
      <WeatherWidget />

      <Slider {...settings} className="w-1/2 px-4 py-2">
        {carouselCategories.map((category, index) => (
          <div key={index} className="carousel-item">
            <div className="container flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 p-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="carousel-image max-h-64 w-auto mx-auto"
                />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <div className="carousel-content">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="container px-10 mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buttonCategories.map((category) => (
            <Link key={category.name} href={category.path}>
              <div className="m-4 cursor-pointer aspect-square">
                <div className="overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                  <img className="flex w-full rounded-lg" src={"./menuItems/Rootbeerfloat.jpeg"} alt={category.name} />
                  <div className="flex py-4 rounded-lg text-center bg-white">
                    <span className="block text-lg font-semibold text-gray-800">
                      {category.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
