import React, { useState } from "react";
import MathEligibilityCalculator from "./MathEligibilityCalculator";
import MathematicsDualQualificationCalculator from "./MathematicsDualQualificationCalculator";
import Alert from "./Alert";

const App = () => {
  const [activeCalculator, setActiveCalculator] = useState("standard");
  const [showInfoBanner, setShowInfoBanner] = useState(true);

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

      {showInfoBanner && (
        <div className="bg-[#E3F2FD] border-b border-[#BBDEFB]">
          <div className="max-w-4xl mx-auto p-3 flex justify-between items-center">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-[#1565C0]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-[#1565C0]">
                <strong>New:</strong> Support for IAL + IAS combinations and Transfer of Credit options
              </p>
            </div>
            <button 
              onClick={() => setShowInfoBanner(false)}
              className="text-[#1565C0] hover:text-[#0D47A1] text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto p-4">
        <Alert>
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold">Important Information About Unit Aggregation</h4>
            <p className="text-sm">
              When combining different qualifications (e.g., IAL Mathematics with IAS Further Mathematics), 
              you must ensure proper unit aggregation. Units previously cashed in may need to be uncashed 
              before being used in a new qualification.
            </p>
            <a 
              href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#007D7F] hover:underline text-sm"
            >
              View detailed aggregation guidance
            </a>
          </div>
        </Alert>

        <div className="bg-white shadow-md rounded-lg p-4 mb-6 mt-4">
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
          
          {activeCalculator === "standard" && (
            <div className="border-l-4 p-4 mt-4 rounded-r-lg bg-[#E3F2FD] border-[#42A5F5] text-[#1565C0]">
              <p>
                <strong>Standard Mode:</strong> Check eligibility for Mathematics (YMA01), Further Mathematics (YFM01), 
                or IAS Further Mathematics qualifications. This mode now includes support for qualification combinations 
                and transfer of credit options.
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-4">
          <div>
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>
                <a 
                  href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FFBB1C]"
                >
                  Aggregation Rules
                </a>
              </li>
              <li>
                <a 
                  href="https://qualifications.pearson.com/en/support/support-topics/exams/special-requirements/transfer-of-credit.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FFBB1C]"
                >
                  Transfer of Credit
                </a>
              </li>
              <li>
                <a 
                  href="https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FFBB1C]"
                >
                  IAL Mathematics Specifications
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Important Notes</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>Units cannot be reused between qualifications</li>
              <li>Cashed-in units must be uncashed for reuse</li>
              <li>Consult your exam officer for official guidance</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">About This Calculator</h3>
            <p className="text-sm opacity-90">
              This calculator is for guidance only. Always refer to official Pearson Edexcel documentation
              for complete and up-to-date eligibility requirements.
            </p>
          </div>
        </div>
        <p className="text-sm opacity-70 pt-4 border-t border-[#004680]">
          © {new Date().getFullYear()} - Based on May/June 2021 IAL Qualification Rules
        </p>
      </footer>
    </div>
  );
};

export default App;
