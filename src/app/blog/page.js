import Link from "next/link"
import { allBlogPosts, blogCategories, getFeaturedPosts } from "../../data/blog/index.js"
import { Calendar, User, Clock, Folder, ArrowRight, Sparkles } from "lucide-react"

export const metadata = {
  title: "Blog - Hope Foundation | Stories, Updates & Community News",
  description:
    "Read inspiring stories, program updates, and community news from Hope Foundation. Discover the impact we're making worldwide and how you can get involved.",
}

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts(3)
  const recentPosts = allBlogPosts.slice(3, 9)

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-[#022741]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#ffb70b]/10 text-[#ffb70b] text-sm font-semibold mb-6 border border-[#ffb70b]/20">
                <Sparkles className="w-4 h-4" />
                <span>Our Stories</span>
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white leading-tight">
                Stories of <span className="text-[#ffb70b]">Hope</span> & <br />
                Transformation
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                Discover the real impact we are making together. Read inspiring stories,
                program updates, and community news from around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 -mt-16 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.id}`}
                  className="group block p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[#022741]"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Folder
                        className="w-6 h-6 transition-colors duration-300 group-hover:text-white"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ffb70b] transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#022741]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-[#022741]">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-[#022741]">Featured Stories</h2>
              <div className="h-1 flex-1 mx-6 bg-gray-100 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                    <img
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-sm"
                      style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                    >
                      {post.category}
                    </span>
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
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm font-bold text-[#022741] flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#022741] mb-4">Latest Updates</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay up to date with our most recent activities, success stories, and announcements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video overflow-hidden relative group">
                    <img
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs font-medium mb-3">
                      <span className="text-[#ffb70b] uppercase tracking-wider">{post.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{new Date(post.publishedDate).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold mb-3 text-[#022741] hover:text-[#ffb70b] transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{post.excerpt}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-[#022741] hover:text-[#ffb70b] transition-colors"
                    >
                      Read full story
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
