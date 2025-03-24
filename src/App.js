import React, { useState } from "react";
import MathEligibilityCalculator from "./MathEligibilityCalculator";
import MathematicsDualQualificationCalculator from "./MathematicsDualQualificationCalculator";

const App = () => {
  const [activeCalculator, setActiveCalculator] = useState("standard");

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <header className="bg-[#003057] p-4 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Pearson Edexcel IAL Calculator</h1>
          <p className="text-sm opacity-80">
            Determine eligibility for International Advanced Level qualifications
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeCalculator === "standard"
                  ? "bg-[#FFBB1C] text-[#000000]"
                  : "bg-[#E0E0E0] text-[#333333]"
              }`}
              onClick={() => setActiveCalculator("standard")}
            >
              Standard Mathematics Eligibility
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeCalculator === "dual"
                  ? "bg-[#FFBB1C] text-[#000000]"
                  : "bg-[#E0E0E0] text-[#333333]"
              }`}
              onClick={() => setActiveCalculator("dual")}
            >
              Dual Qualification Mode
            </button>
          </div>
          
          {activeCalculator === "dual" && (
            <div className="border-l-4 p-4 mt-4 rounded-r-lg bg-[#E3F2FD] border-[#42A5F5] text-[#1565C0]">
              <p>
                <strong>Dual Qualification Mode:</strong> Use this calculator to check if you can obtain both Mathematics (YMA01) and 
                Further Mathematics (YFM01) qualifications with your selected units. This mode helps properly allocate 
                units between the two qualifications.
              </p>
            </div>
          )}
        </div>

        {activeCalculator === "standard" ? (
          <MathEligibilityCalculator />
        ) : (
          <MathematicsDualQualificationCalculator />
        )}
      </main>

      <footer className="bg-[#003057] text-white text-center p-4 mt-8">
        <p className="text-sm">
          This calculator is for guidance only. Please refer to the official Pearson Edexcel documentation
          for complete eligibility requirements.
        </p>
        <p className="text-xs mt-2 opacity-70">
          © {new Date().getFullYear()} - Based on May/June 2021 IAL Qualification Rules
        </p>
      </footer>
    </div>
  );
};

export default App;
