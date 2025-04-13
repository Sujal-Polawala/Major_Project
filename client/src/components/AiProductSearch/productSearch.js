import React, { useState } from 'react';
import { FaImages } from 'react-icons/fa';
import loader from '../../assets/images/loader.gif';
import { useNavigate } from 'react-router-dom';

function ProductSearch({ close  }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);

        // Simulate sending image to server for product search
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch('http://localhost:5000/search-product', { method: 'POST', body: formData });
            if (response.ok) {
                const data = await response.json();
                
                close()
                console.log('Navigating to /shop with search results...'); // Debugging
                navigate('/aisearch', { state: { searchResults: data } });
            } else {
                throw new Error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error searching by image:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center">
            {/* Modal Content */}
            <div className="bg-white flex flex-col justify-center items-center rounded-lg w-full max-w-lg p-6 shadow-lg relative">
                <button
                    onClick={close}
                    className="absolute font-bold top-2 right-2 text-gray-700 hover:text-black"
                >
                    X
                </button>
                <h2 className="text-xl font-semibold text-center mb-4">Search Your Style By Image</h2>
                <p className="text-gray-700 text-center mb-4">
                    Pick your exact match with our Ai-Powered tool
                </p>
                
                {!loading && (
                    <div className="border-2 border-green-500 rounded-full p-3 mb-4">
                        <FaImages className="text-4xl text-green-500" />
                    </div>
                )}

                {!loading && (
                    <label htmlFor="file-upload" className="cursor-pointer bg-violet-700 text-white px-4 py-2 rounded-md">
                        Upload Image
                    </label>
                )}

                {!loading && (
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                )}
                {loading && (
                    <div className="flex flex-col items-center bg-transparent">
                        <img src={loader} alt="loader" className="w-60 h-35 rounded-lg bg-gray-200 mb-2"/>
                        <p className="text-gray-700 mt-1">Finding best match...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductSearch;
