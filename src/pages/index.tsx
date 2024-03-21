import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRedirectAuthenticated } from "@/hooks/useRedirect";
import Navbar from "@/components/NavBar";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useRedirectAuthenticated("/home");
  return (
    <>
      <Head>
        <title>Icon Stacker - Your Customizable Bookmark Application</title>
        <meta
          name="description"
          content="Icon Stacker is your customizable bookmark application, allowing you to organize and access your favorite links easily."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ecuelen" />
        <meta
          name="keywords"
          content="bookmark application, bookmark manager, bookmarks, bookmark storage"
        />
        <meta
          property="og:title"
          content="Icon Stacker - Your Customizable Bookmark Application"
        />
        <meta
          property="og:description"
          content="Icon Stacker is your customizable bookmark application, allowing you to organize and access your favorite links easily."
        />
        <meta property="og:type" content="website" />
        {/* Fill with domain for SEO*/}
        <meta property="og:url" content="{https://}" />
        <meta property="og:image" content="https://./og-image.jpg" />
        <meta property="og:image:alt" content="Icon Stacker Logo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@EzeOmarV" />
      </Head>
      <div className={classNames(inter.className, styles.main)}>
        <Navbar />
      </div>
    </>
  );
}
