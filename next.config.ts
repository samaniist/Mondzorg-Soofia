import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/algemene-tandheelkunde/", destination: "/behandelingen/", statusCode: 301 },
      { source: "/maak-een-afspraak-2/", destination: "/maak-een-afspraak-1/", statusCode: 301 },
      { source: "/afspraak-maken/", destination: "/maak-een-afspraak-1/", statusCode: 301 },
      { source: "/en/algemene-tandheelkunde/", destination: "/en/behandelingen/", statusCode: 301 },
      { source: "/en/maak-een-afspraak-2/", destination: "/en/maak-een-afspraak-1/", statusCode: 301 },
      { source: "/en/afspraak-maken/", destination: "/en/maak-een-afspraak-1/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
