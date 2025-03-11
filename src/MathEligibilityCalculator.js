import React, { useState } from "react";
import Alert from "./Alert";

// Mathematics units data with added qualification codes
const mathsUnits = {
  pure: [
    { code: "P1", name: "Pure Mathematics 1", examCode: "YMA01", cashable: true },
    { code: "P2", name: "Pure Mathematics 2", examCode: "YMA02", cashable: true },
    { code: "P3", name: "Pure Mathematics 3", examCode: "YMA03", cashable: true },
    { code: "P4", name: "Pure Mathematics 4", examCode: "YMA04", cashable: true }
  ],
  further: [
    { code: "FP1", name: "Further Pure Mathematics 1", examCode: "YFM01", cashable: true },
    { code: "FP2", name: "Further Pure Mathematics 2", examCode: "YFM02", cashable: true },
    { code: "FP3", name: "Further Pure Mathematics 3", examCode: "YFM03", cashable: true }
  ],
  applied: [
    { code: "M1", name: "Mechanics 1", examCode: "YME01", cashable: true },
    { code: "M2", name: "Mechanics 2", examCode: "YME02", cashable: true },
    { code: "M3", name: "Mechanics 3", examCode: "YME03", cashable: true },
    { code: "S1", name: "Statistics 1", examCode: "YST01", cashable: true },
    { code: "S2", name: "Statistics 2", examCode: "YST02", cashable: true },
    { code: "S3", name: "Statistics 3", examCode: "YST03", cashable: true },
    { code: "D1", name: "Decision Mathematics 1", examCode: "YDM01", cashable: true }
  ]
};

// Mathematics qualifications with codes
const qualifications = [
  { 
    id: "IAS_MATHEMATICS", 
    name: "IAS Mathematics",
    description: "International Advanced Subsidiary Mathematics",
    code: "XMA01"
  },
  { 
    id: "IAL_MATHEMATICS", 
    name: "IAL Mathematics",
    description: "International Advanced Level Mathematics",
    code: "YMA01" 
  },
  { 
    id: "IAS_FURTHER_MATHEMATICS", 
    name: "IAS Further Mathematics",
    description: "International Advanced Subsidiary Further Mathematics",
    code: "XFM01" 
  },
  { 
    id: "IAL_FURTHER_MATHEMATICS", 
    name: "IAL Further Mathematics",
    description: "International Advanced Level Further Mathematics",
    code: "YFM01" 
  },
  { 
    id: "IAS_PURE_MATHEMATICS", 
    name: "IAS Pure Mathematics",
    description: "International Advanced Subsidiary Pure Mathematics",
    code: "XPM01" 
  },
  { 
    id: "IAL_PURE_MATHEMATICS", 
    name: "IAL Pure Mathematics",
    description: "International Advanced Level Pure Mathematics",
    code: "YPM01" 
  }
];

// Criteria for different mathematics qualifications
const mathsCriteria = {
  IAS_MATHEMATICS: {
    required: ["P1", "P2"],
    oneOf: ["S1", "M1", "D1"]
  },
  IAL_MATHEMATICS: {
    required: ["P1", "P2", "P3", "P4"],
    pairs: [
      ["S1", "S2"],
      ["M1", "M2"],
      ["S1", "M1"],
      ["S1", "D1"],
      ["M1", "D1"]
    ]
  },
  IAS_FURTHER_MATHEMATICS: {
    required: ["FP1"],
    excluding: ["P1", "P2", "P3", "P4"],
    minUnits: 3
  },
  IAL_FURTHER_MATHEMATICS: {
    required: ["FP1"],
    atLeastOneOf: ["FP2", "FP3"],
    excluding: ["P1", "P2", "P3", "P4"],
    minUnits: 6
  },
  IAS_PURE_MATHEMATICS: {
    required: ["P1", "P2", "FP1"]
  },
  IAL_PURE_MATHEMATICS: {
    required: ["P1", "P2", "P3", "P4", "FP1"],
    oneOf: ["FP2", "FP3"]
  }
};

const MathEligibilityCalculator = () => {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [cashedInUnits, setCashedInUnits] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selfCheckConfirmed, setSelfCheckConfirmed] = useState(false);
  const [step, setStep] = useState(1);
  const [targetQualification, setTargetQualification] = useState("");
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

  const checkEligibility = () => {
    try {
      setError(null);
      
      if (selectedUnits.length === 0) {
        throw new Error("Please select at least one unit");
      }

      if (!selfCheckConfirmed) {
        throw new Error("Please confirm that you've reviewed the eligibility rules before proceeding");
      }

      // Check if user is selecting cashed-in units
      const selectedCashedInUnits = selectedUnits.filter(unit => cashedInUnits.includes(unit));
      if (selectedCashedInUnits.length > 0) {
        throw new Error(`The following units have been previously cashed in: ${selectedCashedInUnits.join(", ")}. These may not be eligible for reuse.`);
      }

      const results = {
        eligible: [],
        missing: []
      };

      // Check IAS Mathematics
      const iasRequired = mathsCriteria.IAS_MATHEMATICS.required.every(unit => 
        selectedUnits.includes(unit)
      );
      const iasOption = mathsCriteria.IAS_MATHEMATICS.oneOf.some(unit => 
        selectedUnits.includes(unit)
      );

      if (iasRequired && iasOption) {
        results.eligible.push({
          name: "IAS Mathematics",
          code: qualifications.find(q => q.id === "IAS_MATHEMATICS").code
        });
      } else {
        const missing = [];
        if (!iasRequired) {
          missing.push(
            ...mathsCriteria.IAS_MATHEMATICS.required.filter(unit => !selectedUnits.includes(unit))
          );
        }
        if (!iasOption) {
          missing.push(`One of: ${mathsCriteria.IAS_MATHEMATICS.oneOf.join(", ")}`);
        }
        results.missing.push({
          qualification: "IAS Mathematics",
          code: qualifications.find(q => q.id === "IAS_MATHEMATICS").code,
          requirements: missing
        });
      }

      // Check IAL Mathematics
      const ialRequired = mathsCriteria.IAL_MATHEMATICS.required.every(unit => 
        selectedUnits.includes(unit)
      );
      const ialPair = mathsCriteria.IAL_MATHEMATICS.pairs.some(pair => 
        pair.every(unit => selectedUnits.includes(unit))
      );

      if (ialRequired && ialPair) {
        results.eligible.push({
          name: "IAL Mathematics",
          code: qualifications.find(q => q.id === "IAL_MATHEMATICS").code
        });
      } else {
        const missing = [];
        if (!ialRequired) {
          missing.push(
            ...mathsCriteria.IAL_MATHEMATICS.required.filter(unit => !selectedUnits.includes(unit))
          );
        }
        if (!ialPair) {
          missing.push("A valid pair from: S1+S2, M1+M2, S1+M1, S1+D1, or M1+D1");
        }
        results.missing.push({
          qualification: "IAL Mathematics",
          code: qualifications.find(q => q.id === "IAL_MATHEMATICS").code,
          requirements: missing
        });
      }

      // Check IAS Further Mathematics
      const iasFurtherMaths = selectedUnits.filter(unit => 
        !mathsCriteria.IAS_FURTHER_MATHEMATICS.excluding.includes(unit)
      );
      
      const hasFP1 = iasFurtherMaths.includes("FP1");
      const hasEnoughUnits = iasFurtherMaths.length >= mathsCriteria.IAS_FURTHER_MATHEMATICS.minUnits;

      if (hasFP1 && hasEnoughUnits) {
        results.eligible.push({
          name: "IAS Further Mathematics",
          code: qualifications.find(q => q.id === "IAS_FURTHER_MATHEMATICS").code
        });
      } else {
        const missing = [];
        if (!hasFP1) {
          missing.push("FP1 is required");
        }
        if (!hasEnoughUnits) {
          missing.push(`Need ${mathsCriteria.IAS_FURTHER_MATHEMATICS.minUnits} units excluding P1-P4`);
        }
        results.missing.push({
          qualification: "IAS Further Mathematics",
          code: qualifications.find(q => q.id === "IAS_FURTHER_MATHEMATICS").code,
          requirements: missing
        });
      }

      // Check IAL Further Mathematics
      const ialFurtherMaths = selectedUnits.filter(unit => 
        !mathsCriteria.IAL_FURTHER_MATHEMATICS.excluding.includes(unit)
      );
      
      const hasIalFP1 = ialFurtherMaths.includes("FP1");
      const hasFP2orFP3 = mathsCriteria.IAL_FURTHER_MATHEMATICS.atLeastOneOf.some(unit => 
        ialFurtherMaths.includes(unit)
      );
      const hasEnoughIalUnits = ialFurtherMaths.length >= mathsCriteria.IAL_FURTHER_MATHEMATICS.minUnits;

      if (hasIalFP1 && hasFP2orFP3 && hasEnoughIalUnits) {
        results.eligible.push({
          name: "IAL Further Mathematics",
          code: qualifications.find(q => q.id === "IAL_FURTHER_MATHEMATICS").code
        });
      } else {
        const missing = [];
        if (!hasIalFP1) {
          missing.push("FP1 is required");
        }
        if (!hasFP2orFP3) {
          missing.push("Either FP2 or FP3 is required");
        }
        if (!hasEnoughIalUnits) {
          missing.push(`Need ${mathsCriteria.IAL_FURTHER_MATHEMATICS.minUnits} units excluding P1-P4`);
        }
        results.missing.push({
          qualification: "IAL Further Mathematics",
          code: qualifications.find(q => q.id === "IAL_FURTHER_MATHEMATICS").code,
          requirements: missing
        });
      }

      // Check IAS Pure Mathematics
      const iasPureRequired = mathsCriteria.IAS_PURE_MATHEMATICS.required.every(unit => 
        selectedUnits.includes(unit)
      );

      if (iasPureRequired) {
        results.eligible.push({
          name: "IAS Pure Mathematics",
          code: qualifications.find(q => q.id === "IAS_PURE_MATHEMATICS").code
        });
      } else {
        const missing = mathsCriteria.IAS_PURE_MATHEMATICS.required.filter(unit => 
          !selectedUnits.includes(unit)
        );
        results.missing.push({
          qualification: "IAS Pure Mathematics",
          code: qualifications.find(q => q.id === "IAS_PURE_MATHEMATICS").code,
          requirements: missing
        });
      }

      // Check IAL Pure Mathematics
      const ialPureRequired = mathsCriteria.IAL_PURE_MATHEMATICS.required.every(unit => 
        selectedUnits.includes(unit)
      );
      const ialPureOneOf = mathsCriteria.IAL_PURE_MATHEMATICS.oneOf.some(unit => 
        selectedUnits.includes(unit)
      );

      if (ialPureRequired && ialPureOneOf) {
        results.eligible.push({
          name: "IAL Pure Mathematics",
          code: qualifications.find(q => q.id === "IAL_PURE_MATHEMATICS").code
        });
      } else {
        const missing = [];
        if (!ialPureRequired) {
          missing.push(
            ...mathsCriteria.IAL_PURE_MATHEMATICS.required.filter(unit => !selectedUnits.includes(unit))
          );
        }
        if (!ialPureOneOf) {
          missing.push(`One of: ${mathsCriteria.IAL_PURE_MATHEMATICS.oneOf.join(", ")}`);
        }
        results.missing.push({
          qualification: "IAL Pure Mathematics",
          code: qualifications.find(q => q.id === "IAL_PURE_MATHEMATICS").code,
          requirements: missing
        });
      }

      setResult(results);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Get relevant units based on selected qualification
  const getRelevantUnits = () => {
    switch(targetQualification) {
      case "IAS_MATHEMATICS":
        return {
          pure: mathsUnits.pure.filter(unit => ["P1", "P2"].includes(unit.code)),
          further: [],
          applied: mathsUnits.applied.filter(unit => ["S1", "M1", "D1"].includes(unit.code))
        };
      case "IAL_MATHEMATICS":
        return {
          pure: mathsUnits.pure,
          further: [],
          applied: mathsUnits.applied.filter(unit => ["S1", "S2", "M1", "M2", "D1"].includes(unit.code))
        };
      case "IAS_FURTHER_MATHEMATICS":
        return {
          pure: [],
          further: mathsUnits.further.filter(unit => unit.code === "FP1"),
          applied: mathsUnits.applied
        };
      case "IAL_FURTHER_MATHEMATICS":
        return {
          pure: [],
          further: mathsUnits.further,
          applied: mathsUnits.applied
        };
      case "IAS_PURE_MATHEMATICS":
        return {
          pure: mathsUnits.pure.filter(unit => ["P1", "P2"].includes(unit.code)),
          further: mathsUnits.further.filter(unit => unit.code === "FP1"),
          applied: []
        };
      case "IAL_PURE_MATHEMATICS":
        return {
          pure: mathsUnits.pure,
          further: mathsUnits.further,
          applied: []
        };
      default:
        return mathsUnits;
    }
  };

  const renderUnitsSection = (sectionName, units) => {
    if (units.length === 0) return null;
    
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
                        className={`text-sm ${cashedInUnits.includes(unit.code) ? 'text-[#FF4D4F] font-medium' : 'text-[#000000] font-medium'}`}
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
            {cashedInUnits.some(code => units.some(unit => unit.code === code)) && (
              <div className="text-xs text-[#FF4D4F] mt-2 italic">
                * Highlighted units have been previously used and may not be eligible for reuse.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderQualificationDetails = () => {
    switch(targetQualification) {
      case "IAS_MATHEMATICS":
        return (
          <div className="bg-[#DFE1E1] p-4 rounded-lg mb-4">
            <h4 className="font-semibold">IAS Mathematics Requirements (Code: {qualifications.find(q => q.id === "IAS_MATHEMATICS").code}):</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>P1 and P2 (Pure Mathematics)</li>
              <li>One of: S1, M1, or D1 (Applied Mathematics)</li>
            </ul>
          </div>
        );
      case "IAL_MATHEMATICS":
        return (
          <div className="bg-[#DFE1E1] p-4 rounded-lg mb-4">
            <h4 className="font-semibold">IAL Mathematics Requirements (Code: {qualifications.find(q => q.id === "IAL_MATHEMATICS").code}):</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>P1, P2, P3, and P4 (Pure Mathematics)</li>
              <li>One of these pairs:
                <ul className="list-circle pl-5">
                  <li>S1 and S2</li>
                  <li>M1 and M2</li>
                  <li>S1 and M1</li>
                  <li>S1 and D1</li>
                  <li>M1 and D1</li>
                </ul>
              </li>
            </ul>
          </div>
        );
      case "IAS_FURTHER_MATHEMATICS":
        return (
          <div className="bg-[#DFE1E1] p-4 rounded-lg mb-4">
            <h4 className="font-semibold">IAS Further Mathematics Requirements (Code: {qualifications.find(q => q.id === "IAS_FURTHER_MATHEMATICS").code}):</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>FP1 (Further Pure Mathematics)</li>
              <li>Two more units (excluding P1, P2, P3, P4)</li>
              <li>Note: Requires IAS Mathematics to also be awarded</li>
            </ul>
          </div>
        );
      case "IAL_FURTHER_MATHEMATICS":
        return (
          <div className="bg-[#DFE1E1] p-4 rounded-lg mb-4">
            <h4 className="font-semibold">IAL Further Mathematics Requirements (Code: {qualifications.find(q => q.id === "IAL_FURTHER_MATHEMATICS").code}):</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>FP1 (Further Pure Mathematics)</li>
              <li>At least one of FP2 or FP3</li>
              <li>Four more units (excluding P1, P2, P3, P4)</li>
              <li>Note: Requires IAL Mathematics to also be awarded</li>
            </ul>
          </div>
        );
      case "IAS_PURE_MATHEMATICS":
        return (
          <div className="bg-[#DFE1E1] p-4 rounded-lg mb-4">
            <h4 className="font-semibold">IAS Pure Mathematics Requirements (Code: {qualifications.find(q => q.id === "IAS_PURE_MATHEMATICS").code}):</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>P1 and P2 (Pure Mathematics)</li>
              <li>FP1 (Further Pure Mathematics)</li>
            </ul>
          </div>
        );
      case "IAL_PURE_MATHEMATICS":
        return (
          <div className="bg-[#DFE1E1] p-4 rounded-lg mb-4">
            <h4 className="font-semibold">IAL Pure Mathematics Requirements (Code: {qualifications.find(q => q.id === "IAL_PURE_MATHEMATICS").code}):</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>P1, P2, P3, and P4 (Pure Mathematics)</li>
              <li>FP1 (Further Pure Mathematics)</li>
              <li>One of: FP2 or FP3</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#DFE1E1] font-['Open_Sans']">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[#FFFFFF] rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-[#000000] text-2xl font-bold mb-2">
            IAL Mathematics Eligibility Calculator
          </h2>
          <p className="text-[#505759] mb-6">
            Check your International A Level Mathematics qualification eligibility based on
            completed units.
          </p>

          <Alert variant="warning">
            <div className="flex">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">Important: </span>
              <span className="ml-1">Units that have been previously used (cashed in) for other qualifications may not be eligible for reuse. Please verify your unit selection carefully.</span>
            </div>
          </Alert>

          {error && (
            <Alert variant="destructive">
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
            </Alert>
          )}

          {/* Step 1 - Select qualification */}
          {step === 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Step 1: Which qualification are you checking eligibility for?
              </h3>
              
              <div className="bg-[#DFE1E1] p-4 rounded-lg">
                <select
                  className="w-full p-2 border border-[#505759] rounded focus:border-[#94E7EA] focus:ring focus:ring-[#94E7EA] focus:ring-opacity-50"
                  value={targetQualification}
                  onChange={(e) => setTargetQualification(e.target.value)}
                >
                  <option value="">Select a qualification...</option>
                  {qualifications.map(qual => (
                    <option key={qual.id} value={qual.id}>
                      {qual.name} ({qual.code}) - {qual.description}
                    </option>
                  ))}
                </select>
                
                {targetQualification && renderQualificationDetails()}
                
                <div className="flex justify-end mt-4">
                  <button
                    className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700] transition-colors duration-200 font-semibold"
                    onClick={() => setStep(2)}
                    disabled={!targetQualification}
                  >
                    Next: Select Units
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Select units */}
          {step === 2 && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <button
                  className="mr-2 bg-[#94E7EA] p-1 rounded"
                  onClick={() => setStep(1)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-[#000000]">
                  Step 2: Select your completed units
                </h3>
              </div>
              
              <p className="mb-4 text-[#505759]">
                Check all units you have completed or plan to complete. Mark any units that have been previously used (cashed in) for other qualifications.
              </p>

              <div className="space-y-2">
                {renderQualificationDetails()}
                
                {targetQualification && (
                  <>
                    {renderUnitsSection("pure", getRelevantUnits().pure)}
                    {renderUnitsSection("further", getRelevantUnits().further)}
                    {renderUnitsSection("applied", getRelevantUnits().applied)}
                  </>
                )}
              </div>

              <div className="mt-6 bg-[#DFE1E1] p-4 rounded-lg">
                <div className="flex items-start mb-4">
                  <input
                    type="checkbox"
                    id="selfCheckConfirmation"
                    className="mt-1 w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                    checked={selfCheckConfirmed}
                    onChange={(e) => setSelfCheckConfirmed(e.target.checked)}
                  />
                  <label htmlFor="selfCheckConfirmation" className="ml-2 text-sm text-[#000000]">
                    I confirm that I have reviewed the IAL Mathematics eligibility rules and verified that my selected units meet the criteria. I understand that units previously cashed in for other qualifications may not be eligible for reuse.
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700] transition-colors duration-200 font-semibold"
                    onClick={checkEligibility}
                  >
                    Check Eligibility
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results display */}
          {result && (
            <div className="mt-6 space-y-4">
              {result.eligible.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">You are eligible for:</h4>
                  <div className="p-4 bg-[#8DC63F] border border-[#8DC63F] rounded-lg text-[#000000]">
                    <ul className="list-disc pl-5">
                      {result.eligible.map((qualification, index) => (
                        <li key={index} className="font-medium">
                          {qualification.name} ({qualification.code})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {result.missing.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Missing requirements for:</h4>
                  {result.missing.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#FF757A] border border-[#FF757A] rounded-lg text-[#000000] mb-3"
                    >
                      <h5 className="font-semibold">{item.qualification} ({item.code})</h5>
                      <p className="mt-1">Missing: {Array.isArray(item.requirements) ? item.requirements.join(", ") : item.requirements}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                className="px-6 py-2 bg-[#505759] text-white rounded-lg hover:bg-[#333] transition-colors duration-200 font-semibold"
                onClick={() => {
                  setStep(1);
                  setResult(null);
                  setSelectedUnits([]);
                  setTargetQualification("");
                }}
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-sm mt-6 p-4 bg-[#FFFFFF] rounded-lg border border-[#505759]">
          <p className="text-[#505759] mb-2">
            Need more information about IAL Mathematics eligibility?
          </p>
          <a
            href="https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#003057] hover:text-[#FFBB1C] font-semibold gap-1"
          >
            View full eligibility rules on Pearson Support
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <div className="text-[#FF4D4F] font-medium mt-3 p-2 border border-[#FF4D4F] rounded-lg">
            <p className="mb-1">⚠️ Important Disclaimer:</p>
            <p className="text-xs">
              Units that have been previously used (cashed in) for other qualifications may not be eligible for reuse. 
              Please consult with your exam officer or examination board for final confirmation of eligibility.
            </p>
          </div>
          <p className="text-[#505759] mt-3 text-xs">
            This calculator is a guide only. Please refer to the official
            documentation for complete eligibility requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MathEligibilityCalculator;
