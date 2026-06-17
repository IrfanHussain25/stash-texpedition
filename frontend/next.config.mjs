// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: false, // Enabled in dev so PWA can be installed on phone for testing Web Share Target
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Ngrok URLs in development mode so you can test on your phone
  allowedDevOrigins: [
    "0239-2405-201-8013-923e-8194-1e47-a37e-2647.ngrok-free.app",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
    "http://http://13.207.27.168"
  ],
  // This explicitly silences the Next 16 Turbopack error
  turbopack: {}
};

export default withPWA(nextConfig);