import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function SchemeCard({ result, onClick }) {
  const { scheme, status, metRequirements, totalRequirements } = result;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready to Explore': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Almost Ready': return 'bg-amber-100 text-amber-800 border-amber-200';
      case "Currently Doesn't Match": return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ready to Explore': return <CheckCircle2 className="w-4 h-4" />;
      case 'Almost Ready': return <Clock className="w-4 h-4" />;
      case "Currently Doesn't Match": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {scheme.category}
            </span>
            {scheme.level && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                {scheme.level}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span>{status}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{scheme.description}</p>
        
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
          <div className="font-semibold mb-1">Requirements Met:</div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (metRequirements / (totalRequirements || 1)) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold">{metRequirements}/{totalRequirements}</span>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-800 text-sm font-bold transition-colors flex items-center justify-center gap-2">
        <span>View Details</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
