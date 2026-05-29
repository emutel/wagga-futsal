import Image from "next/image";

export default function VenuesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-navy mb-2">Venues</h1>
      <p className="text-muted mb-10">Find your field on game day.</p>

      {/* Bolton Park */}
      <div className="mb-12">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-navy">Bolton Park</h2>
            <p className="text-muted text-sm">Cnr Bourke & Tompson Streets, Wagga Wagga NSW 2650</p>
          </div>
          <a
            href="https://maps.google.com/?q=Bolton+Park+Wagga+Wagga+NSW"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📍 Get Directions
          </a>
        </div>
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <Image
            src="/bolton-park-map.jpg"
            alt="Bolton Park field map showing fields 1-15, F4ALL and Senior field"
            width={1200}
            height={900}
            className="w-full object-contain"
          />
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted">Bolton Park has 15 numbered fields, F4ALL and a Senior field. Check your fixture for your assigned field number.</p>
          </div>
        </div>
      </div>

      {/* Duke of Kent */}
      <div className="mb-12">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-navy">Duke of Kent Park</h2>
            <p className="text-muted text-sm">Duke of Kent Drive, Wagga Wagga NSW 2650</p>
          </div>
          <a
            href="https://maps.google.com/?q=Duke+of+Kent+Park+Wagga+Wagga+NSW"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📍 Get Directions
          </a>
        </div>
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <Image
            src="/duke-of-kent-map.jpg"
            alt="Duke of Kent Park field map showing fields 1-6"
            width={1200}
            height={900}
            className="w-full object-contain"
          />
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted">Duke of Kent Park has 6 fields. Check your fixture for your assigned field number.</p>
          </div>
        </div>
      </div>

      {/* Away venues */}
      <div>
        <h2 className="text-2xl font-black text-navy mb-4">Away Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Bull Paddock, Tumut", address: "Tumut NSW", q: "Bull+Paddock+Tumut+NSW" },
            { name: "Burns Park, Junee", address: "Junee NSW", q: "Burns+Park+Junee+NSW" },
          ].map((v) => (
            <div key={v.name} className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-navy">{v.name}</p>
                <p className="text-muted text-xs">{v.address}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${v.q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand text-sm font-semibold hover:underline shrink-0"
              >
                📍 Directions
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
