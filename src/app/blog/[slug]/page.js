import { notFound } from "next/navigation"
import Link from "next/link"
import DonateButton from "../../../components/DonateButton/DonateButton"
import { getBlogPostBySlug, allBlogPosts } from "../../../data/blog/index.js"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PersonIcon from "@mui/icons-material/Person"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ShareIcon from "@mui/icons-material/Share"

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const post = getBlogPostBySlug(params.slug)

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

export default function BlogPostPage({ params }) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = allBlogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3)

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-12" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8">
              <ArrowBackIcon className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>

            <div className="mb-8">
              <span
                className="px-4 py-2 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: "#ffb70b" }}
              >
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: "#022741" }}>
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <PersonIcon className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarTodayIcon className="w-5 h-5" />
                <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AccessTimeIcon className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
              <button className="flex items-center space-x-2 hover:text-gray-800">
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="mb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="prose prose-lg max-w-none"
              style={{ color: "#374151" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#022741" }}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16" style={{ backgroundColor: "#022741" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Inspired by This Story?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Help us create more success stories like this one. Your support makes these transformations possible.
            </p>
            <DonateButton size="large" />
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "#022741" }}>
                Related Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.featuredImage || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-3" style={{ color: "#022741" }}>
                        <Link href={`/blog/${relatedPost.slug}`} className="hover:underline">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedPost.author}</span>
                        <span>{new Date(relatedPost.publishedDate).toLocaleDateString()}</span>
                      </div>
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
