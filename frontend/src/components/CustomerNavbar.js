"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { useTransaction } from "@/components/transactions/TransactionContext";
import PaymentModal from "@/components/transactions/PaymentModal"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

/**
 * Provides a navigation bar for customers that includes dynamic links, a cart system, and transaction functionalities.
 * This component integrates with the TransactionContext to manage shopping cart and transaction states.
 * It also handles dynamic UI changes based on screen size and cart interactions.
 *
 * @module CustomerNavbar
 * @param {Object[]} links - An array containing link objects for navigation. Each link object should have 'route' and 'name' properties.
 * @returns {React.Component} The customer navigation bar component with integrated transaction management.
 */
export default function CustomerNavbar({ links }) {
	const pathname = usePathname();
    
  const [isOpen, setOpen] = useState(false);

/**
 * Toggles the menu open or closed based on the current state.
 * It uses a state hook to manage the menu's open or closed status.
 * @memberOf module:CustomerNavbar
 */
  const menuToggle = () => {
    setOpen(!isOpen);
  };

  /**
	 * Sets up responsive behavior for the navigation menu based on window size.
	 * Automatically closes the navigation menu when the window is resized to a width above 768 pixels.
	 * @memberOf module:CustomerNavbar
	 */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []); 

	const {
		transactions,
		clearTransaction,
		submitTransaction,
		updateTransaction,
		removeItemFromTransaction,
		removeItemCompletely,
	} = useTransaction();
	const [transactionsList, setTransactionsList] = useState(null);
	const [showPaymentOptions, setShowPaymentOptions] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const [isCartOpen, setIsCartOpen] = useState(false);

	useEffect(() => {
		setTransactionsList(transactions);
		// Ensure transactions is an array before using reduce
		const totalItems = Array.isArray(transactions) ? transactions.reduce((acc, item) => acc + item.quantity, 0) : 0;
		setCartCount(totalItems);
	}, [transactions]);

	/**
	 * Manages the cart display toggle. If the cart is not visible, it opens the cart and disables page scrolling.
	 * If the cart is visible, it closes the cart and enables page scrolling.
	 * @memberOf module:CustomerNavbar
	 */
	const toggleCart = () => {
    const scrollbarWidth = getScrollbarWidth() + 'px';
		if (ref.current && ref.current.classList.contains('translate-x-full')) {
			setIsCartOpen(true)
			ref.current.classList.remove('translate-x-full')
			ref.current.classList.add('translate-x-0')
			document.body.classList.add('no-scroll');
      document.body.style.paddingRight = scrollbarWidth;
		} else if (ref.current && !ref.current.classList.contains('translate-x-full')) {
			setIsCartOpen(false);
			ref.current.classList.add('translate-x-full')
			ref.current.classList.remove('translate-x-0')
			document.body.classList.remove('no-scroll');
      document.body.style.paddingRight = '';
		}
	}

	/**
	 * Calculates the width of the scrollbar of the browser window.
	 * This is used to adjust the body padding when the cart is open, preventing layout shift.
	 * @memberOf module:CustomerNavbar
	 * @returns {number} The width of the scrollbar in pixels.
	 */
  function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar'; 
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

	/**
	 * Calculates the subtotal for all items currently in the transaction.
	 * Uses the transaction list from the TransactionContext and sums up the total price.
	 * @memberOf module:CustomerNavbar
	 * @returns {string} The subtotal, formatted as a string with two decimal places.
	 */
	const getSubtotal = () => {
		return transactionsList.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0).toFixed(2)
	}

/**
 * Calculates the tax based on the subtotal.
 * Assumes a fixed tax rate of 8.25% (as an example).
 * @memberOf module:CustomerNavbar
 * @returns {string} The tax amount, formatted as a string with two decimal places.
 */
	const getTax = () => {
		return (getSubtotal() * 0.0825).toFixed(2)
	}

/**
 * Handles the final submission of the transaction.
 * Triggers the transaction submission process defined in the TransactionContext.
 * @memberOf module:CustomerNavbar
 */
	const handlePayment = () => {
		submitTransaction();
		setShowPaymentOptions(false);
	};

	const ref = useRef();


/**
 * Opens a new window to display the menu board.
 * This function is designed to open a new browser tab with specified options.
 * @memberOf module:CustomerNavbar
 */
  const handleMenuBoardClick = () => {
    window.open("/menu_board", "_blank", "noopener,noreferrer");
   
  };

  /**
	 * Opens a new window to display the order status or details.
	 * Similar to handleMenuBoardClick, but specifically opens the order display page.
	 * @memberOf module:CustomerNavbar
	 */
	const handleOrderDisplayClick = () => {
		window.open("/orderDisplay", "_blank", "noopener,noreferrer");
	};

	return (
		<>
			<nav className="flex w-full h-[5rem] bg-white shadow-md">
				<div className="flex w-full h-full items-center justify-between px-6 font-bold [&>*>li]:relative">

        <div
          className="absolute right-[1.5rem] md:hidden group"
          onClick={menuToggle}
        >
          <div className="space-y-2">
            <span
              className={`block h-1 w-8 bg-black rounded-full transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <div className="relative">
              <span
                className={`block absolute h-1 w-8 bg-black rounded-full transition-transform duration-200 ease-in-out origin-center ${
                  isOpen ? "rotate-45" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-8 bg-black transition-transform duration-200 ease-in-out rounded-full origin-center ${
                  isOpen ? "-rotate-45" : ""
                }`}
              ></span>
            </div>
            <span
              className={`block h-1 w-8 bg-black rounded-full transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
          </div>
        </div>
        <Image alt="Rev logo" className="hidden absolute md:block" src={"/revs.png"} width={110} height={110}></Image>
        <ul
        className={`${
          isOpen ? "block bg-white border shadow mr-1" : "hidden"
        } ml-[calc(110px+2rem)] absolute rounded-xl md:shadow-none md:bg-none md:border-0 md:relative right-0 md:mt-0 p-4 md:p-0 md:flex space-y-6 md:space-y-0 md:space-x-8 z-[30] text-sm md:text-base`}
        style={{ marginTop: isOpen ? `${links.length * 3 + 1}rem` : "0rem" }}
        >
          {links.map((link, index) => (
            <li key={index}>
              <Link
                onClick={
                  link.name === "Menu Board"
                    ? handleMenuBoardClick
                    : link.name === "Order Display"
                    ? handleOrderDisplayClick
                    : null
                }
                className={
                  pathname === link.route ? "nav-link-active" : "nav-link"
                }
                href={link.route}
              >
                {link.name}
              </Link>
            </li>
          ))}
					</ul>
          
					<ul className="flex flex-row gap-8 items-center">
						<li>
							<Link href={"/employee/burgers"}>
								<Image alt="employee log in" className="nav-image" src={"./user.svg"} width={30} height={30}></Image>
							</Link>
						</li>
						<li onClick={toggleCart} className="cursor-pointer cart relative">
							<Image alt="cart" className="nav-image" src={"./cart.svg"} width={30} height={30}></Image>
							{cartCount > 0 && (
								<span className="absolute top-[-15px] right-[-15px] inline-block px-1 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
									{cartCount}
								</span>
							)}
						</li>
					</ul>

					<div onClick={toggleCart} className={`fixed z-[40] left-0 top-0 bottom-0 right-0 w-screen h-screen bg-black/40 backdrop-blur-sm ${isCartOpen ? "" : "hidden"}`}></div>

					<div ref={ref} role="region" className="min-w-[50%] md:min-w-[25%] h-full fixed top-0 right-0 bg-white transform transition-transform translate-x-full z-50 shadow-2xl">
						<div className="flex flex-col h-full">
							<div className="flex justify-end p-2">
								<button aria-label="Cart" onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
									<svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="border-t-2 border-gray-300" />

							<div className="flex-grow overflow-y-auto">
								<div className="flex flex-col justify-evenly items-center">
									{transactionsList ? transactionsList.map((item, index) => (
										<div key={index} className="flex flex-col justify-between w-full bg-gray-100 p-4 my-2 rounded-lg shadow">
											<div className="flex w-full justify-between items-center">
												<span className="font-semibold flex-1 mr-2">{item.itemname}</span>
												<span> ${(item.price * item.quantity).toFixed(2)}</span>
											</div>
											<div className="max-w-[55%]">
												<p className="font-normal text-sm "> {item.modif && item.modif.slice(0, item.modif.length - 1)} </p>
											</div>
											<div className="flex items-center justify-between mt-2">
												<div>
													<button
														className="font-semibold text-red-600 hover:underline"
														onClick={() => removeItemCompletely(item.id, item.modif)}> Remove 
													</button>

												</div>
												<div className="flex items-center">
													<FaMinusCircle className="text-red-500 cursor-pointer" onClick={() => removeItemFromTransaction(item.id, item.modif)} />
													<span className="mx-2 text-lg">{item.quantity}</span>
													<FaPlusCircle className="text-green-500 cursor-pointer" onClick={() => updateTransaction(item)} />
												</div>
											</div>
										</div>
									)) : <div className="flex flex-col items-center">No items!</div>}
								</div>
							</div>
							<div className="border-t-2 border-gray-300" />

							<div className="px-6 py-2 flex flex-col">
								{transactionsList && (
									<div>
										<div className="flex justify-between">
											<p>Subtotal</p>
											<p>{transactionsList ? "$" + getSubtotal() : "$0.00"}</p>
										</div>

										<div className="flex justify-between">
											<p>Tax</p>
											<p>{transactionsList ? "$" + getTax() : "$0.00"}</p>
										</div>

										<div className="flex justify-between">
											<p>Total</p>
											<p>
												{transactionsList
													? "$" + (parseFloat(getSubtotal()) + parseFloat(getTax())).toFixed(2)
													: "$0.00"}
											</p>
										</div>
									</div>
								)}
							</div>
							<div className="flex mt-auto">
								<button
									className="text-white w-1/2 bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 shadow-sm px-4 py-4"
									onClick={clearTransaction}
									aria-label ="Clear Cart"
								>
									Clear
								</button>
								<button
									className="text-white w-1/2 bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 shadow-sm px-4 py-4"
									onClick={() => {
										if (cartCount > 0) {
											setShowPaymentOptions(true);
										} else {
											toast.error('Your cart is empty. Add items before charging.', {
												position: "bottom-center",
												autoClose: 5000,
												hideProgressBar: false,
												closeOnClick: true,
												pauseOnHover: true,
												draggable: true,
												progress: undefined,
											});
										}
									}}
									aria-label="Checkout"
								>
									Checkout
								</button>
							</div>
						</div>
					</div>

				</div>

				{/* Payment options modal */}
				{showPaymentOptions && (
					<PaymentModal
						showPaymentOptions={showPaymentOptions}
						setShowPaymentOptions={setShowPaymentOptions}
						handlePayment={handlePayment}
						enableCreditCardInput={true}
					/>
				)}

				<ToastContainer className={inter.className}
					// autoClose = {false}
					bodyClassName={() => "text-md text-black font-semibold"}
					progressClassName="bg-black text-black"
					position="bottom-right"
					// theme="dark"
					limit={1} 
					closeOnClick
					autoClose={5000}

				/>
			</nav>
		</>
	);
}
