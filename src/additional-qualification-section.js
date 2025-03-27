import React, { useState } from 'react';
import Alert from './Alert';

const AdditionalQualificationSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState('ial-ias');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-semibold">Additional Qualification Options</h3>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="border-l-4 border-[#FFBB1C] pl-3 py-2">
            <p className="text-sm">
              Select the combination of qualifications you are aiming for:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              className={`p-3 border rounded-lg cursor-pointer ${selectedOption === 'ial-ias' ? 'bg-[#E0F7FA] border-[#94E7EA]' : 'bg-gray-50 border-gray-200'}`}
              onClick={() => setSelectedOption('ial-ias')}
            >
              <h4 className="font-medium">IAL Mathematics + IAS Further Mathematics</h4>
              <p className="text-xs text-[#505759] mt-1">
                Full A Level Mathematics with AS Level Further Mathematics
              </p>
            </div>
            
            <div 
              className={`p-3 border rounded-lg cursor-pointer ${selectedOption === 'transfer-credit' ? 'bg-[#E0F7FA] border-[#94E7EA]' : 'bg-gray-50 border-gray-200'}`}
              onClick={() => setSelectedOption('transfer-credit')}
            >
              <h4 className="font-medium">Transfer of Credit</h4>
              <p className="text-xs text-[#505759] mt-1">
                Using qualifications from other exam boards
              </p>
            </div>
          </div>
          
          {selectedOption === 'ial-ias' && (
            <div className="mt-4">
              <Alert variant="warning">
                <div className="flex flex-col space-y-2">
                  <h4 className="font-semibold">Important Reminder for IAL + IAS Combinations</h4>
                  <p className="text-sm">
                    If you have previously cashed in IAS Mathematics or Further Mathematics, you must uncash these 
                    qualifications when cashing in the IAL options to allow reaggregation of units.
                  </p>
                  <p className="text-sm">
                    Your examination officer can help with the uncashing process, which must be completed 
                    before the IAL qualification can be awarded.
                  </p>
                </div>
              </Alert>
              
              <div className="bg-[#F5F5F5] p-4 rounded-lg mt-4">
                <h4 className="font-medium mb-2">IAL Mathematics + IAS Further Mathematics Requirements:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium">For IAL Mathematics:</h5>
                    <ul className="list-disc pl-5 text-sm">
                      <li>P1, P2, P3, and P4</li>
                      <li>One valid pair from the applied units</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">For IAS Further Mathematics:</h5>
                    <ul className="list-disc pl-5 text-sm">
                      <li>FP1 is required</li>
                      <li>Two more units (cannot include P1-P4)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedOption === 'transfer-credit' && (
            <div className="mt-4">
              <Alert>
                <div className="flex flex-col space-y-2">
                  <h4 className="font-semibold">Transfer of Credit Information</h4>
                  <p className="text-sm">
                    If you are cashing in Edexcel IAL Mathematics with units from another exam board, 
                    you'll need to follow the Transfer of Credit process.
                  </p>
                  <a 
                    href="https://qualifications.pearson.com/en/support/support-topics/exams/special-requirements/transfer-of-credit.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1565C0] hover:underline font-medium text-sm"
                  >
                    Visit the Transfer of Credit page →
                  </a>
                </div>
              </Alert>
              
              <div className="bg-[#F5F5F5] p-4 rounded-lg mt-4">
                <h4 className="font-medium mb-2">Transfer of Credit Key Points:</h4>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  <li>You must apply for Transfer of Credit before the qualification can be awarded</li>
                  <li>Applications must be made via your examination officer</li>
                  <li>Evidence of the previously achieved qualification must be provided</li>
                  <li>Check deadline dates carefully - applications must be received before results day</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="bg-[#E8F5E9] p-4 rounded-lg mt-4">
            <h4 className="font-medium mb-2">Additional Resources:</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2E7D32] hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>IAL Mathematics Aggregation Rules and Guidance</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2E7D32] hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Edexcel IAL Mathematics Qualification Page</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalQualificationSection;