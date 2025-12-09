import { useState } from 'react';
import { Search, FileText, Folder, CheckCircle, Shield, GitBranch, RotateCcw } from 'lucide-react';
import { FactAnalysisPanel } from './FactAnalysisPanel';
import { ArgumentLogicsPanel } from './ArgumentLogicsPanel';
import { CompliancesPanel } from './CompliancesPanel';
import { DiscoverPanel } from './DiscoverPanel';

interface AnalysisSidebarProps {
  width: number;
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export default function AnalysisSidebar({ width, onResizeStart, isResizing }: AnalysisSidebarProps) {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('analysis');
  const [activeFeatureTab, setActiveFeatureTab] = useState('facts-analysis');
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzed(true);
  };

  const handleClear = () => {
    setIsAnalyzed(false);
  };

  return (
    <aside className="right-sidebar-analysis relative flex-shrink-0 bg-white flex flex-col overflow-hidden border-l border-[#c1c1c1]" style={{ width: `${width}px` }}>
      {/* Resize Handle */}
      <div
        className={`resize-handle absolute left-0 top-0 bottom-0 w-[5px] hover:w-[8px] cursor-col-resize z-20 transition-all ${
          isResizing ? 'bg-blue-500 w-[8px]' : 'hover:bg-gray-300'
        }`}
        onMouseDown={onResizeStart}
        aria-label="Resize sidebar"
      />
      
      {/* Analysis Tabs - Fixed at top */}
      <div className="analysis-tabs bg-gray-100 p-[12px] flex items-center justify-between flex-shrink-0 gap-2">
        <button
          onClick={() => setActiveAnalysisTab('analysis')}
          className={`tab-button flex items-center gap-[9px] h-[40px] px-[11px] py-[8px] rounded-[10px] transition-colors ${
            activeAnalysisTab === 'analysis' ? 'bg-white' : 'bg-[#f6f6f6]'
          }`}
        >
          <FileText className="size-[22px]" stroke="#3F3F46" strokeWidth="1.5" />
          <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[14px] lg:text-[16px]">Analysis</span>
        </button>

        <button
          onClick={() => setActiveAnalysisTab('discover')}
          className={`tab-button flex items-center gap-[7px] h-[40px] px-[10px] py-[8px] rounded-[10px] transition-colors ${
            activeAnalysisTab === 'discover' ? 'bg-white' : 'bg-[#f6f6f6]'
          }`}
        >
          <Search className="size-[20px]" stroke="#3F3F46" strokeWidth="2" />
          <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[14px] lg:text-[16px]">Discover</span>
        </button>

        <button
          onClick={() => setActiveAnalysisTab('documents')}
          className={`tab-button flex items-center gap-[7px] h-[40px] px-[8px] py-[8px] rounded-[10px] transition-colors ${
            activeAnalysisTab === 'documents' ? 'bg-white' : 'bg-[#f6f6f6]'
          }`}
        >
          <Folder className="size-[20px]" stroke="#3F3F46" strokeWidth="1.5" />
          <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[14px] lg:text-[16px]">Documents</span>
        </button>
      </div>

      {/* Analysis Content - Scrollable */}
      <div className="analysis-content-wrapper flex-1 overflow-y-auto">
        {activeAnalysisTab === 'analysis' && (
          <div className="p-[16px]">
            {!isAnalyzed ? (
              <>
                {/* Feature Tabs */}
                <div className="feature-tabs flex gap-[12px] mb-[18px]">
                  <button
                    onClick={() => setActiveFeatureTab('facts-analysis')}
                    className={`feature-tab flex flex-col gap-[10px] h-[78px] items-center justify-center px-[16px] py-[12px] rounded-[7px] flex-1 transition-colors ${
                      activeFeatureTab === 'facts-analysis' ? 'bg-[#1980e6]' : 'bg-[#efefef]'
                    }`}
                  >
                    <CheckCircle className="size-[24px]" stroke={activeFeatureTab === 'facts-analysis' ? 'white' : '#09090B'} strokeWidth="2" />
                    <span className={`font-['Arial:Regular',sans-serif] text-[12px] text-center ${
                      activeFeatureTab === 'facts-analysis' ? 'text-white' : 'text-[#3d3d3d]'
                    }`}>Facts Analysis</span>
                  </button>

                  <button
                    onClick={() => setActiveFeatureTab('compliances')}
                    className={`feature-tab flex flex-col gap-[10px] h-[78px] items-center justify-center px-[16px] py-[12px] rounded-[7px] flex-1 transition-colors ${
                      activeFeatureTab === 'compliances' ? 'bg-[#1980e6]' : 'bg-[#efefef]'
                    }`}
                  >
                    <Shield className="size-[24px]" stroke={activeFeatureTab === 'compliances' ? 'white' : '#09090B'} strokeWidth="2" />
                    <span className={`font-['Arial:Regular',sans-serif] text-[12px] text-center ${
                      activeFeatureTab === 'compliances' ? 'text-white' : 'text-[#3d3d3d]'
                    }`}>Compliances</span>
                  </button>

                  <button
                    onClick={() => setActiveFeatureTab('argument-logics')}
                    className={`feature-tab flex flex-col gap-[10px] h-[78px] items-center justify-center px-[12px] py-[12px] rounded-[7px] flex-1 transition-colors ${
                      activeFeatureTab === 'argument-logics' ? 'bg-[#1980e6]' : 'bg-[#efefef]'
                    }`}
                  >
                    <GitBranch className="size-[24px]" stroke={activeFeatureTab === 'argument-logics' ? 'white' : '#09090B'} strokeWidth="2" />
                    <span className={`font-['Arial:Regular',sans-serif] text-[12px] text-center ${
                      activeFeatureTab === 'argument-logics' ? 'text-white' : 'text-[#3d3d3d]'
                    }`}>Argument &amp; Logics</span>
                  </button>
                </div>

                {/* Current Document Section */}
                <div className="current-document-section bg-[rgba(244,244,244,0.54)] rounded-[7px] p-[14px] mb-[18px] flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-['Arial:Regular',sans-serif] text-[16px] text-black">Current Document</p>
                    <p className="font-['Roboto:Light',sans-serif] text-[13px] text-[#707070] mt-[4px] leading-tight">
                      The entire document content will be analyzed
                    </p>
                  </div>
                  <div className="text-right ml-[10px]">
                    <p className="font-['Arvo:Regular',sans-serif] text-[30px] text-zinc-950 leading-none">345</p>
                    <p className="font-['Arial:Regular',sans-serif] text-[16px] text-[#545454]">words</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#E3E3E3] mb-[18px]" />

                {/* Action Buttons */}
                <div className="action-buttons flex gap-[12px]">
                  <button 
                    onClick={handleClear}
                    className="clear-button bg-white border border-[#bfbfbf] rounded-[10px] h-[38px] flex-1 flex items-center justify-center gap-[5px] hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="size-[18px]" stroke="#868686" strokeWidth="2" />
                    <span className="font-['Arial:Regular',sans-serif] text-[13px] text-[#868686]">Clear</span>
                  </button>

                  <button 
                    onClick={handleAnalyze}
                    className="analyze-button bg-black rounded-[10px] h-[38px] flex-1 flex items-center justify-center hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-['Arial:Regular',sans-serif] text-[13px] text-white">Analyze Document</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {activeFeatureTab === 'facts-analysis' && (
                  <FactAnalysisPanel activeTab={activeFeatureTab} onTabChange={setActiveFeatureTab} onClear={handleClear} />
                )}
                {activeFeatureTab === 'compliances' && (
                  <CompliancesPanel activeTab={activeFeatureTab} onTabChange={setActiveFeatureTab} onClear={handleClear} />
                )}
                {activeFeatureTab === 'argument-logics' && (
                  <ArgumentLogicsPanel activeTab={activeFeatureTab} onTabChange={setActiveFeatureTab} onClear={handleClear} />
                )}
              </>
            )}
          </div>
        )}

        {activeAnalysisTab === 'discover' && (
          <DiscoverPanel />
        )}

        {activeAnalysisTab === 'documents' && (
          <div className="p-[16px]">
            <p className="text-[14px] text-[#707070]">Documents content coming soon...</p>
          </div>
        )}
      </div>
    </aside>
  );
}
