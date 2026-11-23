export function CompanySection() {
  const standards = [
    {
      number: '01.',
      title: 'Drop-Forged Metallurgy & Heat Verification',
      detail:
        'Every high-torque multiplier, socket, and 50-ton hydraulic jaw undergoes ultrasonic flaw testing and Rockwell C hardness certification before shipment.',
    },
    {
      number: '02.',
      title: 'NIST-Traceable Calibration Certificates',
      detail:
        'Digital angle torque wrenches, load bank meters, and pressure gauges ship with serialized multi-point calibration certificates valid for OEM audits.',
    },
    {
      number: '03.',
      title: 'Rapid Fleet & Power Station Logistics',
      detail:
        'Regional depots maintain stock of mission-critical extraction kits and generator service chests for same-day air or ground freight dispatch.',
    },
  ];

  return (
    <section
      id="company"
      className="bg-[#0D1015] py-16 sm:py-20 border-b border-slate-800/70"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-medium text-amber-400 mb-2">
              About My Car Parts
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Built for workshops, power houses, and active job sites.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded in 2008, My Car Parts manufactures and calibrates heavy-duty service
              instruments for commercial automotive centers, standby diesel generator operators,
              and civil earthmoving contractors.
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Our engineering division bridges mechanical forging with digital telemetry—giving
              field technicians repeatable accuracy under extreme vibration, oil exposure, and
              high-voltage conditions.
            </p>
          </div>

          <div className="lg:col-span-7 divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
            {standards.map((item) => (
              <div key={item.number} className="py-5 first:pt-4 last:pb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  <span className="font-mono text-amber-400 mr-2.5 tabular-nums">
                    {item.number}
                  </span>
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-300 leading-relaxed pl-0 sm:pl-9">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
