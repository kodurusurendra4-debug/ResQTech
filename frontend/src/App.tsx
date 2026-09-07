import React, { useState } from 'react';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DisasterProvider } from './context/DisasterContext';
import { Navbar } from './components/layout/Navbar';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Footer } from './components/layout/Footer';
import { SOSModal } from './components/sos/SOSModal';
import { AIChatbotModal } from './components/chatbot/AIChatbotModal';

// 17 Core Pages
import { HomePage } from './pages/HomePage';
import { LiveRiskMapPage } from './pages/LiveRiskMapPage';
import { DisasterInfoPage } from './pages/DisasterInfoPage';
import { AIChatbotPage } from './pages/AIChatbotPage';
import { RescueDashboardPage } from './pages/RescueDashboardPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { SafePlacesPage } from './pages/SafePlacesPage';
import { SOSPage } from './pages/SOSPage';
import { ReportDisasterPage } from './pages/ReportDisasterPage';
import { NationalUpdatesPage } from './pages/NationalUpdatesPage';
import { WildlifeEmergencyPage } from './pages/WildlifeEmergencyPage';
import { CoastalRiskPage } from './pages/CoastalRiskPage';
import { ReliefDonationsPage } from './pages/ReliefDonationsPage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DisasterType } from './types';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [selectedDisasterType, setSelectedDisasterType] = useState<DisasterType>('Flood');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            setActiveTab={setActiveTab}
            openSOSModal={() => setIsSOSOpen(true)}
            openChatbot={() => setIsChatbotOpen(true)}
            setSelectedDisasterType={setSelectedDisasterType}
          />
        );
      case 'live-map':
        return <LiveRiskMapPage />;
      case 'disasters':
        return (
          <DisasterInfoPage
            initialType={selectedDisasterType}
            onReportDisaster={(type) => {
              setSelectedDisasterType(type);
              setActiveTab('report-disaster');
            }}
          />
        );
      case 'chatbot':
        return (
          <AIChatbotPage
            onTriggerSOS={() => setIsSOSOpen(true)}
            onOpenShelters={() => setActiveTab('safe-places')}
          />
        );
      case 'rescue':
        return <RescueDashboardPage />;
      case 'volunteers':
        return <VolunteerPage />;
      case 'safe-places':
        return <SafePlacesPage />;
      case 'sos':
        return <SOSPage onOpenShelters={() => setActiveTab('safe-places')} />;
      case 'report-disaster':
        return <ReportDisasterPage initialDisaster={selectedDisasterType} />;
      case 'national-updates':
        return <NationalUpdatesPage />;
      case 'wildlife':
        return <WildlifeEmergencyPage />;
      case 'coastal':
        return <CoastalRiskPage />;
      case 'relief':
        return <ReliefDonationsPage />;
      case 'emergency-contacts':
        return <EmergencyContactsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'login':
        return <LoginPage onLoginSuccess={() => setActiveTab('profile')} />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return (
          <HomePage
            setActiveTab={setActiveTab}
            openSOSModal={() => setIsSOSOpen(true)}
            openChatbot={() => setIsChatbotOpen(true)}
            setSelectedDisasterType={setSelectedDisasterType}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSOSModal={() => setIsSOSOpen(true)}
        openChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Emergency Status Banner */}
      <EmergencyBanner
        onSOSClick={() => setIsSOSOpen(true)}
        onShelterClick={() => setActiveTab('safe-places')}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveTab()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Emergency SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onOpenShelters={() => {
          setIsSOSOpen(false);
          setActiveTab('safe-places');
        }}
      />

      {/* AI Voice & Text Emergency Assistant Modal */}
      <AIChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onTriggerSOS={() => {
          setIsChatbotOpen(false);
          setIsSOSOpen(true);
        }}
        onOpenShelters={() => {
          setIsChatbotOpen(false);
          setActiveTab('safe-places');
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <DisasterProvider>
          <MainContent />
        </DisasterProvider>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}
