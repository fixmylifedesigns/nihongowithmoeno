# Japanese with Moeno - Language Learning Website

A modern, responsive website for Japanese language learning, built with Next.js and Tailwind CSS. This platform offers personalized Japanese lessons with a native speaker, focusing on immersive learning experiences for both beginners and advanced learners.

## 🌟 Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean and intuitive interface built with Tailwind CSS
- **Server-Side Rendering**: Optimized performance and SEO with Next.js
- **Dynamic Routing**: Easy navigation between different sections of the website
- **Interactive Components**: Custom-built components for enhanced user experience

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - JavaScript library for user interfaces
- [Geist Font](https://vercel.com/font) - Modern, optimized font by Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/japanesewithmoeno.git
   cd japanesewithmoeno
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
src/
├── app/               # Next.js app directory
│   ├── layout.js     # Root layout component
│   ├── page.js       # Homepage
│   └── globals.css   # Global styles
├── components/        # Reusable React components
│   ├── Button.js
│   ├── Navbar.js
│   └── Footer.js
└── styles/           # Additional styling
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_SITE_URL=your-site-url
# Add other environment variables as needed
```

### Tailwind Configuration

The project uses a custom Tailwind configuration. You can modify it in `tailwind.config.js`.

## 🚀 Deployment

This project can be deployed to various platforms. Here are some recommended options:

1. **Vercel** (Recommended)
   ```bash
   npm run build
   vercel deploy
   ```

2. **Netlify**
   ```bash
   npm run build
   netlify deploy
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
Project Link: [https://github.com/yourusername/japanesewithmoeno](https://github.com/yourusername/japanesewithmoeno)

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vercel](https://vercel.com) for hosting and deployment

---

Made with ❤️ by Irving