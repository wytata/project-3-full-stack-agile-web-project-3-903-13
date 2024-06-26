import { useState } from "react";

/**
 * A modal component for entering credit card details, including card number, CVC, and expiry date.
 * Provides form validation and submission functionality to handle payment.
 * @function CreditCardModal
 * @module CreditCardModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.showCreditCardModal - Flag to show or hide the modal.
 * @param {function} props.setShowCreditCardModal - Function to update the visibility of the modal.
 * @param {function} props.handlePayment - Function to execute the payment process after validation.
 * @returns {React.Component} A React component that displays a modal for credit card information input.
 */
export default function CreditCardModal({ showCreditCardModal, setShowCreditCardModal, handlePayment }) {
    const [cardNumber, setCardNumber] = useState("");
    const [cvc, setCVC] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    /**
     * Formats the card number input to include spaces every four digits for better readability.
     * Updates the state with the formatted card number if it's 16 digits or fewer.
     * @function formatCardNumber
     * @param {string} value - The raw card number input from the user.
     */
    const formatCardNumber = (value) => {
        const onlyNums = value.replace(/\D/g, '');
        if (onlyNums.length <= 16) {
            setCardNumber(onlyNums.replace(/(\d{4})/g, '$1 ').trim());
        }
    };

    /**
     * Handles changes to the CVC input field, ensuring only numeric values up to three digits are accepted.
     * @function handleCVCChange
     * @param {Object} event - The event object from the input field, providing the current value.
     */
    const handleCVCChange = (event) => {
        const onlyNums = event.target.value.replace(/\D/g, '');
        if (onlyNums.length <= 3) {
            setCVC(onlyNums);
        }
    };

    /**
     * Handles the submission of the credit card form.np
     * Validates the card number and CVC before proceeding with the payment and closing the modal.
     * Alerts the user if the input is invalid.
     * @function handleSubmit
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const plainCardNumber = cardNumber.replace(/\s/g, '');
        if (plainCardNumber.length !== 16) {
            alert('Please enter a valid 16-digit credit card number.');
            return;
        }
        if (cvc.length !== 3) {
            alert('Please enter a valid 3-digit CVC.');
            return;
        }
        handlePayment();
        setShowCreditCardModal(false);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold text-center mb-4">Enter Credit Card Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Card Number (xxxx xxxx xxxx xxxx)"
                        value={cardNumber}
                        onChange={(e) => formatCardNumber(e.target.value)}
                        maxLength={19}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="CVC (3 digits)"
                        value={cvc}
                        onChange={handleCVCChange}
                        maxLength={3}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                        data-testid = "expir"
                        type="month"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">Submit</button>
                </form>
                <div className="text-right mt-4">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow" onClick={() => setShowCreditCardModal(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}