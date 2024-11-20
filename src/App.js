import React, { useState } from "react";
import Alert from "./Alert";
import { subjects } from "./subjects"; // Move subject data to separate file

const LockGroup = {
  MATHEMATICS: "MATHEMATICS",
  FURTHER_MATHEMATICS: "FURTHER_MATHEMATICS",
  PURE_MATHEMATICS: "PURE_MATHEMATICS",
};

const isUnitPure = (unit) => {
  return ["P1", "P2", "P3", "P4", "FP1", "FP2", "FP3"].includes(unit);
};

const getLockStatus = (unit, qualificationHistory) => {
  if (isUnitPure(unit) && qualificationHistory.every((q) => q.level === "AS")) {
    return null;
  }

  const latestIAL = qualificationHistory
    .filter((q) => q.level === "A")
    .sort((a, b) => b.date - a.date)[0];

  if (!latestIAL) return null;

  if (latestIAL.type === "PURE_MATHEMATICS" && isUnitPure(unit)) {
    return LockGroup.PURE_MATHEMATICS;
  }

  if (latestIAL.type === "MATHEMATICS") {
    return LockGroup.MATHEMATICS;
  }

  if (latestIAL.type === "FURTHER_MATHEMATICS") {
    return LockGroup.FURTHER_MATHEMATICS;
  }

  return null;
};

const validateLocking = (subject, selectedUnits, qualificationHistory = []) => {
  // Get lock status for all units
  const unitLocks = selectedUnits.map((unit) => ({
    unit,
    lock: getLockStatus(unit, qualificationHistory),
  }));

  // Check for mixing locked units
  const hasConflictingLocks = unitLocks.some(({ lock: lock1 }) =>
    unitLocks.some(({ lock: lock2 }) => lock1 && lock2 && lock1 !== lock2)
  );

  if (hasConflictingLocks) {
    throw new Error(
      "Cannot mix units locked to different qualification groups"
    );
  }

  // Validate Mathematics vs Pure Mathematics route
  if (subject === "PURE_MATHEMATICS") {
    const hasMathsLocked = unitLocks.some(
      ({ lock }) => lock === LockGroup.MATHEMATICS
    );
    if (hasMathsLocked) {
      throw new Error(
        "Units locked to Mathematics cannot be used for Pure Mathematics"
      );
    }
  }
};

const maximizeGrades = (selectedUnits, qualificationHistory) => {
  if (qualificationHistory.length === 0) return null;

  // For Mathematics and Further Mathematics route
  if (
    qualificationHistory.some(
      (q) => q.type === "MATHEMATICS" || q.type === "FURTHER_MATHEMATICS"
    )
  ) {
    return {
      requiresRecertification: true,
      recommendedUnits: {
        mathematics: selectedUnits.slice(0, 6),
        furtherMaths: selectedUnits.slice(6, 12),
      },
    };
  }

  return null;
};

const checkStandardEligibility = (criteria, selectedUnits) => {
  const result = { eligible: [], missing: [] };

  // Check AS Level if it exists
  if (criteria.AS) {
    const hasAllAS = criteria.AS.every((unit) => selectedUnits.includes(unit));
    if (hasAllAS) {
      result.eligible.push("AS");
    } else {
      result.missing.push({
        level: "AS",
        units: criteria.AS.filter((unit) => !selectedUnits.includes(unit)),
      });
    }
  }

  // Check A Level
  const hasAllA = criteria.A.every((unit) => selectedUnits.includes(unit));
  if (hasAllA) {
    result.eligible.push("A");
  } else {
    result.missing.push({
      level: "A",
      units: criteria.A.filter((unit) => !selectedUnits.includes(unit)),
    });
  }

  return result;
};

const checkMathematicsEligibility = (criteria, selectedUnits) => {
  const result = { eligible: [], missing: [] };

  // Check AS Level
  const hasASRequired = criteria.AS.required.every((unit) =>
    selectedUnits.includes(unit)
  );
  const hasASOption = criteria.AS.oneOf.some((unit) =>
    selectedUnits.includes(unit)
  );

  if (hasASRequired && hasASOption) {
    result.eligible.push("AS");
  } else {
    const missing = [];
    if (!hasASRequired) {
      missing.push(
        ...criteria.AS.required.filter((unit) => !selectedUnits.includes(unit))
      );
    }
    if (!hasASOption) {
      missing.push(`One of: ${criteria.AS.oneOf.join(", ")}`);
    }
    result.missing.push({ level: "AS", units: missing });
  }

  // Check A Level
  const hasARequired = criteria.A.required.every((unit) =>
    selectedUnits.includes(unit)
  );
  const hasValidPair = criteria.A.pairs.some((pair) =>
    pair.every((unit) => selectedUnits.includes(unit))
  );

  if (hasARequired && hasValidPair) {
    result.eligible.push("A");
  } else {
    const missing = [];
    if (!hasARequired) {
      missing.push(
        ...criteria.A.required.filter((unit) => !selectedUnits.includes(unit))
      );
    }
    if (!hasValidPair) {
      missing.push(
        "A valid pair of application units (M1+S1, M1+D1, M1+M2, S1+D1, or S1+S2)"
      );
    }
    result.missing.push({ level: "A", units: missing });
  }

  return result;
};

const checkPureMathsEligibility = (criteria, selectedUnits) => {
  const result = { eligible: [], missing: [] };

  // Check AS Level
  const hasAllAS = criteria.AS.every((unit) => selectedUnits.includes(unit));
  if (hasAllAS) {
    result.eligible.push("AS");
  } else {
    result.missing.push({
      level: "AS",
      units: criteria.AS.filter((unit) => !selectedUnits.includes(unit)),
    });
  }

  // Check A Level
  const hasRequired = criteria.A.required.every((unit) =>
    selectedUnits.includes(unit)
  );
  const hasOneOf = criteria.A.oneOf.some((unit) =>
    selectedUnits.includes(unit)
  );

  if (hasRequired && hasOneOf) {
    result.eligible.push("A");
  } else {
    const missing = [];
    if (!hasRequired) {
      missing.push(
        ...criteria.A.required.filter((unit) => !selectedUnits.includes(unit))
      );
    }
    if (!hasOneOf) {
      missing.push(`One of: ${criteria.A.oneOf.join(", ")}`);
    }
    result.missing.push({ level: "A", units: missing });
  }

  return result;
};

const validateMathsSubjects = (subject, selectedUnits) => {
  if (
    subject === "MATHEMATICS" &&
    selectedUnits.some((unit) => ["WFM01", "WFM02", "WFM03"].includes(unit))
  ) {
    return "Units cannot be used for both Mathematics and Pure Mathematics qualifications";
  }
  return null;
};

const checkFurtherMathsEligibility = (criteria, selectedUnits) => {
  const result = { eligible: [], missing: [] };

  // Check AS Level
  const hasASCore = criteria.AS.required.every((unit) =>
    selectedUnits.includes(unit)
  );
  const optionalUnitsCount = criteria.AS.twoFrom.filter((unit) =>
    selectedUnits.includes(unit)
  ).length;

  if (hasASCore && optionalUnitsCount >= 2) {
    result.eligible.push("AS");
  } else {
    const missing = [];
    if (!hasASCore) {
      missing.push(...criteria.AS.required);
    }
    if (optionalUnitsCount < 2) {
      missing.push(
        `Need ${2 - optionalUnitsCount} more from: ${criteria.AS.twoFrom.join(
          ", "
        )}`
      );
    }
    result.missing.push({ level: "AS", units: missing });
  }

  // Check both A Level routes
  const route1 = criteria.A.options[0];
  const route2 = criteria.A.options[1];

  // Route 1: FP1 + (FP2 or FP3) + 4 apps
  const hasRoute1Core = route1.required.every((unit) =>
    selectedUnits.includes(unit)
  );
  const hasRoute1Further = route1.oneFromFurther.some((unit) =>
    selectedUnits.includes(unit)
  );
  const route1AppsCount = route1.fourFromApps.filter((unit) =>
    selectedUnits.includes(unit)
  ).length;

  // Route 2: FP1 + FP2 + FP3 + 3 apps
  const hasRoute2Core = route2.required.every((unit) =>
    selectedUnits.includes(unit)
  );
  const route2AppsCount = route2.threeFromApps.filter((unit) =>
    selectedUnits.includes(unit)
  ).length;

  if (
    (hasRoute1Core && hasRoute1Further && route1AppsCount >= 4) ||
    (hasRoute2Core && route2AppsCount >= 3)
  ) {
    result.eligible.push("A");
  } else {
    result.missing.push({
      level: "A",
      units: [
        "Complete either:",
        "Route 1: FP1 + (FP2 or FP3) + four application units",
        "Route 2: FP1 + FP2 + FP3 + three application units",
      ],
    });
  }

  return result;
};
export default function App() {
  const [subject, setSubject] = useState("");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [qualificationHistory, setQualificationHistory] = useState([]);

  const validateInput = (subject, selectedUnits, qualificationHistory = []) => {
    if (!subject) {
      throw new Error("Please select a subject");
    }

    if (selectedUnits.length === 0) {
      throw new Error("Please select at least one unit");
    }

    if (subject === "LAW" && selectedUnits.length < 2) {
      throw new Error(
        "Law requires completion of both Paper 1 and Paper 2 in the same exam series"
      );
    }

    validateLocking(subject, selectedUnits, qualificationHistory);

    const hasOnlineVariant = selectedUnits.some((unit) => unit.endsWith("C"));
    const hasOfflineVariant = selectedUnits.some(
      (unit) => !unit.endsWith("C") && selectedUnits.includes(`${unit}C`)
    );

    if (hasOnlineVariant && hasOfflineVariant) {
      throw new Error(
        "Cannot mix online (C) and offline variants of the same unit"
      );
    }
  };

  const checkEligibility = () => {
    try {
      setError(null);
      validateInput(subject, selectedUnits, qualificationHistory);

      const subjectData = subjects[subject];
      let eligibilityResult;

      switch (subject) {
        case "MATHEMATICS":
          eligibilityResult = checkMathematicsEligibility(
            subjectData.criteria,
            selectedUnits
          );
          break;
        case "FURTHER_MATHEMATICS":
          eligibilityResult = checkFurtherMathsEligibility(
            subjectData.criteria,
            selectedUnits
          );
          break;
        case "PURE_MATHEMATICS":
          eligibilityResult = checkPureMathsEligibility(
            subjectData.criteria,
            selectedUnits
          );
          break;
        default:
          eligibilityResult = checkStandardEligibility(
            subjectData.criteria,
            selectedUnits
          );
      }

      setResult(eligibilityResult);
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
            IAL Eligibility Calculator
          </h2>
          <p className="text-[#505759] mb-6">
            Check your International A Level qualification eligibility based on
            completed units.
          </p>

          {error && (
            <Alert variant="destructive">
              <div className="flex">
                <svg
                  className="h-5 w-5 mr-2 text-[#FF757A]"
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
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Select Subject
            </label>
            <select
              className="w-full p-2 border border-[#505759] rounded focus:border-[#94E7EA] focus:ring focus:ring-[#94E7EA] focus:ring-opacity-50"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setSelectedUnits([]);
                setResult(null);
              }}
            >
              <option value="">Select a subject...</option>
              {Object.entries(subjects).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          {subject && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#000000] mb-4">
                Select completed units:
              </h3>
              <div className="space-y-3 bg-[#DFE1E1] p-4 rounded-lg">
                {subjects[subject].units.map((unit) => (
                  <div key={unit.code} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={unit.code}
                      className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                      checked={selectedUnits.includes(unit.code)}
                      onChange={(e) => {
                        setSelectedUnits((prev) =>
                          e.target.checked
                            ? [...prev, unit.code]
                            : prev.filter((code) => code !== unit.code)
                        );
                        setResult(null);
                      }}
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

              {subject && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#000000] mb-4">
                    Previous Qualifications:
                  </h3>
                  <div className="space-y-3 bg-[#DFE1E1] p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="reenter-ias"
                        className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                        onChange={(e) => {
                          const newHistory = e.target.checked
                            ? [
                                ...qualificationHistory,
                                {
                                  level: "AS",
                                  type: subject,
                                  date: new Date(),
                                },
                              ]
                            : qualificationHistory.filter(
                                (q) => q.level !== "AS"
                              );
                          setQualificationHistory(newHistory);
                        }}
                      />
                      <label
                        htmlFor="reenter-ias"
                        className="text-sm text-[#000000] font-medium"
                      >
                        Re-enter IAS {subject.replace("_", " ")}
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="reenter-ial"
                        className="w-4 h-4 text-[#FFBB1C] border-[#505759] rounded focus:ring-[#FFBB1C]"
                        onChange={(e) => {
                          const newHistory = e.target.checked
                            ? [
                                ...qualificationHistory,
                                { level: "A", type: subject, date: new Date() },
                              ]
                            : qualificationHistory.filter(
                                (q) => q.level !== "A"
                              );
                          setQualificationHistory(newHistory);
                        }}
                      />
                      <label
                        htmlFor="reenter-ial"
                        className="text-sm text-[#000000] font-medium"
                      >
                        Re-enter IAL {subject.replace("_", " ")}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="mt-6 px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700] transition-colors duration-200 font-semibold"
                onClick={checkEligibility}
              >
                Check Eligibility
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              {result.eligible.length > 0 && (
                <div className="p-4 bg-[#8DC63F] border border-[#8DC63F] rounded-lg text-[#000000]">
                  <h4 className="font-semibold">
                    Eligible for: {result.eligible.join(" and ")} Level
                  </h4>
                </div>
              )}

              {result && qualificationHistory.length > 0 && (
                <div className="mt-4">
                  <div className="p-4 bg-[#DFE1E1] border border-[#505759] rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Re-certification Analysis
                    </h4>
                    {maximizeGrades(selectedUnits, qualificationHistory)
                      ?.requiresRecertification ? (
                      <>
                        <p className="text-sm mb-2">
                          Re-entering both qualifications may optimize your
                          grades. Recommended unit allocation:
                        </p>
                        <div className="pl-4">
                          <p className="text-sm">
                            Mathematics:{" "}
                            {maximizeGrades(
                              selectedUnits,
                              qualificationHistory
                            )?.recommendedUnits?.mathematics?.join(", ")}
                          </p>
                          <p className="text-sm">
                            Further Mathematics:{" "}
                            {maximizeGrades(
                              selectedUnits,
                              qualificationHistory
                            )?.recommendedUnits?.furtherMaths?.join(", ")}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm">
                        No grade optimization opportunities found
                      </p>
                    )}
                  </div>
                </div>
              )}

              {result.missing.map(({ level, units }, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#FF757A] border border-[#FF757A] rounded-lg text-[#000000]"
                >
                  <h4 className="font-semibold">
                    Missing requirements for {level} Level
                  </h4>
                  <p className="mt-1">Missing units: {units.join(", ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center text-sm mt-6 p-4 bg-[#FFFFFF] rounded-lg border border-[#505759]">
          <p className="text-[#505759] mb-2">
            Need more information about IAL eligibility?
          </p>
          <a
            href="https://support.pearson.com/uk/s/article/International-A-Level-IAL-Eligibility"
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
}
