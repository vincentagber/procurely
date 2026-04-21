"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";

export function ShopPopularCategory() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 max-w-[1115px] min-h-[719px]">
      {/* Header */}
      <div className="relative mb-12 border-b border-slate-100 pb-5 flex items-end justify-between">
        <div className="relative">
          <h2 className="text-[2.2rem] font-bold text-slate-500 tracking-tight leading-none">
            Shop Popular <span className="text-[#0001FF]">Category</span>
          </h2>
          <div className="absolute -bottom-[21.5px] left-0 h-[4px] w-[280px] bg-[#FF5C00]" />
        </div>
        <Link
          href="/categories"
          className="group flex items-center gap-1.5 text-[15px] font-bold text-slate-800 transition hover:text-[#0001FF]"
        >
          View All
          <ChevronRight className="size-5 text-[#FF5C00] transition-transform group-hover:translate-x-1" strokeWidth={3} />
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-[34.7px] md:grid-cols-12 md:auto-rows-[180px] lg:auto-rows-[220px]">
        {/* Large Card - Smart Building Materials Procurement */}
        <motion.div
          className="group md:col-span-8 md:row-span-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
            <Link
              href="/products/smart-building"
              className="relative block h-[421px] w-[766px] overflow-hidden rounded-[17.28px] border border-white/70 shadow-lg bg-[#070C34]"
            >
              <img
                src="/assets/products/cement.png"
                alt="Smart Building Materials Procurement"
                className="h-full w-full object-cover opacity-20"
              />
              <div 
                className="absolute inset-0 flex flex-col justify-center"
                style={{ paddingTop: '49.25px', paddingBottom: '49.25px', paddingLeft: '82.94px', paddingRight: '82.94px' }}
              >
                <div className="max-w-[208px] flex flex-col">
                  <div className="flex flex-col" style={{ gap: '8.64px' }}>
                    <h3 className="text-[30.24px] font-light leading-[30.73px] text-white">
                      Smart Building<br />Materials<br />
                      <span className="font-bold">Procurement</span>
                    </h3>
                    <p className="text-[14px] leading-relaxed text-white/90">
                      Upload your BOQ and let us handle complex matching
                    </p>
                  </div>
                  <div className="mt-[44.06px] inline-flex items-center gap-3 rounded-xl bg-[#001F3F]/90 backdrop-blur-sm px-6 py-4 text-[16px] font-bold text-white transition hover:bg-[#001F3F] self-start">
                    <ArrowUpRight className="h-6 w-6 text-[#FF5C00]" strokeWidth={3} />
                    Start Procuring
                  </div>
                </div>
              </div>
            </Link>
        </motion.div>

        {/* Medium Card - Rebars */}
        <motion.div
          className="group md:col-span-4 md:row-span-2"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/products/rebars"
            className="relative block h-full overflow-hidden rounded-[28px] border border-white/70 shadow-lg"
          >
            <img
              src="/assets/products/rebars.png"
              alt="Rebars"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pt-10 md:p-6 md:pt-12 lg:p-8 lg:pt-16">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white sm:text-4xl md:text-3xl lg:text-[2.8rem]">
                  Rebars
                </h3>
                <p className="mt-2 text-[14px] font-medium text-white/90 uppercase tracking-widest">
                  Powered by Procurely
                </p>
              </div>
              <div className="inline-flex items-center justify-center rounded-full bg-[#FFEAE0] px-10 py-4 text-[16px] font-bold text-[#FF5C00] transition hover:scale-105 shadow-md">
                Start Procuring
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Small Card - Sharp Sand */}
        <motion.div
          className="group md:col-span-6"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/products/sharp-sand"
            className="relative block h-full overflow-hidden rounded-[28px] border border-white/70 shadow-lg"
          >
            <img
              src="/assets/products/sharp-sand.png"
              alt="Sharp Sand"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 lg:p-10">
              <div>
                <h3 className="text-2xl font-bold text-[#0001FF] sm:text-3xl lg:text-[2.2rem]">
                  Sharp Sand
                </h3>
                <p className="mt-2 max-w-[280px] text-[18px] font-bold leading-tight text-[#001F3F] sm:text-xl lg:text-[1.6rem]">
                  Solid Foundation<br />in Every Grain
                </p>
              </div>
              <div className="self-start rounded-full bg-[#001F3F] px-8 py-3.5 text-[15px] font-bold text-white transition hover:scale-105 shadow-md">
                Order Now
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Small Card - Plaster Sand */}
        <motion.div
          className="group md:col-span-3"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/products/plaster-sand"
            className="relative block h-full overflow-hidden rounded-[28px] border border-white/70 shadow-lg"
          >
            <img
              src="/assets/products/plaster-sand.png"
              alt="Plaster Sand"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 lg:p-8">
              <div>
                <h3 className="text-xl font-bold text-[#001F3F] sm:text-2xl lg:text-[1.8rem]">
                  Plaster Sand
                </h3>
                <p className="mt-3 max-w-[120px] text-[11px] font-black leading-tight tracking-widest text-[#001F3F] uppercase sm:text-xs">
                  SMOOTH<br />FINISH.<br />PERFECT<br />TEXTURE.
                </p>
              </div>
              <div className="self-start rounded-full bg-[#001F3F] px-6 py-2.5 text-[14px] font-bold text-white transition hover:scale-105 shadow-md">
                Order Now
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Medium Card - Granite */}
        <motion.div
          className="group md:col-span-3"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/products/granite"
            className="relative block h-full overflow-hidden rounded-[28px] border border-white/70 shadow-lg"
          >
            <img
              src="/assets/products/granite.png"
              alt="Granite Aggregates"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 lg:p-7">
              <div>
                <h3 className="text-[17px] font-bold uppercase tracking-wider text-white sm:text-[19px]">
                  GRANITE (½ & ¾)
                </h3>
                <p className="mt-2 max-w-[120px] text-[15px] font-medium leading-tight text-white/95">
                  Premium<br />Aggregates
                </p>
              </div>
              <div className="self-start rounded-full bg-[#FFEAE0] px-5 py-2.5 text-[13px] font-bold text-[#FF5C00] transition hover:scale-105 shadow-md">
                Start Procuring
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}