import React, { useState } from "react";
import Alert from "./Alert";

// Mathematics units data
const mathsUnits = {
  pure: [
    { code: "P1", name: "Pure Mathematics 1" },
    { code: "P2", name: "Pure Mathematics 2" },
    { code: "P3", name: "Pure Mathematics 3" },
    { code: "P4", name: "Pure Mathematics 4" }
  ],
  further: [
    { code: "FP1", name: "Further Pure Mathematics 1" },
    { code: "FP2", name: "Further Pure Mathematics 2" },
    { code: "FP3", name: "Further Pure Mathematics 3" }
  ],
  applied: [
    { code: "M1", name: "Mechanics 1" },
    { code: "M2", name: "Mechanics 2" },
    { code: "M3", name: "Mechanics 3" },
    { code: "S1", name: "Statistics 1" },
    { code: "S2", name: "Statistics 2" },
    { code: "S3", name: "Statistics 3" },
    { code: "D1", name: "Decision Mathematics 1" }
  ]
};

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
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
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

  const checkEligibility = () => {
    try {
      setError(null);
      
      if (selectedUnits.length === 0) {
        throw new Error("Please select at least one unit");
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
        results.eligible.push("IAS Mathematics");
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
        results.eligible.push("IAL Mathematics");
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
        results.eligible.push("IAS Further Mathematics");
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
        results.eligible.push("IAL Further Mathematics");
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
          requirements: missing
        });
      }

      // Check IAS Pure Mathematics
      const iasPureRequired = mathsCriteria.IAS_PURE_MATHEMATICS.required.every(unit => 
        selectedUnits.includes(unit)
      );

      if (iasPureRequired) {
        results.eligible.push("IAS Pure Mathematics");
      } else {
        const missing = mathsCriteria.IAS_PURE_MATHEMATICS.required.filter(unit => 
          !selectedUnits.includes(unit)
        );
        results.missing.push({
          qualification: "IAS Pure Mathematics",
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
        results.eligible.push("IAL Pure Mathematics");
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
          requirements: missing
        });
      }

      setResult(results);
    } catch (err) {
      setError(err.message);
      setResult(null);
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#000000] mb-4">
              Select your completed units:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-[#DFE1E1] p-4 rounded-lg">
                <h4 className="font-semibold">Pure Mathematics</h4>
                {mathsUnits.pure.map((unit) => (
                  <div key={unit.code} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={unit.code}
                      className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                      checked={selectedUnits.includes(unit.code)}
                      onChange={() => handleUnitToggle(unit.code)}
                    />
                    <label
                      htmlFor={unit.code}
                      className="text-sm text-[#000000] font-medium"
                    >
                      {unit.code} - {unit.name}
                    </label>
                  </div>
                ))}

                <h4 className="font-semibold mt-4">Further Pure Mathematics</h4>
                {mathsUnits.further.map((unit) => (
                  <div key={unit.code} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={unit.code}
                      className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                      checked={selectedUnits.includes(unit.code)}
                      onChange={() => handleUnitToggle(unit.code)}
                    />
                    <label
                      htmlFor={unit.code}
                      className="text-sm text-[#000000] font-medium"
                    >
                      {unit.code} - {unit.name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="space-y-3 bg-[#DFE1E1] p-4 rounded-lg">
                <h4 className="font-semibold">Applied Mathematics</h4>
                {mathsUnits.applied.map((unit) => (
                  <div key={unit.code} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={unit.code}
                      className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                      checked={selectedUnits.includes(unit.code)}
                      onChange={() => handleUnitToggle(unit.code)}
                    />
                    <label
                      htmlFor={unit.code}
                      className="text-sm text-[#000000] font-medium"
                    >
                      {unit.code} - {unit.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700] transition-colors duration-200 font-semibold"
                onClick={checkEligibility}
              >
                Check Eligibility
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              {result.eligible.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">You are eligible for:</h4>
                  <div className="p-4 bg-[#8DC63F] border border-[#8DC63F] rounded-lg text-[#000000]">
                    <ul className="list-disc pl-5">
                      {result.eligible.map(qualification => (
                        <li key={qualification} className="font-medium">
                          {qualification}
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
                      <h5 className="font-semibold">{item.qualification}</h5>
                      <p className="mt-1">Missing: {Array.isArray(item.requirements) ? item.requirements.join(", ") : item.requirements}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#FFFFFF] rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-[#003057] mb-2">IAL Mathematics Qualification Rules</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">IAS Mathematics</h4>
              <p>Requires P1, P2, and one of: S1, M1, or D1</p>
            </div>
            <div>
              <h4 className="font-medium">IAL Mathematics</h4>
              <p>Requires P1, P2, P3, P4, and one of these pairs: S1+S2, M1+M2, S1+M1, S1+D1, or M1+D1</p>
            </div>
            <div>
              <h4 className="font-medium">IAS Further Mathematics</h4>
              <p>Requires FP1 and any two other units that aren't P1, P2, P3, or P4</p>
            </div>
            <div>
              <h4 className="font-medium">IAL Further Mathematics</h4>
              <p>Requires FP1, at least one of FP2 or FP3, and any four other units that aren't P1, P2, P3, or P4</p>
            </div>
            <div>
              <h4 className="font-medium">IAS Pure Mathematics</h4>
              <p>Requires P1, P2, and FP1</p>
            </div>
            <div>
              <h4 className="font-medium">IAL Pure Mathematics</h4>
              <p>Requires P1, P2, P3, P4, FP1, and one of: FP2 or FP3</p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm mt-6 p-4 bg-[#FFFFFF] rounded-lg border border-[#505759]">
          <p className="text-[#505759] mb-2">
            Need more information about IAL Mathematics eligibility?
          </p>
          <a
            href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/specification-and-sample-assesment/International-A-Level-Maths-Spec.pdf"
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
          <p className="text-[#505759] mt-2 text-xs">
            This calculator is a guide only. Please refer to the official
            documentation for complete eligibility requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MathEligibilityCalculator;
