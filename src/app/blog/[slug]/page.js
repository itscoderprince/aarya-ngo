import { notFound } from "next/navigation"
import Link from "next/link"
import DonateButton from "../../../components/DonateButton/DonateButton"
import { getBlogPostBySlug, allBlogPosts } from "../../../data/blog/index.js"
import { Calendar, User, Clock, ArrowLeft, Share2, Tag } from "lucide-react"

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found - Hope Foundation Blog",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} - Hope Foundation Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = allBlogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header / Hero */}
        <section className="relative pt-32 pb-20 bg-[#022741] text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="mb-6">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-[#022741] text-sm font-bold shadow-sm"
                style={{ backgroundColor: "#ffb70b" }}
              >
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#ffb70b]" />
                </div>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ffb70b]" />
                <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ffb70b]" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="-mt-12 relative z-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white">
              <img
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#022741] prose-a:text-[#022741] prose-a:font-semibold hover:prose-a:text-[#ffb70b] prose-img:rounded-2xl"
              style={{ color: "#374151" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags & Share */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 text-gray-400 mr-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">Tags:</span>
                </div>
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm">
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[#022741] rounded-3xl p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffb70b] rounded-full filter blur-[100px] opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">Inspired by This Story?</h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Help us create more success stories like this one. Your support makes these transformations possible.
                </p>
                <DonateButton size="large" />
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-[#022741]">More Stories Like This</h2>
                <Link href="/blog" className="text-[#022741] font-semibold hover:text-[#ffb70b] transition-colors">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={relatedPost.featuredImage || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs font-medium mb-3 text-gray-500">
                        <span className="text-[#ffb70b] uppercase tracking-wider">{relatedPost.category}</span>
                        <span>•</span>
                        <span>{new Date(relatedPost.publishedDate).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-lg font-bold mb-3 text-[#022741] group-hover:text-[#ffb70b] transition-colors line-clamp-2">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
