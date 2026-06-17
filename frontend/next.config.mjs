// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This explicitly silences the Next 16 Turbopack error
  turbopack: {}
};

export default withPWA(nextConfig);