
import { useState } from 'react';
import { 
  Medal, 
  Paperclip, 
  Recycle, 
  Battery, 
  Biohazard, 
  Glasses, 
  Construction,
  Shirt,
  LeafyGreen,
  HelpCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WasteTypeSelectorProps {
  value: string[];
  onChange: (types: string[]) => void;
}

interface WasteType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const wasteTypes: WasteType[] = [
  { id: 'Metal', name: 'Metal', icon: <Medal className="w-6 h-6" />, color: 'bg-gray-300' },
  { id: 'Plastic', name: 'Plastic', icon: <Recycle className="w-6 h-6" />, color: 'bg-blue-100' },
  { id: 'E-Waste', name: 'E-Waste', icon: <Battery className="w-6 h-6" />, color: 'bg-red-100' },
  { id: 'Paper', name: 'Paper', icon: <Paperclip className="w-6 h-6" />, color: 'bg-amber-100' },
  { id: 'Glass', name: 'Glass', icon: <Glasses className="w-6 h-6" />, color: 'bg-teal-100' },
  { id: 'Rubber', name: 'Rubber', icon: <Recycle className="w-6 h-6" />, color: 'bg-orange-100' },
  { id: 'Textiles', name: 'Textiles', icon: <Shirt className="w-6 h-6" />, color: 'bg-purple-100' },
  { id: 'Organic', name: 'Organic Waste', icon: <LeafyGreen className="w-6 h-6" />, color: 'bg-green-100' },
  { id: 'Others', name: 'Others', icon: <HelpCircle className="w-6 h-6" />, color: 'bg-yellow-100' },
];

const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({ value = [], onChange }) => {
  const [otherSpecified, setOtherSpecified] = useState('');

  // Handle toggling selection of a waste type
  const toggleWasteType = (typeId: string) => {
    if (value.includes(typeId)) {
      // If 'Others' is being deselected, clear the custom input
      if (typeId === 'Others') {
        setOtherSpecified('');
      }
      onChange(value.filter(id => id !== typeId));
    } else {
      onChange([...value, typeId]);
    }
  };

  // Handle custom "Other" input
  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customValue = e.target.value;
    setOtherSpecified(customValue);
    
    // If there's custom text and "Others" is not already selected, add it
    if (customValue && !value.includes('Others')) {
      onChange([...value, 'Others']);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Waste Type (Select all that apply)
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {wasteTypes.map((type) => (
          <div 
            key={type.id}
            className={`animate-fade-in cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
              value.includes(type.id) 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => toggleWasteType(type.id)}
          >
            <div className={`${type.color} rounded-full p-2 mb-2`}>
              {type.icon}
            </div>
            <span className="text-sm font-medium text-center">{type.name}</span>
          </div>
        ))}
      </div>
      
      {/* Custom input for "Others" */}
      {value.includes('Others') && (
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Please specify other waste types:
          </label>
          <Input
            type="text"
            value={otherSpecified}
            onChange={handleOtherChange}
            placeholder="Enter other waste types"
            className="w-full"
          />
        </div>
      )}

      {value.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Selected types:</p>
          <div className="flex flex-wrap gap-2">
            {value.map(typeId => (
              <div 
                key={typeId}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {typeId} {typeId === 'Others' && otherSpecified ? `(${otherSpecified})` : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteTypeSelector;
