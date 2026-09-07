import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  PhoneCall,
  ShieldAlert,
  Send,
  Waves,
  Wind,
  Activity,
  Flame,
  Mountain,
  Sun,
  Factory,
  Building2,
  CloudLightning,
  ChevronRight
} from 'lucide-react';
import { DisasterType } from '../types';
import { useDisaster } from '../context/DisasterContext';

interface DisasterInfoPageProps {
  initialType?: DisasterType;
  onReportDisaster: (type: DisasterType) => void;
}

interface DisasterGuide {
  type: DisasterType;
  title: string;
  warningSigns: string[];
  whatToDo: string[];
  whatNotToDo: string[];
  beforeDisaster: string[];
  duringDisaster: string[];
  afterDisaster: string[];
  emergencyNumbers: Array<{ name: string; number: string }>;
}

export const DISASTER_GUIDES: Record<DisasterType, DisasterGuide> = {
  Flood: {
    type: 'Flood',
    title: 'Riverine & Urban Flash Flood',
    warningSigns: [
      'Rapidly rising water levels in nearby drainage canals, rivers, or streets.',
      'Muddy, turbid water with unusual debris entering residential compounds.',
      'Sump overflow and bubbling sounds in household plumbing or drains.',
      'Continuous heavy downpour exceeding 100mm within a 12-hour window.'
    ],
    whatToDo: [
      'Move elderly family members, children, and essential medications to the upper floor or high ground.',
      'Switch off the main electrical breaker and turn off cooking gas cylinders.',
      'Drink only boiled or chlorinated water; keep ORS hydration packets ready.',
      'Evacuate immediately if local SDMA/police issue a Level-1 red notice.'
    ],
    whatNotToDo: [
      'DO NOT walk or swim in moving water deeper than ankle height (6 inches can knock down an adult).',
      'DO NOT drive through flooded roads (12 inches of water can float a car).',
      'DO NOT touch submerged electrical switches, fallen power lines, or transformers.',
      'DO NOT consume uncovered food items that had contact with floodwaters.'
    ],
    beforeDisaster: [
      'Store 4.5 liters of drinking water per person per day for at least 3 days.',
      'Keep waterproof pouches for ration cards, Aadhaar cards, and property documents.',
      'Store emergency power banks, LED torches, and whistle for acoustic signaling.'
    ],
    duringDisaster: [
      'Stay tuned to battery-powered radio or Suraksha AI live mobile alerts.',
      'If trapped in a building, climb to the roof; avoid attic spaces with no roof exit.',
      'Signal rescue boats using high-contrast colored cloth or torch flashes.'
    ],
    afterDisaster: [
      'Wait for official clearance before returning to submerged ground floors.',
      'Beware of displaced snakes, scorpions, and rodents sheltering in dry crevices.',
      'Disinfect household water tanks with bleaching powder before consumption.'
    ],
    emergencyNumbers: [
      { name: 'National Emergency', number: '112' },
      { name: 'NDRF Control Room', number: '011-24363260' },
      { name: 'State Disaster Control', number: '1070' },
      { name: 'Ambulance', number: '108' }
    ]
  },
  Cyclone: {
    type: 'Cyclone',
    title: 'Tropical Cyclone & Coastal Storm Surge',
    warningSigns: [
      'Sudden drop in atmospheric barometric pressure and calm before gale winds.',
      'Abnormal sea swell and tidal waves pushing into estuaries.',
      'Red cyclone alert signals hoisted at local maritime ports by IMD.'
    ],
    whatToDo: [
      'Board up or secure glass windows and doors with wooden battens.',
      'Relocate from thatch (kutcha) roofs to reinforced concrete cyclone shelters.',
      'Anchor loose outdoor objects like tin sheets, water tanks, and signboards.'
    ],
    whatNotToDo: [
      'DO NOT venture into the sea or stay on beach roads after warning signals.',
      'DO NOT step outside during the "eye" of the storm (temporary calm before reverse winds).',
      'DO NOT shelter under large trees or dilapidated brick walls.'
    ],
    beforeDisaster: [
      'Trim overhanging tree branches close to power lines and rooftops.',
      'Stock non-perishable food, dry snacks, and portable battery lights.'
    ],
    duringDisaster: [
      'Remain in the interior-most room of your house or designated cyclone shelter.',
      'Keep away from exterior windows to avoid flying glass debris.'
    ],
    afterDisaster: [
      'Inspect roofs and structures for structural fracture before entry.',
      'Do not touch tangled overhead wires hanging over flooded roads.'
    ],
    emergencyNumbers: [
      { name: 'Coast Guard Rescue', number: '1554' },
      { name: 'Cyclone Helpline', number: '1070' },
      { name: 'Emergency Police/Fire', number: '112' }
    ]
  },
  Earthquake: {
    type: 'Earthquake',
    title: 'Seismic Tremors & Structural Rupture',
    warningSigns: [
      'Sudden ground shaking, rumbling sound, swaying chandeliers.',
      'Unusual agitation in pets, birds, and street animals minutes prior.'
    ],
    whatToDo: [
      'DROP, COVER, and HOLD ON under a heavy desk or table.',
      'Protect head and torso with pillows or arms away from windows.',
      'If outdoors, move to an open playground away from buildings and cables.'
    ],
    whatNotToDo: [
      'DO NOT use elevators or escalators during or immediately after tremors.',
      'DO NOT panic and rush through crowded exit doorways.',
      'DO NOT light matches or lighters until gas pipelines are checked for leaks.'
    ],
    beforeDisaster: [
      'Bolt heavy bookcases, wall-mounted TVs, and cabinets to wall studs.',
      'Identify safe structural corners inside each room.'
    ],
    duringDisaster: [
      'Remain indoors until the shaking stops, then evacuate via stairs.',
      'If in a vehicle, pull over away from flyovers and power pylons.'
    ],
    afterDisaster: [
      'Expect aftershocks. Inspect gas connections and turn off the cylinder valve.',
      'Help trapped neighbors if safe to do so; call 112 for heavy extrication.'
    ],
    emergencyNumbers: [
      { name: 'National Emergency', number: '112' },
      { name: 'Fire & Rescue Extrication', number: '101' },
      { name: 'Ambulance Trauma', number: '108' }
    ]
  },
  Tsunami: {
    type: 'Tsunami',
    title: 'Tsunami & Seismic Ocean Surge',
    warningSigns: [
      'Noticeable seismic tremor felt in a coastal locality.',
      'Sudden, dramatic receding of ocean water exposing seabed and reefs.',
      'A loud roaring sound like an oncoming freight train or jet engine from the ocean.'
    ],
    whatToDo: [
      'Immediately move inland to high ground at least 15–30 meters above sea level.',
      'If trapped, climb to the 3rd floor or roof of a reinforced concrete building.',
      'Follow designated blue Tsunami Evacuation Route markers.'
    ],
    whatNotToDo: [
      'DO NOT go to the shore to watch the receding sea water or exposed fish.',
      'DO NOT return after the first wave; tsunami waves arrive in a series over hours.'
    ],
    beforeDisaster: [
      'Memorize the quickest evacuation route uphill from your coastal settlement.'
    ],
    duringDisaster: [
      'Run immediately inland. Abandon bulky belongings.'
    ],
    afterDisaster: [
      'Stay on high ground until Indian National Centre for Ocean Information Services (INCOIS) cancels warning.'
    ],
    emergencyNumbers: [
      { name: 'Coast Guard', number: '1554' },
      { name: 'INCOIS Ocean Hotline', number: '040-23895011' },
      { name: 'Emergency 112', number: '112' }
    ]
  },
  Landslide: {
    type: 'Landslide',
    title: 'Debris Flow & Slope Failure',
    warningSigns: [
      'Springs or water bursting from hillside slopes where water was never seen.',
      'Cracks opening up in plaster, brick retaining walls, or roadway tarmac.',
      'Faint rumbling sound that increases in volume as mudflow approaches.'
    ],
    whatToDo: [
      'Evacuate immediately away from the path of the slope failure or gully.',
      'If escape is impossible, curl into a tight ball and protect your head.'
    ],
    whatNotToDo: [
      'DO NOT cross swollen hillside streams during intense monsoon cloudbursts.',
      'DO NOT sleep in ground-floor rooms adjoining steep unstable embankments.'
    ],
    beforeDisaster: [
      'Plant deep-rooted native vegetation along sloping terrain to stabilize soil.'
    ],
    duringDisaster: [
      'Move swiftly to the ridge or solid high ground above the landslide line.'
    ],
    afterDisaster: [
      'Stay clear of the slide area; secondary collapses frequently follow.'
    ],
    emergencyNumbers: [
      { name: 'Hill District Control', number: '1077' },
      { name: 'NDRF Control', number: '112' }
    ]
  },
  Drought: {
    type: 'Drought',
    title: 'Prolonged Water Scarcity & Agrarian Stress',
    warningSigns: ['Groundwater drop', 'Crop wilting', 'Reservoir deficit'],
    whatToDo: ['Implement rainwater harvesting', 'Adopt drip irrigation'],
    whatNotToDo: ['Do not waste household greywater', 'Do not over-extract borewells'],
    beforeDisaster: ['Construct percolation pits'],
    duringDisaster: ['Ration water use strictly'],
    afterDisaster: ['Recharge groundwater aquifers'],
    emergencyNumbers: [{ name: 'Kisan Helpline', number: '1800-180-1551' }]
  },
  Heatwave: {
    type: 'Heatwave',
    title: 'Extreme Thermal Exposure',
    warningSigns: ['Ambient temperature > 42°C', 'High humidity wet-bulb index'],
    whatToDo: ['Drink water, buttermilk, ORS regularly', 'Stay indoors 12 PM - 3 PM'],
    whatNotToDo: ['Do not leave children in locked parked cars', 'Avoid alcohol/caffeine'],
    beforeDisaster: ['Insulate roof with reflective white paint'],
    duringDisaster: ['Apply cold compresses to neck and underarms'],
    afterDisaster: ['Seek medical help for heatstroke symptoms'],
    emergencyNumbers: [{ name: 'Ambulance', number: '108' }]
  },
  'Industrial Leakage': {
    type: 'Industrial Leakage',
    title: 'Hazardous Chemical & Gas Release',
    warningSigns: ['Pungent chemical odor', 'Eye stinging and tearing', 'Sudden bird deaths'],
    whatToDo: ['Place wet cloth over nose/mouth', 'Evacuate perpendicular (crosswind) to wind direction'],
    whatNotToDo: ['Do not run in the direction of the gas cloud', 'Do not switch on lights or appliances'],
    beforeDisaster: ['Identify industrial hazard buffer zones near your home'],
    duringDisaster: ['Seal doors and windows with damp towels if trapped'],
    afterDisaster: ['Wash skin thoroughly with copious water'],
    emergencyNumbers: [{ name: 'Chemical Disaster Helpline', number: '112' }]
  },
  Fire: {
    type: 'Fire',
    title: 'Urban Structural & Forest Fire',
    warningSigns: ['Thick smoke', 'Alarms ringing', 'Heat through door surfaces'],
    whatToDo: ['Crawl low under smoke', 'Test door handles with back of hand before opening'],
    whatNotToDo: ['Do not re-enter a burning building for valuables', 'Do not use lifts'],
    beforeDisaster: ['Install smoke detectors and inspect fire extinguishers'],
    duringDisaster: ['STOP, DROP, and ROLL if clothes catch fire'],
    afterDisaster: ['Have structural integrity certified by engineers'],
    emergencyNumbers: [{ name: 'Fire Control', number: '101' }]
  },
  'Building Collapse': {
    type: 'Building Collapse',
    title: 'Structural Failure & Entrapment',
    warningSigns: ['Loud creaking of beams', 'Falling ceiling plaster', 'Jammed door frames'],
    whatToDo: ['Evacuate immediately via designated fire escapes', 'Tap on pipes with metal objects to signal rescuers'],
    whatNotToDo: ['Do not scream continuously (causes dust inhalation; use acoustic tapping)'],
    beforeDisaster: ['Conduct structural audit of buildings older than 30 years'],
    duringDisaster: ['Crouch in the "Triangle of Life" void next to heavy furniture'],
    afterDisaster: ['Stay still to conserve oxygen until rescue teams arrive'],
    emergencyNumbers: [{ name: 'Fire & Rescue', number: '101' }, { name: 'Emergency 112', number: '112' }]
  },
  'Severe Storm': {
    type: 'Severe Storm',
    title: 'Lightning, Hail & Squall',
    warningSigns: ['Dark cumulonimbus anvil clouds', 'Sudden temperature drop', 'Thunder heard within 30 seconds of lightning'],
    whatToDo: ['Apply 30/30 rule: stay indoors for 30 min after last thunder', 'Seek shelter in hard-topped vehicles or buildings'],
    whatNotToDo: ['Do not stand under isolated tall trees or near wire fences'],
    beforeDisaster: ['Install lightning conductors on tall buildings'],
    duringDisaster: ['Unplug delicate electronic equipment'],
    afterDisaster: ['Check for fallen electrical branches'],
    emergencyNumbers: [{ name: 'Emergency 112', number: '112' }]
  },
  Other: {
    type: 'Other',
    title: 'General Emergency & Compound Hazards',
    warningSigns: ['Official emergency sirens sounding', 'SMS broadcast from NDMA'],
    whatToDo: ['Follow district administration instructions immediately'],
    whatNotToDo: ['Do not spread unverified social media rumors'],
    beforeDisaster: ['Prepare a 72-hour family emergency kit'],
    duringDisaster: ['Keep phones charged and lines open for essential calls'],
    afterDisaster: ['Report status on Suraksha AI Safe Check-in'],
    emergencyNumbers: [{ name: 'Emergency 112', number: '112' }]
  }
};

export const DisasterInfoPage: React.FC<DisasterInfoPageProps> = ({
  initialType = 'Flood',
  onReportDisaster
}) => {
  const [selectedType, setSelectedType] = useState<DisasterType>(initialType);
  const guide = DISASTER_GUIDES[selectedType] || DISASTER_GUIDES.Flood;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Disaster Preparedness & Response Guide
        </h2>
        <p className="text-xs text-slate-500 max-w-3xl">
          Comprehensive, verified survival protocols for 12 disaster categories. Reviewed according to National Disaster Management Authority (NDMA) standards.
        </p>

        {/* Disaster Type Pills Scroll */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-1">
          {Object.keys(DISASTER_GUIDES).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as DisasterType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Guide Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Title & Emergency Reporting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              OFFICIAL SOP PROTOCOL
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {guide.title}
            </h3>
          </div>

          <button
            onClick={() => onReportDisaster(selectedType)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report "{selectedType}" is Happening Here</span>
          </button>
        </div>

        {/* Warning Signs */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Recognizable Warning Signs</span>
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-900 dark:text-amber-200">
            {guide.warningSigns.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What To Do vs What NOT To Do (Side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What To Do */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>What To Do (Immediate Actions)</span>
            </h4>
            <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
              {guide.whatToDo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What NOT To Do */}
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 dark:text-rose-300 flex items-center gap-1.5 mb-3">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>What NOT To Do (Dangerous Pitfalls)</span>
            </h4>
            <ul className="space-y-2 text-xs text-rose-900 dark:text-rose-200">
              {guide.whatNotToDo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase Checklist: Before, During, After */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-2">
              Phase 1: Before Disaster
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {guide.beforeDisaster.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-2">
              Phase 2: During Disaster
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {guide.duringDisaster.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
              Phase 3: After Disaster
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {guide.afterDisaster.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* One-Touch Verified Emergency Numbers */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
            Sector-Specific Emergency Helplines (Click to Call)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {guide.emergencyNumbers.map((dial, idx) => (
              <a
                key={idx}
                href={`tel:${dial.number.replace(/[^0-9]/g, '')}`}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-500">{dial.name}</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{dial.number}</div>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
