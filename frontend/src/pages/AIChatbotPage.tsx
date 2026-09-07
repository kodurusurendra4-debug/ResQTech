import React from 'react';
import { AIChatbotModal } from '../components/chatbot/AIChatbotModal';

export const AIChatbotPage: React.FC<{
  onTriggerSOS: () => void;
  onOpenShelters: () => void;
}> = ({ onTriggerSOS, onOpenShelters }) => {
  return (
    <div className="py-2">
      <AIChatbotModal
        isOpen={true}
        onClose={() => {}}
        onTriggerSOS={onTriggerSOS}
        onOpenShelters={onOpenShelters}
      />
    </div>
  );
};
