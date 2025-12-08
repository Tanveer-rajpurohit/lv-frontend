import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CategoryCardProps {
  category: { id: string; name: string; icon: string };
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const positions = ['0% 0%', '-96% -11%', '-95% -100%', '-2% -100%'];
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Initial entrance animation
      gsap.fromTo(cardRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: "power2.out" }
      );
    }
  }, [index]);

  const handleHover = (isHovering: boolean) => {
    if (cardRef.current) {
      if (isHovering) {
        gsap.to(cardRef.current, {
          scale: 1.05,
          y: -8,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(cardRef.current, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };
  
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className="relative h-[150px] sm:h-[186px] rounded-lg border border-[#e8e8e6] overflow-hidden cursor-pointer group"
    >
      <div className="absolute inset-0 opacity-60">
        <img
          src="/assets/images/dashboard/0599b55923e9d0574bb29a0e7cc92e0923576c04.png"
          alt=""
          className="w-full h-full object-cover"
          style={{
            objectPosition: positions[index] || '0% 0%',
            transform: 'scale(2)',
          }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
      
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center px-2">
        <div className="bg-[#fcfbf9] px-3 sm:px-4 py-1 rounded">
          <p className="text-lg sm:text-[25px] text-[#515151] text-center" style={{ fontFamily: 'Antonio' }}>
            {category.name}
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
    </div>
  );
}
