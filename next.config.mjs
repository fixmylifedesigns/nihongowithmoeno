/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      domains: ['*'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    // Add in for mobile 
    // output: "export",
    distDir: ".next",
    // distDir: 'out',
  };
  
  export default nextConfig;
  