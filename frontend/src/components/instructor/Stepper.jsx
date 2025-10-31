import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const Stepper = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
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
                      flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors
                      ${isCompleted 
                        ? 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700' 
                        : isCurrent 
                        ? 'border-purple-600 text-purple-600 bg-white' 
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
                      text-sm font-medium
                      ${isCompleted ? 'text-purple-600' : isCurrent ? 'text-purple-600' : 'text-gray-500'}
                    `}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden sm:block ml-6 w-8 h-0.5 bg-gray-300" />
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