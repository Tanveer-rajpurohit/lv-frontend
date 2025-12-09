import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface InlineIssueTooltipProps {
  text: string;
  issueType: 'false' | 'misleading';
  currentText: string;
  suggestedText?: string;
  explanation: string;
  onAccept?: () => void;
  onDismiss?: () => void;
}

export function InlineIssueTooltip({
  text,
  issueType,
  currentText,
  suggestedText,
  explanation,
  onAccept,
  onDismiss
}: InlineIssueTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const textRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving to the tooltip
    if (tooltipRef.current && !tooltipRef.current.contains(e.relatedTarget as Node)) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100); // Small delay to allow moving to tooltip
    }
  };

  const handleTooltipMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving back to the text
    if (textRef.current && !textRef.current.contains(e.relatedTarget as Node)) {
      setIsHovered(false);
    }
  };

  useEffect(() => {
    if (isHovered && textRef.current && tooltipRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Position tooltip above the text
      setTooltipPosition({
        top: textRect.top - tooltipRect.height - 20,
        left: textRect.left + (textRect.width / 2) - (tooltipRect.width / 2)
      });
    }
  }, [isHovered]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const underlineColor = issueType === 'false' ? '#ed0000' : '#f4900c';
  const badgeColor = issueType === 'false' ? '#9b0000' : '#f4900c';

  return (
    <>
      <span
        ref={textRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-pointer transition-all"
        style={{
          textDecoration: 'underline',
          textDecorationColor: underlineColor,
          textUnderlinePosition: 'from-font',
          textDecorationStyle: 'initial'
        }}
      >
        {text}
      </span>

      {isHovered && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white rounded-[7px] shadow-lg border border-[#e3e3e3] w-[305px]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {/* Arrow pointing down */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[10px] w-[20px] h-[10px]">
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path d="M0 0 L10 10 L20 0 Z" fill="white" stroke="#e3e3e3" strokeWidth="1"/>
            </svg>
          </div>

          <div className="p-[14px]">
            {/* Header with badge */}
            <div className="flex items-center justify-between mb-[12px]">
              <div className="flex items-center gap-[8px]">
                <div 
                  className="size-[12px] rounded-full"
                  style={{ backgroundColor: badgeColor }}
                />
                <span className="font-['Arial:Regular',sans-serif] text-[14px]" style={{ color: badgeColor }}>
                  {issueType === 'false' ? 'False' : 'Misleading'}
                </span>
                <span className="font-['Arial:Regular',sans-serif] text-[12px] text-[#8a8a8a]">
                  60% Incorrect
                </span>
              </div>
              <button 
                onClick={() => {
                  setIsHovered(false);
                  onDismiss?.();
                }}
                className="hover:bg-gray-100 rounded p-1 transition-colors"
              >
                <X className="size-[14px] text-[#8a8a8a]" />
              </button>
            </div>

            {/* Current text */}
            <div className="mb-[12px]">
              <p className="font-['Arial:Regular',sans-serif] text-[11px] text-[#8a8a8a] mb-[4px]">
                Current text
              </p>
              <p className="font-['Arial:Regular',sans-serif] text-[13px] text-[#3d3d3d] leading-[1.4]">
                {currentText}
              </p>
            </div>

            {/* Explanation */}
            <div className="mb-[12px]">
              <p className="font-['Arial:Regular',sans-serif] text-[13px] text-[#3d3d3d] leading-[1.4]">
                {explanation}
              </p>
            </div>

            {/* Suggested correction (if available) */}
            {suggestedText && (
              <div className="bg-[#e3f3e5] rounded-[7px] p-[10px] mb-[12px]">
                <p className="font-['Arial:Regular',sans-serif] text-[11px] text-[#8a8a8a] mb-[4px]">
                  Suggested correction
                </p>
                <p className="font-['Arial:Regular',sans-serif] text-[13px] text-[#3d3d3d] leading-[1.4]">
                  {suggestedText}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-[8px]">
              <button 
                onClick={() => {
                  setIsHovered(false);
                  onDismiss?.();
                }}
                className="flex-1 bg-white border border-[#e3e3e3] rounded-[7px] h-[32px] flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <X className="size-[14px] text-[#8a8a8a] mr-[4px]" />
                <span className="font-['Arial:Regular',sans-serif] text-[12px] text-[#8a8a8a]">
                  Dismiss
                </span>
              </button>
              
              {suggestedText && (
                <button 
                  onClick={() => {
                    setIsHovered(false);
                    onAccept?.();
                  }}
                  className="flex-1 bg-[#1980e6] rounded-[7px] h-[32px] flex items-center justify-center hover:bg-[#1670d0] transition-colors"
                >
                  <svg className="size-[14px] mr-[4px]" fill="none" viewBox="0 0 20 20">
                    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-['Arial:Regular',sans-serif] text-[12px] text-white">
                    Accept Change
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
