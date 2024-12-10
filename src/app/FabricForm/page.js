"use client";
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { INSERT_FABRIC_DETAILS } from '@/utils/gql/GQL_MUTATIONS';

export default function Form() {
  const [formData, setFormData] = useState({
    fabricType: '',
    colour: '',
    length: '',
    width: '',
    price: '',
    dateOfPurchase: ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [insertFabricDetails, {  loading, error }] = useMutation(INSERT_FABRIC_DETAILS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert to Float for GraphQL variables
    const numericFormData = {
      ...formData,
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      price: parseFloat(formData.price),
    };

    // Check for NaN values to ensure valid input
    if (isNaN(numericFormData.length) || isNaN(numericFormData.width) || isNaN(numericFormData.price)) {
      alert('Please enter valid numeric values for length, width, and price.');
      return;
    }

    try {
      const response = await insertFabricDetails({ variables: numericFormData });

      if (response.data) {
        alert('Form submitted successfully!');
        setQrCodeUrl(response.data.insertFabricDetails.qrCodeUrl);
      }
    } catch (err) {
      console.error('Error submitting the form:', err);
      alert('Error submitting the form.');
    }
  };

  const handlePrintQRCode = () => {
    if (!qrCodeUrl) {
      alert('No QR code available to print.');
      return;
    }
  
    // Create a new print window
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (printWindow) {
      // Write the content for the print window
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <h2 style="text-align: center;">QR Code</h2>
            <img src="${qrCodeUrl}" alt="QR Code">
          </body>
        </html>
      `);
      printWindow.document.close();
  
      // Ensure the print window is fully loaded before printing
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } else {
      alert('Failed to open print window.');
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Fabric Data Entry Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="fabricType">Fabric Type</label>
              <input
                type="text"
                id="fabricType"
                name="fabricType"
                value={formData.fabricType}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="colour">Colour</label>
              <input
                type="text"
                id="colour"
                name="colour"
                value={formData.colour}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="length">Length (in mtr)</label>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                min="0"
                step="0.01"  
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="width">Width</label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                min="0"
                step="0.01"  
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                min="0"
                step="0.01"  
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfPurchase">Date of Purchase</label>
            <input
              type="date"
              id="dateOfPurchase"
              name="dateOfPurchase"
              value={formData.dateOfPurchase}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 transition duration-200"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          {error && (
            <div className="mt-4 text-red-600">
              <p>Error: {error.message}</p>
            </div>
          )}
        </form>

        {qrCodeUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Generated QR Code</h3>
            <img src={qrCodeUrl} alt="Generated QR Code" className="max-w-full" />
            <button
              onClick={handlePrintQRCode}
              className="mt-4 w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-200 transition duration-200"
            >
              Print QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
