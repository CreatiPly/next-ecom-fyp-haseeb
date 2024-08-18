import React from "react";
import Link from "next/link";
import RightUpArrow from "./icons/RightUpArrow";

const DashInfoCard = ({ title, value, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <Link href={link}>
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
            <RightUpArrow className="text-white" size={20} />
          </div>
        </Link>
      </div>
      <div className="text-4xl font-bold text-gray-800">{value}</div>
    </div>
  );
};

export default DashInfoCard;
