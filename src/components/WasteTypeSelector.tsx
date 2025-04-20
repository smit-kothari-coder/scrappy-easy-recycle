
import { useState } from 'react';
import { 
  BadgeCheck,
  Recycle, 
  Battery, 
  Biohazard, 
  Glasses, 
  Construction,
  Shirt,
  Delete,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  { id: 'Metal', name: 'Metal', icon: <BadgeCheck className="w-5 h-5" />, color: 'bg-gray-300' },
  { id: 'Paper', name: 'Paper', icon: <Recycle className="w-5 h-5" />, color: 'bg-amber-100' },
  { id: 'Plastic', name: 'Plastic', icon: <Recycle className="w-5 h-5" />, color: 'bg-blue-100' },
  { id: 'E-waste', name: 'E-waste', icon: <Battery className="w-5 h-5" />, color: 'bg-red-100' },
  { id: 'Glass', name: 'Glass', icon: <Glasses className="w-5 h-5" />, color: 'bg-teal-100' },
  { id: 'Rubber', name: 'Rubber', icon: <Recycle className="w-5 h-5" />, color: 'bg-green-300' },
  { id: 'Textiles', name: 'Textiles', icon: <Shirt className="w-5 h-5" />, color: 'bg-purple-100' },
  { id: 'Organic Waste', name: 'Organic Waste', icon: <Biohazard className="w-5 h-5" />, color: 'bg-green-100' },
  { id: 'Construction', name: 'Construction', icon: <Construction className="w-5 h-5" />, color: 'bg-yellow-100' },
];

const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({ value = [], onChange }) => {
  const [showOtherInput, setShowOtherInput] = useState(value.some(type => !wasteTypes.some(wt => wt.id === type)));
  const [otherValue, setOtherValue] = useState('');

  const handleTypeToggle = (typeId: string) => {
    if (typeId === 'Others') {
      // Toggle the "Others" option and show/hide the input
      setShowOtherInput(!showOtherInput);
      if (showOtherInput) {
        // If we're hiding the input, remove any custom values
        const standardTypes = value.filter(type => wasteTypes.some(wt => wt.id === type));
        onChange(standardTypes);
      }
      return;
    }

    const newValue = value.includes(typeId) 
      ? value.filter(t => t !== typeId) 
      : [...value, typeId];
    
    onChange(newValue);
  };

  const handleAddOtherType = () => {
    if (otherValue && !value.includes(otherValue)) {
      onChange([...value, otherValue]);
      setOtherValue('');
    }
  };

  const handleRemoveType = (typeToRemove: string) => {
    onChange(value.filter(t => t !== typeToRemove));
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Waste Types (Select all that apply)</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
        {wasteTypes.map((type) => {
          const isSelected = value.includes(type.id);
          
          return (
            <div 
              key={type.id}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleTypeToggle(type.id)}
            >
              <div className="flex items-center h-4">
                <Checkbox 
                  id={`waste-type-${type.id}`}
                  checked={isSelected}
                  // Fixed: Remove the onCheckedChange handler to prevent double state updates
                  // We're already handling the state in the parent div's onClick
                  className="data-[state=checked]:bg-green-500 border-gray-300"
                />
              </div>
              <div className={`${type.color} rounded-full p-2 mr-2 flex-shrink-0`}>
                {type.icon}
              </div>
              <Label
                htmlFor={`waste-type-${type.id}`}
                className="flex-1 cursor-pointer text-sm"
              >
                {type.name}
              </Label>
            </div>
          );
        })}
        
        {/* "Others" option */}
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
            showOtherInput 
              ? 'border-green-500 bg-green-50 shadow-sm' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => handleTypeToggle('Others')}
        >
          <div className="flex items-center h-4">
            <Checkbox 
              id="waste-type-others"
              checked={showOtherInput}
              // Fixed: Remove the onCheckedChange handler to prevent double state updates
              // We're already handling the state in the parent div's onClick
              className="data-[state=checked]:bg-green-500 border-gray-300"
            />
          </div>
          <div className="bg-gray-200 rounded-full p-2 mr-2 flex-shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <Label
            htmlFor="waste-type-others"
            className="flex-1 cursor-pointer text-sm"
          >
            Others
          </Label>
        </div>
      </div>
      
      {/* Input for "Others" option */}
      {showOtherInput && (
        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            placeholder="Enter other waste type"
            className="flex-1"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={handleAddOtherType} 
            disabled={!otherValue}
          >
            Add
          </Button>
        </div>
      )}
      
      {/* Display selected types */}
      {value.length > 0 && (
        <div className="mt-3">
          <Label className="text-sm text-gray-600 mb-2">Selected Types:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {value.map(type => (
              <div 
                key={type} 
                className="bg-green-100 text-green-800 text-xs rounded-full px-3 py-1 flex items-center gap-1"
              >
                {type}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveType(type);
                  }}
                  className="text-green-700 hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteTypeSelector;
