import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, MapPin, Building, Phone } from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

interface EmergencyBannerProps {
  onSOSClick: () => void;
  onShelterClick: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onSOSClick, onShelterClick }) => {
  const { localityRisk, userLocation } = useDisaster();
  const { t } = useThemeLanguage();

  const isRed = localityRisk.risk_level === 'RED';
  const isYellow = localityRisk.risk_level === 'YELLOW';

  const bgColor = isRed
    ? 'bg-red-600 text-white dark:bg-red-950/90 dark:border-red-800'
    : isYellow
    ? 'bg-amber-500 text-slate-900 dark:bg-amber-950/90 dark:text-amber-100 dark:border-amber-800'
    : 'bg-emerald-600 text-white dark:bg-emerald-950/90 dark:border-emerald-800';

  const riskBadgeClass = isRed
    ? 'bg-white/20 text-white border-white/40'
    : isYellow
    ? 'bg-black/10 text-slate-900 dark:text-amber-200 border-black/20'
    : 'bg-white/20 text-white border-white/40';

  return (
    <aside aria-label="Emergency Status Alert" className={`w-full py-2.5 px-4 sm:px-6 lg:px-8 ${bgColor} border-b shadow-md transition-all duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left: Location & Severity */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold tracking-wide">
            {isRed && <AlertTriangle className="w-5 h-5 animate-bounce" />}
            {isYellow && <AlertTriangle className="w-5 h-5" />}
            {!isRed && !isYellow && <CheckCircle className="w-5 h-5" />}
            <span className="uppercase font-mono text-[11px] tracking-wider">
              {localityRisk.risk_level} ALERT
            </span>
          </div>

          <span className="opacity-60 hidden sm:inline">|</span>

          <div className="flex items-center gap-1 opacity-95">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-semibold">{userLocation.locality}</span>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskBadgeClass}`}>
            Risk Score: {localityRisk.risk_score}/100 • {localityRisk.disaster_type}
          </span>
        </div>

        {/* Center: Advisory summary */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium opacity-90">
          <span>{localityRisk.recommended_actions[0] || 'Monitor official SDMA/NDMA advisories.'}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onShelterClick}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/50 rounded-lg text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Safe Shelter (1.8 km)</span>
          </button>

          <button
            onClick={onSOSClick}
            className="flex items-center gap-1 px-3 py-1 bg-white text-red-700 hover:bg-red-50 dark:bg-red-600 dark:text-white dark:hover:bg-red-500 rounded-lg text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 fill-current" />
            <span>{t('sosButton')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
