import svgPaths from "./svg-sgshmz2kzk";

function Group() {
  return (
    <div className="absolute contents left-[556px] top-[674px]">
      <div className="absolute bg-black h-[49px] left-[556px] rounded-[5px] top-[674px] w-[118px]" />
      <p className="absolute font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.17] left-[584px] not-italic text-[20px] text-nowrap text-white top-[687px] tracking-[1.4px] whitespace-pre">Create</p>
    </div>
  );
}

function CloudUpload() {
  return (
    <div className="absolute left-[329px] size-[32px] top-[387px]" data-name="cloud-upload">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="cloud-upload">
          <path d={svgPaths.p3ab19300} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Add() {
  return (
    <div className="absolute left-[164px] size-[42px] top-[193px]" data-name="add">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="add">
          <path d={svgPaths.p1d8c4480} fill="var(--fill-0, #1D1B20)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="absolute left-[407px] size-[24px] top-[576px]" data-name="Chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Chevron down">
          <path d="M6 9L12 15L18 9" id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[249px] top-[572px]">
      <div className="absolute bg-white border border-[#a2a2a2] border-solid h-[30px] left-[249px] rounded-[6px] top-[572px] w-[191px]" />
      <ChevronDown />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[1.45] left-[304.5px] not-italic text-[12px] text-black text-center text-nowrap top-[579px] translate-x-[-50%] whitespace-pre">Document Name</p>
    </div>
  );
}

export default function Group2() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-white h-[747px] left-0 rounded-[10px] top-0 w-[698px]" />
      <div className="absolute h-0 left-[143px] top-[503px] w-[413px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 413 1">
            <line id="Line 71" stroke="var(--stroke-0, #A3A3A3)" x2="413" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Group />
      <div className="absolute bg-[#f1f1f1] h-[182px] left-[36px] rounded-[5px] top-[131px] w-[303px]" />
      <p className="absolute font-['Playfair_Display:Regular',sans-serif] font-normal leading-[1.45] left-[128px] text-[18px] text-black text-nowrap top-[238px] whitespace-pre">From Scratch</p>
      <div className="absolute bg-white border border-black border-dashed h-[117px] left-[37px] rounded-[5px] top-[359px] w-[621px]" />
      <CloudUpload />
      <p className="absolute font-['Playfair_Display:Regular',sans-serif] font-normal leading-[1.45] left-[352.5px] text-[18px] text-black text-center text-nowrap top-[432px] translate-x-[-50%] whitespace-pre">Choose your Own Template</p>
      <p className="absolute font-['Playfair_Display:Regular',sans-serif] font-normal leading-[1.45] left-[344.5px] text-[15px] text-black text-center text-nowrap top-[541px] translate-x-[-50%] whitespace-pre">Select From existing</p>
      <Add />
      <p className="absolute font-['Playfair_Display:Regular',sans-serif] font-normal leading-[1.17] left-[36px] text-[#858585] text-[30px] text-nowrap top-[32px] whitespace-pre">Enter Project Name...</p>
      <div className="absolute h-0 left-[36px] top-[99px] w-[622px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 622 1">
            <line id="Line 41" stroke="var(--stroke-0, #BEBEBE)" x2="622" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-white h-[20px] left-[323px] top-[493px] w-[47px]" />
      <p className="absolute font-['Nyght_Serif:Regular',sans-serif] leading-[1.17] left-[330px] not-italic text-[#a2a2a2] text-[20px] text-nowrap top-[490px] tracking-[1.4px] whitespace-pre">OR</p>
      <Group1 />
    </div>
  );
}