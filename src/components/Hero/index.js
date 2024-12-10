import Link from 'next/link';
import React from 'react';

const Index = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-200 p-8">
      <Link
        href="/FabricForm"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
      >
       Generate QR for Fabric
      </Link>
    </div>
  );
};

export default Index;
