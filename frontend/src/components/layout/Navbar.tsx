import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Flame,
  Radio,
  Users,
  Compass,
  FileText,
  LifeBuoy,
  HeartHandshake,
  PhoneCall,
  Settings,
  UserCheck,
  Moon,
  Sun,
  Eye,
  Wifi,
  WifiOff,
  Menu,
  X,
  Play,
  Languages,
  Bot
} from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useDisaster } from '../../context/DisasterContext';
import { SupportedLanguage } from '../../i18n/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSOSModal: () => void;
  openChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSOSModal,
  openChatbot
}) => {
  const { language, setLanguage, languages, t, theme, toggleTheme, highContrast, toggleHighContrast } = useThemeLanguage();
  const { isOnline, localityRisk, simulationState, advanceSimulationStep } = useDisaster();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'live-map', label: 'Live Risk Map', icon: MapPin },
    { id: 'disasters', label: 'Disaster Info', icon: Flame },
    { id: 'rescue', label: 'Rescue Dashboard', icon: Radio },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'safe-places', label: 'Safe Places', icon: ShieldAlert },
    { id: 'wildlife', label: 'Wildlife Response', icon: LifeBuoy },
    { id: 'coastal', label: 'Coastal Risk', icon: Radio },
    { id: 'national-updates', label: 'National Updates', icon: FileText },
    { id: 'emergency-contacts', label: 'Helplines', icon: PhoneCall },
    { id: 'relief', label: 'Relief & Donations', icon: HeartHandshake },
    { id: 'profile', label: 'Profile & Family', icon: UserCheck },
    { id: 'admin', label: 'Admin & Simulation', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  SURAKSHA <span className="text-red-600">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 rounded">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Intelligent Disaster Management
              </p>
            </div>
          </div>

          {/* Center Navigation for large screens */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}

            {/* More views dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span>More</span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 hidden group-hover:block">
                {navItems.slice(6).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Action buttons & controls */}
          <div className="flex items-center gap-2">
            
            {/* AI Voice Assistant Trigger */}
            <button
              onClick={openChatbot}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
              title="AI Multilingual Voice Assistant"
            >
              <Bot className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="hidden md:inline">AI Voice</span>
            </button>

            {/* Presentation Mode Cascade Button */}
            <button
              onClick={advanceSimulationStep}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] font-medium hover:bg-amber-100 transition-colors"
              title="Step through the 11-step hackathon cyclone disaster cascade"
            >
              <Play className="w-3 h-3 text-amber-600 fill-current" />
              <span className="hidden lg:inline">Sim Step {simulationState.step_number}/5</span>
            </button>

            {/* Offline indicator */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
              }`}
              title={isOnline ? "Online (Live Telemetry)" : "Offline (SMS Fallback Ready)"}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Change Language (10 Indian Languages)"
              >
                <Languages className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as SupportedLanguage);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        language === l.code ? 'font-bold text-red-600 dark:text-red-400 bg-red-50/50' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{l.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* High Contrast Access Button */}
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg transition-colors ${
                highContrast ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Toggle High-Contrast Accessibility Mode"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* CRITICAL SOS BUTTON */}
            <button
              onClick={openSOSModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-red-600/40 animate-emergency-pulse active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('sosButton')}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 py-3 grid grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
