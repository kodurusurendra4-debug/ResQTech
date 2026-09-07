import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Building,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useDisaster } from '../../context/DisasterContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isUrgent?: boolean;
  actionButtons?: Array<{
    label: string;
    action: () => void;
    variant: 'danger' | 'primary' | 'secondary';
  }>;
}

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSOS: () => void;
  onOpenShelters: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  isOpen,
  onClose,
  onTriggerSOS,
  onOpenShelters
}) => {
  const { language, t } = useThemeLanguage();
  const { userLocation, localityRisk } = useDisaster();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: language === 'te'
        ? "నమస్కారం. నేను సురక్ష AI అత్యవసర సహాయకుడిని. మీకు ఎలాంటి సహాయం కావాలి? (మీరు తెలుగులో మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు)."
        : language === 'hi'
        ? "नमस्ते। मैं सुरक्षा AI आपातकालीन सहायक हूँ। आपको क्या सहायता चाहिए? (आप बोल सकते हैं या लिख सकते हैं)।"
        : "Hello, I am your SURAKSHA AI Emergency Assistant. Tell or speak what is happening around you. I provide instant safety guidance and emergency escalation.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons: [
        { label: "Water Level Rising", action: () => handleSend("Water level is rising rapidly in our street, what should I do?"), variant: "danger" },
        { label: "Find Safe Shelter", action: onOpenShelters, variant: "primary" },
        { label: "Emergency Dial 112", action: () => window.open('tel:112'), variant: "secondary" }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API for voice input if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
      recognition.lang = langInfo.speechLocale;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
    utterance.lang = langInfo.speechLocale;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Multilingual AI Emergency Triage Intelligence
    setTimeout(() => {
      generateAIResponse(textToSend);
    }, 600);
  };

  const generateAIResponse = (query: string) => {
    const lower = query.toLowerCase();

    // Telugu prompt example from prompt: "Ma area lo water perigipothundi, em cheyyali?"
    const isTeluguFlood = lower.includes('water') || lower.includes('neellu') || lower.includes('perigi') || query.includes('నీళ్లు') || query.includes('పెరిగి');
    const isUrgent = lower.includes('trapped') || lower.includes('drowning') || lower.includes('sos') || lower.includes('chest') || lower.includes('help') || lower.includes('water rising') || isTeluguFlood;

    let responseText = "";
    let actionBtns: Message['actionButtons'] = [];

    if (isTeluguFlood || (language === 'te' && lower.includes('water'))) {
      responseText = "గమనిక: మీ ప్రాంతంలో వరద నీరు వేగంగా పెరుగుతోంది! 1. వెంటనే గ్రౌండ్ ఫ్లోర్ నుంచి మొదటి అంతస్తు లేదా ఎత్తైన భవనానికి వెళ్లండి. 2. విద్యుత్ మెయిన్ స్విచ్ వెంటనే ఆఫ్ చేయండి. 3. సమీప సైక్లోన్ షెల్టర్ (ప్రభుత్వ డిగ్రీ కళాశాల - 1.8 కి.మీ) చేరుకోండి. పరిస్థితి ప్రమాదకరంగా ఉంటే వెంటనే క్రింది SOS బటన్ నొక్కండి.";
      actionBtns = [
        { label: "అత్యవసర SOS పంపండి", action: onTriggerSOS, variant: "danger" },
        { label: "సమీప ఆశ్రయం దారి", action: onOpenShelters, variant: "primary" },
        { label: "112 కి కాల్ చేయండి", action: () => window.open('tel:112'), variant: "secondary" }
      ];
    } else if (lower.includes('water') || lower.includes('flood') || lower.includes('inundat')) {
      responseText = "URGENT FLOOD INSTRUCTION: Water levels in your sector (Surya Rao Peta) are RED critical. 1. Move upstairs or to high ground immediately. 2. Switch off household electricity mains. 3. Do NOT walk through flowing water deeper than 6 inches. 4. Evacuate to Govt Degree College Multipurpose Cyclone Shelter (1.8 km away).";
      actionBtns = [
        { label: "ACTIVATE EMERGENCY SOS", action: onTriggerSOS, variant: "danger" },
        { label: "Navigate to Safe Shelter (1.8 km)", action: onOpenShelters, variant: "primary" },
        { label: "Call NDRF / 112", action: () => window.open('tel:112'), variant: "secondary" }
      ];
    } else if (lower.includes('cyclone') || lower.includes('wind') || lower.includes('storm')) {
      responseText = "CYCLONE SAFETY: 1. Stay indoors away from glass windows and loose roofing sheets. 2. Keep battery radios and torches ready. 3. Unplug electrical appliances. 4. If residing in a kutcha house, relocate to the nearest concrete cyclone shelter immediately.";
      actionBtns = [
        { label: "Find Cyclone Shelters", action: onOpenShelters, variant: "primary" },
        { label: "Dial Disaster Helpline 1070", action: () => window.open('tel:1070'), variant: "secondary" }
      ];
    } else if (lower.includes('earthquake') || lower.includes('shake')) {
      responseText = "EARTHQUAKE PROTOCOL: DROP, COVER, and HOLD ON! 1. Take cover under a sturdy desk or table. 2. Protect head and neck. 3. Stay away from windows and heavy furniture. 4. Once tremors cease, evacuate via stairs—never use elevators.";
    } else {
      responseText = `I have received your situation report for ${userLocation.locality}. Current regional risk is ${localityRisk.risk_level} (${localityRisk.risk_score}/100). Please follow official NDMA guidance. If you require immediate evacuation or have children/elderly trapped, trigger the emergency SOS.`;
      actionBtns = [
        { label: "Trigger SOS Alert", action: onTriggerSOS, variant: "danger" },
        { label: "Locate Safe Places", action: onOpenShelters, variant: "primary" }
      ];
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUrgent: isUrgent,
      actionButtons: actionBtns
    };

    setMessages(prev => [...prev, aiMsg]);
    speakText(responseText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[620px] transition-colors">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">SURAKSHA AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20">
                  Multilingual Voice
                </span>
              </div>
              <p className="text-xs text-blue-100">
                10 Indian Languages • Life-Safety Triage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={speechEnabled ? "Mute AI Voice Responses" : "Enable AI Voice Responses"}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Location & Risk Pill Header */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>GPS: {userLocation.locality}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-red-600 dark:text-red-400">
              Risk: {localityRisk.risk_level} ({localityRisk.risk_score}/100)
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : m.isUrgent
                    ? 'bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 rounded-bl-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1.5 opacity-75">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Suraksha AI Advisory</span>
                  </div>
                )}
                <p>{m.text}</p>
                <div className="text-[10px] opacity-60 text-right mt-1">{m.timestamp}</div>
              </div>

              {/* Action Escalation Buttons */}
              {m.actionButtons && m.actionButtons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        btn.variant === 'danger'
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20'
                          : btn.variant === 'primary'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Button */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          
          {/* Voice input button */}
          <button
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-600 text-white border-red-600 animate-pulse ring-4 ring-red-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title={isListening ? "Listening... Speak now" : "Click to Speak (Voice Input)"}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'te'
                ? "మీ సమస్యను ఇక్కడ టైప్ చేయండి లేదా మాట్లాడండి..."
                : language === 'hi'
                ? "यहाँ अपनी आपातकालीन स्थिति लिखें या बोलें..."
                : "Type or speak your emergency situation..."
            }
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
