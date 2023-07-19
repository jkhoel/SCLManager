/** @type {import('next').NextConfig} */

const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  reactStrictMode: true,
  // Note: This feature is required to use NextJS Image in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
  },
  // "next export" is deprecated and replaced with an entry here. See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports for mor information
  output: "export",
};
