import Link from "next/link"
import { notFound } from "next/navigation"

import { getBlogPostsByCategory, blogCategories } from "../../../../data/blog/index.js"
import { Calendar, User, Clock, ArrowLeft, FolderOpen } from "lucide-react"

export async function generateStaticParams() {
  return blogCategories.map((category) => ({
    categoryId: category.id,
  }))
}

export async function generateMetadata({ params }) {
  const { categoryId } = await params
  const category = blogCategories.find((cat) => cat.id === categoryId)

  if (!category) {
    return {
      title: "Category Not Found - Hope Foundation Blog",
      description: "The requested blog category could not be found.",
    }
  }

  return {
    title: `${category.name} - Hope Foundation Blog`,
    description: `${category.description} - Read the latest posts in this category.`,
  }
}

export default async function CategoryPage({ params }) {
  const { categoryId } = await params
  const category = blogCategories.find((cat) => cat.id === categoryId)
  const posts = getBlogPostsByCategory(categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-[#022741]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="flex items-start gap-6">
              <div
                className="hidden md:flex w-20 h-20 rounded-2xl items-center justify-center shadow-lg"
                style={{ backgroundColor: category.color }}
              >
                <FolderOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <span className="inline-block text-[#ffb70b] font-bold tracking-wider uppercase text-sm mb-2">
                  Category
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  {category.name}
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-[#022741] mb-2">No stories found</h3>
                <p className="text-gray-500 mb-8">We haven't published any stories in this category yet.</p>
                <Link
                  href="/blog"
                  className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                >
                  Browse All Stories
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                      <img
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#ffb70b]" />
                          <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#ffb70b]" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-[#022741] group-hover:text-[#ffb70b] transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#022741]">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{post.author}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
