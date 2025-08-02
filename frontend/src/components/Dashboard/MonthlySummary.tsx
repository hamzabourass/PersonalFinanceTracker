import React from 'react';

interface MonthlySummaryProps {
  netIncome: number;
  savingsRate: number;
  yearlyProjection: number;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  netIncome,
  savingsRate,
  yearlyProjection
}) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Net Income</span>
          <span className={`font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netIncome >= 0 ? '+' : ''}${netIncome}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Savings Rate</span>
          <span className="font-semibold text-blue-600">{savingsRate}%</span>
        </div>
        <div className="pt-2 border-t border-green-200">
          <p className="text-sm text-gray-600">
            You're on track to save <span className="font-semibold text-green-600">${yearlyProjection}</span> this year!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;