import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script id="remove-extra-attributes" strategy="afterInteractive">
          {`
            document.body.removeAttribute('data-new-gr-c-s-check-loaded');
            document.body.removeAttribute('data-gr-ext-installed');
          `}
        </Script>
      </body>
    </Html>
  )
}