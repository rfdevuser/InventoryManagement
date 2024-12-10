"use client";
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FABRIC_DETAILS_BY_CODE, GET_UPDATED_FABRIC_DETAILS_BY_CODE } from '@/utils/gql/GQL_QUERIES'; // Ensure the paths are correct
import { UPDATE_FABRIC_IN_INVENTORY } from '@/utils/gql/GQL_MUTATIONS'; // Import the mutation query

// Define TypeScript interfaces for type safety
interface FabricDetails {
  colour: string;
  dateOfPurchase: string;
  fabricCode: string;
  fabricType: string;
  length: number; // Purchased length
  width: number; // Purchased width
}

interface UpdatedFabricDetail {
  fabricCode: string;
  purchased_length: string;
  purchased_width: string;
  remainingLength: string;
  remainingWidth: string;
  slnoPrimary: string | null;
  takingBy: string;
  updated_at: string;
  usedFor: string;
  usedWidth: string;
  usedLength: string;
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const [param, setParam] = React.useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then((unwrappedParams) => {
      setParam(unwrappedParams);
    });
  }, [params]);

  // State for fabric details and updated fabric details
  const [fabricDetails, setFabricDetails] = useState<FabricDetails | null>(null);
  const [updatedFabricDetails, setUpdatedFabricDetails] = useState<UpdatedFabricDetail[]>([]);
  const [lastUpdatedLength, setLastUpdatedLength] = useState<string | null>(null);
  const [lastUpdatedWidth, setLastUpdatedWidth] = useState<string | null>(null);

  // State for user inputs
  const [usedLength, setUsedLength] = useState<number | string>('');
  const [usedWidth, setUsedWidth] = useState<number | string>('');
  const [takingBy, setTakingBy] = useState<string>('');
  const [usedFor, setUsedFor] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  // Queries for fabric details and updated fabric details
  const { loading: loadingFabricDetails, error: errorFabricDetails, data: dataFabricDetails } = useQuery<{ fabricDetails: FabricDetails }>(GET_FABRIC_DETAILS_BY_CODE, {
    variables: { fabricCode: param?.id },
    skip: !param,
  });

  const { loading: loadingUpdatedFabricDetails, error: errorUpdatedFabricDetails, data: dataUpdatedFabricDetails , refetch } = useQuery<{ updatedFabricInquery: UpdatedFabricDetail[] }>(GET_UPDATED_FABRIC_DETAILS_BY_CODE, {
    variables: { fabricCode: param?.id },
    skip: !param,
  });

  // Mutation to update fabric details
  const [updateFabric] = useMutation(UPDATE_FABRIC_IN_INVENTORY);

  // Set fabric details when data is fetched
  useEffect(() => {
    if (dataFabricDetails) {
      setFabricDetails(dataFabricDetails.fabricDetails);
    }
  }, [dataFabricDetails]);

  // Set updated fabric details and calculate last updated length and width
 // Set updated fabric details and calculate last updated length and width
useEffect(() => {
  if (dataUpdatedFabricDetails) {
    setUpdatedFabricDetails(dataUpdatedFabricDetails.updatedFabricInquery);
    const lastItem = dataUpdatedFabricDetails.updatedFabricInquery[dataUpdatedFabricDetails.updatedFabricInquery.length - 1];
    if (lastItem) {
      setLastUpdatedLength(lastItem.remainingLength);
      setLastUpdatedWidth(lastItem.remainingWidth);
    }
  } else if (fabricDetails) {
    // If dataUpdatedFabricDetails is not available, use the initial fabricDetails' length and width
    setLastUpdatedLength(fabricDetails.length.toString()); // Assuming length is a number, convert it to string
    setLastUpdatedWidth(fabricDetails.width.toString()); // Assuming width is a number, convert it to string
  }
}, [dataUpdatedFabricDetails, fabricDetails]);

console.log(lastUpdatedLength)
  // Function to handle the update
// Function to handle the update
// const handleUpdate = async () => {
//   if (fabricDetails) {
//     // Convert usedLength and usedWidth to numbers
//     const updatedLength = fabricDetails.length - (typeof usedLength === 'number' ? usedLength : parseFloat(usedLength as string));
//     const updatedWidth = fabricDetails.width - (typeof usedWidth === 'number' ? usedWidth : parseFloat(usedWidth as string));
    
//     try {
//       const { data } = await updateFabric({
//         variables: {
//           fabricCode: fabricDetails.fabricCode,
//           purchased_length: fabricDetails.length, // Remain unchanged
//           purchased_width: fabricDetails.width, // Remain unchanged
//           remainingLength: updatedLength,
//           remainingWidth: updatedWidth,
//           takingBy:takingBy,
//           usedFor:usedFor,
//           usedLength: typeof usedLength === 'number' ? usedLength : parseFloat(usedLength as string),
//           usedWidth: typeof usedWidth === 'number' ? usedWidth : parseFloat(usedWidth as string),
        
//         }
//       });

//       if (data) {
//         alert('Fabric details updated successfully!');
//         // Optionally, refresh data to reflect the update in the UI
//       }
//     } catch (error) {
//       console.error('Error updating fabric details:', error);
//       alert('Failed to update fabric details.');
//     }
//   }
// };

// Add state for tracking mutation status


// Update the handleUpdate function
const handleUpdate = async () => {
  if (fabricDetails && lastUpdatedLength !== null && lastUpdatedWidth !== null) {
    // Ensure `lastUpdatedLength` and `lastUpdatedWidth` are numbers
    const currentLastUpdatedLength = parseFloat(lastUpdatedLength);
    const currentLastUpdatedWidth = parseFloat(lastUpdatedWidth);

    if (isNaN(currentLastUpdatedLength) || isNaN(currentLastUpdatedWidth)) {
      console.error('Invalid last updated length or width.');
      alert('Invalid data for last updated fabric dimensions.');
      return;
    }

    // Convert usedLength and usedWidth to numbers
    const updatedLength = currentLastUpdatedLength - (typeof usedLength === 'number' ? usedLength : parseFloat(usedLength as string));
    const updatedWidth = currentLastUpdatedWidth - (typeof usedWidth === 'number' ? usedWidth : parseFloat(usedWidth as string));

    // Check for negative values to ensure logic is valid
    if (updatedLength < 0 || updatedWidth < 0) {
      alert('Entered values exceed the remaining fabric dimensions.');
      return;
    }
    try {
      setIsUpdating(true); // Set updating state to true

      const { data } = await updateFabric({
        variables: {
          fabricCode: fabricDetails.fabricCode,
          purchased_length: fabricDetails.length, // Remain unchanged
          purchased_width: fabricDetails.width, // Remain unchanged
          remainingLength: updatedLength,
          remainingWidth: updatedWidth,
          takingBy: takingBy,
          usedFor: usedFor,
          usedLength: typeof usedLength === 'number' ? usedLength : parseFloat(usedLength as string),
          usedWidth: typeof usedWidth === 'number' ? usedWidth : parseFloat(usedWidth as string),
        }
      });

      if (data) {
        alert('Fabric details updated successfully!');
        // Refetch data to reflect the update in the UI
        refetch();
        // Clear input state after successful update
        setUsedLength('');
        setUsedWidth('');
        setTakingBy('');
        setUsedFor('');
      }
    } catch (error) {
      console.error('Error updating fabric details:', error);
      alert('Failed to update fabric details.');
    } finally {
      setIsUpdating(false); // Reset updating state
    }
  }
};


  if (loadingFabricDetails || loadingUpdatedFabricDetails) return <p className="text-center text-blue-500">Loading...</p>;
  if (errorFabricDetails) return <p className="text-center text-red-500">Error loading fabric details: {errorFabricDetails.message}</p>;
  if (errorUpdatedFabricDetails) return <p className="text-center text-red-500">Error loading updated fabric details: {errorUpdatedFabricDetails.message}</p>;

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto p-4">
      {/* Display Fabric Details */}
      {fabricDetails ? (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Fabric Details</h2>
          <div className="space-y-4">
            <p className="text-gray-700"><strong>Fabric Code:</strong> {fabricDetails.fabricCode}</p>
            <p className="text-gray-700"><strong>Colour:</strong> {fabricDetails.colour}</p>
            <p className="text-gray-700"><strong>Date of Purchase:</strong> {fabricDetails.dateOfPurchase}</p>
            <p className="text-gray-700"><strong>Fabric Type:</strong> {fabricDetails.fabricType}</p>
            <p className="text-gray-700"><strong>Length (Purchased):</strong> {fabricDetails.length} meters</p>
            <p className="text-gray-700"><strong>Width (Purchased):</strong> {fabricDetails.width} meters</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No fabric details available</p>
      )}

      {/* Input for Used Length and Width */}
      {fabricDetails && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Update Fabric Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Used Length (m)</label>
              <input
                type="number"
                value={usedLength}
                onChange={(e) => setUsedLength(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Used Width (m)</label>
              <input
                type="number"
                value={usedWidth}
                onChange={(e) => setUsedWidth(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Taken By</label>
              <input
                type="text"
                value={takingBy}
                onChange={(e) => setTakingBy(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-2">Used For</label>
              <input
                type="text"
                value={usedFor}
                onChange={(e) => setUsedFor(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
           
<button
  onClick={handleUpdate}
  className={`mt-4 p-2 rounded ${isUpdating ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
  disabled={isUpdating}
>
  {isUpdating ? 'Updating...' : 'Update'}
</button>

          </div>
        </div>
      )}

      {/* Display Last Updated Length and Width in bold */}
      {lastUpdatedLength && lastUpdatedWidth && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            Last Updated Remaining Length: <span className="font-bold text-green-600">{lastUpdatedLength} meters</span>
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            Last Updated Remaining Width: <span className="font-bold text-green-600">{lastUpdatedWidth} meters</span>
          </p>
        </div>
      )}

      {/* Display Updated Fabric Details */}
      {dataUpdatedFabricDetails && dataUpdatedFabricDetails.updatedFabricInquery.length > 0 ? (
        <div className="bg-white p-6 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Updated Fabric Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-2 sm:px-4 py-2 border">Fabric Code</th>
                  <th className="px-2 sm:px-4 py-2 border">Purchased Length (m)</th>
                  <th className="px-2 sm:px-4 py-2 border">Purchased Width (m)</th>
                  <th className="px-2 sm:px-4 py-2 border">Remaining Length (m)</th>
                  <th className="px-2 sm:px-4 py-2 border">Remaining Width (m)</th>
                  <th className="px-2 sm:px-4 py-2 border">Taking By</th>
                  <th className="px-2 sm:px-4 py-2 border">Updated At</th>
                  <th className="px-2 sm:px-4 py-2 border">Used For</th>
                  <th className="px-2 sm:px-4 py-2 border">Used Width (m)</th>
                  <th className="px-2 sm:px-4 py-2 border">Used Length (m)</th>
                </tr>
              </thead>
              <tbody>
                {updatedFabricDetails.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2 border">{item.fabricCode}</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.purchased_length} m</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.purchased_width} m</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.remainingLength} m</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.remainingWidth} m</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.takingBy}</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.updated_at}</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.usedFor}</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.usedWidth} m</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.usedLength} m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No updated fabric details available</p>
      )}
    </div>
  );
};

export default Page;
