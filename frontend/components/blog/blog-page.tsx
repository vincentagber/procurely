"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { blogPosts } from "@/components/blog/blog-data";
import type { BlogPost } from "@/components/blog/blog-data";

const categories = ["All", "Procurement Guide", "Material Guide", "Product Review", "Cost Management", "Finance"];

export function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#13184f] py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #1900ff 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #ff6f4d 0%, transparent 40%)`
          }}
        />
        <div className="container-shell relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1900ff]/20 px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-[#a0aaff] mb-6">
              <span className="size-2 rounded-full bg-[#1900ff] animate-pulse" />
              Procurely Blog
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Build Smarter.<br />
              <span className="text-[#ff6f4d]">Procure</span> Better.
            </h1>
            <p className="text-lg text-white/70 font-medium max-w-lg leading-relaxed">
              Expert insights on construction procurement, material guides, cost control strategies, and the Nigerian property market — curated for developers and contractors.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container-shell -mt-12 relative z-10">
        <FeaturedCard post={featured} />
      </section>

      {/* Category Filter */}
      <section className="container-shell mt-16">
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-5 py-2 text-[13px] font-bold transition-all ${
                cat === "All"
                  ? "bg-[#1900ff] text-white shadow-[0_4px_14px_rgba(25,0,255,0.3)]"
                  : "bg-slate-100 text-slate-600 hover:bg-[#1900ff]/10 hover:text-[#1900ff]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#f3f4fa] py-20 border-t border-slate-100">
        <div className="container-shell">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#13184f] tracking-tight mb-4">
              Get procurement insights in your inbox
            </h2>
            <p className="text-slate-500 font-medium mb-8">
              Weekly tips on buying better, building faster, and cutting costs on Nigerian construction projects.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-14 rounded-[14px] border border-slate-200 bg-white px-5 text-[15px] text-slate-800 outline-none focus:border-[#1900ff] focus:ring-2 focus:ring-[#1900ff]/10 transition"
              />
              <button
                type="submit"
                className="h-14 rounded-[14px] bg-[#1900ff] px-8 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(25,0,255,0.25)] transition hover:bg-[#1310cc] hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(19,24,79,0.14)] grid md:grid-cols-2 min-h-[380px] transition-all duration-300 group-hover:shadow-[0_40px_100px_rgba(19,24,79,0.2)]">
        {/* Color panel */}
        <div
          className="relative flex items-center justify-center p-12 min-h-[260px]"
          style={{ backgroundColor: post.coverColor }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 30% 70%, white 0%, transparent 60%)` }}
          />
          <span className="text-[100px] select-none relative z-10 drop-shadow-lg">{post.coverEmoji}</span>
          <span className="absolute top-6 left-6 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-[12px] font-bold text-white uppercase tracking-wider">
            {post.category}
          </span>
        </div>
        {/* Content panel */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-[12px] text-slate-400 font-semibold uppercase tracking-wider mb-5">
            <Clock className="size-3.5" />
            {post.readTime}
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            {post.date}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#13184f] tracking-tight leading-tight mb-4 group-hover:text-[#1900ff] transition-colors">
            {post.title}
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-full text-white text-[14px] font-black"
                style={{ backgroundColor: post.coverColor }}
              >
                {post.authorAvatar}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#13184f]">{post.author}</p>
                <p className="text-[12px] text-slate-400 font-medium">{post.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#1900ff] font-bold text-[14px] group-hover:gap-3 transition-all">
              Read article <ArrowRight className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      {/* Cover */}
      <div
        className="rounded-[20px] flex items-center justify-center relative overflow-hidden h-52 mb-5 transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ backgroundColor: post.coverColor }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 20% 80%, white 0%, transparent 60%)` }}
        />
        <span className="text-[72px] select-none relative z-10 drop-shadow-md">{post.coverEmoji}</span>
        <span className="absolute top-4 left-4 rounded-full bg-black/20 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
          {post.category}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-3">
        <Clock className="size-3" />
        {post.readTime}
        <span className="w-1 h-1 rounded-full bg-slate-200" />
        {post.date}
      </div>

      {/* Title */}
      <h3 className="text-[18px] font-black text-[#13184f] tracking-tight leading-tight mb-3 group-hover:text-[#1900ff] transition-colors">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="text-[13.5px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-5 flex-1">
        {post.excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wide"
          >
            <Tag className="size-2.5" />
            {tag}
          </span>
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
        <div
          className="flex size-9 items-center justify-center rounded-full text-white text-[13px] font-black shrink-0"
          style={{ backgroundColor: post.coverColor }}
        >
          {post.authorAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#13184f] truncate">{post.author}</p>
          <p className="text-[11px] text-slate-400 font-medium truncate">{post.authorRole}</p>
        </div>
        <ArrowRight className="size-4 text-slate-300 group-hover:text-[#1900ff] group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </Link>
  );
}
