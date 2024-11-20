import React from "react";

const Alert = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-[#94E7EA] border-[#94E7EA] text-[#000000]",
    destructive: "bg-[#FF757A] border-[#FF757A] text-[#000000]",
    warning: "bg-[#FFBB1C] border-[#FFBB1C] text-[#000000]",
    success: "bg-[#8DC63F] border-[#8DC63F] text-[#000000]",
  };

  return (
    <div className={`border-l-4 p-4 my-4 ${styles[variant]}`}>{children}</div>
  );
};

export default Alert;
