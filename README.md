# Modern Portfolio Website

A sleek, responsive portfolio website built with React and Tailwind CSS, featuring a dark theme and smooth animations.

## 🌟 Features

- **Modern Design**: Clean, minimalist design with a dark theme
- **Responsive**: Fully responsive design that works on all devices
- **Smooth Animations**: Beautiful animations using Framer Motion
- **Interactive Elements**: Hover effects, transitions, and interactive components
- **Contact Form**: Working contact form with validation
- **Project Showcase**: Dynamic project filtering and detailed project modals
- **Skills Section**: Animated skill bars with technology icons
- **Fast Performance**: Optimized for speed and performance

## 🚀 Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Build Tool**: Create React App

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website.

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

The build folder will contain the optimized production files ready for deployment.

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Skills.js
│   │   ├── Projects.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6', // Blue
      },
      accent: {
        500: '#10b981', // Green
      }
    }
  }
}
```

### Content
Update the personal information in each component:

- **Hero.js**: Name, roles, description
- **About.js**: Personal story, skills, stats
- **Skills.js**: Technologies and skill levels
- **Projects.js**: Project details and links
- **Contact.js**: Contact information and social links

### Animations
Animations are configured in `tailwind.config.js` and can be customized:

```js
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.6s ease-out',
  // Add more animations
}
```

## 🌐 Deployment

### Netlify
1. Build the project: `npm run build`
2. Drag the `build` folder to Netlify's deploy area

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://your-username.github.io/portfolio",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance Optimizations

- **Lazy Loading**: Images and components load on demand
- **Code Splitting**: Dynamic imports for better performance
- **Optimized Images**: Compressed and properly sized images
- **Minimal Dependencies**: Only essential packages included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Tips for Customization

1. **Replace placeholder content** with your actual information
2. **Update project images** with screenshots of your real projects
3. **Add your resume** to the public folder and update the download link
4. **Configure contact form** to work with your preferred backend service
5. **Add Google Analytics** for tracking (optional)

## 🐛 Common Issues

### Framer Motion Warnings
If you see warnings about Framer Motion, make sure you're using the latest version:
```bash
npm update framer-motion
```

### Tailwind CSS Not Working
Ensure Tailwind is properly configured and imported in `index.css`.

## 📞 Support

If you have any questions or need help customizing the portfolio, feel free to:
- Open an issue on GitHub
- Contact me at ashis@example.com

---

**Happy coding! 🚀**