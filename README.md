# Prayas by Aarya Foundation NGO Website

A comprehensive NGO website built with Next.js for Prayas by Aarya Foundation, featuring donation integration with Razorpay, blog system, and responsive design.

## About Prayas by Aarya Foundation

Prayas by Aarya Foundation is registered under Section 8 of Company Act of India 2013 (CIN: U85499JH2017NPL024878). We are dedicated to creating positive change in communities through education, healthcare, and sustainable development programs.

**Contact Information:**
- Email: prayasbyaaryafoundation@gmail.com
- Phone: +91 6200218724
- Address: Saraswati Vidya Nivas, Koramtoli, Behind Dr S N Yadav, Infront of Saraswati Apartment, PO- Morabadi, PS-Lalpur, Ranchi, Jharkhand 834001

## Features

- 🏠 Homepage with hero section and impact statistics
- 📖 About pages (Who We Are, What We Do)
- 💰 Donation system with Razorpay integration
- 📝 Blog system with category-wise organization
- 🤝 Get Involved page with volunteer opportunities
- 📚 Resources page with downloadable materials
- 📱 Fully responsive design
- ♿ Accessibility compliant
- 🎨 Custom color scheme for NGO branding

## Tech Stack

- **Framework**: Next.js 14 (JavaScript, no TypeScript)
- **Styling**: Tailwind CSS (hardcoded classes only)
- **Icons**: Material-UI Icons
- **Payment**: Razorpay Integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Razorpay account for payment processing

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Copy environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Configure your environment variables in `.env.local`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

See `.env.example` for all required environment variables.

### Razorpay Setup

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add them to your `.env.local` file
4. For production, use live keys instead of test keys

## Deployment

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

\`\`\`
├── app/                    # Next.js app router
│   ├── page.js            # Homepage
│   ├── layout.js          # Root layout
│   ├── who-we-are/        # About page
│   ├── what-we-do/        # Programs page
│   ├── get-involved/      # Volunteer page
│   ├── resources/         # Resources page
│   ├── donate-now/        # Donation page
│   ├── blog/              # Blog system
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── Shared/           # Navbar, Footer
│   ├── HomePage/         # Homepage components
│   ├── DonateButton/     # Donation component
│   └── [PageName]/       # Page-specific components
├── data/                 # Static data
│   └── blog/            # Blog posts by category
└── public/              # Static assets
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
"# aarya-ngo" 
