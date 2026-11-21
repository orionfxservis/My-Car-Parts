import heroCarsToolsImg from '../assets/images/hero_cars_tools_1795209688349.jpg';
import heroGeneratorSystemsImg from '../assets/images/hero_generator_systems_1795209690119.jpg';
import heroHeavyMachineryImg from '../assets/images/hero_heavy_machinery_1795209690346.jpg';
import toolCarDiagnosticImg from '../assets/images/tool_car_diagnostic_1795209690132.jpg';
import toolGeneratorLoadbankImg from '../assets/images/tool_generator_loadbank_1795209690561.jpg';
import toolHydraulicPullerImg from '../assets/images/tool_hydraulic_puller_1795209689799.jpg';

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
    indexLabel: '01. Automotive Parts & Service',
    title: 'Car Spare Parts',
    subtitle: 'Engine, Brake, Filter & Suspension Components',
    description:
      'Quality car spare parts and automotive components stocked for workshops and fleet operators—covering engine spare parts, brake pads and filters, car suspension parts, and diagnostic torque tools suited for Toyota, Honda, Suzuki, and multi-brand passenger vehicles.',
    image: heroCarsToolsImg,
    highlights: [
      { label: 'Core Parts', value: 'Engine, Brakes & Suspension' },
      { label: 'Popular Makes', value: 'Toyota · Honda · Suzuki' },
      { label: 'Workshop Support', value: 'CAN-FD / Torque Calibrated' },
    ],
    ctaLabel: 'Explore Car Spare Parts',
  },
  {
    id: 'generators',
    indexLabel: '02. Power Generation Parts',
    title: 'Generator Spare Parts',
    subtitle: 'Diesel Engine, Alternator & Maintenance Parts',
    description:
      'Dependable diesel generator parts, generator engine parts, alternator spare parts, AVR controllers, and generator accessories built for prime and standby sets—supporting routine generator maintenance parts and commissioning for Perkins and Cummins power units.',
    image: heroGeneratorSystemsImg,
    highlights: [
      { label: 'Core Parts', value: 'Engine, Alternator & AVR' },
      { label: 'Supported Sets', value: 'Perkins · Cummins · Standby' },
      { label: 'Load Testing', value: '50 kW – 1,200 kW · 50/60 Hz' },
    ],
    ctaLabel: 'Explore Generator Spare Parts',
  },
  {
    id: 'machinery',
    indexLabel: '03. Earthmoving & Plant',
    title: 'Heavy Machinery Parts',
    subtitle: 'Excavator, Hydraulic & Industrial Components',
    description:
      'Heavy machinery spare parts, excavator spare parts, hydraulic spare parts, and industrial equipment components engineered for demanding sites—supporting routine overhauls on Caterpillar, Komatsu, and JCB construction machinery with high-tonnage extraction tooling.',
    image: heroHeavyMachineryImg,
    highlights: [
      { label: 'Core Parts', value: 'Hydraulics, Seals & Undercarriage' },
      { label: 'Fleet Coverage', value: 'Caterpillar · Komatsu · JCB' },
      { label: 'Hydraulic Rating', value: '700 Bar / Up to 100 Ton' },
    ],
    ctaLabel: 'Explore Heavy Machinery Parts',
  },
];

export const HERO_INVENTORY_SLIDES: HeroSlideItem[] = [
  {
    id: 'slide-1',
    toolId: 'vk-car-torque',
    categoryLabel: 'Car Spare Parts',
    sku: 'VK-AT-420',
    title: 'Digital Angle Torque & Cr-V Master Kit',
    specSummary: '10–340 Nm · ±1.5% NIST Traceable',
    image: heroCarsToolsImg,
  },
  {
    id: 'slide-2',
    toolId: 'vk-gen-station',
    categoryLabel: 'Generator Spare Parts',
    sku: 'VK-GN-880',
    title: 'Prime Power Switchgear & Diagnostic Bay',
    specSummary: '400V–1000V · Three-Phase Telemetry',
    image: heroGeneratorSystemsImg,
  },
  {
    id: 'slide-3',
    toolId: 'vk-hm-multiplier',
    categoryLabel: 'Heavy Machinery Parts',
    sku: 'VK-HM-910',
    title: 'Planetary Hydraulic Torque Multiplier 4200 Nm',
    specSummary: '700 Bar · Excavator & Crusher Flanges',
    image: heroHeavyMachineryImg,
  },
  {
    id: 'slide-4',
    toolId: 'vk-car-scanner',
    categoryLabel: 'Car Spare Parts',
    sku: 'VK-AT-905',
    title: 'Rugged IP67 Bi-Directional Telemetry Tablet',
    specSummary: '4-Ch Oscilloscope · CAN-FD & DoIP',
    image: toolCarDiagnosticImg,
  },
  {
    id: 'slide-5',
    toolId: 'vk-gen-loadbank',
    categoryLabel: 'Generator Spare Parts',
    sku: 'VK-GN-500',
    title: 'LB-5000 Portable 50 kW Load Bank Analyzer',
    specSummary: 'L1/L2/L3 Balanced Step Load · 415V',
    image: toolGeneratorLoadbankImg,
  },
  {
    id: 'slide-6',
    toolId: 'vk-hm-puller',
    categoryLabel: 'Heavy Machinery Parts',
    sku: 'VK-HM-50T',
    title: '50-Ton Hydraulic Track Pin & Gear Puller',
    specSummary: 'Black-Oxide Alloy Jaw · Brass Gauge',
    image: toolHydraulicPullerImg,
  },
];

export const TOOL_INVENTORY: ToolItem[] = [
  {
    id: 'vk-car-torque',
    sku: 'VK-AT-420',
    name: 'Digital Angle Torque & Cr-V Master Kit',
    category: 'cars',
    categoryLabel: 'Car Spare Parts',
    image: heroCarsToolsImg,
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
      'Engine spare parts: cylinder head & main bearing cap torque-to-yield',
      'Toyota, Honda & Suzuki passenger and fleet drivetrain assembly',
      'Wheel hub, brake pads, suspension bolts & axle nut calibration',
    ],
  },
  {
    id: 'vk-car-scanner',
    sku: 'VK-AT-905',
    name: 'Rugged IP67 Bi-Directional Telemetry Tablet',
    category: 'cars',
    categoryLabel: 'Car Spare Parts',
    image: toolCarDiagnosticImg,
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
    categoryLabel: 'Car Spare Parts',
    image: heroCarsToolsImg,
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
      'Brake pads, rotor lateral runout & filter service inspection',
      'Car suspension parts, wheel bearing end-play & hub alignment',
      'Toyota, Honda & Suzuki transmission flange runout checks',
    ],
  },
  {
    id: 'vk-gen-loadbank',
    sku: 'VK-GN-500',
    name: 'LB-5000 Portable 50 kW Load Bank Analyzer',
    category: 'generators',
    categoryLabel: 'Generator Spare Parts',
    image: toolGeneratorLoadbankImg,
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
    categoryLabel: 'Generator Spare Parts',
    image: heroGeneratorSystemsImg,
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
      'Perkins & Cummins diesel generator stator and alternator testing',
      'Generator accessories, AVR diagnostics & ATS busbar torque verification',
      'Three-phase sequence & generator maintenance parts commissioning',
    ],
  },
  {
    id: 'vk-gen-tach',
    sku: 'VK-GN-310',
    name: 'Governor Speed & Frequency Calibration Kit',
    category: 'generators',
    categoryLabel: 'Generator Spare Parts',
    image: toolGeneratorLoadbankImg,
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
    categoryLabel: 'Heavy Machinery Parts',
    image: toolHydraulicPullerImg,
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
      'Caterpillar, Komatsu & JCB excavator final drive sprocket extraction',
      'Heavy machinery spare parts & crusher main shaft bearing removal',
      'Construction machinery wheel hub, track pin & kingpin service',
    ],
  },
  {
    id: 'vk-hm-multiplier',
    sku: 'VK-HM-910',
    name: 'Planetary Hydraulic Torque Multiplier 4200 Nm',
    category: 'machinery',
    categoryLabel: 'Heavy Machinery Parts',
    image: heroHeavyMachineryImg,
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
    categoryLabel: 'Heavy Machinery Parts',
    image: heroHeavyMachineryImg,
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
      'Caterpillar, Komatsu & JCB excavator boom & stick hydraulic seal replacement',
      'Wheel loader hydraulic spare parts & lift cylinder overhaul',
      'Construction machinery & industrial equipment ram packing service',
    ],
  },
];

export const TECHNICAL_GUIDES = [
  {
    id: 'guide-torque',
    code: 'DOC-TRQ-2026',
    category: 'Car Spare Parts',
    title: 'NIST Torque & Angle Calibration Procedure',
    summary: 'Step-by-step verification intervals, storage tension rules, and ±1.5% digital sensor zeroing.',
    pages: '14 Pages · PDF / Spec Brief',
  },
  {
    id: 'guide-loadbank',
    code: 'DOC-GEN-415V',
    category: 'Generator Spare Parts',
    title: 'Commercial Generator Step-Load & AVR Sizing',
    summary: 'Three-phase Camlock wiring diagrams, wet-stacking burn-off schedules, and 50/60 Hz governor tuning.',
    pages: '22 Pages · Technical Manual',
  },
  {
    id: 'guide-hydraulic',
    code: 'DOC-HYD-700B',
    category: 'Heavy Machinery Parts',
    title: '700-Bar Hydraulic Puller & Bolt Tension Safety',
    summary: 'Hose burst inspection checklists, jaw load symmetry limits, and 4200 Nm reaction-arm positioning.',
    pages: '18 Pages · Field Safety Spec',
  },
];
