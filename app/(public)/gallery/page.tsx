import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery" };

const FB_PAGE_URL = "https://www.facebook.com/share/18SaWHWbbc/";

export default function GalleryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-navy mb-2">Gallery & News</h1>
      <p className="text-muted mb-8">
        Follow us on Facebook for the latest photos, videos, and news from FOOTBALL WAGGA WAGGA.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facebook page embed */}
        <div className="md:col-span-2">
          <div
            className="fb-page"
            data-href={FB_PAGE_URL}
            data-tabs="timeline,photos"
            data-width="800"
            data-height="600"
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href={FB_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          View our Facebook Page
        </a>
      </div>

      {/* Facebook SDK */}
      <div id="fb-root" />
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
      />
    </div>
  );
}
