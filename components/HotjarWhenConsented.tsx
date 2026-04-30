'use client'

import { Suspense } from 'react'
import Script from 'next/script'
import HotjarRouteTracker from '@/components/HotjarRouteTracker'
import { HOTJAR_SITE_ID, HOTJAR_SV } from '@/lib/hotjarSite'

/**
 * Loads Hotjar only after the user accepts analytics. Include inline bootstrap + SPA route tracker.
 */
export default function HotjarWhenConsented() {
  return (
    <>
      <Script id="hotjar-tracking" strategy="afterInteractive">
        {`
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${HOTJAR_SITE_ID},hjsv:${HOTJAR_SV}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
      <Suspense fallback={null}>
        <HotjarRouteTracker />
      </Suspense>
    </>
  )
}
