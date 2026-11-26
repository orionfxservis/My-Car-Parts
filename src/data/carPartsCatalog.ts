import bodyImg from '../assets/images/car_part_body_1795444721300.jpg';
import brakeImg from '../assets/images/car_part_brake_1795444722508.jpg';
import coolingImg from '../assets/images/car_part_cooling_1795444720295.jpg';
import electricImg from '../assets/images/car_part_electric_1795444721671.jpg';
import engineImg from '../assets/images/car_part_engine_1795444721481.jpg';
import exhaustImg from '../assets/images/car_part_exhaust_1795444721745.jpg';
import filtersImg from '../assets/images/car_part_filters_1795444720085.jpg';
import fuelImg from '../assets/images/car_part_fuel_1795444721569.jpg';
import heatingImg from '../assets/images/car_part_heating_1795444719996.jpg';
import lightingImg from '../assets/images/car_part_lighting_1795444720197.jpg';
import steeringImg from '../assets/images/car_part_steering_1795444721062.jpg';
import suspensionImg from '../assets/images/car_part_suspension_1795444719350.jpg';
import transmissionImg from '../assets/images/car_part_transmission_1795444721270.jpg';
import wipersImg from '../assets/images/car_part_wipers_1795444721247.jpg';
import toolCarDiagnosticImg from '../assets/images/tool_car_diagnostic_1795209690132.jpg';
import heroCarsToolsImg from '../assets/images/hero_cars_tools_1795209688349.jpg';
import bannerReturnsImg from '../assets/images/banner_car_returns_1795445081176.jpg';
import bannerShippingImg from '../assets/images/banner_car_shipping_1795445081504.jpg';
import bannerFitmentImg from '../assets/images/banner_car_fitment_1795445081707.jpg';
import bannerWorkshopImg from '../assets/images/banner_car_workshop_1795445081292.jpg';

export type CarCatalogTabId = string;

export interface CarCatalogTab {
  id: CarCatalogTabId;
  label: string;
}

export interface CarMakeEntry {
  id: string;
  brand: string;
  models: string[];
}

export interface CarSubCategoryItem {
  id: string;
  tab: CarCatalogTabId;
  title: string;
  image?: string;
  images?: string[];
  iconKey?:
    | 'droplets'
    | 'gauge'
    | 'battery'
    | 'sparkles'
    | 'wrench'
    | 'shield'
    | 'cog';
  summary: string;
  components: string[];
  brand?: string;
  sku?: string;
  price?: number;
  availability?: string;
  compatibility?: string;
  warranty?: string;
}

export const CAR_CATALOG_TABS: CarCatalogTab[] = [
  { id: 'car-parts', label: 'Car parts' },
  { id: 'oils-fluids', label: 'Oils and fluids' },
  { id: 'accessories', label: 'Accessories and equipment' },
  { id: 'tools', label: 'Tools' },
];

export const CAR_MAKES_DIRECTORY: CarMakeEntry[] = [
  {
    id: 'toyota',
    brand: 'Toyota',
    models: [
      'Corolla & Altis',
      'Yaris',
      'Corolla Cross',
      'Raize',
      'Fortuner',
      'Hilux / Vigo / Revo',
      'Hilux Surf',
      'Land Cruiser',
      'Land Cruiser Prado',
      'FJ Cruiser',
      'Vitz',
      'Passo',
      'Aqua',
      'Prius',
      'Prius Alpha',
      'Belta',
      'Platz',
      'Premio',
      'Axio',
      'Fielder',
      'C-HR',
      'Mark X',
      'Probox',
      'Rush',
      'Camry',
      'iQ',
    ],
  },
  {
    id: 'honda',
    brand: 'Honda',
    models: [
      'Civic',
      'City',
      'Accord',
      'Vezel',
      'HR-V',
      'BR-V',
      'Fit',
      'Jazz',
      'Freed',
      'Insight',
      'CR-Z',
      'N-Box',
      'N-One',
      'N-Wgn',
      'Crossroad',
      'Life',
      'Airwave',
      'Elysion',
      'Element',
      'Vamos',
    ],
  },
  {
    id: 'suzuki',
    brand: 'Suzuki',
    models: [
      'Alto (PKDM & JDM)',
      'Cultus',
      'Wagon R',
      'Swift',
      'Mehran',
      'Bolan',
      'Every',
      'Ravi',
      'Ciaz',
      'Liana',
      'Baleno',
      'Vitara',
      'Fronx',
      'Xbee',
      'Khyber',
      'Kizashi',
      'Alto Lapin',
      'Alto Works',
      'MR Wagon',
    ],
  },
  {
    id: 'hyundai',
    brand: 'Hyundai',
    models: [
      'Elantra',
      'Tucson',
      'Santa Fe',
      'Sonata',
      'Santro',
      'Grand Starex',
      'Ioniq',
    ],
  },
  {
    id: 'kia',
    brand: 'Kia',
    models: [
      'Sportage',
      'Stonic',
      'Sorento',
      'Picanto',
      'Grand Carnival',
      'Cerato',
    ],
  },
  {
    id: 'daihatsu',
    brand: 'Daihatsu',
    models: [
      'Mira',
      'Cuore',
      'Hijet',
      'Move',
      'Boon',
      'Cast',
      'Tanto',
      'Charade',
      'Copen',
    ],
  },
  {
    id: 'mitsubishi',
    brand: 'Mitsubishi',
    models: [
      'Lancer',
      'eK Wagon',
      'Mirage',
      'Minicab',
      'Pajero Mini',
    ],
  },
  {
    id: 'nissan',
    brand: 'Nissan',
    models: [
      'Dayz',
      'Note',
      'AD Expert',
      'Clipper',
      'Juke',
      'Moco',
      'Wingroad',
    ],
  },
  {
    id: 'changan',
    brand: 'Changan',
    models: ['Alsvin', 'Karvaan', 'Oshan X7'],
  },
  {
    id: 'haval',
    brand: 'Haval',
    models: ['Haval H6', 'Haval H6 PHEV', 'Haval Jolion', 'GWM Haval Truck'],
  },
  {
    id: 'deepal',
    brand: 'Deepal',
    models: ['Deepal S05', 'Deepal S07', 'Deepal L07'],
  },
  {
    id: 'chery',
    brand: 'Chery',
    models: ['Tiggo 9', 'Chery QQ'],
  },
  {
    id: 'mg',
    brand: 'MG',
    models: ['MG HS', 'MG HS PHEV', 'MG ZS', 'MG ZS EV'],
  },
  {
    id: 'jaecoo',
    brand: 'Jaecoo',
    models: ['Jaecoo J5', 'Jaecoo J6', 'Jaecoo J7'],
  },
  {
    id: 'jetour',
    brand: 'Jetour',
    models: ['Jetour X70 Plus', 'Jetour Dashing'],
  },
  {
    id: 'faw',
    brand: 'FAW',
    models: ['FAW V2', 'FAW XPV'],
  },
  {
    id: 'dfsk',
    brand: 'DFSK',
    models: ['DFSK Glory 580', 'DFSK K07'],
  },
  {
    id: 'lexus',
    brand: 'Lexus',
    models: [
      'CT200h',
      'ES300h',
      'HS250h',
      'IS Series',
      'GS Series',
      'LS Series',
      'NX Series',
      'RX Series',
      'LX Series',
    ],
  },
  {
    id: 'other-models',
    brand: 'Other Models',
    models: [
      'Mercedes-Benz (C / E / S / G Class)',
      'Audi (A3 / A4 / A5 / A6 / Q3 / Q5 / Q7)',
      'BMW (X3 / X4 / X5 Series)',
      'Isuzu D-Max',
      'Proton Saga',
      'Proton X70',
      'BYD Atto 2 / Atto 3 / Seal / Shark',
      'Peugeot 2008',
      'JAC T9',
      'Omoda E5',
      'Mazda Carol',
      'Ford F-150',
      'Land Rover Discovery 4',
    ],
  },
];

export const CAR_CATALOG_ITEMS: CarSubCategoryItem[] = [
  // Tab 1: Car parts (Exact 14 categories matching reference layout)
  {
    id: 'brake-system',
    tab: 'car-parts',
    title: 'Brake system',
    image: brakeImg,
    summary:
      'Service-grade friction, hydraulic actuation, and ventilated rotor components matched by VIN or OEM caliper code.',
    components: [
      'Ceramic & semi-metallic brake pad sets',
      'Ventilated, solid & cross-drilled brake discs',
      'Brake calipers, repair seal kits & guide pins',
      'Master cylinders, brake boosters & ABS sensors',
      'Braided & EPDM rubber brake hoses',
    ],
  },
  {
    id: 'filters',
    tab: 'car-parts',
    title: 'Filters',
    image: filtersImg,
    summary:
      'Engine oil, intake air, fuel injection, and activated-carbon cabin filtration for routine vehicle servicing.',
    components: [
      'Spin-on & cartridge engine oil filters',
      'Pleated panel & cylindrical engine air filters',
      'Inline & high-pressure diesel/petrol fuel filters',
      'Standard & activated-carbon cabin pollen filters',
      'Automatic & CVT transmission sump filters',
    ],
  },
  {
    id: 'suspension',
    tab: 'car-parts',
    title: 'Suspension',
    image: suspensionImg,
    summary:
      'Ride control dampers, structural control arms, ball joints, and wheel hub bearings built for road and fleet durability.',
    components: [
      'Gas & oil shock absorbers and strut assemblies',
      'Coil springs, strut mounts & bump stops',
      'Lower & upper control arms and stabilizer links',
      'Wheel hub bearings & suspension bushings',
    ],
  },
  {
    id: 'steering',
    tab: 'car-parts',
    title: 'Steering',
    image: steeringImg,
    summary:
      'Hydraulic and electric rack-and-pinion gears, tie rods, and power steering pumps verified by chassis code.',
    components: [
      'Steering rack and pinion assemblies & bellows',
      'Inner axial joints & outer tie rod ends',
      'Hydraulic power steering pumps & pressure hoses',
      'Steering column couplings & idler/pitman arms',
    ],
  },
  {
    id: 'wipers-washers',
    tab: 'car-parts',
    title: 'Wipers and washers',
    image: wipersImg,
    summary:
      'All-weather flat beam wiper blades, linkage assemblies, and high-flow windshield washer pumps.',
    components: [
      'Flat beam & hybrid front/rear wiper blades',
      'Windshield & headlamp washer pumps',
      'Wiper arms, linkages & drive motors',
      'Washer spray nozzles & fluid reservoirs',
    ],
  },
  {
    id: 'engine-parts',
    tab: 'car-parts',
    title: 'Engine parts',
    image: engineImg,
    summary:
      'Internal engine rebuild components, timing drive kits, cylinder head gaskets, and belt drive tensioners.',
    components: [
      'Timing belts, timing chains, tensioners & guides',
      'Cylinder head gaskets, valve stem seals & overhaul sets',
      'Pistons, piston rings, main & connecting rod bearings',
      'Serpentine drive belts, pulleys & engine mounts',
    ],
  },
  {
    id: 'fuel-system',
    tab: 'car-parts',
    title: 'Fuel system',
    image: fuelImg,
    summary:
      'In-tank electric fuel modules, common-rail high-pressure pumps, injectors, and pressure regulators.',
    components: [
      'In-tank & inline electric fuel feed pumps',
      'Fuel injectors, rail pressure sensors & regulators',
      'Throttle bodies & air-fuel mass flow sensors',
      'Fuel tank sender units & return lines',
    ],
  },
  {
    id: 'exhaust-system',
    tab: 'car-parts',
    title: 'Exhaust system',
    image: exhaustImg,
    summary:
      'Silencers, catalytic assemblies, exhaust manifold gaskets, lambda oxygen sensors, and mounting clamps.',
    components: [
      'Rear mufflers, center resonators & flex pipes',
      'Upstream & downstream oxygen (Lambda) sensors',
      'Exhaust manifold gaskets, studs & hangers',
      'EGR valves & DPF differential pressure sensors',
    ],
  },
  {
    id: 'electric-system',
    tab: 'car-parts',
    title: 'Electric system',
    image: electricImg,
    summary:
      'Starting and charging units, ignition coils, relays, and drivetrain sensors verified by part number.',
    components: [
      '12V starter motors, solenoids & drive pinions',
      'Alternators, voltage regulators & freewheel pulleys',
      'Ignition coils, spark plugs & crankshaft sensors',
      'Relays, fuse blocks & battery terminal harnesses',
    ],
  },
  {
    id: 'engine-cooling',
    tab: 'car-parts',
    title: 'Engine cooling',
    image: coolingImg,
    summary:
      'Thermal management radiators, mechanical and electric water pumps, thermostats, and cooling fans.',
    components: [
      'Aluminum engine cooling radiators & caps',
      'Water pumps, housings & thermostat assemblies',
      'Silicone & molded EPDM upper/lower radiator hoses',
      'Electric radiator cooling fans & fan clutches',
    ],
  },
  {
    id: 'heating-ventilation',
    tab: 'car-parts',
    title: 'Heating and ventilation',
    image: heatingImg,
    summary:
      'Cabin HVAC heater cores, A/C compressors, condensers, expansion valves, and blower motors.',
    components: [
      'Cabin heater cores & A/C evaporator coils',
      'A/C compressors, magnetic clutches & condensers',
      'Blower fan motors & resistor speed modules',
      'Receiver driers & thermal expansion valves',
    ],
  },
  {
    id: 'transmission-clutch',
    tab: 'car-parts',
    title: 'Transmission and clutch',
    image: transmissionImg,
    summary:
      'Clutch pressure plates, dual-mass flywheels, release bearings, CV joints, and gearbox seals.',
    components: [
      'Clutch kits (disc, pressure plate & release bearing)',
      'Single & dual-mass flywheels and slave cylinders',
      'CV joints, drive axles & prop-shaft center bearings',
      'Gearbox input/output seals & shift linkage cables',
    ],
  },
  {
    id: 'body-interior',
    tab: 'car-parts',
    title: 'Body and interior',
    image: bodyImg,
    summary:
      'Replacement sheet-metal panels, bumpers, mirrors, window regulators, and cabin trim latches.',
    components: [
      'Front fenders, hoods, bumpers & grille trims',
      'Side view mirrors, mirror glass & door handles',
      'Power window regulators, motors & tailgate struts',
      'Splash shields, wheel arch liners & retaining clips',
    ],
  },
  {
    id: 'lighting',
    tab: 'car-parts',
    title: 'Lighting',
    image: lightingImg,
    summary:
      'OEM-fit halogen, projector, and LED headlamp assemblies, tail lamps, fog lights, and bulbs.',
    components: [
      'Left & right front headlight assemblies',
      'Rear tail lamp clusters & high-mount brake lights',
      'Bumper fog lamps, turn signals & side repeaters',
      'Halogen, HID xenon & LED replacement bulbs',
    ],
  },

  // Tab 2: Oils and fluids
  {
    id: 'engine-oil',
    tab: 'oils-fluids',
    title: 'Engine oil',
    iconKey: 'droplets',
    summary:
      'API SP / ACEA C3 full-synthetic, semi-synthetic, and heavy-duty diesel motor oils in 1L, 4L, and workshop drums.',
    components: [
      '0W-20 & 5W-30 full-synthetic passenger oils',
      '5W-40 & 10W-40 high-mileage synthetic blends',
      '15W-40 & 10W-30 commercial diesel engine oils',
    ],
  },
  {
    id: 'transmission-oil',
    tab: 'oils-fluids',
    title: 'Transmission & gear oil',
    iconKey: 'cog',
    summary:
      'Automatic ATF, CVT, dual-clutch DCT, and hypoid differential gear lubricants matched to OEM fluid specs.',
    components: [
      'ATF WS / Dexron VI automatic fluids',
      'CVT & DCT specialty transmission fluids',
      '75W-90 & 80W-90 GL-5 differential oils',
    ],
  },
  {
    id: 'brake-fluid',
    tab: 'oils-fluids',
    title: 'Brake & clutch fluids',
    iconKey: 'gauge',
    summary:
      'High-boiling-point DOT 3, DOT 4, and DOT 5.1 glycol hydraulic fluids safe for ABS/ESP valves.',
    components: [
      'DOT 4 & DOT 4 LV (Low Viscosity ABS/ESP)',
      'DOT 3 standard hydraulic brake fluids',
      'DOT 5.1 heavy-duty thermal brake fluids',
    ],
  },
  {
    id: 'coolant-antifreeze',
    tab: 'oils-fluids',
    title: 'Coolant & antifreeze',
    iconKey: 'droplets',
    summary:
      'Silicate-free OAT/HOAT concentrates and premixed 50/50 coolants preventing aluminum corrosion and scale.',
    components: [
      'Long-life OAT red/pink & blue premix coolants',
      'Concentrated ethylene-glycol radiator antifreeze',
      'Deionized coolant flush & radiator seal treatments',
    ],
  },
  {
    id: 'steering-hydraulic',
    tab: 'oils-fluids',
    title: 'Power steering fluid',
    iconKey: 'cog',
    summary:
      'Hydraulic steering and central suspension fluids formulated for cold-start pump protection.',
    components: [
      'CHF 11S synthetic hydraulic steering fluid',
      'Conventional PSF & Dexron-compatible fluids',
    ],
  },
  {
    id: 'washer-additives',
    tab: 'oils-fluids',
    title: 'Washer & fuel additives',
    iconKey: 'sparkles',
    summary:
      'Windshield screenwash concentrates, diesel cetane boosters, and fuel injector system cleaners.',
    components: [
      'All-season windshield washer concentrate',
      'Petrol & common-rail diesel injector cleaners',
    ],
  },

  // Tab 3: Accessories and equipment
  {
    id: 'batteries-chargers',
    tab: 'accessories',
    title: 'Batteries & jump starters',
    iconKey: 'battery',
    summary:
      'Maintenance-free SMF, AGM start-stop, and EFB automotive batteries alongside smart workshop chargers.',
    components: [
      'JIS & DIN SMF calcium starter batteries',
      'AGM & EFB start-stop vehicle batteries',
      '12V smart trickle chargers & booster cables',
    ],
  },
  {
    id: 'mats-liners',
    tab: 'accessories',
    title: 'Floor mats & cargo liners',
    iconKey: 'shield',
    summary:
      'Model-fitted TPE all-weather cabin mats and spill-resistant boot liners.',
    components: [
      '3D molded TPE front & rear floor mats',
      'Waterproof rear trunk & cargo trays',
    ],
  },
  {
    id: 'emergency-safety',
    tab: 'accessories',
    title: 'Safety & roadside kits',
    iconKey: 'shield',
    summary:
      'Warning triangles, tow ropes, first-aid packs, fire extinguishers, and wheel chocks.',
    components: [
      'Heavy-duty recovery tow straps & shackles',
      'Reflective warning triangles & safety vests',
    ],
  },
  {
    id: 'tire-inflators',
    tab: 'accessories',
    title: 'Compressors & tire care',
    iconKey: 'gauge',
    summary:
      '12V portable air compressors, digital tire tread/pressure gauges, and valve stem hardware.',
    components: [
      '12V metal-cylinder tire inflators',
      'Digital pressure gauges & valve cores',
    ],
  },

  // Tab 4: Tools
  {
    id: 'torque-master-kit',
    tab: 'tools',
    title: 'Digital Angle Torque Kit',
    image: heroCarsToolsImg,
    summary:
      'VK-AT-420 72-tooth digital torque-angle wrench (10–340 Nm) with 28 Cr-V 6-point metric sockets.',
    components: [
      '1/2-inch digital torque & angle readout',
      '10 – 32 mm Cr-V 6-point impact & chrome sockets',
      'NIST-traceable ±1.5% calibration certificate',
    ],
  },
  {
    id: 'diagnostic-tablet',
    tab: 'tools',
    title: 'IP67 Diagnostic Tablet',
    image: toolCarDiagnosticImg,
    summary:
      'VK-AT-905 rugged bi-directional CAN-FD & DoIP scanner with 4-channel 20 MS/s oscilloscope.',
    components: [
      'J2534 pass-through ECU programming',
      'ABS bleeding, injector coding & steering reset',
      '11-hour workshop battery runtime',
    ],
  },
  {
    id: 'brake-alignment-kit',
    tab: 'tools',
    title: 'Brake Runout Alignment Kit',
    iconKey: 'gauge',
    summary:
      'VK-AT-215 dial indicator with 80 kgf magnetic base and 0–150 mm stainless digital caliper.',
    components: [
      '0.01 mm lateral disc runout gauge',
      'Articulated 80 kgf switchable magnet base',
      '0 – 150 mm digital vernier micrometer',
    ],
  },
  {
    id: 'service-hand-tools',
    tab: 'tools',
    title: 'Oil Filter & Chassis Wrenches',
    iconKey: 'wrench',
    summary:
      'Cup-type oil filter wrenches, brake caliper wind-back sets, and spring compressors.',
    components: [
      'Fluted cup & 3-jaw oil filter wrenches',
      'Universal brake piston wind-back tool set',
      'Coil spring compressor & ball joint pullers',
    ],
  },
];

export interface CarPromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  enquiryTopic: string;
}

export const CAR_PROMO_BANNERS: CarPromoBanner[] = [
  {
    id: 'returns-30-days',
    title: 'Product returns within 30 days',
    subtitle: 'We do our very best to keep our customers happy.',
    image: bannerReturnsImg,
    enquiryTopic: '30-Day Return Policy & Order Support',
  },
  {
    id: 'ship-worldwide',
    title: 'We ship worldwide',
    subtitle: 'High quality car parts delivered to your doorstep.',
    image: bannerShippingImg,
    enquiryTopic: 'Shipping & Delivery Lead Time Enquiry',
  },
  {
    id: 'oem-vin-verified',
    title: 'OEM & VIN fitment verified',
    subtitle: 'Every part number cross-checked before dispatch.',
    image: bannerFitmentImg,
    enquiryTopic: 'VIN / OEM Part Compatibility Check',
  },
  {
    id: 'workshop-fleet-supply',
    title: 'Workshop & fleet supply',
    subtitle: 'Priority sourcing and bulk pricing for service bays.',
    image: bannerWorkshopImg,
    enquiryTopic: 'Bulk Workshop & Fleet Parts Quotation',
  },
];
