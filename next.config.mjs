/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
              frame-src *;
              child-src *;
              connect-src * 'unsafe-inline';
              img-src * data: blob:;
              script-src * 'unsafe-inline' 'unsafe-eval';
              style-src * 'unsafe-inline';
            `.replace(/\s{2,}/g, " ").trim() // Ditambahkan .trim() agar lebih bersih
          }
        ]
      }
    ];
  }
};

export default nextConfig;