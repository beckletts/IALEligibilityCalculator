import React, { useState } from 'react';
import Alert from './Alert';

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

const MathematicsDualQualificationCalculator = () => {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [cashedInUnits, setCashedInUnits] = useState([]);
  const [dualQualificationMode, setDualQualificationMode] = useState(true);
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
      if (prev.includes(unitCode)) {
        return prev.filter(code => code !== unitCode);
      } else {
        return [...prev, unitCode];
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

  const checkDualQualificationEligibility = () => {
    try {
      setError(null);
      
      if (selectedUnits.length === 0) {
        throw new Error("Please select at least one unit");
      }

      // Check for minimum required units (12 total for both qualifications)
      if (selectedUnits.length < 12) {
        throw new Error(`You need at least 12 units for both qualifications. Currently selected: ${selectedUnits.length}`);
      }

      // Check requirements for Mathematics
      const mathsCore = ["P1", "P2", "P3", "P4"];
      const hasMathsCore = mathsCore.every(unit => selectedUnits.includes(unit));
      
      // Check for a valid math pair
      const mathsPairs = [
        ["S1", "S2"],
        ["M1", "M2"],
        ["S1", "M1"],
        ["S1", "D1"],
        ["M1", "D1"]
      ];
      
      const hasValidMathsPair = mathsPairs.some(pair => 
        pair.every(unit => selectedUnits.includes(unit))
      );

      // Mathematics requirements fulfilled?
      const mathsRequirementsMet = hasMathsCore && hasValidMathsPair;

      // Check requirements for Further Mathematics
      const hasFP1 = selectedUnits.includes("FP1");
      const hasFP2orFP3 = selectedUnits.includes("FP2") || selectedUnits.includes("FP3");
      
      // Further maths requires 6 units excluding P1-P4
      const furtherMathsUnits = selectedUnits.filter(unit => 
        !mathsCore.includes(unit)
      );
      
      const hasEnoughFurtherUnits = furtherMathsUnits.length >= 6;

      // Further Mathematics requirements fulfilled?
      const furtherMathsRequirementsMet = hasFP1 && hasFP2orFP3 && hasEnoughFurtherUnits;

      // Units must be separate for each qualification
      const furtherMathsUnitsCounted = furtherMathsUnits.length;
      
      // Check if we have enough units for both qualifications (no overlap allowed)
      const hasEnoughUniqueUnits = selectedUnits.length >= (mathsCore.length + furtherMathsUnitsCounted);

      // Check for cashed in units that would prevent eligibility
      const hasConflictingCashedIn = selectedUnits.some(unit => cashedInUnits.includes(unit));

      let results = {
        mathsEligible: mathsRequirementsMet,
        furtherMathsEligible: furtherMathsRequirementsMet,
        dualEligible: mathsRequirementsMet && furtherMathsRequirementsMet && hasEnoughUniqueUnits,
        mathsMissing: [],
        furtherMathsMissing: [],
        allocation: { maths: [], furtherMaths: [] },
        warnings: []
      };

      // Add warning about cashed-in units if necessary
      if (hasConflictingCashedIn) {
        results.warnings.push("Some selected units are already cashed in. These will need to be uncashed before being used in new qualifications.");
      }

      // Determine what's missing for Mathematics
      if (!hasMathsCore) {
        results.mathsMissing.push(
          ...mathsCore.filter(unit => !selectedUnits.includes(unit))
        );
      }
      
      if (!hasValidMathsPair) {
        results.mathsMissing.push("A valid pair from: S1+S2, M1+M2, S1+M1, S1+D1, or M1+D1");
      }

      // Determine what's missing for Further Mathematics
      if (!hasFP1) {
        results.furtherMathsMissing.push("FP1");
      }
      
      if (!hasFP2orFP3) {
        results.furtherMathsMissing.push("Either FP2 or FP3");
      }
      
      if (!hasEnoughFurtherUnits) {
        results.furtherMathsMissing.push(`Need 6 units excluding P1-P4 (currently have ${furtherMathsUnitsCounted})`);
      }

      // If eligible for both, suggest unit allocation
      if (results.dualEligible) {
        // Allocate core units to Mathematics
        results.allocation.maths = [...mathsCore];
        
        // Identify a valid pair for Mathematics
        let allocatedPair = [];
        for (const pair of mathsPairs) {
          if (pair.every(unit => selectedUnits.includes(unit))) {
            allocatedPair = pair;
            break;
          }
        }
        
        results.allocation.maths.push(...allocatedPair);
        
        // The rest go to Further Mathematics
        const mathsAllocated = new Set([...mathsCore, ...allocatedPair]);
        results.allocation.furtherMaths = selectedUnits.filter(unit => !mathsAllocated.has(unit));
      }

      setResult(results);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
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
                  <tr key={unit.code} className={`border-b border-[#C5C7C7] ${cashedInUnits.includes(unit.code) ? 'bg-[#FFE7E7]' : 
                                                  result?.allocation?.maths?.includes(unit.code) ? 'bg-[#E0F7FA]' :
                                                  result?.allocation?.furtherMaths?.includes(unit.code) ? 'bg-[#E8F5E9]' : ''}`}>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        id={`dual-${unit.code}`}
                        className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                        checked={selectedUnits.includes(unit.code)}
                        onChange={() => handleUnitToggle(unit.code)}
                      />
                    </td>
                    <td>
                      <label
                        htmlFor={`dual-${unit.code}`}
                        className="text-sm text-[#000000] font-medium"
                      >
                        {unit.code} - {unit.name}
                      </label>
                    </td>
                    <td className="text-sm">{unit.examCode}</td>
                    <td>
                      <input
                        type="checkbox"
                        id={`dual-cashed-${unit.code}`}
                        className="w-4 h-4 text-[#FF757A] border-[#505759] rounded focus:ring-[#FF757A]"
                        checked={cashedInUnits.includes(unit.code)}
                        onChange={() => handleCashedInToggle(unit.code)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {result && (result.allocation.maths.some(code => units.some(unit => unit.code === code)) || 
                         result.allocation.furtherMaths.some(code => units.some(unit => unit.code === code))) && (
              <div className="text-xs mt-2">
                <span className="inline-block w-3 h-3 bg-[#E0F7FA] mr-1"></span> Mathematics qualification
                <span className="inline-block w-3 h-3 bg-[#E8F5E9] mx-1 ml-3"></span> Further Mathematics qualification
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mathematics Dual Qualification Calculator</h2>
      
      <div className="bg-[#F0F8FF] p-4 rounded-lg mb-6">
        <p className="font-semibold mb-2">
          Dual Qualification Mode (IAL Mathematics + IAL Further Mathematics)
        </p>
        
        <p className="text-sm text-[#505759]">
          This calculator helps you check eligibility for both Mathematics (YMA01) and Further Mathematics (YFM01) 
          qualifications simultaneously. Remember that units used for one qualification cannot be reused for the other.
        </p>
      </div>

      {cashedInUnits.length > 0 && (
        <Alert variant="warning">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold">Important Reminder About Cashed In Units</h4>
              <p className="text-sm mt-1">
                You have marked units as previously used (cashed in). For dual qualification purposes, 
                these units will need to be uncashed if you want to use them in a new qualification.
                Your examination officer can help with the uncashing process.
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

      <div className="bg-[#E8F5E9] p-4 rounded-lg mb-6 mt-4">
        <h3 className="font-semibold mb-2">Dual Qualification Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-[#94E7EA] pl-3">
            <h4 className="font-medium">IAL Mathematics (YMA01):</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>P1, P2, P3, and P4 (Pure Mathematics)</li>
              <li>One of these pairs:
                <ul className="list-circle pl-4 text-xs">
                  <li>S1 and S2</li>
                  <li>M1 and M2</li>
                  <li>S1 and M1</li>
                  <li>S1 and D1</li>
                  <li>M1 and D1</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="border-l-4 border-[#8BC34A] pl-3">
            <h4 className="font-medium">IAL Further Mathematics (YFM01):</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>FP1 (Further Pure Mathematics)</li>
              <li>At least one of FP2 or FP3</li>
              <li>Four more units (cannot include P1-P4)</li>
              <li>Units must not overlap with IAL Mathematics</li>
            </ul>
          </div>
        </div>
      </div>

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

      <div className="space-y-4">
        {renderUnitsSection("pure", mathsUnits.pure)}
        {renderUnitsSection("further", mathsUnits.further)}
        {renderUnitsSection("applied", mathsUnits.applied)}
      </div>

      <div className="mt-6">
        <button
          className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700]"
          onClick={checkDualQualificationEligibility}
        >
          Check Dual Qualification Eligibility
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Results:</h3>
          
          {result.warnings.length > 0 && (
            <Alert variant="warning">
              <div>
                <h4 className="font-semibold">Important Notes</h4>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {result.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}
          
          <div className={`p-4 rounded-lg ${result.mathsEligible ? 'bg-[#E0F7FA]' : 'bg-[#FFEBEE]'}`}>
            <h4 className="font-medium">IAL Mathematics (YMA01):</h4>
            {result.mathsEligible ? (
              <p className="text-[#007C89] font-medium">Eligible for Mathematics qualification</p>
            ) : (
              <div>
                <p className="text-[#C62828] font-medium">Not eligible for Mathematics qualification</p>
                <p className="text-sm mt-1">Missing: {result.mathsMissing.join(", ")}</p>
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg ${result.furtherMathsEligible ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'}`}>
            <h4 className="font-medium">IAL Further Mathematics (YFM01):</h4>
            {result.furtherMathsEligible ? (
              <p className="text-[#2E7D32] font-medium">Eligible for Further Mathematics qualification</p>
            ) : (
              <div>
                <p className="text-[#C62828] font-medium">Not eligible for Further Mathematics qualification</p>
                <p className="text-sm mt-1">Missing: {result.furtherMathsMissing.join(", ")}</p>
              </div>
            )}
          </div>
          
          <div className={`p-4 rounded-lg ${result.dualEligible ? 'bg-[#FFF8E1]' : 'bg-[#FFEBEE]'}`}>
            <h4 className="font-medium">Dual Qualification:</h4>
            {result.dualEligible ? (
              <div>
                <p className="text-[#F57F17] font-medium">Eligible for both qualifications!</p>
                <div className="mt-2 p-3 bg-white rounded border border-[#DFE1E1]">
                  <p className="font-medium mb-2">Recommended unit allocation:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium">Mathematics (YMA01):</h5>
                      <ul className="list-disc pl-5 text-sm">
                        {result.allocation.maths.map((unit, index) => (
                          <li key={index}>{unit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium">Further Mathematics (YFM01):</h5>
                      <ul className="list-disc pl-5 text-sm">
                        {result.allocation.furtherMaths.map((unit, index) => (
                          <li key={index}>{unit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[#C62828] font-medium">Not eligible for both qualifications</p>
                {(!result.mathsEligible || !result.furtherMathsEligible) && (
                  <p className="text-sm mt-1">Please check the individual qualification requirements above.</p>
                )}
                {(result.mathsEligible && result.furtherMathsEligible && !result.dualEligible) && (
                  <p className="text-sm mt-1">You need 12 unique units with no overlap between qualifications.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-[#505759]">
        <p className="mb-2 font-medium">Important notes:</p>
        <ul className="list-disc pl-5">
          <li>Units used for one qualification cannot be used for another qualification.</li>
          <li>You need at least 12 unique units in total for both qualifications.</li>
          <li>Highlighted colors show which units are allocated to which qualification.</li>
          <li>This calculator is for guidance only. Please confirm with your exam officer.</li>
        </ul>
      </div>
      
      <div className="mt-8 p-4 bg-[#F5F5F5] rounded-lg">
        <h3 className="font-semibold">Additional Resources</h3>
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
        </div>
      </div>
    </div>
  );
};

export default MathematicsDualQualificationCalculator;
