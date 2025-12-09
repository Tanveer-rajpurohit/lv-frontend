import { useRef, useEffect } from 'react';
import { Trash, Download, Settings, FileText, Bold, Italic, Underline, List, ListOrdered, Quote, Link, Image, Code, ArrowLeft, ChevronLeft, Undo, Redo, Copy, Palette } from 'lucide-react';
import { InlineIssueTooltip } from './InlineIssueTooltip';

interface WritingSectionProps {
  isHeaderVisible: boolean;
  isToolbarSticky: boolean;
  onScroll: () => void;
}

export default function WritingSection({ isHeaderVisible, isToolbarSticky, onScroll }: WritingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll);
      return () => scrollContainer.removeEventListener('scroll', onScroll);
    }
  }, [onScroll]);

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
          <div className="toolbar-container bg-[#f6f6f6] border border-[#e3e3e3] rounded-[7px] p-[15px] mx-[24px] mt-[16px] mb-[22px]">
            {/* Primary Toolbar */}
            <div className="primary-toolbar flex items-center gap-[23px] mb-[20px] flex-wrap">
              {/* Text Style Dropdown */}
              <button className="text-style-dropdown flex items-center gap-[7px] hover:opacity-70 transition-opacity">
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[18px] hidden sm:inline">Normal Text</span>
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[16px] sm:hidden">Text</span>
                <ChevronLeft className="size-[16px] rotate-180" fill="#1D1B20" />
              </button>

              {/* Cite Button */}
              <button className="cite-button flex items-center gap-[7px] hover:opacity-70 transition-opacity">
                <FileText className="size-[24px]" stroke="#1E1E1E" strokeWidth="2" />
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[18px] hidden sm:inline">Cite</span>
              </button>

              {/* Alignment Dropdown */}
              <button className="alignment-dropdown flex items-center hover:opacity-70 transition-opacity">
                <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                  <path d="M21 6H3M15 12H3M17 18H3" stroke="#09090B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                  <path d="M12 15L7 10H17L12 15Z" fill="#565656" />
                </svg>
              </button>

              {/* Pen Color Group */}
              <div className="pen-color-group h-[31px] w-[137px] hidden lg:block">
                <button className="w-full h-full hover:opacity-70 transition-opacity">
                  <svg className="block size-full" fill="none" viewBox="0 0 137 31">
                    <rect fill="white" height="30" rx="15" stroke="#DCDCDC" width="136" x="0.5" y="0.5" />
                    <path d="M20 14L14 20V23H23L26 20" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M33 15L28.4 19.6C28.0261 19.9665 27.5235 20.1717 27 20.1717C26.4765 20.1717 25.9739 19.9665 25.6 19.6L20.4 14.4C20.0335 14.0261 19.8283 13.5235 19.8283 13C19.8283 12.4765 20.0335 11.9739 20.4 11.6L25 7" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <circle cx="53" cy="15" fill="#D4AF37" r="9" />
                    <circle cx="75" cy="15" fill="#F45555" r="9" />
                    <circle cx="97" cy="15" fill="#34C759" r="9" />
                    <circle cx="119" cy="15" fill="#027FBD" r="9" />
                  </svg>
                </button>
              </div>

              {/* Text Color Group */}
              <div className="text-color-group h-[31px] w-[130px] hidden lg:block">
                <button className="w-full h-full hover:opacity-70 transition-opacity">
                  <svg className="block size-full" fill="none" viewBox="0 0 130 31">
                    <rect fill="white" height="30" rx="15" stroke="#DCDCDC" width="129" x="0.5" y="0.5" />
                    <circle cx="47" cy="15" fill="#D4AF37" r="9" />
                    <circle cx="69" cy="15" fill="#F45555" r="9" />
                    <circle cx="91" cy="15" fill="#34C759" r="9" />
                    <circle cx="113" cy="15" fill="#027FBD" r="9" />
                    <path d="M12.5 24V21H27.5V24H12.5ZM15.125 18.75L19.0625 8.25H20.9375L24.875 18.75H23.075L22.1375 16.05H17.9L16.925 18.75H15.125ZM18.425 14.55H21.575L20.0375 10.2H19.9625L18.425 14.55Z" fill="#1D1B20" />
                  </svg>
                </button>
              </div>

              {/* Image Button */}
              <button className="image-button size-[24px] hover:opacity-70 transition-opacity" aria-label="Insert image">
                <Image className="size-[24px]" stroke="black" strokeWidth="2" />
              </button>

              {/* Divider */}
              <div className="h-[27px] w-[1px] bg-[#CFCFCF] hidden xl:block" />

              {/* Undo/Redo */}
              <div className="undo-redo-group flex items-center gap-[9px]">
                <button className="undo-button size-[24px] hover:opacity-70 transition-opacity" aria-label="Undo">
                  <Undo className="size-[24px]"  />
                </button>
                <button className="redo-button size-[23px] hover:opacity-70 transition-opacity" aria-label="Redo">
                  <Redo className="size-[23px]"  />
                </button>
              </div>
            </div>

            {/* Secondary Toolbar */}
            <div className="secondary-toolbar flex items-center gap-[17px] flex-wrap">
              {/* Citation Style Dropdown */}
              <button className="citation-style-dropdown bg-[#e8e8e8] border border-[#e4e4e4] h-[40px] px-[12px] rounded-[10px] flex items-center gap-[20px] lg:gap-[47px] hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-[7px]">
                  <FileText className="size-[18px]" stroke="#3D3D3D" strokeWidth="1.5" />
                  <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[18px] hidden sm:inline">Citation Style</span>
                  <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[16px] sm:hidden">Style</span>
                </div>
                <ChevronLeft className="size-[16px] rotate-180" fill="#1D1B20" />
              </button>

              {/* Copy Button */}
              <button className="copy-button border border-[#bfbfbf] h-[40px] px-[19px] rounded-[10px] flex items-center gap-[8px] hover:bg-gray-50 transition-colors">
                <Copy className="size-[22px]" stroke="#3D3D3D" strokeWidth="2" />
                <span className="font-['Arial:Regular',sans-serif] text-[#3d3d3d] text-[18px]">Copy</span>
              </button>
            </div>
          </div>
        </div>
        {/* Editor Container */}
        <div className="editor-container bg-white border border-[#e3e3e3] rounded-[7px] min-h-[800px] p-[30px] mx-[24px] mb-[40px]">
          {/* Placeholder for Editor.js */}
          <div className="editorjs-container">
            <h1 className="text-[40px] text-[#b5bcc3] leading-[1.45]">Maneka Gandhi v. Union of India, 1978</h1>
            
            <div className="mt-[30px] space-y-[20px]">
              <section>
                <h2 className="text-[24px] mb-[10px]">1. Introduction</h2>
                <p className="text-[16px] leading-[1.6]">
                  This research draft examines the landmark Supreme Court judgment Maneka Gandhi v. Union of India (1978), which transformed the interpretation of fundamental rights under the Indian Constitution. The case primarily concerned with the scope of personal liberty{' '}
                  <InlineIssueTooltip
                    text="under Article 21 and expanded the idea of &quot;procedure established by law.&quot;"
                    issueType="false"
                    currentText='under Article 21 and expanded the idea of "procedure established by law."'
                    suggestedText='under Article 21 of the Indian Constitution, expanding the meaning of "procedure established by law" to include principles of natural justice and fairness.'
                    explanation="Here wrong statement will be shown under Article 21 and expanded the"
                    onAccept={() => console.log('Accepted suggestion')}
                    onDismiss={() => console.log('Dismissed suggestion')}
                  />
                  {' '}This judgment is widely regarded as a turning point in Indian constitutional history.
                </p>
              </section>

              <section>
                <h2 className="text-[24px] mb-[10px]">2. Background of the Case</h2>
                <p className="text-[16px] leading-[1.6]">
                  Maneka Gandhi, a journalist, was issued a passport under the Passports Act, 1967. In July 1977, the Government of India ordered her to surrender her passport without giving reasons. Gandhi requested an explanation, but the government refused on grounds of &quot;public interest.&quot;{' '}
                  <InlineIssueTooltip
                    text="She filed a petition under Article 32, challenging the order and arguing that it violated her fundamental rights under Articles 14, 19, and 21."
                    issueType="misleading"
                    currentText="She filed a petition under Article 32, challenging the order and arguing that it violated her fundamental rights under Articles 14, 19, and 21."
                    suggestedText="Maneka Gandhi, a prominent journalist, had been granted a passport in accordance with the provisions of the Passports Act, 1967."
                    explanation="She filed a petition under Article 32, challenging the order and arguing that it violated her fundamental rights under Articles 14, 19, and 21."
                    onAccept={() => console.log('Accepted suggestion')}
                    onDismiss={() => console.log('Dismissed suggestion')}
                  />
                </p>
              </section>

              <section>
                <h2 className="text-[24px] mb-[10px]">3. Key Legal Questions</h2>
                <p className="text-[16px] leading-[1.6]">
                  The Supreme Court addressed several fundamental questions in this case. First, whether the right to travel abroad is part of personal liberty under Article 21. Second, what constitutes &quot;procedure established by law&quot; - whether it requires only legislative authorization or must also satisfy principles of natural justice and reasonableness. Third, the relationship between Article 21 and other fundamental rights, particularly Article 19.
                </p>
              </section>

              <section>
                <h2 className="text-[24px] mb-[10px]">4. Supreme Court&apos;s Reasoning</h2>
                <p className="text-[16px] leading-[1.6]">
                  The Court held that the right to go abroad is part of personal liberty under Article 21. More significantly, it ruled that &quot;procedure established by law&quot; must be just, fair, and reasonable - not arbitrary. This marked a departure from the narrow interpretation in ADM Jabalpur. The Court also established that Articles 14, 19, and 21 are interconnected and must be read together, creating a comprehensive framework for fundamental rights protection.
                </p>
              </section>

              <section>
                <h2 className="text-[24px] mb-[10px]">5. Impact and Significance</h2>
                <p className="text-[16px] leading-[1.6]">
                  Maneka Gandhi significantly expanded the scope of Article 21, transforming it from a mere right to life and personal liberty into a source of numerous unenumerated rights. The judgment introduced principles of natural justice into administrative law and established that any law depriving personal liberty must satisfy tests of reasonableness and fairness. This case laid the foundation for subsequent judicial developments in human rights jurisprudence in India.
                </p>
              </section>

              <section>
                <h2 className="text-[24px] mb-[10px]">6. Conclusion</h2>
                <p className="text-[16px] leading-[1.6]">
                  The Maneka Gandhi case represents a watershed moment in Indian constitutional law. By expanding the interpretation of Article 21 and establishing the interconnectedness of fundamental rights, the Supreme Court strengthened individual liberty protections and laid the groundwork for a more expansive understanding of constitutional rights in India.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
