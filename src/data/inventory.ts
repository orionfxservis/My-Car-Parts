export type ToolCategory = 'cars' | 'generators' | 'machinery';

export interface ToolSpec {
  label: string;
  value: string;
}

export interface ToolItem {
  id: string;
  sku: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  price: number;
  availability: 'In Stock' | 'Built to Order';
  warranty: string;
  specs: ToolSpec[];
  applications: string[];
}

export interface CategoryCardData {
  id: ToolCategory;
  indexLabel: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  highlights: { label: string; value: string }[];
  ctaLabel: string;
}

export interface HeroSlideItem {
  id: string;
  toolId: string;
  categoryLabel: string;
  sku: string;
  title: string;
  specSummary: string;
  image: string;
}

export const CATEGORY_CARDS: CategoryCardData[] = [
  {
    id: 'cars',
    indexLabel: '01. Automotive Service',
    title: 'Car Parts',
    subtitle: 'Diagnostics, Torque & Chassis Calibration',
    description:
      'Precision chrome-vanadium hand tools, digital angle torque wrenches, and multi-protocol OBD-II telemetry analyzers engineered for modern combustion, hybrid, and EV drivetrains.',
    image: '/src/assets/images/hero_cars_tools_1795209688349.jpg',
    highlights: [
      { label: 'Torque Range', value: '10 – 450 Nm' },
      { label: 'Calibration Accuracy', value: '±1.5% CW / CCW' },
      { label: 'Service Protocols', value: 'CAN-FD / DoIP / J2534' },
    ],
    ctaLabel: 'Explore Car Parts',
  },
  {
    id: 'generators',
    indexLabel: '02. Power Generation',
    title: 'Generators Parts',
    subtitle: 'Load Banks, AVR Testing & Switchgear',
    description:
      'Industrial load bank analyzers, 1000V insulated switchgear maintenance chests, and digital governor calibration instruments built for prime and standby diesel generator fleets.',
    image: '/src/assets/images/hero_generator_systems_1795209690119.jpg',
    highlights: [
      { label: 'Load Capacity', value: '50 kW – 1,200 kW' },
      { label: 'Insulation Rating', value: 'IEC 60900 1000V' },
      { label: 'Frequency Precision', value: '50 / 60 Hz ±0.02%' },
    ],
    ctaLabel: 'Explore Generators Parts',
  },
  {
    id: 'machinery',
    indexLabel: '03. Earthmoving & Plant',
    title: 'Heavy Machinery Equipments',
    subtitle: 'Hydraulic Pullers & High-Torque Multipliers',
    description:
      'High-tonnage hydraulic track pin extractors, planetary torque multipliers, and excavator cylinder rebuild kits forged from heat-treated alloy steel for quarry and construction fleets.',
    image: '/src/assets/images/hero_heavy_machinery_1795209690346.jpg',
    highlights: [
      { label: 'Extraction Force', value: 'Up to 100 Ton' },
      { label: 'Torque Output', value: '4,200 – 8,500 Nm' },
      { label: 'Operating Pressure', value: '700 Bar / 10,000 PSI' },
    ],
    ctaLabel: 'Explore Heavy Machinery Equipments',
  },
];

export const HERO_INVENTORY_SLIDES: HeroSlideItem[] = [
  {
    id: 'slide-1',
    toolId: 'vk-car-torque',
    categoryLabel: 'Car Parts',
    sku: 'VK-AT-420',
    title: 'Digital Angle Torque & Cr-V Master Kit',
    specSummary: '10–340 Nm · ±1.5% NIST Traceable',
    image: '/src/assets/images/hero_cars_tools_1795209688349.jpg',
  },
  {
    id: 'slide-2',
    toolId: 'vk-gen-station',
    categoryLabel: 'Generators Parts',
    sku: 'VK-GN-880',
    title: 'Prime Power Switchgear & Diagnostic Bay',
    specSummary: '400V–1000V · Three-Phase Telemetry',
    image: '/src/assets/images/hero_generator_systems_1795209690119.jpg',
  },
  {
    id: 'slide-3',
    toolId: 'vk-hm-multiplier',
    categoryLabel: 'Heavy Machinery Equipments',
    sku: 'VK-HM-910',
    title: 'Planetary Hydraulic Torque Multiplier 4200 Nm',
    specSummary: '700 Bar · Excavator & Crusher Flanges',
    image: '/src/assets/images/hero_heavy_machinery_1795209690346.jpg',
  },
  {
    id: 'slide-4',
    toolId: 'vk-car-scanner',
    categoryLabel: 'Car Parts',
    sku: 'VK-AT-905',
    title: 'Rugged IP67 Bi-Directional Telemetry Tablet',
    specSummary: '4-Ch Oscilloscope · CAN-FD & DoIP',
    image: '/src/assets/images/tool_car_diagnostic_1795209690132.jpg',
  },
  {
    id: 'slide-5',
    toolId: 'vk-gen-loadbank',
    categoryLabel: 'Generators Parts',
    sku: 'VK-GN-500',
    title: 'LB-5000 Portable 50 kW Load Bank Analyzer',
    specSummary: 'L1/L2/L3 Balanced Step Load · 415V',
    image: '/src/assets/images/tool_generator_loadbank_1795209690561.jpg',
  },
  {
    id: 'slide-6',
    toolId: 'vk-hm-puller',
    categoryLabel: 'Heavy Machinery Equipments',
    sku: 'VK-HM-50T',
    title: '50-Ton Hydraulic Track Pin & Gear Puller',
    specSummary: 'Black-Oxide Alloy Jaw · Brass Gauge',
    image: '/src/assets/images/tool_hydraulic_puller_1795209689799.jpg',
  },
];

export const TOOL_INVENTORY: ToolItem[] = [
  {
    id: 'vk-car-torque',
    sku: 'VK-AT-420',
    name: 'Digital Angle Torque & Cr-V Master Kit',
    category: 'cars',
    categoryLabel: 'Car Parts',
    image: '/src/assets/images/hero_cars_tools_1795209688349.jpg',
    shortDesc:
      '72-tooth sealed ratchet head with backlit OLED angle readout and forged 6-point metric impact & chrome sockets.',
    fullDesc:
      'Built for precision cylinder head, flywheel, and suspension fastener sequences. Includes 1/2-inch digital torque-angle wrench, dual-scale preset alerts, and 28 chrome-vanadium sockets seated in oil-resistant high-density foam.',
    price: 890,
    availability: 'In Stock',
    warranty: '5-Year Calibration & Structural Warranty',
    specs: [
      { label: 'Torque Range', value: '10 – 340 Nm' },
      { label: 'Accuracy', value: '±1.5% CW / ±2.0% CCW' },
      { label: 'Drive Size', value: '1/2 in (12.7 mm)' },
      { label: 'Socket Set', value: '10 – 32 mm Cr-V 6-Pt' },
    ],
    applications: [
      'Engine cylinder head & main bearing cap torque-to-yield',
      'EV battery pack structural fastener verification',
      'Wheel hub, brake caliper, and axle nut calibration',
    ],
  },
  {
    id: 'vk-car-scanner',
    sku: 'VK-AT-905',
    name: 'Rugged IP67 Bi-Directional Telemetry Tablet',
    category: 'cars',
    categoryLabel: 'Car Parts',
    image: '/src/assets/images/tool_car_diagnostic_1795209690132.jpg',
    shortDesc:
      'Workshop-hardened vehicle diagnostic terminal with 4-channel oscilloscope, injector coding, and live CAN bus graphing.',
    fullDesc:
      'Engineered for master technicians handling European, Asian, and domestic passenger & light-commercial fleets. Features an anti-glare 10.1-inch screen, reinforced corner bumpers, and J2534 pass-through ECU programming support.',
    price: 2450,
    availability: 'In Stock',
    warranty: '3-Year Hardware + 2-Year Firmware Updates',
    specs: [
      { label: 'Protocols', value: 'CAN-FD, DoIP, J2534, ISO-15765' },
      { label: 'Ingress Rating', value: 'IP67 Dust & Oil Sealed' },
      { label: 'Oscilloscope', value: '4-Channel 20 MS/s' },
      { label: 'Battery Runtime', value: '11 Hours Continuous' },
    ],
    applications: [
      'Live fuel rail pressure & turbo actuator waveform analysis',
      'ABS bleeding, steering angle reset & DPF regeneration',
      'HV battery cell balancing diagnostics on hybrid/EV models',
    ],
  },
  {
    id: 'vk-car-caliper',
    sku: 'VK-AT-215',
    name: 'Machined Brake & Rotor Runout Alignment Kit',
    category: 'cars',
    categoryLabel: 'Car Parts',
    image: '/src/assets/images/hero_cars_tools_1795209688349.jpg',
    shortDesc:
      'Precision dial indicator assembly with magnetic articulated arm and digital vernier micrometer for brake and driveline service.',
    fullDesc:
      'Eliminates brake pulsation and premature bearing wear by measuring disc lateral runout and hub flange flatness down to 0.01 mm inside tight wheel wells.',
    price: 340,
    availability: 'In Stock',
    warranty: 'Lifetime Mechanical Warranty',
    specs: [
      { label: 'Resolution', value: '0.01 mm / 0.0005 in' },
      { label: 'Clamp Force', value: '80 kgf Switchable Magnet' },
      { label: 'Caliper Range', value: '0 – 150 mm Stainless' },
      { label: 'Case Weight', value: '2.4 kg' },
    ],
    applications: [
      'Brake rotor lateral runout inspection',
      'Wheel bearing end-play measurement',
      'Transmission flange & flywheel runout checks',
    ],
  },
  {
    id: 'vk-gen-loadbank',
    sku: 'VK-GN-500',
    name: 'LB-5000 Portable 50 kW Load Bank Analyzer',
    category: 'generators',
    categoryLabel: 'Generators Parts',
    image: '/src/assets/images/tool_generator_loadbank_1795209690561.jpg',
    shortDesc:
      'Three-phase resistive load bank with true-RMS digital metering, braided copper Camlock leads, and thermal runaway protection.',
    fullDesc:
      'Designed for scheduled wet-stacking prevention, AVR voltage droop testing, and commissioning of commercial standby and mobile diesel generators up to 480V three-phase.',
    price: 4680,
    availability: 'In Stock',
    warranty: '3-Year Industrial Power Warranty',
    specs: [
      { label: 'Rated Load', value: '50 kW Step-Selectable' },
      { label: 'Voltage Input', value: '208V / 400V / 480V 3-Ph' },
      { label: 'Frequency', value: '50 Hz / 60 Hz' },
      { label: 'Step Resolution', value: '1 kW / 2 kW / 5 kW / 10 kW' },
    ],
    applications: [
      'Diesel generator wet-stacking burn-off & thermal load testing',
      'Automatic Voltage Regulator (AVR) transient step-load response',
      'Standby power transfer switch commissioning',
    ],
  },
  {
    id: 'vk-gen-station',
    sku: 'VK-GN-880',
    name: '1000V Insulated Switchgear & AVR Service Chest',
    category: 'generators',
    categoryLabel: 'Generators Parts',
    image: '/src/assets/images/hero_generator_systems_1795209690119.jpg',
    shortDesc:
      '46-piece IEC 60900 certified insulated tool trolley with phase-rotation meter and true-RMS AC/DC clamp multimeter.',
    fullDesc:
      'Purpose-built for field engineers servicing prime power generator enclosures, parallel switchgear cabinets, and high-amperage busbars safely under live inspection conditions.',
    price: 1890,
    availability: 'In Stock',
    warranty: '5-Year Dielectric & Tool Warranty',
    specs: [
      { label: 'Dielectric Rating', value: '1000V AC / 1500V DC' },
      { label: 'Clamp Capacity', value: '1,000 A True-RMS' },
      { label: 'Certification', value: 'IEC 60900 / VDE 0682' },
      { label: 'Enclosure', value: 'Powder-Coated Steel Cart' },
    ],
    applications: [
      'Generator stator & exciter winding insulation diagnostics',
      'Busbar torque verification inside ATS panels',
      'Three-phase sequence & harmonic distortion verification',
    ],
  },
  {
    id: 'vk-gen-tach',
    sku: 'VK-GN-310',
    name: 'Governor Speed & Frequency Calibration Kit',
    category: 'generators',
    categoryLabel: 'Generators Parts',
    image: '/src/assets/images/tool_generator_loadbank_1795209690561.jpg',
    shortDesc:
      'Optical/magnetic pickup tachometer paired with harmonic clamp meter for precision diesel governor droop adjustment.',
    fullDesc:
      'Maintains strict 1500 / 1800 RPM synchronous speed on prime-mover diesel engines, preventing frequency drift during sudden utility load transfers.',
    price: 760,
    availability: 'In Stock',
    warranty: '3-Year Instrument Warranty',
    specs: [
      { label: 'RPM Range', value: '50 – 19,999 RPM' },
      { label: 'Frequency Accuracy', value: '±0.01 Hz' },
      { label: 'Sensor Type', value: 'Laser + Mag Pickup Probe' },
      { label: 'Data Logging', value: 'USB-C CSV Export' },
    ],
    applications: [
      'Electronic & mechanical governor droop tuning',
      'Parallel generator load-sharing synchronization',
      'Overspeed trip threshold verification',
    ],
  },
  {
    id: 'vk-hm-puller',
    sku: 'VK-HM-50T',
    name: '50-Ton Hydraulic Track Pin & Gear Puller',
    category: 'machinery',
    categoryLabel: 'Heavy Machinery Equipments',
    image: '/src/assets/images/tool_hydraulic_puller_1795209689799.jpg',
    shortDesc:
      'Forged black-oxide 3-jaw hydraulic puller with 700-bar dual-speed hand pump and glycerin-filled brass pressure gauge.',
    fullDesc:
      'Removes seized bulldozer sprockets, excavator swing bearings, and heavy shaft couplings safely without torch cutting or shock hammering.',
    price: 3250,
    availability: 'In Stock',
    warranty: '5-Year Hydraulic Seal & Forging Warranty',
    specs: [
      { label: 'Max Capacity', value: '50 Ton (490 kN)' },
      { label: 'Working Pressure', value: '700 Bar / 10,000 PSI' },
      { label: 'Max Spread', value: '520 mm' },
      { label: 'Stroke Length', value: '150 mm Spring Return' },
    ],
    applications: [
      'Excavator & dozer final drive sprocket extraction',
      'Crusher flywheel and main shaft bearing removal',
      'Mining haul truck wheel hub & kingpin service',
    ],
  },
  {
    id: 'vk-hm-multiplier',
    sku: 'VK-HM-910',
    name: 'Planetary Hydraulic Torque Multiplier 4200 Nm',
    category: 'machinery',
    categoryLabel: 'Heavy Machinery Equipments',
    image: '/src/assets/images/hero_heavy_machinery_1795209690346.jpg',
    shortDesc:
      'Continuous-rotation hydraulic torque head with reaction arm for excavator boom cylinders, slew rings, and structural bolts.',
    fullDesc:
      'Delivers repeatable high-torque bolting in tight crane and excavator undercarriage clearances with ±3% repeatability across M24 to M64 heavy hex fasteners.',
    price: 5490,
    availability: 'Built to Order',
    warranty: '3-Year Drivetrain & Housing Warranty',
    specs: [
      { label: 'Torque Output', value: '420 – 4,200 Nm' },
      { label: 'Square Drive', value: '1-1/2 in Heavy Impact' },
      { label: 'Repeatability', value: '±3.0% at 700 Bar' },
      { label: 'Tool Weight', value: '8.9 kg' },
    ],
    applications: [
      'Excavator hydraulic cylinder gland nut breakaway & torque',
      'Tower crane & wind-turbine slewing ring bolting',
      'Rock crusher jaw liner & frame assembly',
    ],
  },
  {
    id: 'vk-hm-gland',
    sku: 'VK-HM-640',
    name: 'Excavator Cylinder Seal & Gland Wrench System',
    category: 'machinery',
    categoryLabel: 'Heavy Machinery Equipments',
    image: '/src/assets/images/hero_heavy_machinery_1795209690346.jpg',
    shortDesc:
      'Adjustable heavy-duty pin spanner & hydraulic bench fixture kit for tearing down 80 mm to 260 mm hydraulic rams.',
    fullDesc:
      'Built from hardened 4140 chromoly steel to loosen high-torque piston locknuts and gland caps on boom, arm, and bucket hydraulic cylinders without marring chrome rods.',
    price: 1120,
    availability: 'In Stock',
    warranty: 'Lifetime Structural Forging Warranty',
    specs: [
      { label: 'Gland Capacity', value: '80 – 260 mm Diameter' },
      { label: 'Pin Diameters', value: '8 mm / 10 mm / 12 mm' },
      { label: 'Max Torque Load', value: '3,500 Nm' },
      { label: 'Alloy Grade', value: '4140 Heat-Treated Steel' },
    ],
    applications: [
      'Boom, stick, and bucket cylinder seal kit replacement',
      'Wheel loader steering & lift cylinder overhaul',
      'Hydraulic press ram packing maintenance',
    ],
  },
];

export const TECHNICAL_GUIDES = [
  {
    id: 'guide-torque',
    code: 'DOC-TRQ-2026',
    category: 'Car Parts',
    title: 'NIST Torque & Angle Calibration Procedure',
    summary: 'Step-by-step verification intervals, storage tension rules, and ±1.5% digital sensor zeroing.',
    pages: '14 Pages · PDF / Spec Brief',
  },
  {
    id: 'guide-loadbank',
    code: 'DOC-GEN-415V',
    category: 'Generators Parts',
    title: 'Commercial Generator Step-Load & AVR Sizing',
    summary: 'Three-phase Camlock wiring diagrams, wet-stacking burn-off schedules, and 50/60 Hz governor tuning.',
    pages: '22 Pages · Technical Manual',
  },
  {
    id: 'guide-hydraulic',
    code: 'DOC-HYD-700B',
    category: 'Heavy Machinery Equipments',
    title: '700-Bar Hydraulic Puller & Bolt Tension Safety',
    summary: 'Hose burst inspection checklists, jaw load symmetry limits, and 4200 Nm reaction-arm positioning.',
    pages: '18 Pages · Field Safety Spec',
  },
];
