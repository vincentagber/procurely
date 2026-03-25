"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import type { ReactNode } from "react";
import type { BlogPost } from "@/components/blog/blog-data";
import { getRelatedPosts } from "@/components/blog/blog-data";

type Props = { post: BlogPost };

export function BlogPostPage({ post }: Props) {
  const related = getRelatedPosts(post, 3);

  const processBody = (body: string): ReactNode[] => {
    const lines = body.split("\n");
    const result: ReactNode[] = [];
    let tableRows: ReactNode[] = [];
    let inTable = false;
    let listItems: ReactNode[] = [];
    let inList = false;
    let isOrderedList = false;

    const flushTable = (key: string) => {
      result.push(
        <div key={key} className="my-8 overflow-auto rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full min-w-[400px]">{tableRows}</table>
        </div>
      );
      tableRows = [];
      inTable = false;
    };

    const flushList = (key: string) => {
      result.push(
        <ul key={key} className="my-4 space-y-1">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
      isOrderedList = false;
    };

    lines.forEach((line, i) => {
      // --- Table handling ---
      if (line.startsWith("| ")) {
        if (line.match(/^\|[\s-|]+\|$/)) return; // separator row
        inTable = true;
        const cells = line.split("|").filter((c) => c.trim() !== "");
        const isFirstRow = tableRows.length === 0;
        tableRows.push(
          <tr
            key={i}
            className={isFirstRow ? "bg-[#f3f4fa]" : "border-b border-slate-100 hover:bg-slate-50/50"}
          >
            {cells.map((cell, j) => {
              const CellTag = isFirstRow ? "th" : "td";
              return (
                <CellTag
                  key={j}
                  className={`py-3 px-5 text-[13.5px] ${
                    isFirstRow
                      ? "text-left font-black text-[#13184f] uppercase tracking-wider"
                      : j === 0
                      ? "font-bold text-[#13184f]"
                      : "text-slate-600 font-medium"
                  }`}
                >
                  {cell.trim().replace(/\*\*(.*?)\*\*/g, "$1")}
                </CellTag>
              );
            })}
          </tr>
        );
        return;
      } else if (inTable) {
        flushTable(`table-${i}`);
      }

      // --- Bullet list handling ---
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (inList && isOrderedList) flushList(`list-${i}`);
        inList = true;
        isOrderedList = false;
        const text = line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#13184f]'>$1</strong>");
        listItems.push(
          <li key={i} className="flex items-start gap-2.5 text-[15.5px] text-slate-600 font-medium mb-2.5 leading-relaxed">
            <span className="mt-2 size-1.5 rounded-full bg-[#1900ff] shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </li>
        );
        return;
      }

      // --- Ordered list handling ---
      if (line.match(/^\d+\. /)) {
        if (inList && !isOrderedList) flushList(`list-${i}`);
        inList = true;
        isOrderedList = true;
        const num = line.match(/^(\d+)\./)?.[1] ?? "";
        const text = line.replace(/^\d+\. /, "").replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#13184f]'>$1</strong>");
        listItems.push(
          <li key={i} className="flex items-start gap-2.5 text-[15.5px] text-slate-600 font-medium mb-2.5 leading-relaxed">
            <span className="text-[#1900ff] font-black text-[13px] mt-1 shrink-0 w-4">{num}.</span>
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </li>
        );
        return;
      } else if (inList) {
        flushList(`list-${i}`);
      }

      // --- Headings ---
      if (line.startsWith("## ")) {
        result.push(
          <h2 key={i} className="text-2xl sm:text-[28px] font-black text-[#13184f] tracking-tight mt-14 mb-5 border-l-4 border-[#1900ff] pl-5">
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }
      if (line.startsWith("### ")) {
        result.push(
          <h3 key={i} className="text-xl font-black text-[#13184f] tracking-tight mt-10 mb-4">
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      // --- Blank line ---
      if (line === "") {
        result.push(<div key={i} className="h-3" />);
        return;
      }

      // --- Paragraph ---
      const inlineBold = line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#13184f]'>$1</strong>");
      result.push(
        <p
          key={i}
          className="text-[16.5px] text-slate-600 leading-[1.9] mb-2 font-[450]"
          dangerouslySetInnerHTML={{ __html: inlineBold }}
        />
      );
    });

    // Flush any remaining
    if (inTable && tableRows.length) flushTable("table-end");
    if (inList && listItems.length) flushList("list-end");

    return result;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Post Hero */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden"
        style={{ backgroundColor: post.coverColor }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 60%, white 0%, transparent 50%),
                              radial-gradient(circle at 85% 20%, white 0%, transparent 40%)`,
          }}
        />
        <div className="container-shell relative z-10 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 text-[13px] font-bold uppercase tracking-widest mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Blog
          </Link>

          <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-[12px] font-bold text-white uppercase tracking-wider mb-6">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
            {post.title}
          </h1>

          <p className="text-white/75 text-lg font-medium leading-relaxed mb-10 max-w-2xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-white/20 text-white text-[15px] font-black">
                {post.authorAvatar}
              </div>
              <div>
                <p className="text-white font-bold text-[15px]">{post.author}</p>
                <p className="text-white/60 text-[13px]">{post.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/60 text-[13px] font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> {post.readTime}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="container-shell max-w-3xl py-16 md:py-20">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f4fa] px-4 py-1.5 text-[12px] font-bold text-[#1900ff] uppercase tracking-wider"
            >
              <Tag className="size-3" /> {tag}
            </span>
          ))}
        </div>

        <article>{processBody(post.body)}</article>

        {/* CTA Box */}
        <div className="mt-16 rounded-3xl bg-[#13184f] p-10 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 20% 50%, #1900ff 0%, transparent 60%)` }}
          />
          <div className="relative z-10">
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#a0aaff] mb-3">Ready to act?</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
              Submit Your BOQ Today
            </h3>
            <p className="text-white/65 font-medium mb-8 max-w-md mx-auto">
              Get competitive quotes from verified suppliers across Lagos in under 48 hours.
            </p>
            <Link
              href="/contact-quote"
              className="inline-flex h-14 items-center gap-2 rounded-[16px] bg-[#1900ff] px-10 text-[16px] font-black text-white shadow-[0_10px_30px_rgba(25,0,255,0.4)] transition hover:bg-[#1310cc] hover:-translate-y-0.5"
            >
              Get Started <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 bg-[#f8f9fb] py-16">
          <div className="container-shell">
            <h2 className="text-2xl font-black text-[#13184f] tracking-tight mb-10">More from the blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link href={`/blog/${rp.slug}`} key={rp.slug} className="group flex flex-col gap-4">
                  <div
                    className="rounded-2xl flex items-center justify-center h-40 overflow-hidden transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: rp.coverColor }}
                  >
                    <span className="text-[56px] select-none drop-shadow">{rp.coverEmoji}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{rp.category}</span>
                    <h3 className="text-[16px] font-black text-[#13184f] leading-snug mt-1 group-hover:text-[#1900ff] transition-colors">
                      {rp.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 mt-2 line-clamp-2">{rp.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
