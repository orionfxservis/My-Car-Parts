import fuelFilterImg from '../assets/images/gen_part_fuel_filter_1795521039529.jpg';
import oilFilterImg from '../assets/images/gen_part_oil_filter_1795521038760.jpg';
import airFilterImg from '../assets/images/gen_part_air_filter_1795521039663.jpg';
import radiatorImg from '../assets/images/gen_part_radiator_1795521039347.jpg';
import injectorImg from '../assets/images/gen_part_injector_1795521040848.jpg';
import turboImg from '../assets/images/gen_part_turbo_1795521040264.jpg';
import waterPumpImg from '../assets/images/gen_part_water_pump_1795521039947.jpg';
import beltsImg from '../assets/images/gen_part_belts_1795521040884.jpg';
import avrImg from '../assets/images/gen_part_avr_1795521040420.jpg';
import rectifierImg from '../assets/images/gen_part_rectifier_1795521041830.jpg';
import starterImg from '../assets/images/gen_part_starter_1795521041393.jpg';
import controllerImg from '../assets/images/gen_part_controller_1795521046589.jpg';
import governorImg from '../assets/images/gen_part_governor_1795521042922.jpg';
import alternatorImg from '../assets/images/gen_part_alternator_1795521153558.jpg';
import sensorsImg from '../assets/images/gen_part_sensors_1795521153454.jpg';
import gasketsImg from '../assets/images/gen_part_gaskets_1795521153868.jpg';
import loadbankImg from '../assets/images/tool_generator_loadbank_1795209690561.jpg';
import switchgearImg from '../assets/images/hero_generator_systems_1795209690119.jpg';
import bannerReturnsImg from '../assets/images/banner_car_returns_1795445081176.jpg';
import bannerShippingImg from '../assets/images/banner_car_shipping_1795445081504.jpg';
import bannerFitmentImg from '../assets/images/banner_car_fitment_1795445081707.jpg';
import bannerWorkshopImg from '../assets/images/banner_car_workshop_1795445081292.jpg';
import { CarPromoBanner } from './carPartsCatalog';

export interface GeneratorPartItem {
  id: string;
  title: string;
  subsystem: string;
  image: string;
  cover?: boolean;
  summary: string;
  components: string[];
}

export const GENERATOR_PROMO_BANNERS: CarPromoBanner[] = [
  {
    id: 'gen-returns-warranty',
    title: '30-day warranty & returns',
    subtitle: 'Guaranteed OEM cross-fitment for standby & prime generators.',
    image: bannerReturnsImg,
    enquiryTopic: 'Generator Parts Warranty & Return Support',
  },
  {
    id: 'gen-worldwide-dispatch',
    title: 'Fast plant & site dispatch',
    subtitle: 'Diesel engine, AVR & alternator spares delivered to site.',
    image: bannerShippingImg,
    enquiryTopic: 'Generator Parts Shipping & Dispatch Lead Time',
  },
  {
    id: 'gen-serial-verified',
    title: 'Nameplate & serial verified',
    subtitle: 'Matched against engine build list and alternator frame.',
    image: bannerFitmentImg,
    enquiryTopic: 'Generator Nameplate & Serial Cross-Reference',
  },
  {
    id: 'gen-fleet-maintenance',
    title: 'Prime & standby power contracts',
    subtitle: 'Scheduled 250h / 500h / 1000h PM service kits in stock.',
    image: bannerWorkshopImg,
    enquiryTopic: 'Bulk Generator PM Kits & Service Contract Quote',
  },
];

export const GENERATOR_PARTS_CATALOG: GeneratorPartItem[] = [
  {
    id: 'gen-fuel-filters',
    title: 'Fuel Filters & Water Separators',
    subsystem: 'Filtration & Fuel Supply',
    image: fuelFilterImg,
    summary:
      'Primary spin-on fuel filters and clear-bowl fuel/water separators protecting diesel injection pumps from condensation and sediment.',
    components: [
      'Spin-on primary & secondary diesel fuel filters',
      'Racor-style clear-bowl water separator elements',
      'Primer pump heads, drain valves & Viton O-ring seals',
    ],
  },
  {
    id: 'gen-oil-filters',
    title: 'Engine Oil Filters',
    subsystem: 'Lubrication System',
    image: oilFilterImg,
    summary:
      'Full-flow and bypass heavy-duty spin-on lube oil filters rated for continuous 1500 / 1800 RPM diesel generator operation.',
    components: [
      'High-capacity spin-on engine lubrication filters',
      'Bypass centrifuge & cartridge oil filter elements',
      'Anti-drainback silicone gasket service assemblies',
    ],
  },
  {
    id: 'gen-air-filters',
    title: 'Air Intake Filters',
    subsystem: 'Air Induction',
    image: airFilterImg,
    summary:
      'Dual-stage primary and inner safety radial-seal air elements engineered for dusty site enclosures and quarry canopies.',
    components: [
      'Heavy-duty pleated primary intake air elements',
      'Secondary safety inner cartridge filters',
      'Restriction service indicators & silicone intake boots',
    ],
  },
  {
    id: 'gen-avr-regulators',
    title: 'Automatic Voltage Regulators (AVR)',
    subsystem: 'Alternator Excitation',
    image: avrImg,
    summary:
      'Solid-state brushless alternator AVRs providing ±0.5% to ±1% voltage stability across SX460, AS440, MX321, and R250/R450 frames.',
    components: [
      'Self-excited & PMG brushless AVR control boards',
      'Under-frequency roll-off & stability trim modules',
      'Remote voltage trimmer potentiometers & EMI suppressors',
    ],
  },
  {
    id: 'gen-rectifiers',
    title: 'Rotating Rectifier Diode Bridges',
    subsystem: 'Alternator Rotor',
    image: rectifierImg,
    summary:
      'Matched forward/reverse rotating diode bridge half-moon packs and varistor surge suppressors for brushless AC alternators.',
    components: [
      'Positive & negative half-moon diode bridge plates',
      'Stud-mount 25A – 85A avalanche exciter diodes',
      'MOV varistor surge arrestors & rotor hardware kits',
    ],
  },
  {
    id: 'gen-amf-controllers',
    title: 'AMF & ATS Control Modules',
    subsystem: 'Control & Telemetry',
    image: controllerImg,
    summary:
      'Microprocessor auto-mains-failure, auto-start, and synchronizing generator controllers with Modbus/CANbus J1939 monitoring.',
    components: [
      'AMF / Auto-Start LCD digital genset controllers',
      'Mains / Generator ATS changeover relays & timers',
      'CANbus J1939 ECU display & fault shutdown modules',
    ],
  },
  {
    id: 'gen-governors',
    title: 'Speed Governors & Magnetic Pickups',
    subsystem: 'Speed Regulation',
    image: governorImg,
    summary:
      'Electronic isochronous speed control units, proportional fuel actuators, and flywheel ring-gear magnetic pickup sensors (MPU).',
    components: [
      '12V / 24V electronic isochronous speed governor boards',
      '5/8"-18 UNF & M16x1.5 flywheel magnetic pickup sensors',
      'Rotary & linear proportional diesel fuel actuators',
    ],
  },
  {
    id: 'gen-injectors',
    title: 'Fuel Injection Pumps & Injectors',
    subsystem: 'High-Pressure Fuel',
    image: injectorImg,
    summary:
      'Mechanical inline/rotary injection pumps, common-rail diesel injectors, delivery valves, and lift transfer pumps.',
    components: [
      'Common-rail & mechanical multi-hole diesel injectors',
      'Rotary & inline fuel injection pump assemblies',
      'Fuel shutoff solenoids & high-pressure rail pipes',
    ],
  },
  {
    id: 'gen-turbochargers',
    title: 'Turbochargers & Exhaust Manifolds',
    subsystem: 'Forced Induction',
    image: turboImg,
    summary:
      'Wastegated and free-floating diesel generator turbochargers, CHRA cartridges, stainless flex bellows, and high-temp gaskets.',
    components: [
      'Complete diesel engine turbocharger assemblies',
      'Balanced CHRA center cartridges & oil feed lines',
      'Stainless exhaust expansion bellows & V-band clamps',
    ],
  },
  {
    id: 'gen-radiators',
    title: 'Radiators & Cooling Cores',
    subsystem: 'Thermal Management',
    image: radiatorImg,
    summary:
      'Heavy-duty brass/copper and brazed aluminum tropicalized generator radiators rated for 50°C ambient canopy cooling.',
    components: [
      '50°C tropicalized fin-and-tube genset radiators',
      'Charge-air intercooler cores & expansion surge tanks',
      'Pusher cooling fan blades, shrouds & pressure caps',
    ],
  },
  {
    id: 'gen-water-pumps',
    title: 'Water Pumps & Thermostats',
    subsystem: 'Coolant Circulation',
    image: waterPumpImg,
    summary:
      'High-flow gear-driven and belt-driven coolant water pumps matched with calibrated dual-stage diesel engine thermostats.',
    components: [
      'Cast-iron & aluminum coolant water pump assemblies',
      'Block-mounted water jacket pre-heaters (230V)',
      '82°C / 88°C thermostat elements & housing seals',
    ],
  },
  {
    id: 'gen-belts',
    title: 'Drive Belts & Tensioners',
    subsystem: 'Front-End Drive',
    image: beltsImg,
    summary:
      'Matched cogged V-belts, multi-rib serpentine fan belts, automatic spring tensioners, and sealed idler pulleys.',
    components: [
      'Matched-pair cogged fan & alternator V-belts',
      'Multi-rib EPDM poly-V serpentine drive belts',
      'Spring-loaded belt tensioner arms & idler bearings',
    ],
  },
  {
    id: 'gen-starters',
    title: '24V Starter Motors & Solenoids',
    subsystem: 'Cranking System',
    image: starterImg,
    summary:
      'High-torque 12V and 24V gear-reduction cranking motors, heavy-duty starter contactors, and Bendix drive pinions.',
    components: [
      '12V / 24V high-torque planetary starter motors',
      'Heavy-duty engagement solenoids & start relays',
      'Overrunning clutch drive pinions & brush kits',
    ],
  },
  {
    id: 'gen-charging-alternators',
    title: 'Battery Charging Alternators',
    subsystem: 'DC Power Supply',
    image: alternatorImg,
    summary:
      'Brushless 12V and 24V engine-driven battery charging alternators with integral regulators alongside static mains float chargers.',
    components: [
      '24V 45A – 100A engine charging alternators',
      'Static 12V / 24V automatic boost-float chargers',
      'Multi-groove charging pulleys & mounting brackets',
    ],
  },
  {
    id: 'gen-sensors',
    title: 'Oil Pressure & Temp Sensors',
    subsystem: 'Engine Protection',
    image: sensorsImg,
    summary:
      'NPT/BSP brass oil pressure transducers, dual-output coolant temperature switches, and low-coolant level probes.',
    components: [
      '0–10 bar VDO & resistive oil pressure senders',
      'Coolant temperature sensors & high-temp shutdown switches',
      'Capacitive coolant & day-tank fuel level sensors',
    ],
  },
  {
    id: 'gen-gaskets',
    title: 'Cylinder Head Gaskets & Overhaul Kits',
    subsystem: 'Engine Rebuild',
    image: gasketsImg,
    summary:
      'Top-end and full-engine MLS head gaskets, Viton liner seals, valve stem seals, and front/rear crankshaft oil seals.',
    components: [
      'Multi-layer steel (MLS) cylinder head gasket sets',
      'Upper top-set & lower sump gasket overhaul kits',
      'PTFE / Viton crankshaft seals & valve cover gaskets',
    ],
  },
  {
    id: 'gen-load-bank',
    title: 'Portable 50 kW Load Bank Analyzer',
    subsystem: 'Commissioning · VK-GN-500',
    image: loadbankImg,
    cover: true,
    summary:
      'Three-phase resistive load bank for wet-stacking elimination, standby generator commissioning, and step-load verification.',
    components: [
      '208V / 400V / 480V three-phase 50/60 Hz operation',
      '1 / 2 / 5 / 10 kW rotary load step banks',
      'True-RMS kW, PF & Hz panel meter with Camlock leads',
    ],
  },
  {
    id: 'gen-switchgear-chest',
    title: '1000V Switchgear & AVR Service Chest',
    subsystem: 'Commissioning · VK-GN-880',
    image: switchgearImg,
    cover: true,
    summary:
      '46-piece IEC 60900 / VDE 0682 1000V insulated tool trolley with phase-rotation meter and 1,000 A AC/DC clamp meter.',
    components: [
      '1000V AC / 1500V DC insulated torque & hand tools',
      '3-phase rotation & breaker timing test instruments',
      '1,000 A true-RMS AC/DC clamp multimeter',
    ],
  },
  {
    id: 'gen-engine-rebuild-packs',
    title: 'Major Overhaul Engine Kits',
    subsystem: 'Engine Rebuild Assemblies',
    image: '../assets/aistudio/industrial_generator_parts_02_7dc8d853.jpg',
    cover: true,
    summary:
      'Matched piston-liner-ring kits, camshaft bearings, crankshaft journals, and timing gear trains for major diesel engine rebuilds.',
    components: [
      'Cylinder liners, forged pistons & chrome ring sets',
      'Standard & undersize main & big-end shell bearings',
      'Camshafts, followers, timing gears & oil pumps',
    ],
  },
  {
    id: 'gen-pm-filter-bundles',
    title: '250h / 500h PM Filter Service Kits',
    subsystem: 'Scheduled Maintenance',
    image: '../assets/aistudio/industrial_generator_parts_b718b111.jpg',
    summary:
      'Complete bundled maintenance kits containing matched oil, fuel, water-separator, and air filters for single-visit servicing.',
    components: [
      '250-hour & 500-hour bundled filtration packages',
      'Pre-matched seals, O-rings & differential gauges',
      'Cross-referenced by genset model & serial plate',
    ],
  },
];
