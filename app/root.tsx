// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation, // Import useLocation
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useEffect } from "react"; // Import useEffect

import "./tailwind.css";

// --- GTM Configuration ---
const GTM_ID = 'GTM-KF9G33NL'; // Replace with your GTM ID
// -------------------------

declare global {
  interface Window {
    dataLayer?: any[];
    // You can keep gtag declaration if you have a global gtag helper,
    // but primarily GTM will use dataLayer.
    gtag?: (...args: any[]) => void;
  }
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous", // "anonymous" is the correct value
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation(); // For page_view tracking

  useEffect(() => {
    // Initialize GTM
    if (typeof window !== 'undefined' && GTM_ID) {
      window.dataLayer = window.dataLayer || [];
      // Check if GTM script is already added to prevent duplicates
      if (!document.getElementById('gtm-script-loader')) {
        const gtmScript = document.createElement('script');
        gtmScript.id = 'gtm-script-loader';
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `;
        document.head.appendChild(gtmScript);
      }
    }
  }, []); // Runs once on initial app load

  // Send page_view events to GTM's dataLayer on route changes
  // GTM can be configured to listen for these or use its own history change trigger.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer && GTM_ID) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title, // Ensure Meta component updates title effectively
      });
    }
  }, [location]); // Re-runs when location changes

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* GTM script will be injected here by the useEffect above */}
      </head>
      <body>
        {/* GTM NoScript - Should be right after the opening <body> tag */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // The Layout component now wraps the Outlet implicitly
  // because Outlet is rendered as children of Layout via the main Remix render path.
  // No, the default App component just returns Outlet. The Layout is defined
  // in the route hierarchy.
  // To ensure Layout wraps everything, it's typically the default export of root.tsx
  // or used explicitly in the routes.
  // Given your previous structure, let's assume Remix handles this correctly
  // where App's <Outlet/> is rendered within the Layout.
  // For clarity and explicitness, it's common to see:
  // return <Layout><Outlet /></Layout>; if App is the root component.
  // However, Remix's convention is that root.tsx's default export IS the layout.
  // So your structure should be:
  // export default function App() { return <Layout><Outlet /></Layout>; }
  // OR, more commonly, the Layout component itself is the default export.

  // Let's adjust to the common Remix pattern where the Layout IS the root component.
  // If your 'Layout' function is intended to be the root layout,
  // it should be the default export or surround the Outlet in the default App export.

  // Assuming your intention is that `Layout` is the main layout for all routes:
  return <Outlet />; // This implies that `Layout` is used by Remix as the root layout for the Outlet.
                     // If Layout is not the default export, this might not wrap all pages.
                     // Let's simplify and make Layout the component that includes the Outlet.
}

// To make it clear and standard:
// Rename your current Layout to Document (or keep as Layout)
// and make App the component that uses it.

/*
  A more standard Remix `root.tsx` pattern would be:

  export default function App() { // App is the root component that renders the document structure
    const location = useLocation();

    useEffect(() => {
      // GTM script injection logic as shown in the Layout component above
      if (typeof window !== 'undefined' && GTM_ID) {
        window.dataLayer = window.dataLayer || [];
        if (!document.getElementById('gtm-script-loader')) {
          const gtmScript = document.createElement('script');
          gtmScript.id = 'gtm-script-loader';
          gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
          document.head.appendChild(gtmScript);
        }
      }
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.dataLayer && GTM_ID) {
        window.dataLayer.push({
          event: 'page_view',
          page_path: location.pathname + location.search,
          // ... other params
        });
      }
    }, [location]);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          {GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
          )}
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
*/

// Let's stick to modifying your existing structure cleanly.
// Your `Layout` component is where the GTM code should go.
// Your `App` component remains as is, and Remix will render the routes via `<Outlet />`
// within the `Layout` you've defined (assuming `Layout` is correctly used as the top-level layout component for your routes).
// If `Layout` is not the default export, you might need to ensure it's used in your route definitions
// or make it the default export.

// For now, the GTM code added to your `Layout` component is the key.