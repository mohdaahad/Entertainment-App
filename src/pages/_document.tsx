import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#343434" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
