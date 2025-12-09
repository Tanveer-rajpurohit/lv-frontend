import { useState } from 'react';
import { Search, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

interface CaseResult {
  id: string;
  title: string;
  description: string;
  status: 'adopted' | 'added';
  expandedContent?: {
    sections: { title: string; content: string }[];
  };
}

const mockCaseResults: CaseResult[] = [
  {
    id: '1',
    title: 'Pankajam Parthasarathy And Five Others vs Kasturi Guna Singh on 27 September, 2000',
    description: 'In State of Maharashtra vs. Arun Kumar Sharma (2023) 4 SCC 512, the Supreme Court of India, comprising Justice D.Y. Chandrachud and Justice B.V. Nagarathna, delivered its judgment on 15th February 2023. The accused was charged under Section 302 IPC for allegedly murdering his business partner, \n\nRajesh Verma, following a dispute over profit sharing. The prosecution claimed the act was intentional and premeditated, while the defense argued it occurred during a sudden',
    status: 'adopted',
    expandedContent: {
      sections: [
        {
          title: 'Introduction',
          content: "In today's digital economy, data is the new oil—but if misused, it can become toxic. With increasing instances of data breaches, surveillance concerns, and privacy violations, the Indian government has taken a landmark step by enacting the Digital Personal Data Protection Act, 2023 (DPDPA).\n\nThis law aims to strike a balance between the individual's right to privacy and the need for organizations to use data for legitimate purposes.\n\nWhether you're a tech startup, an HR head, or a digital service provider, this law applies to you—and the time to act is now."
        },
        {
          title: 'What Is the Digital Personal Data Protection Act, 2023?',
          content: "The DPDPA is India's first comprehensive law dedicated solely to protecting individuals' personal data. It regulates how organizations collect..."
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Pankajam Parthasarathy And Five Others vs Kasturi Guna Singh on 27 September, 2000',
    description: 'In State of Maharashtra vs. Arun Kumar Sharma (2023) 4 SCC 512, the Supreme Court of India, comprising Justice D.Y. Chandrachud and Justice B.V. Nagarathna, delivered its judgment on 15th February 2023. The accused was charged under Section 302 IPC for allegedly murdering his business partner, \n\nRajesh Verma, following a dispute over profit sharing. The prosecution claimed the act was intentional and premeditated, while the defense argued it occurred during a sudden altercation without intent to kill. After examining the evidence,',
    status: 'added'
  }
];

export function DiscoverPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCases, setExpandedCases] = useState<string[]>([]);

  const toggleCase = (caseId: string) => {
    setExpandedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  return (
    <div className="discover-panel p-[16px]">
      {/* Search Bar */}
      <div className="search-bar mb-[24px]">
        <div className="relative">
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 size-[20px] text-[#818181]" />
          <input
            type="text"
            placeholder="Search any case or judgement"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[48px] pl-[44px] pr-[14px] bg-white border border-[#e3e3e3] rounded-[7px] font-['Arial:Regular',sans-serif] text-[16px] text-[#3d3d3d] placeholder:text-[#818181] focus:outline-none focus:border-[#1980e6] transition-colors"
          />
        </div>
      </div>

      {/* Case Results List */}
      <div className="case-results-list space-y-[20px]">
        {mockCaseResults.map((caseResult) => {
          const isExpanded = expandedCases.includes(caseResult.id);
          
          return (
            <div 
              key={caseResult.id} 
              className="case-card bg-white border border-[#c5c5c5] rounded-[7px] overflow-hidden"
            >
              {/* Case Header */}
              <div className="case-header p-[16px]">
                <div className="flex items-start justify-between mb-[12px]">
                  <h3 className="font-['Arial:Regular',sans-serif] text-[20px] lg:text-[22px] text-[#3d3d3d] leading-[1.3] flex-1 pr-[12px]">
                    {caseResult.title}
                  </h3>
                  <button
                    className={`flex-shrink-0 px-[19px] py-[8px] rounded-[19px] font-['Arial:Regular',sans-serif] text-[12px] transition-colors ${
                      caseResult.status === 'adopted' 
                        ? 'bg-[#66e583] text-[#2b2b2b]' 
                        : 'bg-[#66e583] text-[#2b2b2b]'
                    }`}
                  >
                    {caseResult.status === 'adopted' ? 'Adopted' : 'Added'}
                  </button>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#e3e3e3] mb-[16px]" />

                {/* Case Description */}
                {!isExpanded && (
                  <div className="case-description mb-[16px]">
                    <p className="font-['Arial:Regular',sans-serif] text-[15px] lg:text-[17px] text-[#3d3d3d] leading-[1.4] whitespace-pre-line">
                      {caseResult.description}
                    </p>
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && caseResult.expandedContent && (
                  <div className="expanded-content mb-[16px] space-y-[16px]">
                    {caseResult.expandedContent.sections.map((section, index) => (
                      <div key={index}>
                        <h4 className="font-['Arial:Bold',sans-serif] text-[16px] text-[#3d3d3d] mb-[8px]">
                          {section.title}
                        </h4>
                        <p className="font-['Arial:Regular',sans-serif] text-[15px] lg:text-[17px] text-[#3d3d3d] leading-[1.4] whitespace-pre-line">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons flex items-center gap-[12px]">
                  <button className="bg-[#e2e1e1] rounded-[53px] h-[31px] px-[16px] flex items-center gap-[8px] hover:bg-[#d5d4d4] transition-colors">
                    <ExternalLink className="size-[14px] text-[#4b4b4b]" />
                    <span className="font-['Arial:Regular',sans-serif] text-[12px] text-[#333333]">
                      Read full Material
                    </span>
                  </button>

                  {caseResult.expandedContent && (
                    <button 
                      onClick={() => toggleCase(caseResult.id)}
                      className="bg-[#e2e1e1] rounded-[53px] h-[31px] px-[16px] flex items-center gap-[8px] hover:bg-[#d5d4d4] transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-[14px] text-[#4b4b4b]" />
                      ) : (
                        <ChevronDown className="size-[14px] text-[#4b4b4b]" />
                      )}
                      <span className="font-['Arial:Regular',sans-serif] text-[12px] text-[#333333]">
                        {isExpanded ? 'Show Less' : 'Read full Material'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {mockCaseResults.length === 0 && (
        <div className="empty-state text-center py-[40px]">
          <p className="font-['Arial:Regular',sans-serif] text-[16px] text-[#818181]">
            No cases found. Try searching for a different case or judgement.
          </p>
        </div>
      )}
    </div>
  );
}
          
