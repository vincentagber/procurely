"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import type { Brand } from "@/lib/types";

type BrandGridProps = {
  brands: Brand[];
};

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <section 
      className="mx-auto w-full max-w-[1113px] px-4 pt-[35px]"
      style={{ height: '255.91px' }}
    >
      <div className="flex flex-col gap-[20px]">
        <Reveal>
          <div 
            className="flex items-center"
            style={{
              height: '49.91px',
              paddingTop: '10px',
              paddingRight: '9.91px',
              paddingBottom: '9.91px',
              paddingLeft: '9.91px',
              gap: '9.91px',
            }}
          >
            <h2 
              className="font-display m-0 p-0 text-[#98A2B3] whitespace-nowrap"
              style={{
                fontSize: '25px',
                fontWeight: '400',
                lineHeight: '29.74px',
                letterSpacing: '0.02em'
              }}
            >
              TRUSTED BY <span className="text-[#1900ff]">INDUSTRY LEADERS</span>
            </h2>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-2 gap-[15px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <Reveal key={brand.name}>
              <div 
                className="flex flex-col items-center justify-center border border-[#ECEFF2] bg-white p-2 transition-all hover:border-[#13184f] hover:shadow-md"
                style={{
                  width: '100%',
                  maxWidth: '178.87px',
                  height: '89.43px',
                  borderRadius: '4.47px'
                }}
              >
                <div className="relative h-10 w-full flex-1">
                  <Image
                    alt={brand.name}
                    src={brand.logo}
                    fill
                    className="object-contain p-1"
                    sizes="178px"
                  />
                </div>
                <p className="text-[12px] font-bold text-[#13184f] mt-auto">
                  {brand.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
