import hydraulicPumpImg from '../assets/images/mach_part_hydraulic_pump_1795521959630.jpg';
import sealKitImg from '../assets/images/mach_part_seal_kit_1795521959148.jpg';
import trackRollerImg from '../assets/images/mach_part_track_roller_1795521959144.jpg';
import idlerSprocketImg from '../assets/images/mach_part_idler_sprocket_1795521959356.jpg';
import bucketTeethImg from '../assets/images/mach_part_bucket_teeth_1795521959869.jpg';
import pinsBushingsImg from '../assets/images/mach_part_pins_bushings_1795521960260.jpg';
import swingBearingImg from '../assets/images/mach_part_swing_bearing_1795521960873.jpg';
import finalDriveImg from '../assets/images/mach_part_final_drive_1795521961764.jpg';
import controlValveImg from '../assets/images/mach_part_control_valve_1795521961765.jpg';
import hydraulicHosesImg from '../assets/images/mach_part_hydraulic_hoses_1795522039610.jpg';
import hydraulicFilterImg from '../assets/images/mach_part_hydraulic_filter_1795522039357.jpg';
import trackChainImg from '../assets/images/mach_part_track_chain_1795522039543.jpg';
import jcbBackhoeImg from '../assets/images/mach_part_jcb_backhoe_1795522040221.jpg';
import breakerChiselImg from '../assets/images/mach_part_breaker_chisel_1795522040324.jpg';
import oilCoolerImg from '../assets/images/mach_part_oil_cooler_1795522040588.jpg';
import throttleMonitorImg from '../assets/images/mach_part_throttle_monitor_1795522041614.jpg';
import engineOverhaulImg from '../assets/images/mach_part_engine_overhaul_1795522041252.jpg';
import pullerToolImg from '../assets/images/tool_hydraulic_puller_1795209689799.jpg';
import torqueToolImg from '../assets/images/hero_heavy_machinery_1795209690346.jpg';

export interface MachineryPartItem {
  id: string;
  title: string;
  subsystem: string;
  image: string;
  cover?: boolean;
  summary: string;
  components: string[];
}

export const MACHINERY_PARTS_CATALOG: MachineryPartItem[] = [
  {
    id: 'mach-hydraulic-pumps',
    title: 'Main Hydraulic Piston Pumps',
    subsystem: 'Hydraulic Power',
    image: hydraulicPumpImg,
    summary:
      'Variable-displacement tandem axial piston pumps, rotary groups, swashplates, and regulator valves for 12T–45T excavators.',
    components: [
      'Complete Kawasaki, Rexroth & Caterpillar style main pumps',
      'Cylinder blocks, pistons, valve plates & drive shafts',
      'Pilot gear pumps & hydraulic load-sensing regulators',
    ],
  },
  {
    id: 'mach-seal-kits',
    title: 'Hydraulic Cylinder Seal Kits',
    subsystem: 'Cylinder Overhaul',
    image: sealKitImg,
    summary:
      'High-pressure polyurethane rod seals, PTFE piston seals, bronze wear rings, and Viton wipers matched to boom, arm, and bucket rams.',
    components: [
      'Boom, stick arm, bucket & blade cylinder seal kits',
      'Control valve & swivel center-joint O-ring kits',
      'Hydraulic travel & swing motor shaft seal sets',
    ],
  },
  {
    id: 'mach-track-rollers',
    title: 'Track & Carrier Rollers',
    subsystem: 'Undercarriage',
    image: trackRollerImg,
    summary:
      'Induction-hardened forged steel single/double-flange bottom rollers and carrier top rollers with duo-cone lifetime seals.',
    components: [
      'Single & double-flange excavator bottom track rollers',
      'Upper carrier rollers, bronze bushings & end collars',
      'Track roller guards & grade-10.9 mounting bolts',
    ],
  },
  {
    id: 'mach-idlers-sprockets',
    title: 'Front Idlers & Drive Sprockets',
    subsystem: 'Undercarriage',
    image: idlerSprocketImg,
    summary:
      'Heat-treated cast steel final drive sprocket segments and spring-tensioned front track idler assemblies for earthmoving fleets.',
    components: [
      'Machined 19-tooth to 23-tooth drive sprockets & rims',
      'Complete front idler wheels with yoke & recoil springs',
      'Track adjuster grease cylinder valves & piston rods',
    ],
  },
  {
    id: 'mach-bucket-teeth',
    title: 'Bucket Teeth & Adapters',
    subsystem: 'Ground Engaging Tools',
    image: bucketTeethImg,
    summary:
      'Abrasion-resistant alloy digging teeth, rock chisels, weld-on/bolt-on adapters, and side cutters for quarry and trenching.',
    components: [
      'Standard, rock-chisel & twin-tiger bucket teeth',
      'Flush-mount & straddle weld-on bucket adapters',
      'Side cutters, cutting edges, flex pins & retainer locks',
    ],
  },
  {
    id: 'mach-pins-bushings',
    title: 'Boom, Arm & Bucket Pins',
    subsystem: 'Linkage Hardware',
    image: pinsBushingsImg,
    summary:
      'Hard-chrome induction-hardened pivot pins, H-link bushings, dust seals, and alignment shims eliminating front-end bucket play.',
    components: [
      'Chrome-plated boom foot, dipper arm & bucket pivot pins',
      'Grooved hardened steel & bronze-lined linkage bushings',
      'Bucket H-links, tipping links & dust wiper seals',
    ],
  },
  {
    id: 'mach-swing-bearings',
    title: 'Slew Ring & Swing Bearings',
    subsystem: 'Upper Structure',
    image: swingBearingImg,
    summary:
      'Internal and external gear-tooth turntable slew ring bearings, swing pinions, and planetary swing reduction gearboxes.',
    components: [
      'Single-row ball & cross-roller turntable slew rings',
      'Hardened swing drive pinion shafts & sun/planet gears',
      'Swing motor assemblies & slew grease seal strips',
    ],
  },
  {
    id: 'mach-final-drives',
    title: 'Final Drive & Travel Motors',
    subsystem: 'Drivetrain',
    image: finalDriveImg,
    summary:
      'Two-speed planetary final drive travel motors, sun gears, planetary carriers, and duo-cone floating seals built for heavy mud and grade.',
    components: [
      'Complete hydraulic travel motor & gearbox assemblies',
      'Planetary carrier gears, needle bearings & ring gears',
      'Floating duo-cone mechanical face seals & brake discs',
    ],
  },
  {
    id: 'mach-control-valves',
    title: 'Main Control & Solenoid Valves',
    subsystem: 'Hydraulic Control',
    image: controlValveImg,
    summary:
      'Multi-spool main hydraulic control blocks, proportional solenoid valves, pressure relief cartridges, and pilot joystick valves.',
    components: [
      'Proportional EPC & ON/OFF hydraulic solenoid valves',
      'Main relief valves, port relief & holding check valves',
      'Cab pilot joystick control valves & foot travel pedals',
    ],
  },
  {
    id: 'mach-hydraulic-hoses',
    title: 'High-Pressure Hoses & Fittings',
    subsystem: 'Fluid Lines',
    image: hydraulicHosesImg,
    summary:
      'SAE 100R12 / 4SP / 4SH 4-wire spiral hydraulic hoses custom-crimped with JIC, BSP, ORFS, and split-flange couplings.',
    components: [
      '4-wire spiral boom, stick & hammer hydraulic hoses',
      'SAE Code 61 / Code 62 split-flange & JIC steel fittings',
      'Quick-disconnect flat-face breaker couplers & test ports',
    ],
  },
  {
    id: 'mach-hydraulic-filters',
    title: 'Hydraulic Return & Suction Filters',
    subsystem: 'Filtration',
    image: hydraulicFilterImg,
    summary:
      'Micro-glass hydraulic tank return cartridges, pilot line spin-on elements, suction strainers, and pressurized breather caps.',
    components: [
      'Hydraulic reservoir return & case-drain filter elements',
      'High-pressure pilot oil filters & stainless suction screens',
      'Fuel water-separator, lube & dual air filter sets',
    ],
  },
  {
    id: 'mach-track-chains',
    title: 'Track Chains, Links & Shoes',
    subsystem: 'Undercarriage',
    image: trackChainImg,
    summary:
      'Sealed and greased track link assemblies (SALT), master link pins, and triple-grouser steel track pads with lock nuts.',
    components: [
      'Heavy-duty sealed & lubricated track link chains',
      '600 mm / 700 mm / 800 mm triple-grouser steel shoes',
      'Master track pins, split links & high-tensile pad bolts',
    ],
  },
  {
    id: 'mach-jcb-wear',
    title: 'JCB Backhoe & Loader Wear Parts',
    subsystem: 'Backhoe & Loader',
    image: jcbBackhoeImg,
    summary:
      'Kingpost carriage pins, brass extendahoe slider pads, stabilizer cylinder pins, and axle hub seals for backhoe loaders.',
    components: [
      'Kingpost pivot pins, bushes & slew cylinder seals',
      'Bronze dipper wear pads & shim adjustment packs',
      'Front/rear axle planetary gears, kingpins & track rods',
    ],
  },
  {
    id: 'mach-breaker-chisels',
    title: 'Hydraulic Breaker Chisels & Seals',
    subsystem: 'Attachments',
    image: breakerChiselImg,
    summary:
      'Moil point, wedge, and blunt quarry rock breaker tool chisels alongside nitrogen accumulator membranes, through-bolts, and bushing kits.',
    components: [
      'Forged moil, flat wedge & blunt rock breaker chisels',
      'Rubber nitrogen accumulator diaphragms & charge valves',
      'Upper/lower tool bushings, retainer pins & breaker seal kits',
    ],
  },
  {
    id: 'mach-oil-coolers',
    title: 'Hydraulic Oil Coolers & Radiators',
    subsystem: 'Thermal Management',
    image: oilCoolerImg,
    summary:
      'Heavy-gauge plate-and-bar brazed aluminum hydraulic oil coolers, engine radiators, charge-air intercoolers, and cooling fan blades.',
    components: [
      'High-pressure brazed aluminum hydraulic oil coolers',
      'Engine water radiators, fan shrouds & silicone hoses',
      'Viscous fan clutches & hydraulic fan motor drives',
    ],
  },
  {
    id: 'mach-monitors-sensors',
    title: 'Monitors, Sensors & Throttle Motors',
    subsystem: 'Cab & Electronics',
    image: throttleMonitorImg,
    summary:
      'Cab ECU monitor display panels, governor throttle stepper motors, high/low pressure switches, and wiring harness assemblies.',
    components: [
      'LCD cab monitor gauges, keypads & wiper controllers',
      'Governor throttle stepper motors & drive cables',
      'Hydraulic pump pressure switches & revolution sensors',
    ],
  },
  {
    id: 'mach-engine-rebuild',
    title: 'Diesel Engine Rebuild Kits',
    subsystem: 'Prime Mover',
    image: engineOverhaulImg,
    summary:
      'Full construction equipment engine overhaul kits containing wet cylinder liners, pistons, chrome ring sets, and main/con-rod bearings.',
    components: [
      'Cylinder liner sleeves, Alfin pistons & piston ring kits',
      'Main, connecting-rod & thrust bearing sets',
      'MLS cylinder head gaskets, injectors & turbochargers',
    ],
  },
  {
    id: 'mach-planetary-gears',
    title: 'Planetary Ring Gears & Shafts',
    subsystem: 'Transmission & Final Drive',
    image: '../assets/aistudio/image_11c6e947.png',
    summary:
      'Precision-cut bull gears, bevel pinions, planetary carrier shafts, and spring assemblies for dozer, loader, and excavator drives.',
    components: [
      'Internal/external planetary ring gears & hubs',
      'Spiral bevel pinions, crown wheels & splined shafts',
      'Recoil track tension springs & differential carriers',
    ],
  },
  {
    id: 'mach-hydraulic-puller',
    title: '50-Ton Hydraulic Pin & Gear Puller',
    subsystem: 'Workshop Tooling · VK-HM-50T',
    image: pullerToolImg,
    cover: true,
    summary:
      'Forged black-oxide 3-jaw 50-ton hydraulic extraction puller with 700-bar dual-speed hand pump and glycerin gauge.',
    components: [
      '50-ton capacity · 520 mm spread · 150 mm stroke',
      '700-bar dual-speed pump & pressure gauge manifold',
      'Built for sprocket, bearing & seized track pin extraction',
    ],
  },
  {
    id: 'mach-torque-multiplier',
    title: 'Hydraulic Torque Multiplier 4200 Nm',
    subsystem: 'Workshop Tooling · VK-HM-910',
    image: torqueToolImg,
    cover: true,
    summary:
      'Continuous-rotation planetary hydraulic torque multiplier head (420–4,200 Nm) for M24–M64 slew-ring and crusher fasteners.',
    components: [
      '420 – 4,200 Nm calibrated torque output (±3.0%)',
      '1-1/2 in heavy impact square drive & reaction arm',
      'Ideal for slew bearings, crusher liners & track bolts',
    ],
  },
];
