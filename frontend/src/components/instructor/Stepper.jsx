import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';

const Stepper = ({ currentStep, steps, onStepClick }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`border-b px-6 py-4 transition-colors ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white border-gray-200'
    }`}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-4 sm:space-x-8">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <button
                    onClick={() => onStepClick && onStepClick(stepNumber)}
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all
                      ${isCompleted 
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20' 
                          : 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700'
                        : isCurrent 
                        ? isDarkMode
                          ? 'border-purple-500 text-purple-400 bg-slate-700/50 shadow-lg shadow-purple-500/20'
                          : 'border-purple-600 text-purple-600 bg-white'
                        : isDarkMode
                          ? 'border-slate-600 text-slate-400 bg-slate-700/30 hover:border-slate-500'
                          : 'border-gray-300 text-gray-400 bg-white hover:border-gray-400'
                      }
                      ${onStepClick ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={!onStepClick}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </button>
                  <div className="ml-3 text-left">
                    <p className={`
                      text-sm font-medium transition-colors
                      ${isCompleted 
                        ? isDarkMode ? 'text-purple-400' : 'text-purple-600' 
                        : isCurrent 
                        ? isDarkMode ? 'text-purple-400' : 'text-purple-600' 
                        : isDarkMode ? 'text-slate-400' : 'text-gray-500'}
                    `}>
                      {step.name}
                    </p>
                    <p className={`text-xs transition-colors ${
                      isDarkMode ? 'text-slate-500' : 'text-gray-500'
                    }`}>{step.description}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block ml-6 w-8 h-0.5 transition-colors ${
                    isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                  }`} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Stepper;