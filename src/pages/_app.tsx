import "src/styles/globals.scss";
import type { AppProps } from "next/app";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { SessionProvider } from "next-auth/react";
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "src/server/_app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config() {
    const url =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.NEXT_PUBLIC_RAILWAY_STATIC_URL}/api/trpc`
        : "http://localhost:3000/api/trpc";
    return {
      url,
      headers: {
        "x-ssr": "1",
      },
    };
  },
})(MyApp);
