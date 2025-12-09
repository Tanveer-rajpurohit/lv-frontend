import { useRef, useEffect, useState } from 'react';
import { Trash, Download, Settings, FileText, Bold, Italic, Underline, List, ListOrdered, Quote, Link, Image, Code, ArrowLeft, ChevronLeft, Undo, Redo, Copy, Palette } from 'lucide-react';
import { InlineIssueTooltip } from './InlineIssueTooltip';
import Editor from './Editor';

interface WritingSectionProps {
  isHeaderVisible: boolean;
  isToolbarSticky: boolean;
  onScroll: () => void;
}

export default function WritingSection({ isHeaderVisible, isToolbarSticky, onScroll }: WritingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [editorData, setEditorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll);
      return () => scrollContainer.removeEventListener('scroll', onScroll);
    }
  }, [onScroll]);

  // Initialize with default content
  useEffect(() => {
    const defaultData = {
      time: new Date().getTime(),
      blocks: [
        {
          id: "document-title",
          type: "header",
          data: {
            text: "Maneka Gandhi v. Union of India, 1978",
            level: 1,
          },
        },
        {
          id: "introduction",
          type: "paragraph",
          data: {
            text: "This research draft examines the landmark Supreme Court judgment Maneka Gandhi v. Union of India (1978), which transformed the interpretation of fundamental rights under the Indian Constitution. The case primarily concerned the scope of personal liberty under Article 21 and expanded the idea of \"procedure established by law.\" This judgment is widely regarded as a turning point in Indian constitutional history.",
          },
        },
        {
          id: "background",
          type: "header",
          data: {
            text: "1. Background of the Case",
            level: 2,
          },
        },
        {
          id: "background-content",
          type: "paragraph",
          data: {
            text: "Maneka Gandhi, a journalist, was issued a passport under the Passports Act, 1967. In July 1977, the Government of India ordered her to surrender her passport without giving reasons. Gandhi requested an explanation, but the government refused on grounds of \"public interest.\" She filed a petition under Article 32, challenging the order and arguing that it violated her fundamental rights under Articles 14, 19, and 21.",
          },
        },
        {
          id: "legal-questions",
          type: "header",
          data: {
            text: "2. Key Legal Questions",
            level: 2,
          },
        },
        {
          id: "legal-questions-content",
          type: "list",
          data: {
            style: "ordered",
            items: [
              "Whether the right to travel abroad is part of personal liberty under Article 21",
              "What constitutes \"procedure established by law\" - whether it requires only legislative authorization or must also satisfy principles of natural justice and reasonableness",
              "The relationship between Article 21 and other fundamental rights, particularly Article 19",
            ],
          },
        },
        {
          id: "court-reasoning",
          type: "header",
          data: {
            text: "3. Supreme Court's Reasoning",
            level: 2,
          },
        },
        {
          id: "court-reasoning-content",
          type: "paragraph",
          data: {
            text: "The Court held that the right to go abroad is part of personal liberty under Article 21. More significantly, it ruled that \"procedure established by law\" must be just, fair, and reasonable - not arbitrary. This marked a departure from the narrow interpretation in ADM Jabalpur. The Court also established that Articles 14, 19, and 21 are interconnected and must be read together, creating a comprehensive framework for fundamental rights protection.",
          },
        },
        {
          id: "impact",
          type: "header",
          data: {
            text: "4. Impact and Significance",
            level: 2,
          },
        },
        {
          id: "impact-content",
          type: "paragraph",
          data: {
            text: "Maneka Gandhi significantly expanded the scope of Article 21, transforming it from a mere right to life and personal liberty into a source of numerous unenumerated rights. The judgment introduced principles of natural justice into administrative law and established that any law depriving personal liberty must satisfy tests of reasonableness and fairness.",
          },
        },
        {
          id: "conclusion",
          type: "header",
          data: {
            text: "5. Conclusion",
            level: 2,
          },
        },
        {
          id: "conclusion-content",
          type: "paragraph",
          data: {
            text: "The Maneka Gandhi case represents a watershed moment in Indian constitutional law. By expanding the interpretation of Article 21 and establishing the interconnectedness of fundamental rights, the Supreme Court strengthened individual liberty protections and laid the groundwork for a more expansive understanding of constitutional rights in India.",
          },
        },
      ],
      version: "2.22.2",
    };
    
    setEditorData(defaultData);
    setIsLoading(false);
  }, []);

  const handleEditorChange = (newData: any) => {
    setEditorData(newData);
    // Here you can add auto-save functionality
    console.log('Editor content changed:', newData);
  };

  return (
    <main className="main-content-area flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Header */}
      <header 
        className={`app-header border-b border-[#e3e3e3] transition-all duration-300 flex-shrink-0 ${
          isHeaderVisible ? 'h-[120px] opacity-100' : 'h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="header-top h-[67px] border-b border-[#e3e3e3] px-[24px] flex items-center justify-between">
          <div className="header-left flex items-center gap-[24px]">
            {/* Logo */}
            <div className="app-logo">
              <p className="font-['Baskerville_Old_Face:Regular',sans-serif] text-[30px] text-black">LawVriksh</p>
              <div className="bg-[#d4af37] h-[2px] w-[129px]" />
            </div>
          </div>

          <div className="header-right flex items-center gap-[15px]">
            <p className="last-saved-text font-['Verdana:Regular',sans-serif] text-[15px] text-[#656565] tracking-[-0.45px] hidden lg:block">
              Last saved: 10/28/2025 12:32AM
            </p>

            {/* Trash Button */}
            <button className="trash-button p-[5px] hover:opacity-70 transition-opacity" aria-label="Delete">
              <Trash className="size-[30px]" stroke="#D00000" strokeWidth="2.5" />
            </button>

            {/* Vertical Divider */}
            <div className="h-[29px] w-[1px] bg-[#9F9F9F] hidden md:block" />

            {/* Export Button */}
            <button className="export-button flex items-center gap-[14px] h-[40px] px-[10px] border border-[#bfbfbf] rounded-[10px] hover:bg-gray-50 transition-colors">
              <Download className="size-[22px]" stroke="#3D3D3D" strokeWidth="2" />
              <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[18px] hidden sm:inline">Export</span>
              <ChevronLeft className="size-[16px] rotate-180 hidden sm:inline" fill="#1D1B20" />
            </button>
          </div>
        </div>

        {/* Title Bar */}
        <div className="title-bar h-[53px] px-[24px] flex items-center">
          <button className="back-button mr-[17px] hover:opacity-70 transition-opacity" aria-label="Go back">
            <ArrowLeft className="size-[24px]"  />
          </button>
          <h1 className="document-title font-['Arial:Regular',sans-serif] text-[20px] text-[#3d3d3d] truncate">
            Maneka Gandhi v. Union of India, 1978
          </h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="editor-scroll-container flex-1 overflow-y-auto">
        {/* Sticky Toolbar Container */}
        <div className={`sticky top-0 z-10 bg-white transition-shadow duration-300 ${
          isToolbarSticky ? 'shadow-md' : ''
        }`}>
          {/* Toolbar */}
          <div className="toolbar-container bg-[#f6f6f6] border border-[#e3e3e3] rounded-[7px] p-[12px] mx-[24px] mt-[16px] mb-[22px]">
            {/* Single Line Toolbar */}
            <div className="toolbar flex items-center gap-[16px] flex-wrap">
              {/* Cite Button */}
              <button className="cite-button bg-white border border-[#d1d5db] h-[36px] px-[12px] rounded-[8px] flex items-center gap-[8px] hover:bg-gray-50 hover:border-[#9ca3af] transition-all">
                <FileText className="size-[18px]" stroke="#1E1E1E" strokeWidth="2" />
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[15px] hidden sm:inline">Cite</span>
              </button>

              {/* Citation Style Dropdown */}
              <button className="citation-style-dropdown bg-white border border-[#d1d5db] h-[36px] px-[12px] rounded-[8px] flex items-center gap-[8px] hover:bg-gray-50 hover:border-[#9ca3af] transition-all">
                <FileText className="size-[18px]" stroke="#3D3D3D" strokeWidth="1.5" />
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[15px] hidden sm:inline">Style</span>
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[13px] sm:hidden">Style</span>
                <ChevronLeft className="size-[14px] rotate-180" fill="#6b7280" />
              </button>

              {/* Copy Button */}
              <button className="copy-button bg-white border border-[#d1d5db] h-[36px] px-[12px] rounded-[8px] flex items-center gap-[8px] hover:bg-gray-50 hover:border-[#9ca3af] transition-all">
                <Copy className="size-[18px]" stroke="#3D3D3D" strokeWidth="2" />
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[15px] hidden sm:inline">Copy</span>
              </button>

              {/* Divider */}
              <div className="h-[24px] w-[1px] bg-[#d1d5db]" />

              {/* Undo/Redo */}
              <div className="undo-redo-group flex items-center gap-[8px]">
                <button className="undo-button bg-white border border-[#d1d5db] h-[36px] w-[36px] rounded-[8px] flex items-center justify-center hover:bg-gray-50 hover:border-[#9ca3af] transition-all" aria-label="Undo">
                  <Undo className="size-[18px]" stroke="#6b7280" strokeWidth="2" />
                </button>
                <button className="redo-button bg-white border border-[#d1d5db] h-[36px] w-[36px] rounded-[8px] flex items-center justify-center hover:bg-gray-50 hover:border-[#9ca3af] transition-all" aria-label="Redo">
                  <Redo className="size-[18px]" stroke="#6b7280" strokeWidth="2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Editor Container */}
        <div className="editor-container bg-white border border-[#e3e3e3] rounded-[7px] min-h-[800px] p-[30px] mx-[24px] mb-[40px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-[#9ca3af]">Loading editor...</div>
            </div>
          ) : (
            <Editor
              data={editorData}
              onChange={handleEditorChange}
              placeholder="Start typing or press '/' for commands..."
              autofocus={true}
              minHeight={600}
            />
          )}
        </div>
      </div>
    </main>
  );
}
