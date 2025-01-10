/*  @type { import('next').NextConfig } */
import path from "path";

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join("/styles", "styles")],
  },
  images: {
    domains: [
      "vandenbergcarclassic-wp.grandsolution.dev"
    
    ], // Add your image domains here
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      exclude: /node_modules/,
      use: {
        loader: "svg-react-loader",
      },
    });

    return config;
  },
};

export default nextConfig;
