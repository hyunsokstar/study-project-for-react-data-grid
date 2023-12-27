// /** @type {import('next').NextConfig} */

// const nextConfig = {}

// module.exports = nextConfig

// next.config.js
const withLinaria = require('next-with-linaria');

/** @type {import('next-with-linaria').LinariaConfig} */
const config = {
    // ...your next.js config
};
module.exports = withLinaria(config);