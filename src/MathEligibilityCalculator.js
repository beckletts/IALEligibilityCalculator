</p>
                  
                  <div className="flex gap-2 mb-2">
                    <select
                      className="flex-grow p-2 border border-[#505759] rounded"
                      value={cashInSelectValue}
                      onChange={handleCashInSelectChange}
                    >
                      <option value="">Select previous cash-in code...</option>
                      {qualifications.map(qual => (
                        <option 
                          key={qual.code} 
                          value={qual.code}
                          disabled={previousCashIns.includes(qual.code)}
                        >
                          {qual.code} - {qual.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="px-3 py-2 bg-[#94E7EA] text-[#000000] rounded"
                      onClick={addPreviousCashIn}
                    >
                      Add
                    </button>
                  </div>
                  
                  {previousCashIns.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {previousCashIns.map(code => (
                        <div key={code} className="flex items-center bg-[#E1F5F5] px-2 py-1 rounded text-sm">
                          <span>{code}</span>
                          <button
                            className="ml-2 text-[#FF4D4F]"
                            onClick={() => removePreviousCashIn(code)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {previousCashIns.length > 0 && (
                    <div className="text-xs text-[#8DC63F] mt-1">
                      Units from these qualifications will be unlocked for reuse
                    </div>
                  )}
                </div>
                
                {targetQualification && renderQualificationDetails()}
                
                <div className="flex justify-end mt-4">
                  <button
                    className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700]"
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
                    className="px-6 py-2 bg-[#FFBB1C] text-[#000000] rounded-lg hover:bg-[#FFD700]"
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
                className="px-6 py-2 bg-[#505759] text-white rounded-lg hover:bg-[#333]"
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
              Units that have been previously used (cashed in) for other qualifications require entering the previous 
              cash-in code to unlock them. If you don't enter the previous cash-in code, the units will not be eligible 
              for reuse. Please consult with your exam officer for final confirmation of eligibility.
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
