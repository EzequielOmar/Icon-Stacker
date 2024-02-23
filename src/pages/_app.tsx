import "@/styles/globals.css";
import type { AppType, AppProps } from "next/app";

import SessionContext from "@/_contexts/sessionContext";
import trpc from "@/utils/trpc";

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionContext>
      <Component {...pageProps} />
    </SessionContext>
  );
};

export default trpc.withTRPC(App);
