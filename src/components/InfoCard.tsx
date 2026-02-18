import React from 'react';

interface InfoCardProps {
  title: string;
  details: { label: string; value: string }[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, details }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <ul>
        {details.map((detail, index) => (
          <li key={index} className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-semibold text-gray-600">{detail.label}</span>
            <span className="text-gray-800">{detail.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoCard;
