import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog/blog-post-page";
import { getPostBySlug } from "@/components/blog/blog-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found – Procurely" };

  return {
    title: `${post.title} – Procurely Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
  };
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <BlogPostPage post={post} />;
}
