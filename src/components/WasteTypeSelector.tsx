
import { useState } from 'react';
import { 
  Metal, 
  Paperclip, 
  Recycle, 
  Battery, 
  Biohazard, 
  Glass, 
  Construction
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WasteTypeSelectorProps {
  value: string;
  onChange: (type: string) => void;
}

interface WasteType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const wasteTypes: WasteType[] = [
  { id: 'Metal', name: 'Metal', icon: <Metal className="w-6 h-6" />, color: 'bg-gray-300' },
  { id: 'Paper', name: 'Paper', icon: <Paperclip className="w-6 h-6" />, color: 'bg-amber-100' },
  { id: 'Plastic', name: 'Plastic', icon: <Recycle className="w-6 h-6" />, color: 'bg-blue-100' },
  { id: 'E-Waste', name: 'E-Waste', icon: <Battery className="w-6 h-6" />, color: 'bg-red-100' },
  { id: 'Bio-Waste', name: 'Bio-Waste', icon: <Biohazard className="w-6 h-6" />, color: 'bg-green-100' },
  { id: 'Glass', name: 'Glass', icon: <Glass className="w-6 h-6" />, color: 'bg-teal-100' },
  { id: 'Textile', name: 'Textile', icon: <Recycle className="w-6 h-6" />, color: 'bg-purple-100' },
  { id: 'Construction', name: 'Construction', icon: <Construction className="w-6 h-6" />, color: 'bg-yellow-100' },
];

const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {wasteTypes.map((type) => (
          <div 
            key={type.id}
            className={`animate-fade-in cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
              value === type.id 
                ? 'border-green-500 bg-green-50 shadow-md scale-105' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onChange(type.id)}
          >
            <div className={`${type.color} rounded-full p-2 mb-2`}>
              {type.icon}
            </div>
            <span className="text-sm font-medium">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteTypeSelector;
