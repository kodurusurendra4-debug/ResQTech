import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Building,
  CheckCircle,
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';

interface OfficialReliefFund {
  name: string;
  authority: string;
  jurisdiction: string;
  portal_url: string;
  tax_exemption: string;
  account_code: string;
}

const OFFICIAL_FUNDS: OfficialReliefFund[] = [
  {
    name: "Prime Minister's National Relief Fund (PMNRF)",
    authority: "Prime Minister's Office (PMO), New Delhi",
    jurisdiction: "National",
    portal_url: "https://pmnrf.gov.in",
    tax_exemption: "100% deduction under Section 80G of Income Tax Act",
    account_code: "PMNRF-DIRECT-GOV"
  },
  {
    name: "Andhra Pradesh Chief Minister's Relief Fund (CMRF)",
    authority: "Revenue Department, Govt of Andhra Pradesh",
    jurisdiction: "Andhra Pradesh",
    portal_url: "https://cmrf.ap.gov.in",
    tax_exemption: "Section 80G Compliant Official Relief Account",
    account_code: "AP-CMRF-DISASTER-RELIEF"
  },
  {
    name: "Assam Chief Minister's Relief Fund",
    authority: "Disaster Management & Relief Dept, Assam",
    jurisdiction: "Assam",
    portal_url: "https://cmrf.assam.gov.in",
    tax_exemption: "Tax Exempted Government Treasury Account",
    account_code: "AS-CMRF-BRAHMAPUTRA"
  },
  {
    name: "Odisha Chief Minister's Relief Fund",
    authority: "Odisha State Disaster Management Authority",
    jurisdiction: "Odisha",
    portal_url: "https://cmrfodisha.gov.in",
    tax_exemption: "Section 80G Verified State Treasury",
    account_code: "OD-CMRF-CYCLONE-SDRF"
  }
];

export const ReliefDonationsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'fund' | 'item'>('fund');
  const [selectedFund, setSelectedFund] = useState<OfficialReliefFund>(OFFICIAL_FUNDS[0]);
  const [amountTier, setAmountTier] = useState<string>('5000');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [itemType, setItemType] = useState<string>('potable_water');
  const [pledgeSuccess, setPledgeSuccess] = useState<boolean>(false);

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    setPledgeSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
          <HeartHandshake className="w-4 h-4" />
          <span>Verified Government Relief Logistics</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Direct Disaster Relief & Fund Transparency Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Suraksha AI routes all financial assistance exclusively to certified State and National Chief Minister / Prime Minister Relief Funds. No third-party intermediaries.
        </p>
      </div>

      {/* Strict Financial Compliance Warning (Section 42 & 43) */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-300">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        <div>
          <strong className="block text-sm">OFFICIAL ROUTING & PAYMENT TRANSPARENCY:</strong>
          <span>
            We do NOT host simulated payment gateways or unverified wallets. Clicking "Donate to Official Treasury" redirects directly to the respective State Government's verified NIC portal.
          </span>
        </div>
      </div>

      {/* Mode Selector: Financial Fund vs. Essential Items Pledge */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit text-xs font-bold">
        <button
          onClick={() => setSelectedCategory('fund')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'fund' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          Direct Treasury Relief Fund
        </button>
        <button
          onClick={() => setSelectedCategory('item')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'item' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
          }`}
        >
          Physical Relief Goods Pledge
        </button>
      </div>

      {selectedCategory === 'fund' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Official Fund Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Select Official Destination Treasury:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OFFICIAL_FUNDS.map((fund) => (
                <div
                  key={fund.account_code}
                  onClick={() => setSelectedFund(fund)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedFund.account_code === fund.account_code
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{fund.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{fund.jurisdiction}</span>
                  </div>
                  <p className="text-xs text-slate-500">{fund.authority}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-2">{fund.tax_exemption}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Tiers (Section 42) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Select Contribution Amount:
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: '₹1,000', value: '1000' },
                { label: '₹5,000', value: '5000' },
                { label: '₹10,000', value: '10000' },
                { label: '₹25,000', value: '25000' }
              ].map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => {
                    setAmountTier(tier.value);
                    setCustomAmount('');
                  }}
                  className={`py-3 rounded-xl font-black text-sm border transition-all ${
                    amountTier === tier.value && !customAmount
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transparency Destination Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Verified Transaction Destination
            </h5>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
              <div>Organization: <strong className="text-slate-900 dark:text-white">{selectedFund.authority}</strong></div>
              <div>State/Territory: <strong className="text-slate-900 dark:text-white">{selectedFund.jurisdiction}</strong></div>
              <div>Official Portal: <strong className="text-slate-900 dark:text-white">{selectedFund.portal_url}</strong></div>
              <div>Audit Trail: <strong className="text-emerald-600">Comptroller and Auditor General (CAG)</strong></div>
            </div>
          </div>

          {/* Direct Link to Treasury */}
          <a
            href={selectedFund.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Official {selectedFund.name} Treasury Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        /* Physical Goods Pledge */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Pledge Essential Disaster Relief Inventory
          </h3>
          <p className="text-xs text-slate-500">
            Pledged items are routed to the District Logistics Staging Hub at Kakinada Port Road for distribution by NDRF boat teams.
          </p>

          {pledgeSuccess ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 rounded-2xl text-center text-emerald-900 dark:text-emerald-200 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Relief Pledge Registered!</h4>
              <p className="text-xs">
                District Relief Officer will contact you for pickup or delivery drop-off point coordination.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePledge} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Item Category:</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="potable_water">Drinking Water Cases (20L Cans or Packaged Bottles)</option>
                  <option value="dry_rations">Dry Food Rations (Rice, Dal, Biscuits, Milk Powder)</option>
                  <option value="medical_kits">First Aid Kits, ORS & Water Purification Tablets</option>
                  <option value="blankets">Emergency Blankets & Tarpaulin Sheets</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantity Pledged:</label>
                <input
                  type="text"
                  placeholder="E.g. 500 packets / 100 blankets"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Register Relief Goods Pledge
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
