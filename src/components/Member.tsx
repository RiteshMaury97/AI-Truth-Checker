import React from 'react';
import Image from 'next/image';

interface MemberProps {
  name: string;
  role: string;
  imageUrl: string;
}

const Member: React.FC<MemberProps> = ({ name, role, imageUrl }) => {
  return (
    <div className="text-center text-gray-800">
      <Image src={imageUrl} alt={name} width={150} height={150} className="rounded-full mx-auto mb-4" />
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
};

export default Member;
