import Link from "next/link"

import { allBlogPosts, blogCategories, getFeaturedPosts } from "../../data/blog/index.js"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PersonIcon from "@mui/icons-material/Person"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CategoryIcon from "@mui/icons-material/Category"

export const metadata = {
  title: "Blog - Hope Foundation | Stories, Updates & Community News",
  description:
    "Read inspiring stories, program updates, and community news from Hope Foundation. Discover the impact we're making worldwide and how you can get involved.",
}

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts(3)
  const recentPosts = allBlogPosts.slice(3, 9)

  return (
    <div className="min-h-screen">
     
      <main>
        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6" style={{ color: "#022741" }}>
                Our Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Stay updated with inspiring stories, program developments, and community news from Hope Foundation.
                Discover the real impact we are making together and how you can be part of the change.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "#022741" }}>
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.id}`}
                  className="block p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white border-2 border-transparent hover:border-opacity-20"
                  style={{ borderColor: category.color }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: category.color }}
                  >
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#022741" }}>
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20" style={{ backgroundColor: "#011728" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-white mb-16">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                        style={{ backgroundColor: "#ffb70b" }}
                      >
                        {post.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <AccessTimeIcon className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: "#022741" }}>
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <PersonIcon className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarTodayIcon className="w-4 h-4" />
                        <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ color: "#022741" }}>
              Recent Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                        style={{ backgroundColor: "#ffb70b" }}
                      >
                        {post.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <AccessTimeIcon className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: "#022741" }}>
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <PersonIcon className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarTodayIcon className="w-4 h-4" />
                        <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
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
