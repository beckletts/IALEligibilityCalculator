import React from "react";

const Alert = ({ children, variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-[#FFECEC] text-[#FF4D4F] border-[#FF4D4F]";
      case "warning":
        return "bg-[#FFF9E6] text-[#D48806] border-[#FFBB1C]";
      case "success":
        return "bg-[#F4FFE6] text-[#52C41A] border-[#8DC63F]";
      default:
        return "bg-[#E1F5F5] text-[#007D7F] border-[#94E7EA]";
    }
  };

  return (
    <div
      className={`p-4 mb-4 border rounded-lg ${getVariantStyles()}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Alert;
