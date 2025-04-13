//AddressForm.js
import React from 'react'

function AddressForm({ address, handleAddressChange, handleAddressSubmit, userDetails }) {
  return (
    <form onSubmit={handleAddressSubmit} className='space-y-6 mt-4'>
        {[ 'address', 'city', 'state', 'pincode', 'country', 'mobileno'].map(field => (
            <input 
                key={field}
                type='text'
                name={field}
                value={address[field]}
                onChange={handleAddressChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className={`w-full p-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
            />
        ))}
        <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300">
            {userDetails?.address ? "Update Address" : "Add Address"}
        </button>
    </form>
  )
}

export default AddressForm
