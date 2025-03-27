import React, { useState } from 'react';
import Alert from './Alert';
import AdditionalQualificationSection from './AdditionalQualificationSection';

// Mathematics units data
const mathsUnits = {
  pure: [
    { code: "P1", name: "Pure Mathematics 1", examCode: "WMA11", cashable: true },
    { code: "P2", name: "Pure Mathematics 2", examCode: "WMA12", cashable: true },
    { code: "P3", name: "Pure Mathematics 3", examCode: "WMA13", cashable: true },
    { code: "P4", name: "Pure Mathematics 4", examCode: "WMA14", cashable: true }
  ],
  further: [
    { code: "FP1", name: "Further Pure Mathematics 1", examCode: "WFM01", cashable: true },
    { code: "FP2", name: "Further Pure Mathematics 2", examCode: "WFM02", cashable: true },
    { code: "FP3", name: "Further Pure Mathematics 3", examCode: "WFM03", cashable: true }
  ],
  applied: [
    { code: "M1", name: "Mechanics 1", examCode: "WME01", cashable: true },
    { code: "M2", name: "Mechanics 2", examCode: "WME02", cashable: true },
    { code: "M3", name: "Mechanics 3", examCode: "WME03", cashable: true },
    { code: "S1", name: "Statistics 1", examCode: "WST01", cashable: true },
    { code: "S2", name: "Statistics 2", examCode: "WST02", cashable: true },
    { code: "S3", name: "Statistics 3", examCode: "WST03", cashable: true },
    { code: "D1", name: "Decision Mathematics 1", examCode: "WDM11", cashable: true }
  ]
};

const MathEligibilityCalculator = () => {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [cashedInUnits, setCashedInUnits] = useState([]);
  const [showUncashReminder, setShowUncashReminder] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    pure: true,
    further: true,
    applied: true
  });

  const handleUnitToggle = (unitCode) => {
    setSelectedUnits(prev => {
      if (prev.includes(unitCode)) {
        return prev.filter(code => code !== unitCode);
      } else {
        return [...prev, unitCode];
      }
    });
    setResult(null);
  };

  const handleCashedInToggle = (unitCode) => {
    setCashedInUnits(prev => {
      // If toggling on (adding to cashed-in list)
      if (!prev.includes(unitCode)) {
        // Check if the unit is a P1-P4 or FP unit
        const isPure = mathsUnits.pure.some(unit => unit.code === unitCode);
        const isFurtherPure = mathsUnits.further.some(unit => unit.code === unitCode);
        
        // Show reminder if toggling on a pure or further pure unit
        if ((isPure || isFurtherPure) && !showUncashReminder) {
          setShowUncashReminder(true);
        }
        
        return [...prev, unitCode];
      } else {
        // Toggling off (removing from cashed-in list)
        return prev.filter(code => code !== unitCode);
      }
    });
    setResult(null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const checkEligibility = () => {
    try {
      setError(null);
      
      if (selectedUnits.length === 0) {
        throw new Error("Please select at least one unit");
      }

      // Check for Mathematics - 6 units required
      const isMathsEligible = checkMathsEligibility();
      
      // Check for Further Mathematics - 6 units required
      const isFurtherMathsEligible = checkFurtherMathsEligibility();
      
      // Check for IAS Further Mathematics - 3 units required
      const isIASFurtherMathsEligible = checkIASFurtherMathsEligibility();

      setResult({
        maths: isMathsEligible,
        furtherMaths: isFurtherMathsEligible,
        iasFurtherMaths: isIASFurtherMathsEligible,
        selectedUnits: [...selectedUnits],
        cashedInUnits: [...cashedInUnits]
      });
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const checkMathsEligibility = () => {
    // P1, P2, P3, P4 are required
    const p1to4 = ["P1", "P2", "P3", "P4"];
    const hasAllPure = p1to4.every(unit => selectedUnits.includes(unit));
    
    // Need one of these pairs: S1+S2, M1+M2, S1+M1, S1+D1, M1+D1
    const validPairs = [
      ["S1", "S2"],
      ["M1", "M2"],
      ["S1", "M1"],
      ["S1", "D1"],
      ["M1", "D1"]
    ];
    
    const hasValidPair = validPairs.some(pair => 
      pair.every(unit => selectedUnits.includes(unit))
    );

    // Check for cashed in units that would prevent eligibility
    const hasConflictingCashedIn = p1to4.some(unit => 
      cashedInUnits.includes(unit)
    );

    if (!hasAllPure) {
      return { eligible: false, message: "Missing one or more required Pure Mathematics units (P1-P4)" };
    }
    
    if (!hasValidPair) {
      return { eligible: false, message: "Missing a valid applied pair" };
    }
    
    if (hasConflictingCashedIn) {
      return { 
        eligible: true, 
        warning: "Some required units are already cashed in. You may need to request these to be uncashed."
      };
    }
    
    return { eligible: true };
  };

  const checkFurtherMathsEligibility = () => {
    // Must have FP1
    const hasFP1 = selectedUnits.includes("FP1");
    
    // Must have at least one of FP2 or FP3
    const hasFP2orFP3 = selectedUnits.includes("FP2") || selectedUnits.includes("FP3");
    
    // Need 6 units total, excluding P1-P4
    const pureCoreUnits = ["P1", "P2", "P3", "P4"];
    const furtherMathsUnits = selectedUnits.filter(unit => !pureCoreUnits.includes(unit));
    const hasEnoughUnits = furtherMathsUnits.length >= 6;
    
    // Check for cashed in further pure units that would prevent eligibility
    const hasConflictingCashedIn = ["FP1", "FP2", "FP3"].some(unit => 
      cashedInUnits.includes(unit)
    );

    if (!hasFP1) {
      return { eligible: false, message: "FP1 is required" };
    }
    
    if (!hasFP2orFP3) {
      return { eligible: false, message: "At least one of FP2 or FP3 is required" };
    }
    
    if (!hasEnoughUnits) {
      return { 
        eligible: false, 
        message: `Need 6 units for Further Maths (excluding P1-P4). Currently have ${furtherMathsUnits.length}.`
      };
    }
    
    if (hasConflictingCashedIn) {
      return { 
        eligible: true, 
        warning: "Some required further pure units are already cashed in and may need to be uncashed."
      };
    }
    
    return { eligible: true };
  };

  const checkIASFurtherMathsEligibility = () => {
    // Must have FP1
    const hasFP1 = selectedUnits.includes("FP1");
    
    // Need 3 units total, excluding P1-P4
    const pureCoreUnits = ["P1", "P2", "P3", "P4"];
    const furtherMathsUnits = selectedUnits.filter(unit => !pureCoreUnits.includes(unit));
    const hasEnoughUnits = furtherMathsUnits.length >= 3;
    
    // Check for cashed in units that would prevent eligibility
    const hasConflictingCashedIn = cashedInUnits.includes("FP1");

    if (!hasFP1) {
      return { eligible: false, message: "FP1 is required" };
    }
    
    if (!hasEnoughUnits) {
      return { 
        eligible: false, 
        message: `Need 3 units for IAS Further Maths (excluding P1-P4). Currently have ${furtherMathsUnits.length}.`
      };
    }
    
    if (hasConflictingCashedIn) {
      return { 
        eligible: true, 
        warning: "FP1 is already cashed in and may need to be uncashed."
      };
    }
    
    return { eligible: true };
  };

  const renderUnitsSection = (sectionName, units) => {
    return (
      <div className="mb-4">
        <div 
          className="flex items-center justify-between bg-[#94E7EA] p-2 rounded cursor-pointer"
          onClick={() => toggleSection(sectionName)}
        >
          <h4 className="font-semibold">{sectionName === "pure" ? "Pure Mathematics" : 
                                       sectionName === "further" ? "Further Pure Mathematics" : 
                                       "Applied Mathematics"}</h4>
          <svg 
            className={`w-5 h-5 transition-transform ${expandedSections[sectionName] ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {expandedSections[sectionName] && (
          <div className="bg-[#DFE1E1] p-3 rounded-b">
            <table className="w-full mb-2">
              <thead>
                <tr className="text-left text-xs text-[#505759]">
                  <th className="pb-1 w-16">Select</th>
                  <th className="pb-1">Unit</th>
                  <th className="pb-1">Exam Code</th>
                  <th className="pb-1 w-24">Previously Used</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.code} className={`border-b border-[#C5C7C7] ${cashedInUnits.includes(unit.code) ? 'bg-[#FFE7E7]' : ''}`}>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        id={unit.code}
                        className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                        checked={selectedUnits.includes(unit.code)}
                        onChange={() => handleUnitToggle(unit.code)}
                      />
                    </td>
                    <td>
                      <label
                        htmlFor={unit.code}
                        className="text-sm text-[#000000] font-medium"
                      >
                        {unit.code} - {unit.name}
                      </label>
                    </td>
                    <td className="text-sm">{unit.examCode}</td>
                    <td>
                      <input
                        type="checkbox"
                        id={`cashed-${unit.code}`}
                        className="w-4 h-4 text-[#FF757A] border-[#505759] rounded focus:ring-[#FF757A]"
                        checked={cashedInUnits.includes(unit.code)}
                        onChange={() => handleCashedInToggle(unit.code)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mathematics Eligibility Calculator</h2>
      
      {showUncashReminder && (
        <Alert variant="warning">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold">Important Reminder About Cashed In Units</h4>
              <p className="text-sm mt-1">
                You have marked units as previously used (cashed in). Remember that you need to uncash these units 
                if you want to use them in a new IAL qualification. Your examination officer can help with the uncashing process.
              </p>
              <a 
                href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#D48806] hover:underline text-sm mt-2 inline-block"
              >
                View the aggregation guidance document for more information
              </a>
            </div>
          </div>
        </Alert>
      )}
      
      <AdditionalQualificationSection />

      {error && (
        <div className="border-l-4 p-4 mb-4 rounded-r-lg bg-[#FFEBEE] border-[#FF5252] text-[#C62828]">
          <div className="flex">
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4 mt-6">
        {renderUnitsSection("pure", mathsUnits.pure)}
        {renderUnitsSection("further", mathsUnits.further)}
        {renderUnitsSection("applied", mathsUnits.applied)}
      </div>

      <div className="mt-6">
        <button
          className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700]"
          onClick={checkEligibility}
        >
          Check Eligibility
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Results:</h3>
          
          <div className={`p-4 rounded-lg ${result.maths.eligible ? 'bg-[#E0F7FA]' : 'bg-[#FFEBEE]'}`}>
            <h4 className="font-medium">IAL Mathematics (YMA01):</h4>
            {result.maths.eligible ? (
              <div>
                <p className="text-[#007C89] font-medium">Eligible for Mathematics qualification</p>
                {result.maths.warning && (
                  <div className="mt-2 flex items-start">
                    <svg className="h-4 w-4 mr-1 mt-0.5 text-[#D48806]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-[#D48806]">{result.maths.warning}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[#C62828] font-medium">Not eligible for Mathematics qualification</p>
                <p className="text-sm mt-1">{result.maths.message}</p>
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg ${result.furtherMaths.eligible ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
            <h4 className="font-medium">IAL Further Mathematics (YFM01):</h4>
            {result.furtherMaths.eligible ? (
              <div>
                <p className="text-[#2E7D32] font-medium">Eligible for Further Mathematics qualification</p>
                {result.furtherMaths.warning && (
                  <div className="mt-2 flex items-start">
                    <svg className="h-4 w-4 mr-1 mt-0.5 text-[#D48806]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-[#D48806]">{result.furtherMaths.warning}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[#C62828] font-medium">Not eligible for Further Mathematics qualification</p>
                <p className="text-sm mt-1">{result.furtherMaths.message}</p>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-lg ${result.iasFurtherMaths.eligible ? 'bg-[#FFF8E1]' : 'bg-[#FFEBEE]'}`}>
            <h4 className="font-medium">IAS Further Mathematics (International AS):</h4>
            {result.iasFurtherMaths.eligible ? (
              <div>
                <p className="text-[#F57F17] font-medium">Eligible for IAS Further Mathematics qualification</p>
                {result.iasFurtherMaths.warning && (
                  <div className="mt-2 flex items-start">
                    <svg className="h-4 w-4 mr-1 mt-0.5 text-[#D48806]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-[#D48806]">{result.iasFurtherMaths.warning}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-[#C62828] font-medium">Not eligible for IAS Further Mathematics qualification</p>
                <p className="text-sm mt-1">{result.iasFurtherMaths.message}</p>
              </div>
            )}
          </div>
          
          {(result.maths.eligible && result.iasFurtherMaths.eligible) && (
            <div className="p-4 rounded-lg bg-[#E3F2FD] border border-[#42A5F5]">
              <h4 className="font-medium">IAL Mathematics + IAS Further Mathematics Combination:</h4>
              <p className="text-[#1565C0] mt-1">
                You are eligible for both IAL Mathematics and IAS Further Mathematics qualifications!
              </p>
              <div className="mt-2 text-sm">
                <p className="font-medium">Important reminders:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Ensure that units used for one qualification are not used for the other</li>
                  <li>If any units are already cashed in, they will need to be uncashed</li>
                  <li>Speak to your examination officer about the uncashing and reaggregation process</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-[#F5F5F5] rounded-lg">
        <h3 className="font-semibold">Additional Resources and Guidance</h3>
        <div className="mt-3 space-y-3">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 text-[#007D7F]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <div>
              <a 
                href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:underline text-[#007D7F]"
              >
                IAL Mathematics Aggregation Rules and Guidance
              </a>
              <p className="text-sm text-[#505759] mt-1">
                Comprehensive guide to understanding unit aggregation and qualification rules
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 text-[#007D7F]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <a 
                href="https://qualifications.pearson.com/en/support/support-topics/exams/special-requirements/transfer-of-credit.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:underline text-[#007D7F]"
              >
                Transfer of Credit Information
              </a>
              <p className="text-sm text-[#505759] mt-1">
                Information on transferring credits from other examination boards
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 text-[#007D7F]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <div>
              <a 
                href="https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:underline text-[#007D7F]"
              >
                Edexcel IAL Mathematics Qualification Page
              </a>
              <p className="text-sm text-[#505759] mt-1">
                Official qualification information, specifications, and resources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathEligibilityCalculator;
