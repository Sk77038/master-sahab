
import React, { useState } from 'react';
import { Calculator as CalcIcon, ArrowLeft } from 'lucide-react';

export const CalculatorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);

  const handleInput = (val: string) => {
    if (display === '0' && !isNaN(Number(val))) setDisplay(val);
    else if (display === 'Error') setDisplay(val);
    else setDisplay(prev => prev + val);
  };

  /**
   * Safe Arithmetic Evaluator
   * This avoids eval() and new Function() to pass Vercel's security checks.
   */
  const safeEval = (str: string): number => {
    // Basic regex to split numbers and operators
    const tokens = str.split(/([+\-×÷])/).map(t => t.trim());
    if (tokens.length === 0) return 0;

    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const val = parseFloat(tokens[i + 1]);
      if (op === '+') result += val;
      if (op === '-') result -= val;
      if (op === '×') result *= val;
      if (op === '÷') result /= val;
    }
    return result;
  };

  const calculate = () => {
    try {
      const res = safeEval(display);
      if (isNaN(res) || !isFinite(res)) throw new Error();
      
      setHistory(prev => [`${display} = ${res}`, ...prev].slice(0, 5));
      setDisplay(String(res));
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => setDisplay('0');

  const buttons = [
    'C', '÷', '×', 'DEL',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.', '%', ''
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-white border-b flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CalcIcon size={24} className="text-blue-600" /> Master Calculator
        </h1>
      </header>

      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-4 h-24 overflow-y-auto bg-gray-100 p-2 rounded-lg text-sm text-gray-500">
          {history.length === 0 ? "No history yet" : history.map((h, i) => <div key={i}>{h}</div>)}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-inner mb-6 text-right text-4xl font-mono truncate border-2 border-blue-100">
          {display}
        </div>

        <div className="grid grid-cols-4 gap-3 flex-1">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => {
                if (btn === '=') calculate();
                else if (btn === 'C') clear();
                else if (btn === 'DEL') setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
                else if (btn !== '') handleInput(btn);
              }}
              className={`h-16 rounded-xl text-xl font-bold transition-all active:scale-95 ${
                ['÷', '×', '-', '+', '='].includes(btn) 
                ? 'bg-blue-600 text-white' 
                : btn === 'C' || btn === 'DEL' 
                ? 'bg-red-100 text-red-600'
                : 'bg-white text-gray-800 shadow-sm border'
              } ${btn === '' ? 'opacity-0 cursor-default' : ''}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
