import { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle, Shield, GitBranch, RotateCcw } from 'lucide-react';

interface CompliancesPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClear: () => void;
}

interface ComplianceIssue {
  id: string;
  type: 'dangerous' | 'legal';
  title: string;
  description: string;
  details: string;
}

const mockIssues: ComplianceIssue[] = [
  {
    id: '1',
    type: 'dangerous',
    title: 'Dangerous misinformation',
    description: 'Here wrong statement will be shown under Article 21 and expanded the',
    details: 'Here wrong statement will be shown under Article 21 and expanded the idea of "procedure established by law."'
  },
  {
    id: '2',
    type: 'legal',
    title: 'Legal Violation',
    description: 'She filed a petition under Article 32, challenging the order and arguing that it violated her fundamental rights under Articles 14, 19, and 21.',
    details: 'She filed a petition under Article 32, challenging the order and arguing that it violated her fundamental rights under Articles 14, 19, and 21.'
  }
];

export function CompliancesPanel({ activeTab, onTabChange, onClear }: CompliancesPanelProps) {
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);

  const toggleIssue = (issueId: string) => {
    setExpandedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  return (
    <div className="compliances-panel">
      {/* Feature Tabs */}
      <div className="feature-tabs flex gap-[12px] mb-[18px]">
        <button
          onClick={() => onTabChange('facts-analysis')}
          className={`feature-tab flex flex-col gap-[10px] h-[78px] items-center justify-center px-[16px] py-[12px] rounded-[7px] flex-1 transition-colors ${
            activeTab === 'facts-analysis' ? 'bg-[#1980e6]' : 'bg-[#efefef]'
          }`}
        >
          <CheckCircle className={`size-[24px]`} stroke={activeTab === 'facts-analysis' ? 'white' : '#09090B'} strokeWidth="2" />
          <span className={`font-['Arial:Regular',sans-serif] text-[12px] text-center ${
            activeTab === 'facts-analysis' ? 'text-white' : 'text-[#3d3d3d]'
          }`}>Facts Analysis</span>
        </button>

        <button
          onClick={() => onTabChange('compliances')}
          className={`feature-tab flex flex-col gap-[10px] h-[78px] items-center justify-center px-[16px] py-[12px] rounded-[7px] flex-1 transition-colors ${
            activeTab === 'compliances' ? 'bg-[#1980e6]' : 'bg-[#efefef]'
          }`}
        >
          <Shield className={`size-[24px]`} stroke={activeTab === 'compliances' ? 'white' : '#09090B'} strokeWidth="2" />
          <span className={`font-['Arial:Regular',sans-serif] text-[12px] text-center ${
            activeTab === 'compliances' ? 'text-white' : 'text-[#3d3d3d]'
          }`}>Compliances</span>
        </button>

        <button
          onClick={() => onTabChange('argument-logics')}
          className={`feature-tab flex flex-col gap-[10px] h-[78px] items-center justify-center px-[12px] py-[12px] rounded-[7px] flex-1 transition-colors ${
            activeTab === 'argument-logics' ? 'bg-[#1980e6]' : 'bg-[#efefef]'
          }`}
        >
          <GitBranch className={`size-[24px]`} stroke={activeTab === 'argument-logics' ? 'white' : '#09090B'} strokeWidth="2" />
          <span className={`font-['Arial:Regular',sans-serif] text-[12px] text-center ${
            activeTab === 'argument-logics' ? 'text-white' : 'text-[#3d3d3d]'
          }`}>Argument & Logics</span>
        </button>
      </div>

      {/* Title */}
      <h3 className="font-['Arial:Regular',sans-serif] text-[16px] text-black mb-[12px]">
        Compliance Score
      </h3>

      {/* Score Card */}
      <div className="score-card bg-[rgba(244,244,244,0.54)] rounded-[7px] p-[14px] mb-[16px]">
        <div className="flex items-start justify-between mb-[14px]">
          <div className="flex-1">
            <div className="flex items-baseline gap-[10px]">
              <span className="font-['Arvo:Regular',sans-serif] text-[30px] text-green-600">85%</span>
              <p className="font-['Roboto:Light',sans-serif] text-[12px] text-black max-w-[140px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Compliances in this document not followed
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row flex gap-[8px]">
          <div className="stat-card bg-[#f4f4f4] rounded-[7px] p-[14px] flex-1">
            <p className="font-['Inter:Light',sans-serif] text-[#545454] text-[12px] mb-[9px]">Flagged Claims</p>
            <p className="font-['Arvo:Regular',sans-serif] text-zinc-950 text-[22px]">2</p>
          </div>
          <div className="stat-card bg-[#f4f4f4] rounded-[7px] p-[14px] flex-1">
            <p className="font-['Inter:Light',sans-serif] text-[#545454] text-[12px] mb-[9px]">Total words</p>
            <p className="font-['Arvo:Regular',sans-serif] text-zinc-950 text-[22px]">345</p>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="issues-list space-y-[12px] mb-[20px]">
        {mockIssues.map((issue) => {
          const isExpanded = expandedIssues.includes(issue.id);
          
          return (
            <div 
              key={issue.id} 
              className="issue-item bg-white border border-[#e3e3e3] rounded-[7px] overflow-hidden"
            >
              <button
                onClick={() => toggleIssue(issue.id)}
                className="issue-header w-full p-[14px] flex items-start gap-[10px] hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`flex-shrink-0 size-[16px] rounded-full flex items-center justify-center mt-[2px] ${
                  issue.type === 'dangerous' ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  <div className={`size-[8px] rounded-full ${
                    issue.type === 'dangerous' ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[8px] mb-[6px]">
                    <span className={`font-['Arial:Regular',sans-serif] text-[14px] ${
                      issue.type === 'dangerous' ? 'text-red-600' : 'text-orange-600'
                    }`}>{issue.title}</span>
                  </div>
                  <p className="font-['Roboto:Light',sans-serif] text-[13px] text-[#3d3d3d] leading-[1.4]">
                    {issue.description}
                  </p>
                </div>

                <div className="flex-shrink-0 mt-[2px]">
                  {isExpanded ? (
                    <ChevronDown className="size-[20px] text-[#3d3d3d]" />
                  ) : (
                    <ChevronRight className="size-[20px] text-[#3d3d3d]" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="issue-details border-t border-[#e3e3e3] p-[14px] bg-gray-50">
                  <div>
                    <p className="font-['Arial:Regular',sans-serif] text-[12px] text-[#545454] mb-[6px]">
                      Issue Details:
                    </p>
                    <p className="font-['Roboto:Light',sans-serif] text-[13px] text-[#3d3d3d] leading-[1.4]">
                      {issue.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Button */}
      <div className="sticky bottom-0 bg-white pt-[12px] pb-[4px] border-t border-[#e3e3e3]">
        <button 
          onClick={onClear}
          className="w-full bg-white border border-[#3b3b3b] rounded-[10px] h-[38px] flex items-center justify-center gap-[10px] hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="size-[18px]" stroke="#3B3B3B" strokeWidth="1.5" />
          <span className="font-['Arial:Regular',sans-serif] text-[13px] text-[#3b3b3b]">Return to Refresh Score</span>
        </button>
      </div>
    </div>
  );
}
