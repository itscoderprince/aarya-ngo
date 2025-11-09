import Link from "next/link"
import { notFound } from "next/navigation"

import { getBlogPostsByCategory, blogCategories } from "../../../../data/blog/index.js"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PersonIcon from "@mui/icons-material/Person"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export async function generateStaticParams() {
  return blogCategories.map((category) => ({
    categoryId: category.id,
  }))
}

export async function generateMetadata({ params }) {
  const category = blogCategories.find((cat) => cat.id === params.categoryId)

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

export default function CategoryPage({ params }) {
  const category = blogCategories.find((cat) => cat.id === params.categoryId)
  const posts = getBlogPostsByCategory(params.categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen">
   
      <main>
        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8">
              <ArrowBackIcon className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>

            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6" style={{ color: "#022741" }}>
                {category.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{category.description}</p>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No posts found in this category yet.</p>
                <Link
                  href="/blog"
                  className="inline-block mt-4 px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                >
                  Browse All Posts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
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
                          style={{ backgroundColor: category.color }}
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
            )}
          </div>
        </section>
      </main>

    </div>
  )
}
