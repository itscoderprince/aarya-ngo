"use client"

import Image from "next/image"

// Icons
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Spam: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
}

export default function HomeSubscribe() {
  return (
    <section className="relative w-full bg-white border-t-8 py-10 md:py-14 overflow-hidden" style={{ borderColor: 'rgb(255, 183, 11)' }}>

      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgb(2, 39, 65) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Left Side: Content & Form */}
          <div className="w-full lg:w-1/2">

            <div className="inline-flex items-center gap-2 px-3 py-0.5 mb-4 rounded-full bg-blue-50 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgb(2, 39, 65)' }}>Join the Movement</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3" style={{ color: 'rgb(2, 39, 65)' }}>
              Don't miss out on <br />
              <span className="relative inline-block">
                <span className="relative z-10">Good News.</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300/30 -z-0 transform -rotate-2"></span>
              </span>
            </h2>

            <p className="text-gray-600 text-base mb-6 leading-relaxed max-w-xl">
              Sign up today to receive life-transforming stories, event announcements, and see exactly how your contribution is changing lives.
            </p>
            {/* Subscribe Form */}
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl w-full">

              {/* Name Input - Takes 1 portion of space */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Icons.User />
                </div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-sm"
                  style={{ '--tw-ring-color': 'rgb(2, 39, 65)' }}
                  required
                />
              </div>

              {/* Email Input - Takes 2 portions of space (Wider) */}
              <div className="relative flex-[2]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Icons.Mail />
                </div>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-sm"
                  style={{ '--tw-ring-color': 'rgb(2, 39, 65)' }}
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="group px-6 py-3 rounded-lg font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: 'rgb(255, 183, 11)', color: 'rgb(2, 39, 65)' }}
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-[10px] text-gray-400 flex items-center gap-1.5">
              <Icons.Spam />
              We respect your privacy. No spam, ever.
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="w-full lg:w-5/12 relative flex justify-center lg:justify-end mt-4 lg:mt-0">

            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-yellow-100 rounded-full blur-xl"></div>

            <div className="relative">
              {/* Image Frame */}
              <div className="relative rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] bg-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/subscribe-girl.png"
                  alt="Child smiling"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-4 -left-4 p-3 rounded-lg shadow-lg transform -rotate-3 border border-white/10 backdrop-blur-sm"
                style={{ backgroundColor: 'rgb(2, 39, 65)' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-1.5 rounded-md">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white leading-none">5,000+</p>
                    <p className="text-[10px] text-gray-300 font-medium mt-0.5">Joined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}