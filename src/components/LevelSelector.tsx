import { useState } from 'react';

interface LevelSelectorProps {
  onSelectLevel: (level: number) => void;
  selectedLevel?: number;
}

export const LevelSelector = ({ 
  onSelectLevel, 
  selectedLevel = 1 
}: LevelSelectorProps) => {
  const [activeLevel, setActiveLevel] = useState(selectedLevel);

  const levels = [
    {
      level: 1,
      title: 'Basic',
      description: 'Email verification only',
      requirements: ['Email verification']
    },
    {
      level: 2,
      title: 'Intermediate',
      description: 'Basic identity verification',
      requirements: ['Email verification', 'ID document verification']
    },
    {
      level: 3,
      title: 'Advanced',
      description: 'Full identity verification',
      requirements: ['Email verification', 'ID document verification', 'Video selfie verification']
    }
  ];

  const handleLevelSelect = (level: number) => {
    setActiveLevel(level);
    onSelectLevel(level);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Verification Level</h2>
      
      <div className="space-y-4">
        {levels.map((level) => (
          <div 
            key={level.level}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              activeLevel === level.level 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
            onClick={() => handleLevelSelect(level.level)}
          >
            <div className="flex items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  activeLevel === level.level ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {level.level}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{level.title} (Level {level.level})</h3>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            </div>
            
            <div className="mt-3 ml-9">
              <p className="text-xs text-gray-500 font-medium mb-1">Requirements:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {level.requirements.map((req, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '16px', height: '16px'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 