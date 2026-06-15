import "dotenv/config";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import UserModel, { VerificationStatus } from "./models/User.js";
import BookingModel from "./models/Booking.js";
import ReviewModel from "./models/Review.js";
import CategoryModel from "./models/Category.js";
import LocationModel from "./models/Location.js";
import SystemConfigModel from "./models/SystemConfig.js";
import { computeTrustScore } from "./services/trustScoreService.js";

const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || "DemoPassword123!";

const INITIAL_CATEGORIES = [
  {
    name: "Electrician",
    slug: "electrician",
    icon: "Zap",
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    description: "Certified residential and commercial electricians, wiring, circuit breakers, and generator installation",
    isPopular: true,
    rateMin: 350,
    rateMax: 520,
    skills: ["Breaker Panel Upgrades", "Emergency Diagnostics", "Industrial Wiring", "Solar Inverter Setup", "Conduit Cabling", "Automatic Transfer Switch (ATS)", "LED Lighting Design", "Short Circuit Repair", "Socket & Switch Fitting", "Earthing & Surge Protection"],
    doc: "Trade Competency License Level IV",
    bio: "Certified electrician specializing in residential wiring, fuse boxes, inverter installations, and electrical safety inspections.",
  },
  {
    name: "Plumber",
    slug: "plumber",
    icon: "Wrench",
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
    description: "Pipe installation, drainage repair, sanitary fixtures, water heaters, and leak detection",
    isPopular: true,
    rateMin: 320,
    rateMax: 480,
    skills: ["Borehole Pump Installation", "Drip Irrigation Pipelines", "Water Tank Plumbing", "Drainage Unblocking", "Leak Detection", "Boiler Repair", "Bathroom Fixtures Installation", "Water Pump Systems", "PPR Pipe Fusion", "Pressure Booster Calibration"],
    doc: "Municipal Sanitary Plumbing Certificate",
    bio: "Expert sanitary plumber handling water supply piping, pressurized pumps, drainage lines, and leak troubleshooting.",
  },
  {
    name: "Home Cleaner",
    slug: "home-cleaner",
    icon: "Sparkle",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    description: "Deep house cleaning, post-construction sanitization, sofa cleaning, and carpet washing",
    isPopular: true,
    rateMin: 220,
    rateMax: 320,
    skills: ["Deep House Cleaning", "Move-in/Move-out Sanitization", "Window & Glass Detailing", "Post-Construction Clean", "Corporate Office Cleaning", "Steam Carpet Sanitizing", "Kitchen Grease Removal", "Sofa & Mattress Sanitization", "Tile & Grout Steam Wash"],
    doc: "Commercial Sanitation License",
    bio: "Meticulous professional cleaner providing deep residential sanitization, post-renovation cleanup, and steam disinfection.",
  },
  {
    name: "Tutor",
    slug: "tutor",
    icon: "GraduationCap",
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40",
    description: "Math, physics, English, Amharic, chemistry, and national exam preparation tutors",
    isPopular: true,
    rateMin: 300,
    rateMax: 550,
    skills: ["Mathematics (Grade 9-12)", "Calculus & Algebra", "SAT / National Exam Prep", "Physics Fundamentals", "University Physics", "Advanced Chemistry", "Conversational English & IELTS", "Computer Science & Python Coding", "Amharic Grammar & Writing"],
    doc: "B.Sc. Education & Teaching License",
    bio: "Dedicated educator providing structured academic tutoring, exam preparation, and conceptual clarity for high school and university students.",
  },
  {
    name: "Carpenter",
    slug: "carpenter",
    icon: "Hammer",
    color: "text-orange-500 bg-orange-50 dark:bg-orange-950/40",
    description: "Custom cabinetry, kitchen remodeling, wooden door & window fittings, and structural woodwork",
    isPopular: true,
    rateMin: 350,
    rateMax: 500,
    skills: ["Custom Kitchen Islands", "Solid Hardwood Wardrobes", "Acoustic Wall Paneling", "Parquet Restoration", "Hardwood Parquet Flooring", "Bespoke Dining Sets", "Office Workstations", "Security Door Framing", "Custom Cabinetry", "Door & Window Fitting"],
    doc: "Master Craftsman License Level IV",
    bio: "Artisan carpenter crafting bespoke solid wood furniture, fitted kitchen cabinets, architectural woodwork, and door installations.",
  },
  {
    name: "Painter",
    slug: "painter",
    icon: "Paintbrush",
    color: "text-teal-500 bg-teal-50 dark:bg-teal-950/40",
    description: "Interior/exterior wall painting, decorative finishes, waterproofing, and surface preparation",
    isPopular: true,
    rateMin: 260,
    rateMax: 380,
    skills: ["High-Gloss Trim & Mouldings", "Anti-Fungal Exterior Wash", "Stucco & Venetian Plaster", "Commercial Spray Painting", "Decorative Wall Stenciling", "Interior Emulsion", "Weatherproof Exterior Coating", "Textured Wall Finishes", "Epoxy Floor Coatings"],
    doc: "Painting & Decorating License",
    bio: "Skilled painter delivering high-quality interior and exterior finishes, textured coatings, and weather-resistant wall protections.",
  },
  {
    name: "HVAC Technician",
    slug: "hvac-technician",
    icon: "Flame",
    color: "text-red-500 bg-red-50 dark:bg-red-950/40",
    description: "Air conditioning, ventilation systems, cooling units, and server room HVAC maintenance",
    isPopular: false,
    rateMin: 400,
    rateMax: 580,
    skills: ["Central AC Systems", "Commercial Cold Rooms", "Inverter VRF Systems", "R410A Freon Servicing", "Split AC Maintenance", "Air Duct Sanitization", "Thermostat Replacements", "Walk-in Freezers", "Commercial Chillers", "Compressor Overhaul"],
    doc: "Commercial HVAC & Refrigeration License",
    bio: "HVAC technician servicing commercial cooling systems, split air conditioners, walk-in freezers, and ventilation units.",
  },
  {
    name: "Appliance Repair",
    slug: "appliance-repair",
    icon: "Cpu",
    color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40",
    description: "Refrigerator repair, washing machines, microwave ovens, and kitchen appliance diagnostics",
    isPopular: false,
    rateMin: 300,
    rateMax: 460,
    skills: ["Electric Mitad Heating Coils", "Commercial Espresso Machines", "Double-Door Refrigerators", "Digital Microwave Inverters", "Washing Machine PCB Repair", "Induction Cooktop Electronics", "Dishwasher Solenoid Valves", "Blender Motors", "Water Dispenser Coolers"],
    doc: "Electronics & Appliance Repair License Level IV",
    bio: "Experienced technician repairing household appliances, electric mitad baking plates, washing machines, and commercial kitchen units.",
  },
  {
    name: "Auto Mechanic",
    slug: "auto-mechanic",
    icon: "Wrench",
    color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
    description: "Mobile auto maintenance, engine diagnostics, brake replacement, and electrical troubleshooting",
    isPopular: false,
    rateMin: 360,
    rateMax: 520,
    skills: ["OBD-II Computer Diagnostics", "Automatic Transmission Rebuilds", "4x4 Suspension Overhauls", "Common Rail Diesel Injectors", "Hybrid Battery Cell Balancing", "ABS Brake Calibrations", "Alternator & Starter Overhauls", "Cooling Radiator Flushes", "Brake Pad Replacement"],
    doc: "Automotive Engineering Master License",
    bio: "Automotive mechanic providing mobile computer diagnostics, engine maintenance, suspension overhauls, and brake repairs.",
  },
  {
    name: "IT & Network Support",
    slug: "it-network-support",
    icon: "Cpu",
    color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40",
    description: "Office Wi-Fi setup, LAN cabling, CCTV surveillance cameras, PC hardware repair, and server maintenance",
    isPopular: false,
    rateMin: 380,
    rateMax: 600,
    skills: ["MikroTik / Cisco Routing", "Enterprise Wi-Fi 6 Meshing", "IP CCTV Surveillance NVR", "Structured Cat6A Cabling", "Hikvision IP CCTV Setup", "Biometric Access Control", "Windows Server Active Directory", "NAS Storage Backup", "Fiber Splicing & Termination"],
    doc: "Cisco CCNA & Trade License",
    bio: "Network engineer configuring corporate Wi-Fi mesh systems, IP surveillance cameras, structured cabling, and IT infrastructure.",
  },
  {
    name: "Landscaper & Gardener",
    slug: "landscaper-gardener",
    icon: "Trees",
    color: "text-green-500 bg-green-50 dark:bg-green-950/40",
    description: "Compound lawn mowing, ornamental tree trimming, landscaping design, and garden drainage",
    isPopular: false,
    rateMin: 240,
    rateMax: 360,
    skills: ["Landscape Architecture Design", "Compound Lawn Sodding", "Drip Garden Irrigation", "Ornamental Palm Pruning", "Tree Surgery & Canopy Pruning", "Kikuyu Grass Aeration & Fertilizing", "Garden Drainage Swales", "Flower Bed Retaining Walls", "Compound Hedging"],
    doc: "Horticulture License & Commercial Registry",
    bio: "Landscape gardener designing compound greenery, lawn turfing, ornamental shrub shaping, and automated garden irrigation.",
  },
  {
    name: "Locksmith & Security",
    slug: "locksmith-security",
    icon: "ShieldCheck",
    color: "text-slate-500 bg-slate-50 dark:bg-slate-950/40",
    description: "Deadbolt installation, electronic smart locks, emergency door opening, and security bars",
    isPopular: false,
    rateMin: 300,
    rateMax: 450,
    skills: ["Smart Biometric Deadbolts", "High-Security Master Key Systems", "Emergency Safe Cracking", "Commercial Panic Bar Exit Doors", "Automotive Transponder Key Cutting", "Padlock Rekeying", "Electric Strike Plate Installation", "Door Chain & Deadbolt Locks"],
    doc: "Security Trade License & Police Clearance",
    bio: "Certified locksmith handling smart electronic deadbolts, emergency opening, master key systems, and security hardware.",
  },
  {
    name: "Flooring & Tiling",
    slug: "flooring-tiling",
    icon: "Layers",
    color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40",
    description: "Ceramic tile laying, granite counter installation, parquet floor sanding, and epoxy coatings",
    isPopular: false,
    rateMin: 320,
    rateMax: 460,
    skills: ["Italian Porcelain Tile Laying", "Granite & Marble Counter Polishing", "Terrazzo Diamond Grinding", "Epoxy 3D Metallic Flooring", "Ceramic Bathroom Tiles", "Tile Regrouting", "Subfloor Leveling & Screeding", "Parquet Sanding & Varnishing"],
    doc: "Flooring Trade Competency Certificate Level IV",
    bio: "Master tiler delivering precision porcelain tile installation, granite counter polishing, terrazzo grinding, and epoxy floors.",
  },
  {
    name: "Roofing & Waterproofing",
    slug: "roofing-waterproofing",
    icon: "Building",
    color: "text-zinc-500 bg-zinc-50 dark:bg-zinc-950/40",
    description: "Corrugated iron sheet roof repair, asphalt membrane waterproofing, and rain gutter installation",
    isPopular: false,
    rateMin: 350,
    rateMax: 520,
    skills: ["Bitumen Torch-On Membranes", "Polyurethane Liquid Waterproofing", "Galvanized Corrugated Sheet Repair", "Concrete Roof Deck Sealant", "Rain Gutter Installation", "Tile Roof Leak Sealing", "Thermal Insulation Underlay"],
    doc: "Civil Construction & Waterproofing License",
    bio: "Roofing specialist providing bituminous membrane waterproofing, corrugated sheet replacement, and rain drainage solutions.",
  },
  {
    name: "Upholsterer & Furniture",
    slug: "upholsterer-furniture",
    icon: "Armchair",
    color: "text-pink-500 bg-pink-50 dark:bg-pink-950/40",
    description: "Living room sofa reupholstery, leather car seat refurbishment, and custom wooden furniture crafting",
    isPopular: false,
    rateMin: 300,
    rateMax: 440,
    skills: ["Chesterfield Deep Button Tufting", "Genuine Ethiopian Leather Sofas", "Orthopedic Foam Density Matching", "Automotive Leather Interior Customization", "Living Room Sofa Reupholstery", "Dining Chair Fabric Replacement", "Custom Headboard Upholstery"],
    doc: "Leather & Textile Craftsman License",
    bio: "Upholstery craftsman reupholstering living room furniture, leather executive chairs, custom headboards, and foam replacements.",
  },
  {
    name: "Welder & Metalworker",
    slug: "welder-metalworker",
    icon: "Flame",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    description: "Compound gate fabrication, window grilles, structural steel welding, and metal repair",
    isPopular: false,
    rateMin: 340,
    rateMax: 480,
    skills: ["MIG/TIG Stainless Steel Welding", "Heavy Compound Security Gates", "Structural Truss Fabrication", "Decorative Balcony Railings", "Window Burglar Grilles", "Steel Spiral Staircases", "Water Tank Steel Stands"],
    doc: "Master Welder License Level IV",
    bio: "Metal fabricator welding automated security gates, decorative window grilles, structural roof trusses, and metal railings.",
  },
  {
    name: "Moving & Relocation",
    slug: "moving-relocation",
    icon: "Truck",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    description: "Residential house moving, office equipment relocation, heavy furniture hoisting, and packing service",
    isPopular: false,
    rateMin: 300,
    rateMax: 450,
    skills: ["Fragile Bubble-Wrap Packaging", "Heavy Furniture Crane Hoisting", "Office Cubicle Assembly", "Intercity Moving Logistics", "Padded Truck Transport", "Apartment Packing & Loading", "Piano & Heavy Safe Hoisting"],
    doc: "Transport & Logistics Operating Permit",
    bio: "Relocation specialist managing residential packing, furniture disassembly, safe transport, and heavy item hoisting.",
  },
  {
    name: "Satellite & TV Tech",
    slug: "satellite-tv-tech",
    icon: "Tv",
    color: "text-violet-500 bg-violet-50 dark:bg-violet-950/40",
    description: "Satellite dish alignment (NSS, Eutelsat, DSTV), smart TV wall mounting, and soundbar setup",
    isPopular: false,
    rateMin: 280,
    rateMax: 420,
    skills: ["Multi-LNB Dish Alignment (NSS12/DSTV)", "Flush OLED TV Wall Mounting", "Home Theater Surround Audio Cabling", "Hotel Central RF Distribution", "Motorized Satellite Dish Calibration", "Soundbar & Subwoofer Setup"],
    doc: "Electronics & Audio-Visual Cert Level III",
    bio: "Audio-visual technician installing flush TV wall mounts, satellite dish alignment, sound systems, and multi-room cabling.",
  },
  {
    name: "Solar & Generator Tech",
    slug: "solar-generator-tech",
    icon: "Sun",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
    description: "Solar PV panel installation, off-grid inverter setup, backup battery storage, and diesel generator servicing",
    isPopular: false,
    rateMin: 420,
    rateMax: 620,
    skills: ["Hybrid Solar Inverter Design", "Perkins/Cummins Generator Maintenance", "LiFePO4 Lithium Rack Storage", "Automatic Transfer Switch Calibration", "Solar PV Rooftop Array Mounting", "Off-Grid Battery Bank Sizing"],
    doc: "Energy Authority Solar Competency Class A",
    bio: "Renewable energy technician deploying rooftop solar arrays, hybrid inverters, battery storage banks, and backup generators.",
  },
  {
    name: "Tailor & Habesha Craft",
    slug: "tailor-habesha-craft",
    icon: "Scissors",
    color: "text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/40",
    description: "Traditional Habesha Kemis embroidery, modern suit tailoring, curtain sewing, and textile alterations",
    isPopular: false,
    rateMin: 280,
    rateMax: 450,
    skills: ["Handmade Gold & Silk Tibeb Embroidery", "Custom Habesha Kemis Tailoring", "Traditional Bridal Gowns", "Modern Ethiopian Formal Wear", "Handloom Cotton Netela & Gabi", "Bespoke Suit Alterations", "Curtain & Drape Sewing"],
    doc: "Ethiopian Textile & Handicraft Master License",
    bio: "Traditional Habesha fashion artisan crafting handmade Tibeb embroidery dresses, modern Ethiopian wedding attire, and tailored suits.",
  },
];

const INITIAL_LOCATIONS = [
  {
    city: "Addis Ababa",
    subCities: [
      "Bole", "Kazanchis", "Piassa", "Sarbet", "Meganagna", "CMC", "Gerji", "Summit", "Lebu", "Kera",
      "Gotera", "Kolfe", "Ayat", "Old Airport", "Gurd Shola", "22 Mazoria", "Lideta", "Kirkos", "Arada",
      "Yeka", "Gullele", "Akaki Kality", "Nifas Silk-Lafto", "Lemi Kura",
    ],
  },
  {
    city: "Hawassa",
    subCities: ["Piazza", "Tabor", "Menhariya", "Haile Resort Area", "Millennium"],
  },
  {
    city: "Bahir Dar",
    subCities: ["Kebele 04", "Kebele 14", "Giyorgis", "Abay Mado", "Diaspora Area"],
  },
  {
    city: "Adama",
    subCities: ["Bole", "Posta", "Goro", "Dembi", "Wonji Road"],
  },
  {
    city: "Dire Dawa",
    subCities: ["Kezira", "Megala", "Sabian", "Gende Kore"],
  },
  {
    city: "Gondar",
    subCities: ["Arada", "Maraki", "Azezo", "Fasiledes"],
  },
  {
    city: "Bishoftu",
    subCities: ["Hora Lake Area", "Babogaya", "Kuriftu", "City Center"],
  },
  {
    city: "Jimma",
    subCities: ["Hermata", "Mendera", "Ginjo", "Jiren"],
  },
];

interface ProviderDef {
  name: string;
  username: string;
  email: string;
  category: string;
  hourlyRate: number;
  experienceYears: number;
  skills: string[];
  phone: string;
  bio: string;
  location: { city: string; subCity: string; address: string };
  verificationStatus: VerificationStatus;
  verificationDocType: string;
  verificationDocUrl: string;
  completedJobsCount: number;
  repeatCustomerCount: number;
  providerCancelledCount: number;
}

const INITIAL_SYSTEM_CONFIG = {
  key: "global",
  allowedVerificationDocTypes: [
    "Kebele ID",
    "National ID (Fayda)",
    "Ethiopian Trade License",
    "Driver's License",
    "Passport",
    "Professional Certification / Degree",
  ],
  avatarConfig: {
    baseUrl: "https://api.dicebear.com/7.x/initials/svg",
    bgColors: ["ffb545", "98fdce", "2563eb"],
  },
};

const SUBCITY_LANDMARKS: Record<string, string[]> = {
  "Bole": ["Bole Medhanialem St", "Atlas Hotel Lane", "Olympia Area", "Japan Embassy St", "Rwanda St", "Bole Brass", "Main Expressway Rd", "Bole Adama Square", "Rift Valley University Ave", "Executive Quarters"],
  "Kazanchis": ["Near UNECA Compound", "Menelik II Ave", "Intercontinental Lane", "ECA Road", "Elilly Area", "Zewditu St"],
  "Piassa": ["Churchill Ave", "Cunningham St", "De Gaulle Square", "Arada St", "Posta Bet Lane", "Mahmud Music Area"],
  "Sarbet": ["Roosevelt St", "Karl Square Area", "AU Roundabout", "Old Airport Rd", "Pushkin Square", "Victoria St"],
  "Meganagna": ["Zefmesh Grand Mall Area", "Lem Hotel St", "Meganagna Square", "Kokeb Building Lane", "Sileshi St"],
  "CMC": ["Ayat Grand Mall Rd", "Michael Roundabout", "Tsehay Real Estate", "St. Michael Church Area", "Sahilitomite St"],
  "Gerji": ["Mebrat Hail Condominium", "Jakros Area", "Unity University Rd", "Imperial Hotel Lane", "Sunshine Real Estate"],
  "Summit": ["Summit Condominium", "Near Safari Junction", "Coca-Cola Bottling Area", "Safari Real Estate", "Pepsi Junction"],
  "Lebu": ["Musika Sefer Avenue", "Lebu Varnero", "Mebrat Hail Square", "Lebu Commercial Center", "Haile Garment Rd"],
  "Kera": ["Gofa Sefer", "Bulbula Junction", "Kera Slaughterhouse Rd", "Sofa Sefer", "Gotera Link"],
  "Gotera": ["Near Pepsi Factory", "Gotera Interchange", "Gofa Mazoria", "Global Hotel Area", "Ethio-China St"],
  "Kolfe": ["18 Mazoria", "Kolfe Police Station Area", "Ayer Tena Junction", "Keranio St", "Tor Hailoch Rd"],
  "Ayat": ["Ayat Zone 2", "Ayat Zone 3", "Ayat Real Estate Villa 102", "Tafo Road", "Ayat Roundabout"],
  "Old Airport": ["South Africa St", "Bisrate Gabriel", "Near Vatican Embassy", "ICS International School Area", "Adams Pavilion"],
  "Gurd Shola": ["Athletics Federation Building", "Century Mall Rd", "Besrate Gabriel Area", "Salite Mehret St", "Civil Service Area"],
  "22 Mazoria": ["Haya Hulet Square", "Axum Hotel Area", "Mekanisa Link", "Atlas Junction", "Golagul Tower Area"],
  "Lideta": ["Balcha Hospital St", "Lideta Condominium", "Mexico Square", "Abakoran Area", "Darfur St"],
  "Kirkos": ["Meskel Flower", "Beklobet Area", "Olympia Junction", "Riche Area", "Debre Zeyit Rd"],
  "Arada": ["4 Kilo Square", "6 Kilo University Rd", "Piazza Overpass", "St. George Cathedral Lane", "Jan Meda Gate", "Fasiledes Castle Ave", "Arada Central Market", "Posta Square", "Cinema Gondar Lane"],
  "Yeka": ["Kotebe Metal Factory Rd", "Yeka Abado", "Megenagna Hills", "Signal Area", "Ferensay Legasion"],
  "Gullele": ["Shiro Meda Textile Market", "Addis Ababa University North Gate", "Semien Hotel Area", "Entoto Foothills", "Wingate Rd"],
  "Akaki Kality": ["Crown Hotel Area", "Kality Square", "Tulu Dimtu Link", "Kality Customs Area", "Akaki Bridge"],
  "Nifas Silk-Lafto": ["Jomo 1 Condominium", "Lafto Mall Area", "Mechanisa German Square", "Haile Garment", "Vefa Junction"],
  "Lemi Kura": ["Figa Junction", "Lemi Kura Subcity HQ", "Bole Arabsa Zone 1", "Ayat East Gate", "Goro Roundabout"],

  "Piazza": ["Lake Awassa Promenade", "Piazza Central Square", "Posta Bet Rd", "Haile Resort Blvd"],
  "Tabor": ["Tabor Mountain Rd", "Tabor Ceramic Area", "St. Gabriel Church St", "Bate Area"],
  "Menhariya": ["Bus Station Terminal", "Menhariya Commercial Ave", "Gelan Area", "Hawassa Stadium Rd"],
  "Haile Resort Area": ["Lake View Blvd", "Resort Strip", "Fikir Lake Front", "Gudumale Park Area"],
  "Millennium": ["Millennium Park Rd", "Industrial Park Gate 1", "Datto Area", "Hawassa University Main Gate"],

  "Kebele 04": ["Lake Tana Promenade", "Felege Hiwot Rd", "Piazza Central", "St. George Church St"],
  "Kebele 14": ["Lake Tana View", "Bahir Dar University Main Gate", "Diaspora Blvd", "Kuriftu Lake Area"],
  "Giyorgis": ["Giyorgis Square", "Nile Bridge Rd", "Tana Market", "Abay Basin Authority Area"],
  "Abay Mado": ["Blue Nile Falls Rd", "Abay Mado Market", "Tis Abay Link", "Grand Hotel Ave"],
  "Diaspora Area": ["Diaspora Village", "Lakeside Villas", "Papyrus Hotel Lane", "Shimbit St"],

  "Posta": ["Station Quarter", "Posta Bet Central", "Commercial Bank Rd", "Oromia Square"],
  "Goro": ["Goro Market Area", "Franko Junction", "Adama Stadium Rd", "Mojo Road"],
  "Dembi": ["Dembi Residential Complex", "Awash River Link", "Dembi School Rd", "East Bypass"],
  "Wonji Road": ["Wonji Sugar Factory Ave", "Industrial Zone Rd", "Wonji Curve", "Canal View"],

  "Kezira": ["Franco-Ethiopian Railway St", "Kezira Boulevard", "Continental Hotel Rd", "Ras Hotel Square"],
  "Megala": ["Taiwan Market Area", "Avenue Gabriel", "Megala Central Mosque Lane", "Dechatu River Walk"],
  "Sabian": ["Sabian General Hospital Rd", "Sabian High School St", "Dire Dawa Textile Area", "Depot Rd"],
  "Gende Kore": ["Gende Kore Residential Zone", "Airport Road", "Melka Jebdu Link", "Shinile Gate"],

  "Maraki": ["University of Gondar Campus", "Maraki Hills", "Hospital Rd", "Kuskuam Link"],
  "Azezo": ["Gondar Airport Road", "Azezo Military Camp Gate", "Teda Road", "Tseda Area"],
  "Fasiledes": ["Fasiledes Bath Compound", "Goha Hotel Viewpoint", "Debre Berhan Selassie Rd", "Enfranz Link"],

  "Hora Lake Area": ["Hora Lake Resort Way", "Hora Lakeside Trail", "Waterfront Boulevard", "Pyramid Hotel Rd"],
  "Babogaya": ["Babogaya Lakefront", "Lakeside Road", "Asham Resort Lane", "View Point Drive"],
  "Kuriftu": ["Kuriftu Resort Rd", "Lake Kuriftu Promenade", "Bishoftu Spa Lane", "Water Park Way"],
  "City Center": ["Main Highway Cross", "Bishoftu Municipal Hall", "Railway Station", "Central Market"],

  "Hermata": ["Hermata Market Square", "Abba Jifar Palace Rd", "Central Commercial St", "Merato Area"],
  "Mendera": ["Mendera Residential Quarters", "Jimma University Gate 2", "Kochi Area", "Gibe Link"],
  "Ginjo": ["Ginjo Commercial District", "Aba Buna St", "Hospital Link", "Bonga Road"],
  "Jiren": ["Abba Jifar Historic Gate", "Jiren Hilltop", "Palace View", "Old Kingdom Rd"],
};

const PRESERVED_PROVIDERS: ProviderDef[] = [
  {
    name: "Abebe Kebede",
    username: "abebe_electric",
    email: "provider@sureservice.com",
    category: "Electrician",
    hourlyRate: 450,
    experienceYears: 9,
    skills: ["Breaker Panel Upgrades", "Emergency Diagnostics", "Industrial Wiring", "Solar Inverter Setup"],
    phone: "+251 91 122 3344",
    bio: "Certified master electrician with 9+ years experience resolving complex residential and commercial electrical faults across Addis Ababa.",
    location: { city: "Addis Ababa", subCity: "Bole", address: "Bole Medhanialem Street" },
    verificationStatus: "approved",
    verificationDocType: "Trade Competency License Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 12,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
  {
    name: "Ermias Desta",
    username: "ermias_solar",
    email: "ermias.solar@sureservice.com",
    category: "Electrician",
    hourlyRate: 480,
    experienceYears: 8,
    skills: ["Solar Photovoltaic Design", "Battery Bank Storage", "Hybrid Inverter Systems", "Commercial Wiring"],
    phone: "+251 91 444 8899",
    bio: "Renewable energy electrical specialist installing turnkey hybrid solar systems for hotels, farms, and homes in Hawassa and SNNPR.",
    location: { city: "Hawassa", subCity: "Tabor", address: "Tabor Mountain Road" },
    verificationStatus: "approved",
    verificationDocType: "Ministry of Water & Energy Solar License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Samuel Girma",
    username: "samuel_plumb",
    email: "samuel.plumbing@sureservice.com",
    category: "Plumber",
    hourlyRate: 420,
    experienceYears: 9,
    skills: ["Borehole Pump Installation", "Drip Irrigation Pipelines", "Water Tank Plumbing", "Drainage Unblocking"],
    phone: "+251 91 666 0011",
    bio: "Master plumber specializing in deep borehole submersible pumps, agricultural water distribution, and domestic plumbing in Adama.",
    location: { city: "Adama", subCity: "Posta", address: "Station Quarter" },
    verificationStatus: "approved",
    verificationDocType: "Oromia Trade Competency Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Yohannes Tadesse",
    username: "yohannes_plumb",
    email: "yohannes.plumbing@sureservice.com",
    category: "Plumber",
    hourlyRate: 400,
    experienceYears: 8,
    skills: ["Leak Detection", "Boiler Repair", "Bathroom Fixtures Installation", "Water Pump Systems"],
    phone: "+251 91 344 5566",
    bio: "Expert plumber specializing in underground leak repair, water pump pressure systems, and sanitary pipe fitting across Addis Ababa.",
    location: { city: "Addis Ababa", subCity: "Piassa", address: "Churchill Avenue" },
    verificationStatus: "approved",
    verificationDocType: "Municipal Trade Certificate",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 8,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Almaz Tesfaye",
    username: "almaz_cleaning",
    email: "almaz.cleaning@sureservice.com",
    category: "Home Cleaner",
    hourlyRate: 300,
    experienceYears: 6,
    skills: ["Deep Cleaning", "Move-in/Move-out Sanitization", "Window & Glass Detailing", "Post-Construction Clean"],
    phone: "+251 91 233 4455",
    bio: "Thorough, meticulous professional residential and commercial cleaning specialist equipped with eco-friendly sanitizing equipment.",
    location: { city: "Addis Ababa", subCity: "Kazanchis", address: "Near UNECA Compound" },
    verificationStatus: "approved",
    verificationDocType: "National ID & Commercial Registry",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 11,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
  {
    name: "Hiwot Mengesha",
    username: "hiwot_clean",
    email: "hiwot.clean@sureservice.com",
    category: "Home Cleaner",
    hourlyRate: 280,
    experienceYears: 5,
    skills: ["Corporate Office Cleaning", "Steam Carpet Sanitizing", "Kitchen Grease Removal", "Post-Event Cleanup"],
    phone: "+251 91 555 9900",
    bio: "Reliable commercial and domestic sanitation expert leading trained cleaning teams with professional pressure steam washers.",
    location: { city: "Addis Ababa", subCity: "Gerji", address: "Jakros Area" },
    verificationStatus: "approved",
    verificationDocType: "Commercial Cleaning License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 8,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Dr. Bereket Zewdu",
    username: "bereket_stem",
    email: "bereket.tutor@sureservice.com",
    category: "Tutor",
    hourlyRate: 500,
    experienceYears: 10,
    skills: ["University Physics", "Advanced Calculus", "AP / SAT Prep", "Machine Learning & Python Basics"],
    phone: "+251 91 333 7788",
    bio: "University lecturer and private STEM tutor with 10 years experience preparing top candidates for national exams and university competitions.",
    location: { city: "Addis Ababa", subCity: "Ayat", address: "Zone 3, Villa 102" },
    verificationStatus: "approved",
    verificationDocType: "Doctoral Degree & National ID",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 12,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
  {
    name: "Selamawit Alemu",
    username: "selam_tutor",
    email: "selamawit.tutor@sureservice.com",
    category: "Tutor",
    hourlyRate: 350,
    experienceYears: 5,
    skills: ["Mathematics (Grade 9-12)", "Calculus & Algebra", "SAT / National Exam Prep", "Physics Fundamentals"],
    phone: "+251 91 455 6677",
    bio: "B.Sc. in Mathematics from Addis Ababa University with 5 years experience helping students achieve top scores in national exams.",
    location: { city: "Addis Ababa", subCity: "Sarbet", address: "Old Airport Road" },
    verificationStatus: "approved",
    verificationDocType: "AAU Degree Certificate & Kebele ID",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 8,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Fikadu Negash",
    username: "fikadu_carpentry",
    email: "fikadu.carpenter@sureservice.com",
    category: "Carpenter",
    hourlyRate: 460,
    experienceYears: 9,
    skills: ["Custom Kitchen Islands", "Solid Hardwood Wardrobes", "Acoustic Wall Paneling", "Parquet Restoration"],
    phone: "+251 91 766 4488",
    bio: "Master woodworker delivering luxury bespoke furniture, modern fitted kitchens, and solid timber doors across CMC and Bole.",
    location: { city: "Addis Ababa", subCity: "CMC", address: "Ayat Grand Mall Road" },
    verificationStatus: "approved",
    verificationDocType: "Master Craftsman License Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Surafel Belay",
    username: "surafel_wood",
    email: "surafel.carpentry@sureservice.com",
    category: "Carpenter",
    hourlyRate: 400,
    experienceYears: 7,
    skills: ["Hardwood Parquet Flooring", "Bespoke Dining Sets", "Office Workstations", "Security Door Framing"],
    phone: "+251 91 777 1122",
    bio: "Experienced wood artisan creating elegant furniture, durable door frames, and customized cabinetry with fine Ethiopian timber.",
    location: { city: "Addis Ababa", subCity: "Lebu", address: "Musika Sefer" },
    verificationStatus: "approved",
    verificationDocType: "National TVET Level III Carpentry",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 7,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Fitsum Bekele",
    username: "fitsum_wood",
    email: "fitsum.carpentry@sureservice.com",
    category: "Carpenter",
    hourlyRate: 380,
    experienceYears: 7,
    skills: ["Custom Cabinetry", "Door & Window Fitting", "Hardwood Repair", "Modular Furniture"],
    phone: "+251 91 566 7788",
    bio: "Artisan carpenter crafting bespoke wood fixtures, kitchen cabinets, and durable furniture assemblies.",
    location: { city: "Addis Ababa", subCity: "Meganagna", address: "Zefmesh Grand Mall Area" },
    verificationStatus: "approved",
    verificationDocType: "Vocational Carpentry Diploma",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 4,
    repeatCustomerCount: 0,
    providerCancelledCount: 0,
  },
  {
    name: "Eskinder Tesema",
    username: "eskinder_paint",
    email: "eskinder.paint@sureservice.com",
    category: "Painter",
    hourlyRate: 360,
    experienceYears: 8,
    skills: ["High-Gloss Trim & Mouldings", "Anti-Fungal Exterior Wash", "Stucco & Venetian Plaster", "Commercial Spray Painting"],
    phone: "+251 91 188 6600",
    bio: "Premium painting contractor specializing in luxury villa finishes, weather-resistant exterior coatings, and interior stenciling in Bole.",
    location: { city: "Addis Ababa", subCity: "Bole", address: "Japan Embassy Street" },
    verificationStatus: "approved",
    verificationDocType: "National Painting & Decorating License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 9,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Meron Assefa",
    username: "meron_paint",
    email: "meron.painter@sureservice.com",
    category: "Painter",
    hourlyRate: 280,
    experienceYears: 4,
    skills: ["Interior Emulsion", "Weatherproof Exterior Coating", "Textured Wall Finishes", "Epoxy Floor Coatings"],
    phone: "+251 91 788 9900",
    bio: "Professional painter offering smooth, durable interior and exterior finishes for residential houses and hotels in Bahir Dar.",
    location: { city: "Bahir Dar", subCity: "Kebele 04", address: "Felege Hiwot Road" },
    verificationStatus: "approved",
    verificationDocType: "National ID",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 3,
    repeatCustomerCount: 0,
    providerCancelledCount: 0,
  },
  {
    name: "Yonas Kassa",
    username: "yonas_hvac",
    email: "yonas.hvac@sureservice.com",
    category: "HVAC Technician",
    hourlyRate: 520,
    experienceYears: 8,
    skills: ["Central AC Systems", "Commercial Cold Rooms", "Inverter VRF Systems", "R410A Freon Servicing"],
    phone: "+251 91 299 8833",
    bio: "HVAC specialist designing and servicing central ventilation, hotel cooling systems, and cold rooms in Addis Ababa.",
    location: { city: "Addis Ababa", subCity: "22 Mazoria", address: "Cameroon Street" },
    verificationStatus: "approved",
    verificationDocType: "Commercial HVAC & Refrigeration License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Kidus Tadesse",
    username: "kidus_hvac",
    email: "kidus.hvac@sureservice.com",
    category: "HVAC Technician",
    hourlyRate: 460,
    experienceYears: 6,
    skills: ["Walk-in Freezers", "Commercial Chillers", "Ice Maker Repair", "Condenser Coil Replacement"],
    phone: "+251 91 888 2211",
    bio: "Commercial cooling and refrigeration technician servicing lakeside resorts, restaurants, and cold storage facilities in Hawassa.",
    location: { city: "Hawassa", subCity: "Piazza", address: "Lake Awassa Promenade" },
    verificationStatus: "approved",
    verificationDocType: "Commercial Refrigeration Competency Certificate",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 6,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Nebiyu Girma",
    username: "nebiyu_hvac",
    email: "nebiyu.hvac@sureservice.com",
    category: "HVAC Technician",
    hourlyRate: 440,
    experienceYears: 5,
    skills: ["Commercial AC Units", "Freon Leak Diagnostics", "Air Handling Units", "Compressor Overhaul"],
    phone: "+251 91 555 4400",
    bio: "Cooling systems technician providing reliable air conditioner installation and maintenance across Dire Dawa.",
    location: { city: "Dire Dawa", subCity: "Megala", address: "Avenue Gabriel" },
    verificationStatus: "approved",
    verificationDocType: "National Technical Certificate",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 5,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Melaku Kinfu",
    username: "melaku_appliance",
    email: "melaku.appliance@sureservice.com",
    category: "Appliance Repair",
    hourlyRate: 420,
    experienceYears: 9,
    skills: ["Electric Mitad Heating Coils", "Commercial Espresso Machines", "Double-Door Refrigerators", "Digital Microwave Inverters"],
    phone: "+251 91 199 4488",
    bio: "Master technician with 9 years repairing domestic and commercial kitchen appliances, electric mitad baking plates, and espresso machines.",
    location: { city: "Addis Ababa", subCity: "22 Mazoria", address: "Atlas Hotel Lane" },
    verificationStatus: "approved",
    verificationDocType: "Electronics & Appliance Repair License Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Bezawit Assefa",
    username: "bezawit_tech",
    email: "bezawit.appliance@sureservice.com",
    category: "Appliance Repair",
    hourlyRate: 380,
    experienceYears: 6,
    skills: ["Washing Machine PCB Repair", "Induction Cooktop Electronics", "Dishwasher Solenoid Valves", "Blender & Food Processor Motors"],
    phone: "+251 91 277 5511",
    bio: "Certified electronics technician in Gerji repairing washing machines, dishwashers, and complex household control boards.",
    location: { city: "Addis Ababa", subCity: "Gerji", address: "Mebrat Hail Avenue" },
    verificationStatus: "approved",
    verificationDocType: "TVET Electronics Level III",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 7,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Girma Wolde",
    username: "girma_appliance",
    email: "girma.appliance@sureservice.com",
    category: "Appliance Repair",
    hourlyRate: 320,
    experienceYears: 3,
    skills: ["Oven Thermostats", "Blender Motors", "Water Dispenser Coolers"],
    phone: "+251 91 400 3388",
    bio: "Appliance repair technician serving Kolfe and Ayer Tena neighborhoods.",
    location: { city: "Addis Ababa", subCity: "Kolfe", address: "Ayer Tena Junction" },
    verificationStatus: "approved",
    verificationDocType: "National ID & TVET Level II",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 3,
    repeatCustomerCount: 0,
    providerCancelledCount: 3,
  },
  {
    name: "Muluken Fikre",
    username: "muluken_garage",
    email: "muluken.mechanic@sureservice.com",
    category: "Auto Mechanic",
    hourlyRate: 480,
    experienceYears: 10,
    skills: ["Engine Overhauls", "Automatic Transmission Servicing", "ECU Remapping", "Hydraulic Brake Systems"],
    phone: "+251 91 699 5577",
    bio: "Veteran automotive engineer specializing in Toyota, Hyundai, Suzuki, and German vehicle diagnostics and mechanical rebuilding in Kera.",
    location: { city: "Addis Ababa", subCity: "Kera", address: "Gofa Sefer" },
    verificationStatus: "approved",
    verificationDocType: "Master Automotive Technician Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 11,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
  {
    name: "Robel Zeleke",
    username: "robel_auto",
    email: "robel.auto@sureservice.com",
    category: "Auto Mechanic",
    hourlyRate: 450,
    experienceYears: 7,
    skills: ["Hybrid Battery Cell Balancing", "ABS Diagnostics", "Alternator & Starter Motor", "Suspension Tuning"],
    phone: "+251 91 700 6688",
    bio: "Modern vehicle electronic technician specializing in Toyota Prius / Aqua hybrids, sensor calibration, and starter motors in Bole.",
    location: { city: "Addis Ababa", subCity: "Bole", address: "Atlas Hotel Lane" },
    verificationStatus: "approved",
    verificationDocType: "Electronic Diagnostics Specialist Certificate",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 7,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Hailemariam Dessie",
    username: "hailemariam_it",
    email: "hailemariam.it@sureservice.com",
    category: "IT & Network Support",
    hourlyRate: 550,
    experienceYears: 8,
    skills: ["Fiber Optic Splicing", "Cisco & Mikrotik Routing", "Biometric Access Control", "Windows Server Active Directory"],
    phone: "+251 91 811 7799",
    bio: "Senior network systems engineer building high-availability office Wi-Fi, structured cabling, and cloud backup servers in Kazanchis.",
    location: { city: "Addis Ababa", subCity: "Kazanchis", address: "Menelik II Ave" },
    verificationStatus: "approved",
    verificationDocType: "Cisco CCNP & Network Engineering B.Sc.",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Blen Asfaw",
    username: "blen_networks",
    email: "blen.it@sureservice.com",
    category: "IT & Network Support",
    hourlyRate: 450,
    experienceYears: 6,
    skills: ["CCTV Camera Setup", "Enterprise Wi-Fi 6 Meshing", "Firewall & Cybersecurity", "Structured Cat6A Cabling"],
    phone: "+251 91 922 8800",
    bio: "Certified network technician deploying secure IP security cameras, unified office networks, and reliable workstation setups in Piassa.",
    location: { city: "Addis Ababa", subCity: "Piassa", address: "Churchill Ave" },
    verificationStatus: "approved",
    verificationDocType: "CompTIA Network+ & B.Sc. IT",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 7,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Eden Haile",
    username: "eden_gardens",
    email: "eden.landscape@sureservice.com",
    category: "Landscaper & Gardener",
    hourlyRate: 350,
    experienceYears: 6,
    skills: ["Landscape Architecture Design", "Compound Lawn Sodding", "Ornamental Palm Pruning", "Drip Garden Irrigation"],
    phone: "+251 91 888 2233",
    bio: "Horticulturist designing lush residential gardens, hotel landscaping, and tranquil water fountain greenery in Bishoftu and Addis.",
    location: { city: "Bishoftu", subCity: "Babogaya", address: "Babogaya Lakefront" },
    verificationStatus: "approved",
    verificationDocType: "Horticulture License & Commercial Registry",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 9,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Wondwossen Mulugeta",
    username: "wondwossen_land",
    email: "wondwossen.landscape@sureservice.com",
    category: "Landscaper & Gardener",
    hourlyRate: 360,
    experienceYears: 7,
    skills: ["Stone Pathway Landscaping", "Compound Hedging", "Kikuyu Grass Aeration & Fertilizing", "Tree Surgery & Canopy Pruning"],
    phone: "+251 91 144 0022",
    bio: "Experienced botanical landscaper creating serene private villa gardens and commercial greenery across Sarbet and Old Airport.",
    location: { city: "Addis Ababa", subCity: "Old Airport", address: "South Africa St" },
    verificationStatus: "approved",
    verificationDocType: "Landscape Architecture & Botany Certificate",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 7,
    repeatCustomerCount: 1,
    providerCancelledCount: 0,
  },
  {
    name: "Tariku Gizaw",
    username: "tariku_security",
    email: "tariku.locks@sureservice.com",
    category: "Locksmith & Security",
    hourlyRate: 450,
    experienceYears: 8,
    skills: ["Smart Biometric Deadbolts", "High-Security Master Key Systems", "Emergency Safe Cracking", "Commercial Panic Bar Exit Doors"],
    phone: "+251 91 477 3366",
    bio: "Certified security hardware master installing smart door locks, keyless entry card systems, and master key suites in Bole and Kazanchis.",
    location: { city: "Addis Ababa", subCity: "Bole", address: "Olympia Area" },
    verificationStatus: "approved",
    verificationDocType: "Security Trade License & Police Clearance",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Zerihun Tefera",
    username: "zerihun_auto_keys",
    email: "zerihun.keys@sureservice.com",
    category: "Locksmith & Security",
    hourlyRate: 380,
    experienceYears: 4,
    skills: ["Automotive Transponder Key Cutting", "Padlock Rekeying", "Electric Strike Plate Installation", "Door Chain & Deadbolt Locks"],
    phone: "+251 91 699 5588",
    bio: "Automotive and residential key maker offering laser key duplication and electronic remote key fobs in Gotera.",
    location: { city: "Addis Ababa", subCity: "Gotera", address: "Gotera Interchange" },
    verificationStatus: "approved",
    verificationDocType: "Security Trade License & Police Clearance",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 3,
    repeatCustomerCount: 0,
    providerCancelledCount: 2,
  },
  {
    name: "Endale Workineh",
    username: "endale_terrazzo",
    email: "endale.flooring@sureservice.com",
    category: "Flooring & Tiling",
    hourlyRate: 420,
    experienceYears: 9,
    skills: ["Terrazzo Diamond Grinding", "Italian Porcelain Tile Laying", "Granite & Marble Counter Polishing", "Epoxy 3D Metallic Flooring"],
    phone: "+251 91 700 6699",
    bio: "Specialist in terrazzo casting, diamond machine polishing, and flawless porcelain tiling for luxury homes and office buildings in Lebu.",
    location: { city: "Addis Ababa", subCity: "Lebu", address: "Lebu Varnero" },
    verificationStatus: "approved",
    verificationDocType: "Flooring Trade Competency Certificate Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 11,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
  {
    name: "Binyam Mengistu",
    username: "binyam_tile",
    email: "binyam.tile@sureservice.com",
    category: "Flooring & Tiling",
    hourlyRate: 350,
    experienceYears: 4,
    skills: ["Ceramic Bathroom Tiles", "Tile Regrouting", "Subfloor Leveling & Screeding"],
    phone: "+251 91 011 2233",
    bio: "Tile installer for bathrooms, kitchens and terrace corridors across Bole and surrounding areas.",
    location: { city: "Addis Ababa", subCity: "Bole", address: "Rwanda St" },
    verificationStatus: "approved",
    verificationDocType: "Flooring Trade Competency Certificate Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 2,
    repeatCustomerCount: 0,
    providerCancelledCount: 2,
  },
  {
    name: "Teshome Wolde",
    username: "teshome_roof",
    email: "teshome.roofing@sureservice.com",
    category: "Roofing & Waterproofing",
    hourlyRate: 450,
    experienceYears: 9,
    skills: ["Bitumen Torch-On Membranes", "Concrete Roof Deck Sealant", "Rain Gutter Installation", "Tile Roof Leak Sealing"],
    phone: "+251 91 033 9922",
    bio: "Master roofing contractor with 9 years defending Addis Ababa villas and commercial complexes from heavy seasonal rainwater leaks.",
    location: { city: "Addis Ababa", subCity: "Gurd Shola", address: "Century Mall Rd" },
    verificationStatus: "approved",
    verificationDocType: "Civil Construction & Waterproofing License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Dagnachew Mengistu",
    username: "dagnachew_leather",
    email: "dagnachew.upholstery@sureservice.com",
    category: "Upholsterer & Furniture",
    hourlyRate: 400,
    experienceYears: 8,
    skills: ["Chesterfield Deep Button Tufting", "Genuine Ethiopian Leather Sofas", "Orthopedic Foam Density Matching", "Automotive Leather Interior Customization"],
    phone: "+251 91 366 2255",
    bio: "Master upholsterer restoring antique and luxury living room sofas, car interior leather, and executive office chairs in Gotera.",
    location: { city: "Addis Ababa", subCity: "Gotera", address: "Global Hotel Area" },
    verificationStatus: "approved",
    verificationDocType: "Leather & Textile Craftsman License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Girum Abera",
    username: "girum_metal",
    email: "girum.welder@sureservice.com",
    category: "Welder & Metalworker",
    hourlyRate: 450,
    experienceYears: 10,
    skills: ["Heavy Compound Security Gates", "MIG/TIG Stainless Steel Welding", "Structural Truss Fabrication", "Window Burglar Grilles"],
    phone: "+251 91 699 5599",
    bio: "Master metal fabricator with 10 years experience crafting heavy steel gates, decorative balcony railings, and structural steel in Kolfe.",
    location: { city: "Addis Ababa", subCity: "Kolfe", address: "18 Mazoria" },
    verificationStatus: "approved",
    verificationDocType: "Master Welder License Level IV",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 12,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
  {
    name: "Danait Gebregziabher",
    username: "danait_movers",
    email: "danait.movers@sureservice.com",
    category: "Moving & Relocation",
    hourlyRate: 500,
    experienceYears: 7,
    skills: ["Fragile Bubble-Wrap Packaging", "Heavy Furniture Crane Hoisting", "Intercity Moving Logistics", "Padded Truck Transport"],
    phone: "+251 91 033 9933",
    bio: "Professional relocation team leader ensuring zero-damage packing, careful loading, and swift residential and office moving in Bole.",
    location: { city: "Addis Ababa", subCity: "Bole", address: "Bole Brass" },
    verificationStatus: "approved",
    verificationDocType: "Transport & Logistics Operating Permit",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 10,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Elsabeth Haile",
    username: "elsabeth_dish",
    email: "elsabeth.dish@sureservice.com",
    category: "Satellite & TV Tech",
    hourlyRate: 350,
    experienceYears: 6,
    skills: ["Flush OLED TV Wall Mounting", "Multi-LNB Dish Alignment (NSS12/DSTV)", "Home Theater Surround Audio Cabling", "Soundbar & Subwoofer Setup"],
    phone: "+251 91 144 0066",
    bio: "Audio-visual technician installing flush TV wall mounts, satellite dish alignment, sound systems, and multi-room cabling in Sarbet.",
    location: { city: "Addis Ababa", subCity: "Sarbet", address: "Pushkin Square" },
    verificationStatus: "approved",
    verificationDocType: "Electronics & Audio-Visual Cert Level III",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 8,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Selam Bekele",
    username: "selam_solar",
    email: "selam.solar@sureservice.com",
    category: "Solar & Generator Tech",
    hourlyRate: 480,
    experienceYears: 7,
    skills: ["Hybrid Solar Inverter Design", "LiFePO4 Lithium Rack Storage", "Automatic Transfer Switch Calibration", "Solar PV Rooftop Array Mounting"],
    phone: "+251 91 255 1166",
    bio: "Renewable energy technician deploying rooftop solar arrays, hybrid inverters, battery storage banks, and backup generators in Bahir Dar.",
    location: { city: "Bahir Dar", subCity: "Kebele 04", address: "Lake Tana Promenade" },
    verificationStatus: "approved",
    verificationDocType: "Energy Authority Solar Competency Class A",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 9,
    repeatCustomerCount: 2,
    providerCancelledCount: 0,
  },
  {
    name: "Tizita Belay",
    username: "tizita_kemis",
    email: "tizita.craft@sureservice.com",
    category: "Tailor & Habesha Craft",
    hourlyRate: 420,
    experienceYears: 9,
    skills: ["Handmade Gold & Silk Tibeb Embroidery", "Custom Habesha Kemis Tailoring", "Traditional Bridal Gowns", "Modern Ethiopian Formal Wear"],
    phone: "+251 91 133 7755",
    bio: "Renowned traditional fashion artisan weaving custom Habesha Kemis dresses, wedding attire, and modern Afro-chic garments in Piassa.",
    location: { city: "Addis Ababa", subCity: "Piassa", address: "Cunningham St" },
    verificationStatus: "approved",
    verificationDocType: "Ethiopian Textile & Handicraft Master License",
    verificationDocUrl: "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg",
    completedJobsCount: 11,
    repeatCustomerCount: 3,
    providerCancelledCount: 0,
  },
];

const FIRST_NAMES = [
  "Dawit", "Almaz", "Bethlehem", "Bereket", "Selamawit", "Fikadu", "Eskinder", "Yonas", "Melaku",
  "Muluken", "Hailemariam", "Eden", "Tariku", "Endale", "Teshome", "Dagnachew", "Girum", "Danait", "Elsabeth",
  "Selam", "Tizita", "Ermias", "Samuel", "Yohannes", "Eyob", "Daniel", "Hiwot", "Tigist", "Frehiwot",
  "Tamirat", "Ruth", "Surafel", "Fitsum", "Anteneh", "Elias", "Meron", "Genet", "Feven", "Kidus",
  "Nebiyu", "Binyam", "Bezawit", "Robel", "Zerihun", "Wondwossen", "Blen", "Mikiyas", "Abel", "Kalkidan",
  "Biruk", "Senait", "Yared", "Tsion", "Henok", "Rahel", "Solomon", "Mahlet", "Natnael", "Eyerusalem",
  "Meseret", "Getachew", "Worku", "Tadesse", "Bekele", "Mengistu", "Haile", "Kassa", "Assefa", "Belay",
  "Negash", "Girma", "Tesfaye", "Desta", "Kebede", "Alemu", "Zewdu", "Tesema", "Kinfu", "Fikre",
  "Dessie", "Gizaw", "Workineh", "Wolde", "Abera", "Gebregziabher", "Belayneh", "Gebre", "Mulugeta", "Demisse",
  "Hailu", "Berhanu", "Alemayehu", "Mekonnen", "Mengesha", "Abebaw", "Sisay", "Taye", "Sintayehu", "Tesfahun",
  "Habtamu", "Belete", "Mulu", "Genene", "Birhanu", "Negussie", "Tefera", "Lemma", "Aschalew", "Yohanes",
  "Abiy", "Tewodros", "Tedros", "Nahom", "Kirubel", "Leul", "Yonatan", "Samson", "Amanuel", "Bisrat",
  "Fanuel", "Dagim", "Eyasu", "Ephrem", "Yidnekachew", "Brook", "Michael", "Fasika", "Aster", "Hana",
  "Lensa", "Marta", "Sara", "Helen", "Saron", "Hawi", "Samrawit", "Makeda", "Nardos", "Rediet",
  "Fikir", "Gelila", "Meklit", "Helina", "Eleni", "Hermela", "Lydia", "Aklilu", "Biniam", "Gedion",
  "Kassahun", "Nega", "Semir", "Tarekegn", "Zelalem", "Tibebu", "Wubshet", "Tamru", "Seyoum", "Negatu",
  "Moges", "Kifle", "Gashaw", "Demeke", "Berhe", "Ashenafi", "Amha", "Addisu", "Abinet", "Alem",
  "Chala", "Eshetu", "Fasil", "Girmaw", "Habte", "Kinde", "Lulseged", "Melesse", "Nigatu", "Tilahun",
  "Wondimu", "Yemane", "Zewdie", "Fisseha", "Kefyalew", "Mebratu", "Petros", "Weldemariam", "Yitbarek", "Zeleke",
  "Kassaye", "Dibaba", "Wami", "Gebrselassie", "Bikila", "Roba", "Tulu", "Bayisa", "Debela", "Tolessa",
  "Megersa", "Gudeta", "Bedada", "Urga", "Diriba", "Kumsa", "Dinkisa", "Feyisa", "Bulcha", "Girmaw",
  "Yohannis", "Abebech", "Derartu", "Tirunesh", "Meseret", "Genzebe", "Almaz", "Ejegayehu", "Kutre", "Fatuma",
  "Gete", "Berhane", "Aselefech", "Firehiwot", "Roman", "Tiki", "Mare", "Senbere", "Letesenbet", "Gudaf",
  "Tigst", "Yalemzerf", "Gotytom", "Hirut", "Worknesh", "Teyba", "Emebet", "Mestawet", "Aheza", "Sutume"
];

const LAST_NAMES = [
  "Kebede", "Tesfaye", "Haile", "Girma", "Alemu", "Negash", "Tesema", "Kassa", "Kinfu", "Fikre",
  "Dessie", "Gizaw", "Workineh", "Wolde", "Mengistu", "Abera", "Gebregziabher", "Belayneh", "Belay", "Desta",
  "Tadesse", "Mekonnen", "Mengesha", "Abebe", "Zewdu", "Bekele", "Assefa", "Hailu", "Berhanu", "Alemayehu",
  "Demisse", "Mulugeta", "Gebre", "Worku", "Getachew", "Taye", "Sisay", "Habtamu", "Belete", "Birhanu",
  "Negussie", "Tefera", "Lemma", "Aschalew", "Tewodros", "Tedros", "Nahom", "Kirubel", "Amanuel", "Bisrat",
  "Ephrem", "Michael", "Fasika", "Gedion", "Kassahun", "Nega", "Tarekegn", "Zelalem", "Tibebu", "Wubshet",
  "Tamru", "Seyoum", "Negatu", "Moges", "Kifle", "Gashaw", "Demeke", "Berhe", "Ashenafi", "Amha",
  "Addisu", "Abinet", "Alem", "Eshetu", "Fasil", "Girmaw", "Habte", "Kinde", "Lulseged", "Melesse",
  "Nigatu", "Tilahun", "Wondimu", "Yemane", "Zewdie", "Fisseha", "Kefyalew", "Mebratu", "Petros", "Weldemariam",
  "Yitbarek", "Zeleke", "Kassaye", "Dibaba", "Wami", "Gebrselassie", "Bikila", "Roba", "Tulu", "Bayisa"
];

const generateAllProviderDefs = (): ProviderDef[] => {
  const preservedBySubcity = new Map<string, ProviderDef[]>();
  for (const p of PRESERVED_PROVIDERS) {
    const key = `${p.location.city}:::${p.location.subCity}`;
    if (!preservedBySubcity.has(key)) {
      preservedBySubcity.set(key, []);
    }
    preservedBySubcity.get(key)!.push(p);
  }

  const usedUsernames = new Set(PRESERVED_PROVIDERS.map(p => p.username));
  const usedEmails = new Set(PRESERVED_PROVIDERS.map(p => p.email));
  const usedPhones = new Set(PRESERVED_PROVIDERS.map(p => p.phone));
  const usedFullNames = new Set(PRESERVED_PROVIDERS.map(p => p.name));

  const allProviders: ProviderDef[] = [];
  let subcityCounter = 0;
  let nameIndex = 0;
  let phoneCounter = 1000;

  for (const loc of INITIAL_LOCATIONS) {
    for (const subCity of loc.subCities) {
      const key = `${loc.city}:::${subCity}`;
      const preserved = preservedBySubcity.get(key) || [];
      const subcityProviders = [...preserved];
      const existingCats = new Set(subcityProviders.map(p => p.category));

      let catOffset = 0;
      while (subcityProviders.length < 5) {
        const catIndex = (subcityCounter * 5 + catOffset) % INITIAL_CATEGORIES.length;
        catOffset++;
        const catObj = INITIAL_CATEGORIES[catIndex];
        if (existingCats.has(catObj.name)) {
          continue;
        }
        existingCats.add(catObj.name);

        let firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
        let lastName = LAST_NAMES[(nameIndex * 3 + subcityCounter) % LAST_NAMES.length];
        let fullName = `${firstName} ${lastName}`;
        while (usedFullNames.has(fullName)) {
          nameIndex++;
          firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
          lastName = LAST_NAMES[(nameIndex * 3 + subcityCounter) % LAST_NAMES.length];
          fullName = `${firstName} ${lastName}`;
        }
        usedFullNames.add(fullName);
        nameIndex++;

        const catSlug = catObj.name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").slice(0, 10);
        let username = `${firstName.toLowerCase()}_${catSlug}`;
        if (usedUsernames.has(username)) {
          username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${catSlug}`.slice(0, 30);
        }
        let uSuffix = 2;
        while (usedUsernames.has(username)) {
          username = `${firstName.toLowerCase()}_${catSlug}_${uSuffix++}`;
        }
        usedUsernames.add(username);

        let email = `${username}@sureservice.com`;
        let eSuffix = 2;
        while (usedEmails.has(email)) {
          email = `${username}${eSuffix++}@sureservice.com`;
        }
        usedEmails.add(email);

        phoneCounter += 3;
        const phonePrefix = (phoneCounter % 2 === 0) ? "+251 91" : "+251 92";
        const pA = String(100 + (phoneCounter % 890));
        const pB = String(1000 + ((phoneCounter * 7) % 8990));
        let phone = `${phonePrefix} ${pA.slice(0, 3)} ${pB.slice(0, 4)}`;
        while (usedPhones.has(phone)) {
          phoneCounter += 7;
          phone = `${phonePrefix} ${String(100 + (phoneCounter % 890)).slice(0, 3)} ${String(1000 + ((phoneCounter * 7) % 8990)).slice(0, 4)}`;
        }
        usedPhones.add(phone);

        const landmarks = SUBCITY_LANDMARKS[subCity] || [`${subCity} Central Road`, `${subCity} Square`, `${subCity} Avenue`];
        const address = landmarks[subcityProviders.length % landmarks.length];

        const skillA = catObj.skills[(subcityCounter + subcityProviders.length) % catObj.skills.length];
        const skillB = catObj.skills[(subcityCounter + subcityProviders.length + 2) % catObj.skills.length];
        const skillC = catObj.skills[(subcityCounter + subcityProviders.length + 4) % catObj.skills.length];
        const skills = [skillA, skillB, skillC];

        const hourlyRate = Math.round((catObj.rateMin + ((subcityCounter * 17 + subcityProviders.length * 23) % (catObj.rateMax - catObj.rateMin))) / 10) * 10;
        const experienceYears = 3 + ((subcityCounter + subcityProviders.length * 2) % 9);

        let verificationStatus: VerificationStatus = "approved";
        let verificationDocType = catObj.doc;
        let verificationDocUrl = "https://res.cloudinary.com/tlbpdthp/image/upload/v1787057064/fayda_sample_uao4ae.jpg";
        let completedJobsCount = 0;
        let repeatCustomerCount = 0;
        let providerCancelledCount = 0;

        const slot = subcityProviders.length;
        if (slot === 0) {
          completedJobsCount = 10 + (subcityCounter % 3);
          repeatCustomerCount = 2 + (subcityCounter % 2);
        } else if (slot === 1) {
          completedJobsCount = 7 + (subcityCounter % 3);
          repeatCustomerCount = 1 + (subcityCounter % 2);
        } else if (slot === 2) {
          completedJobsCount = 4 + (subcityCounter % 3);
          repeatCustomerCount = (subcityCounter % 2 === 0) ? 1 : 0;
        } else if (slot === 3) {
          if (subcityCounter % 4 === 0) {
            verificationStatus = "pending";
            verificationDocType = "National ID (Fayda)";
            completedJobsCount = 1;
          } else {
            completedJobsCount = 2 + (subcityCounter % 2);
          }
        } else {
          if (subcityCounter % 5 === 0) {
            verificationStatus = "unverified";
            verificationDocUrl = "";
            completedJobsCount = 0;
          } else if (subcityCounter % 7 === 0) {
            completedJobsCount = 4;
            providerCancelledCount = 2;
          } else {
            completedJobsCount = 3;
          }
        }

        const bio = `${catObj.bio.replace("resident", `trusted pro in ${subCity}, ${loc.city}`)} Dedicated to high-standard workmanship for clients across ${loc.city}.`;

        subcityProviders.push({
          name: fullName,
          username,
          email,
          category: catObj.name,
          hourlyRate,
          experienceYears,
          skills,
          phone,
          bio,
          location: { city: loc.city, subCity, address },
          verificationStatus,
          verificationDocType,
          verificationDocUrl,
          completedJobsCount,
          repeatCustomerCount,
          providerCancelledCount,
        });
      }

      allProviders.push(...subcityProviders);
      subcityCounter++;
    }
  }

  return allProviders;
};

const seedDatabase = async () => {
  try {
    await connectDb();
    console.log("Connected to MongoDB for SureService seeding...");

    // Clear existing collections
    await ReviewModel.deleteMany({});
    await BookingModel.deleteMany({});
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await LocationModel.deleteMany({});
    await SystemConfigModel.deleteMany({});

    console.log("Cleared existing collections.");

    // Seed System Config, Categories, and Locations
    await SystemConfigModel.create(INITIAL_SYSTEM_CONFIG);
    await CategoryModel.insertMany(INITIAL_CATEGORIES);
    await LocationModel.insertMany(INITIAL_LOCATIONS);
    console.log(`Seeded System Config, ${INITIAL_CATEGORIES.length} Categories, and ${INITIAL_LOCATIONS.length} Locations.`);

    // 1. Create Admin
    const admin = await UserModel.create({
      name: "Dawit Haile",
      username: "dawithaile",
      email: "admin@sureservice.com",
      password: DEMO_PASSWORD,
      role: "admin",
      phone: "+251 91 100 2233",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DawitHaile&backgroundColor=2563eb",
      bio: "Platform Administrator & Trust Verification Officer at SureService Ethiopia.",
      location: { city: "Addis Ababa", subCity: "Bole", address: "Atlas Building, 4th Floor" },
    });

    // 2. Create Customers across Addis Ababa and Regional Cities
    const customerBethlehem = await UserModel.create({
      name: "Bethlehem Girma",
      username: "bethlehem_g",
      email: "customer@sureservice.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 234 5678",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BethlehemGirma&backgroundColor=ec4899",
      bio: "Homeowner in Bole looking for vetted, trustworthy trade professionals.",
      location: { city: "Addis Ababa", subCity: "Bole", address: "Near Medhanialem Church" },
    });

    const customerYared = await UserModel.create({
      name: "Yared Demisse",
      username: "yared_d",
      email: "yared@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 92 345 6789",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=YaredDemisse&backgroundColor=f59e0b",
      bio: "Small business manager in Kazanchis requiring reliable facility maintenance.",
      location: { city: "Addis Ababa", subCity: "Kazanchis", address: "ECA Road" },
    });

    const customerTsion = await UserModel.create({
      name: "Tsion Hailu",
      username: "tsion_h",
      email: "tsion@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 93 456 7890",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TsionHailu&backgroundColor=10b981",
      bio: "Parent looking for certified academic tutors and home service pros.",
      location: { city: "Addis Ababa", subCity: "Sarbet", address: "Karl Square Area" },
    });

    const customerHenok = await UserModel.create({
      name: "Henok Getachew",
      username: "henok_g",
      email: "henok@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 555 1234",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=HenokGetachew&backgroundColor=6366f1",
      bio: "Real estate property supervisor managing apartment buildings across Gerji and CMC.",
      location: { city: "Addis Ababa", subCity: "Gerji", address: "Mebrat Hail Condominium" },
    });

    const customerRahel = await UserModel.create({
      name: "Rahel Tadesse",
      username: "rahel_t",
      email: "rahel@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 666 2345",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=RahelTadesse&backgroundColor=8b5cf6",
      bio: "Architectural designer based in CMC.",
      location: { city: "Addis Ababa", subCity: "CMC", address: "Tsehay Real Estate" },
    });

    const customerSolomon = await UserModel.create({
      name: "Solomon Berhanu",
      username: "solomon_b",
      email: "solomon@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 777 3456",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SolomonBerhanu&backgroundColor=14b8a6",
      bio: "Homeowner in Summit looking for reliable electrical, plumbing, and carpentry specialists.",
      location: { city: "Addis Ababa", subCity: "Summit", address: "Near Safari Junction" },
    });

    const customerMahlet = await UserModel.create({
      name: "Mahlet Worku",
      username: "mahlet_w",
      email: "mahlet@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 888 4567",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MahletWorku&backgroundColor=ec4899",
      bio: "Resort and guesthouse operator in Hawassa.",
      location: { city: "Hawassa", subCity: "Piazza", address: "Lake Awassa Drive" },
    });

    const customerNatnael = await UserModel.create({
      name: "Natnael Alemayehu",
      username: "natnael_a",
      email: "natnael@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 999 5678",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NatnaelAlemayehu&backgroundColor=0ea5e9",
      bio: "Tech entrepreneur in Bahir Dar looking for network, electrical, and facility experts.",
      location: { city: "Bahir Dar", subCity: "Kebele 04", address: "Lake Tana Promenade" },
    });

    const customerSenait = await UserModel.create({
      name: "Senait Bekele",
      username: "senait_b",
      email: "senait@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 92 111 6789",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SenaitBekele&backgroundColor=f43f5e",
      bio: "Branch manager in Adama coordinating commercial maintenance services.",
      location: { city: "Adama", subCity: "Bole", address: "Main Expressway Road" },
    });

    const customerEyerusalem = await UserModel.create({
      name: "Eyerusalem Kassa",
      username: "eyerusalem_k",
      email: "eyerusalem@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 92 222 7890",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EyerusalemKassa&backgroundColor=d97706",
      bio: "Heritage gallery and boutique owner in Piassa.",
      location: { city: "Addis Ababa", subCity: "Piassa", address: "Cunningham Street" },
    });

    const customerDawitB = await UserModel.create({
      name: "Dawit Bekele",
      username: "dawit_b",
      email: "dawit.b@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 333 4411",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DawitBekele&backgroundColor=2563eb",
      bio: "Ayat residential complex resident seeking vetted home repair pros.",
      location: { city: "Addis Ababa", subCity: "Ayat", address: "Ayat Zone 2" },
    });

    const customerKalkidan = await UserModel.create({
      name: "Kalkidan Tadesse",
      username: "kalkidan_t",
      email: "kalkidan.t@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 444 5522",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=KalkidanTadesse&backgroundColor=8b5cf6",
      bio: "Restaurant owner in 22 Mazoria needing regular appliance and electrical servicing.",
      location: { city: "Addis Ababa", subCity: "22 Mazoria", address: "Haya Hulet Square" },
    });

    const customerBiruk = await UserModel.create({
      name: "Biruk Assefa",
      username: "biruk_a",
      email: "biruk.a@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 555 6633",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BirukAssefa&backgroundColor=10b981",
      bio: "Diplomatic compound supervisor in Old Airport area.",
      location: { city: "Addis Ababa", subCity: "Old Airport", address: "South Africa Street" },
    });

    const customerSelamawitG = await UserModel.create({
      name: "Selamawit Gebre",
      username: "selamawit_g",
      email: "selamawit.g@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 666 7744",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SelamawitGebre&backgroundColor=ec4899",
      bio: "Office manager in Gurd Shola looking for IT and facility technicians.",
      location: { city: "Addis Ababa", subCity: "Gurd Shola", address: "Athletics Federation Building" },
    });

    const customerTigistM = await UserModel.create({
      name: "Tigist Mulugeta",
      username: "tigist_m",
      email: "tigist.m@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 777 8855",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TigistMulugeta&backgroundColor=f59e0b",
      bio: "Homeowner in Lebu requiring carpentry, furniture upholstery, and gardening.",
      location: { city: "Addis Ababa", subCity: "Lebu", address: "Musika Sefer Avenue" },
    });

    const customerAbelG = await UserModel.create({
      name: "Abel Girma",
      username: "abel_g",
      email: "abel.g@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 888 9966",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AbelGirma&backgroundColor=0ea5e9",
      bio: "Vehicle fleet owner and workshop manager in Kera.",
      location: { city: "Addis Ababa", subCity: "Kera", address: "Gofa Sefer" },
    });

    const customerFrehiwot = await UserModel.create({
      name: "Frehiwot Tesfaye",
      username: "frehiwot_t",
      email: "frehiwot.t@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 91 999 0077",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FrehiwotTesfaye&backgroundColor=14b8a6",
      bio: "Villa owner in Bishoftu looking for verified landscaping and roofing pros.",
      location: { city: "Bishoftu", subCity: "Babogaya", address: "Lakeside Road" },
    });

    const customerMeseret = await UserModel.create({
      name: "Meseret Kassa",
      username: "meseret_k",
      email: "meseret.k@example.com",
      password: DEMO_PASSWORD,
      role: "customer",
      phone: "+251 92 000 1188",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MeseretKassa&backgroundColor=6366f1",
      bio: "Retail shop owner in Dire Dawa.",
      location: { city: "Dire Dawa", subCity: "Megala", address: "Avenue Gabriel" },
    });

    // 3. Generate 275 Providers across all 55 Ethiopian Subcities (5 distinct categories per subcity)
    const providerDefs = generateAllProviderDefs();
    const seededProviders: Record<string, any> = {};

    for (const def of providerDefs) {
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(def.name)}&backgroundColor=2563eb,10b981,f59e0b,8b5cf6,ec4899,0ea5e9,14b8a6`;
      const providerData = { ...def, avatar };
      const { trustScore, breakdown } = computeTrustScore(providerData);

      const provider = await UserModel.create({
        name: def.name,
        username: def.username,
        email: def.email,
        password: DEMO_PASSWORD,
        role: "provider",
        avatar,
        phone: def.phone,
        bio: def.bio,
        location: def.location,
        category: def.category,
        hourlyRate: def.hourlyRate,
        experienceYears: def.experienceYears,
        skills: def.skills,
        verificationStatus: def.verificationStatus,
        verificationDocType: def.verificationDocType,
        verificationDocUrl: def.verificationDocUrl,
        trustScore,
        trustBreakdown: breakdown,
        completedJobsCount: def.completedJobsCount,
        repeatCustomerCount: def.repeatCustomerCount,
        providerCancelledCount: def.providerCancelledCount,
      });

      seededProviders[def.username] = provider;
    }

    console.log(`Seeded ${providerDefs.length} providers across all 55 subcities in 8 Ethiopian cities.`);

    // 4. Seed Verified Completed Bookings & Reviews across Services
    interface BookingSeedSpec {
      customer: any;
      providerUsername: string;
      category: string;
      serviceDate: string;
      timeSlot: string;
      address: string;
      city: string;
      subCity: string;
      notes: string;
      status: "completed" | "accepted" | "pending" | "cancelled";
      wasAccepted: boolean;
      cancelledBy?: "provider" | "customer";
      acceptedAt?: Date;
      completedAt?: Date;
      rating?: number;
      reviewComment?: string;
    }

    const bookingSpecs: BookingSeedSpec[] = [
      // 1. Electrical Bookings
      {
        customer: customerBethlehem,
        providerUsername: "abebe_electric",
        category: "Electrician",
        serviceDate: "2026-08-01",
        timeSlot: "Morning (09:00 AM - 12:00 PM)",
        address: "Bole Medhanialem, House 412",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Main circuit breaker keeps tripping when heavy appliances turn on.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-07-31T09:00:00Z"),
        completedAt: new Date("2026-08-01T11:45:00Z"),
        rating: 5,
        reviewComment: "Abebe is extraordinarily competent and arrived promptly. Diagnosed our breaker overload issue in 20 minutes.",
      },
      {
        customer: customerBethlehem,
        providerUsername: "abebe_electric",
        category: "Electrician",
        serviceDate: "2026-08-10",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "Bole Medhanialem, House 412",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Install 4 new surge-protected outlets and an inverter transfer switch.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-09T14:00:00Z"),
        completedAt: new Date("2026-08-10T16:30:00Z"),
        rating: 5,
        reviewComment: "Hired Abebe again for inverter setup. Clean workmanship, fair pricing, and clear explanations.",
      },
      {
        customer: customerMahlet,
        providerUsername: "ermias_solar",
        category: "Electrician",
        serviceDate: "2026-08-06",
        timeSlot: "Full Day (09:00 AM - 04:00 PM)",
        address: "Lake Awassa Drive, Villa 4",
        city: "Hawassa",
        subCity: "Piazza",
        notes: "10kVA solar hybrid inverter installation with 8 lithium battery modules.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-05T08:30:00Z"),
        completedAt: new Date("2026-08-06T16:00:00Z"),
        rating: 5,
        reviewComment: "Flawless solar hybrid installation in Hawassa. Our resort now operates 24/7 without power disruptions.",
      },

      // 2. Plumbing Bookings
      {
        customer: customerSenait,
        providerUsername: "samuel_plumb",
        category: "Plumber",
        serviceDate: "2026-08-09",
        timeSlot: "Afternoon (01:30 PM - 04:30 PM)",
        address: "Main Expressway Road, Villa 22",
        city: "Adama",
        subCity: "Bole",
        notes: "Replace overhead water tank float valve and pressurized booster pump.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-08T10:00:00Z"),
        completedAt: new Date("2026-08-09T16:00:00Z"),
        rating: 5,
        reviewComment: "Samuel fixed our pump pressure in Adama swiftly. Fair pricing, genuine parts, and friendly demeanor.",
      },
      {
        customer: customerEyerusalem,
        providerUsername: "yohannes_plumb",
        category: "Plumber",
        serviceDate: "2026-08-04",
        timeSlot: "Morning (09:00 AM - 12:00 PM)",
        address: "Cunningham Street, Gallery 10",
        city: "Addis Ababa",
        subCity: "Piassa",
        notes: "Underground water pipe leakage diagnosis and pressure valve replacement.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-03T11:00:00Z"),
        completedAt: new Date("2026-08-04T12:30:00Z"),
        rating: 5,
        reviewComment: "Yohannes accurately pinpointed the underground leak without destroying our tile walkway. True professional.",
      },

      // 3. Home Cleaner Bookings
      {
        customer: customerBethlehem,
        providerUsername: "almaz_cleaning",
        category: "Home Cleaner",
        serviceDate: "2026-08-05",
        timeSlot: "Morning (08:30 AM - 01:00 PM)",
        address: "Bole Medhanialem, House 412",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Deep cleaning for 3 bedrooms and living room before family holiday gathering.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-04T10:00:00Z"),
        completedAt: new Date("2026-08-05T12:45:00Z"),
        rating: 5,
        reviewComment: "Almaz and her team did an immaculate job. Every corner of the house was spotless and fresh.",
      },
      {
        customer: customerRahel,
        providerUsername: "hiwot_clean",
        category: "Home Cleaner",
        serviceDate: "2026-08-07",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "Tsehay Real Estate, Building C",
        city: "Addis Ababa",
        subCity: "CMC",
        notes: "Post-renovation deep dust sanitization and floor steam waxing.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-06T15:00:00Z"),
        completedAt: new Date("2026-08-07T13:30:00Z"),
        rating: 5,
        reviewComment: "Hiwot's steam cleaning equipment removed all renovation gypsum dust without a trace. Highly recommended!",
      },

      // 4. Tutor Bookings
      {
        customer: customerTsion,
        providerUsername: "selam_tutor",
        category: "Tutor",
        serviceDate: "2026-08-08",
        timeSlot: "Afternoon (04:00 PM - 06:00 PM)",
        address: "Karl Square, Villa 18",
        city: "Addis Ababa",
        subCity: "Sarbet",
        notes: "Grade 11 Trigonometry and Algebra intensive session.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-07T16:00:00Z"),
        completedAt: new Date("2026-08-08T18:00:00Z"),
        rating: 5,
        reviewComment: "Selamawit makes complex math concepts very approachable. My daughter gained huge confidence for her national exam.",
      },
      {
        customer: customerHenok,
        providerUsername: "bereket_stem",
        category: "Tutor",
        serviceDate: "2026-08-03",
        timeSlot: "Morning (10:00 AM - 12:00 PM)",
        address: "Mebrat Hail Condominium, Block 12",
        city: "Addis Ababa",
        subCity: "Gerji",
        notes: "Advanced Physics and Calculus revision for university entrance examination.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-02T11:00:00Z"),
        completedAt: new Date("2026-08-03T12:00:00Z"),
        rating: 5,
        reviewComment: "Dr. Bereket is unmatched in physics problem-solving. Structured pedagogy and deep conceptual clarity.",
      },

      // 5. Carpenter Bookings
      {
        customer: customerSolomon,
        providerUsername: "surafel_wood",
        category: "Carpenter",
        serviceDate: "2026-08-11",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "Near Safari Junction, House 88",
        city: "Addis Ababa",
        subCity: "Summit",
        notes: "Custom solid timber TV console with hidden cable conduits.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-10T12:00:00Z"),
        completedAt: new Date("2026-08-11T13:00:00Z"),
        rating: 5,
        reviewComment: "The TV console craftsmanship is top-tier. Clean mitred joints and solid Wanza wood finish.",
      },
      {
        customer: customerYared,
        providerUsername: "fikadu_carpentry",
        category: "Carpenter",
        serviceDate: "2026-08-02",
        timeSlot: "Full Day (09:00 AM - 05:00 PM)",
        address: "ECA Road, Office 204",
        city: "Addis Ababa",
        subCity: "Kazanchis",
        notes: "Install custom modular hardwood conference cabinets and wall acoustic wooden slats.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-01T14:00:00Z"),
        completedAt: new Date("2026-08-02T17:00:00Z"),
        rating: 5,
        reviewComment: "Fikadu's woodwork transformed our executive boardroom completely. Solid, elegant, and perfectly fitted.",
      },

      // 6. Painter Bookings
      {
        customer: customerNatnael,
        providerUsername: "meron_paint",
        category: "Painter",
        serviceDate: "2026-08-07",
        timeSlot: "Full Day (08:30 AM - 04:30 PM)",
        address: "Lake Tana Promenade, Office 10",
        city: "Bahir Dar",
        subCity: "Kebele 04",
        notes: "Interior wall refresh with washable satin emulsion paint.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-06T10:00:00Z"),
        completedAt: new Date("2026-08-07T16:30:00Z"),
        rating: 5,
        reviewComment: "Meron painted our tech office in Bahir Dar with great precision. Edges are laser-sharp and clean.",
      },
      {
        customer: customerBiruk,
        providerUsername: "eskinder_paint",
        category: "Painter",
        serviceDate: "2026-08-05",
        timeSlot: "Full Day (09:00 AM - 05:00 PM)",
        address: "South Africa Street, Villa 2",
        city: "Addis Ababa",
        subCity: "Old Airport",
        notes: "Exterior weather-resistant coating and anti-fungal treatment on residence façade.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-04T09:00:00Z"),
        completedAt: new Date("2026-08-05T17:00:00Z"),
        rating: 5,
        reviewComment: "Eskinder provided top-quality exterior paintwork. Completely waterproof and beautiful finish.",
      },

      // 7. HVAC Technician Bookings
      {
        customer: customerMahlet,
        providerUsername: "kidus_hvac",
        category: "HVAC Technician",
        serviceDate: "2026-08-04",
        timeSlot: "Morning (09:00 AM - 12:30 PM)",
        address: "Lake Awassa Drive, Villa 4",
        city: "Hawassa",
        subCity: "Piazza",
        notes: "Restaurant walk-in refrigerator compressor replacement and freon gas refill.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-03T16:00:00Z"),
        completedAt: new Date("2026-08-04T12:00:00Z"),
        rating: 5,
        reviewComment: "Kidus restored our restaurant cold room cooling in Hawassa within hours. Saved all our food supplies.",
      },
      {
        customer: customerKalkidan,
        providerUsername: "yonas_hvac",
        category: "HVAC Technician",
        serviceDate: "2026-08-08",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "Haya Hulet Square, Commercial Kitchen",
        city: "Addis Ababa",
        subCity: "22 Mazoria",
        notes: "Kitchen exhaust hood duct cleaning and 24,000 BTU split AC filter service.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-07T12:00:00Z"),
        completedAt: new Date("2026-08-08T17:00:00Z"),
        rating: 5,
        reviewComment: "Yonas did thorough maintenance on our commercial AC units. Noticeably cooler and whisper quiet.",
      },

      // 8. Appliance Repair Bookings
      {
        customer: customerKalkidan,
        providerUsername: "melaku_appliance",
        category: "Appliance Repair",
        serviceDate: "2026-08-06",
        timeSlot: "Morning (10:00 AM - 01:00 PM)",
        address: "Haya Hulet Square, House 22",
        city: "Addis Ababa",
        subCity: "22 Mazoria",
        notes: "High-capacity injera mitad heating coil replaced and thermostat calibrated.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-05T14:00:00Z"),
        completedAt: new Date("2026-08-06T12:30:00Z"),
        rating: 5,
        reviewComment: "Melaku replaced our mitad heating element perfectly. Bakes evenly with no electrical short circuits.",
      },
      {
        customer: customerHenok,
        providerUsername: "bezawit_tech",
        category: "Appliance Repair",
        serviceDate: "2026-08-09",
        timeSlot: "Morning (09:30 AM - 12:30 PM)",
        address: "Mebrat Hail Condominium, Block 12",
        city: "Addis Ababa",
        subCity: "Gerji",
        notes: "Beko front-load washing machine drum drainage pump error troubleshooting.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-08T15:30:00Z"),
        completedAt: new Date("2026-08-09T12:00:00Z"),
        rating: 5,
        reviewComment: "Bezawit identified the coin blockage in our washing machine pump immediately. Very honest and skilled.",
      },

      // 9. Auto Mechanic Bookings
      {
        customer: customerAbelG,
        providerUsername: "muluken_garage",
        category: "Auto Mechanic",
        serviceDate: "2026-08-05",
        timeSlot: "Full Day (09:00 AM - 04:00 PM)",
        address: "Gofa Sefer, Garage 5",
        city: "Addis Ababa",
        subCity: "Kera",
        notes: "Toyota Hilux complete brake overhaul and suspension bushing replacement.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-04T10:00:00Z"),
        completedAt: new Date("2026-08-05T16:00:00Z"),
        rating: 5,
        reviewComment: "Muluken is the best mechanic in Kera. Replaced our suspension parts with genuine OEM components.",
      },
      {
        customer: customerDawitB,
        providerUsername: "robel_auto",
        category: "Auto Mechanic",
        serviceDate: "2026-08-08",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "Ayat Zone 2, House 14",
        city: "Addis Ababa",
        subCity: "Ayat",
        notes: "Toyota Aqua hybrid battery checkup and 12V auxiliary battery replacement.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-07T11:00:00Z"),
        completedAt: new Date("2026-08-08T12:45:00Z"),
        rating: 5,
        reviewComment: "Robel cleared our hybrid warning light and balanced the battery cells. Fuel economy back to normal!",
      },

      // 10. IT & Network Support Bookings
      {
        customer: customerSelamawitG,
        providerUsername: "hailemariam_it",
        category: "IT & Network Support",
        serviceDate: "2026-08-04",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "Athletics Federation Building, 3rd Floor",
        city: "Addis Ababa",
        subCity: "Gurd Shola",
        notes: "Install 3 Mikrotik Wi-Fi 6 access points with load balancing and guest VLAN.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-03T10:00:00Z"),
        completedAt: new Date("2026-08-04T13:00:00Z"),
        rating: 5,
        reviewComment: "Hailemariam solved our chronic office Wi-Fi dead zones. Strong, seamless connection across the whole floor.",
      },
      {
        customer: customerYared,
        providerUsername: "blen_networks",
        category: "IT & Network Support",
        serviceDate: "2026-08-07",
        timeSlot: "Afternoon (02:00 PM - 05:30 PM)",
        address: "ECA Road, Office 204",
        city: "Addis Ababa",
        subCity: "Kazanchis",
        notes: "Install 4 HD security cameras with mobile NVR app monitoring.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-06T14:00:00Z"),
        completedAt: new Date("2026-08-07T17:30:00Z"),
        rating: 5,
        reviewComment: "Blen set up our office security cameras cleanly without dangling wires. Crystal clear video on my phone.",
      },

      // 11. Landscaper & Gardener Bookings
      {
        customer: customerEyerusalem,
        providerUsername: "eden_gardens",
        category: "Landscaper & Gardener",
        serviceDate: "2026-08-12",
        timeSlot: "Morning (08:30 AM - 12:30 PM)",
        address: "Babogaya Resort Compound",
        city: "Bishoftu",
        subCity: "Babogaya",
        notes: "Terrace garden lawn rejuvenation and flower bed landscaping.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-11T09:00:00Z"),
        completedAt: new Date("2026-08-12T12:00:00Z"),
        rating: 5,
        reviewComment: "Eden transformed our terrace into a blooming paradise in Bishoftu. Wonderful eye for aesthetic greenery.",
      },
      {
        customer: customerBiruk,
        providerUsername: "wondwossen_land",
        category: "Landscaper & Gardener",
        serviceDate: "2026-08-06",
        timeSlot: "Morning (08:30 AM - 01:00 PM)",
        address: "South Africa Street, Villa 2",
        city: "Addis Ababa",
        subCity: "Old Airport",
        notes: "Prune mature eucalyptus trees, shape compound hedges, and aerate lawn.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-05T11:00:00Z"),
        completedAt: new Date("2026-08-06T13:00:00Z"),
        rating: 5,
        reviewComment: "Wondwossen shaped our compound trees and hedges with exceptional skill. Very safe and tidy cleanup.",
      },

      // 12. Locksmith & Security Bookings
      {
        customer: customerBethlehem,
        providerUsername: "tariku_security",
        category: "Locksmith & Security",
        serviceDate: "2026-08-07",
        timeSlot: "Morning (10:00 AM - 12:30 PM)",
        address: "Bole Medhanialem, House 412",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Install digital biometric fingerprint handle lock on main steel entrance door.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-06T16:00:00Z"),
        completedAt: new Date("2026-08-07T12:15:00Z"),
        rating: 5,
        reviewComment: "Tariku installed our digital smart lock flawlessly. Great security upgrade and easy to program codes.",
      },

      // 13. Flooring & Tiling Bookings
      {
        customer: customerTigistM,
        providerUsername: "endale_terrazzo",
        category: "Flooring & Tiling",
        serviceDate: "2026-08-04",
        timeSlot: "Full Day (08:30 AM - 04:30 PM)",
        address: "Musika Sefer Avenue, Villa 15",
        city: "Addis Ababa",
        subCity: "Lebu",
        notes: "Terrazzo living room floor diamond grinding and high-gloss crystalline polishing.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-03T10:00:00Z"),
        completedAt: new Date("2026-08-04T16:00:00Z"),
        rating: 5,
        reviewComment: "Endale brought our 20-year-old terrazzo floor back to life. Looks like brand new marble!",
      },

      // 14. Roofing & Waterproofing Bookings
      {
        customer: customerSelamawitG,
        providerUsername: "teshome_roof",
        category: "Roofing & Waterproofing",
        serviceDate: "2026-08-02",
        timeSlot: "Full Day (09:00 AM - 04:00 PM)",
        address: "Athletics Federation Building, Roof Deck",
        city: "Addis Ababa",
        subCity: "Gurd Shola",
        notes: "Torch-on 4mm bitumen membrane waterproofing over building concrete terrace.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-01T09:30:00Z"),
        completedAt: new Date("2026-08-02T16:00:00Z"),
        rating: 5,
        reviewComment: "Teshome sealed our roof deck right before the heavy rains. Zero leaks through three days of downpours.",
      },

      // 15. Upholsterer & Furniture Bookings
      {
        customer: customerAbelG,
        providerUsername: "dagnachew_leather",
        category: "Upholsterer & Furniture",
        serviceDate: "2026-08-06",
        timeSlot: "Full Day (09:00 AM - 05:00 PM)",
        address: "Gofa Sefer, House 33",
        city: "Addis Ababa",
        subCity: "Gotera",
        notes: "Reupholster 7-seater living room sofa with premium Turkish fabric and high-density foam.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-05T11:00:00Z"),
        completedAt: new Date("2026-08-06T17:00:00Z"),
        rating: 5,
        reviewComment: "Dagnachew's upholstery work is sublime. The stitching and foam firmness exceed factory quality.",
      },

      // 16. Welder & Metalworker Bookings
      {
        customer: customerHenok,
        providerUsername: "girum_metal",
        category: "Welder & Metalworker",
        serviceDate: "2026-08-03",
        timeSlot: "Full Day (08:30 AM - 04:30 PM)",
        address: "Mebrat Hail Condominium, Block 12",
        city: "Addis Ababa",
        subCity: "Gerji",
        notes: "Install heavy gauge security grill and sliding gate lock bracket.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-02T14:00:00Z"),
        completedAt: new Date("2026-08-03T16:00:00Z"),
        rating: 5,
        reviewComment: "Girum welded sturdy, artistic window grills and aligned our compound gate seamlessly.",
      },

      // 17. Moving & Relocation Bookings
      {
        customer: customerRahel,
        providerUsername: "danait_movers",
        category: "Moving & Relocation",
        serviceDate: "2026-08-08",
        timeSlot: "Morning (08:00 AM - 01:00 PM)",
        address: "Tsehay Real Estate to Bole Atlas",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Full apartment relocation including packing of glassware, furniture dismantling, and transport.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-07T09:00:00Z"),
        completedAt: new Date("2026-08-08T13:00:00Z"),
        rating: 5,
        reviewComment: "Danait and her moving crew were punctual, careful, and fast. Not a single glass scratch.",
      },

      // 18. Satellite & TV Tech Bookings
      {
        customer: customerTsion,
        providerUsername: "elsabeth_dish",
        category: "Satellite & TV Tech",
        serviceDate: "2026-08-09",
        timeSlot: "Afternoon (02:00 PM - 04:30 PM)",
        address: "Karl Square, Villa 18",
        city: "Addis Ababa",
        subCity: "Sarbet",
        notes: "Wall mount 65-inch OLED TV with hidden wire conduits and align dual DSTV dish.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-08T13:00:00Z"),
        completedAt: new Date("2026-08-09T16:15:00Z"),
        rating: 5,
        reviewComment: "Elsabeth did a super clean flush TV mount and got maximum signal strength on all channels.",
      },

      // 19. Solar & Generator Tech Bookings
      {
        customer: customerNatnael,
        providerUsername: "selam_solar",
        category: "Solar & Generator Tech",
        serviceDate: "2026-08-03",
        timeSlot: "Full Day (09:00 AM - 05:00 PM)",
        address: "Lake Tana Promenade, Tech Hub",
        city: "Bahir Dar",
        subCity: "Kebele 04",
        notes: "Install 5kW roof solar system with 10kWh LiFePO4 battery storage bank.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-02T10:00:00Z"),
        completedAt: new Date("2026-08-03T17:00:00Z"),
        rating: 5,
        reviewComment: "Selam configured our solar backup system in Bahir Dar brilliantly. Continuous power without noise.",
      },

      // 20. Tailor & Habesha Craft Bookings
      {
        customer: customerEyerusalem,
        providerUsername: "tizita_kemis",
        category: "Tailor & Habesha Craft",
        serviceDate: "2026-08-05",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "Cunningham Street, Gallery 10",
        city: "Addis Ababa",
        subCity: "Piassa",
        notes: "Handmade custom Habesha Kemis with authentic gold and burgundy Tibeb embroidery.",
        status: "completed",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-04T12:00:00Z"),
        completedAt: new Date("2026-08-05T17:00:00Z"),
        rating: 5,
        reviewComment: "Tizita is a true master artist. The Habesha Kemis embroidery detail and fit were breathtaking.",
      },

      // Active / In-Progress & Pending Bookings
      {
        customer: customerBethlehem,
        providerUsername: "yohannes_plumb",
        category: "Plumber",
        serviceDate: "2026-08-22",
        timeSlot: "Morning (09:00 AM - 12:00 PM)",
        address: "Bole Medhanialem, House 412",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Kitchen sink drain is clogged and leaking under the wooden counter.",
        status: "pending",
        wasAccepted: false,
      },
      {
        customer: customerYared,
        providerUsername: "fitsum_wood",
        category: "Carpenter",
        serviceDate: "2026-08-20",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "ECA Road, Office 204",
        city: "Addis Ababa",
        subCity: "Kazanchis",
        notes: "Custom conference room storage shelves and document organizer.",
        status: "accepted",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-19T11:00:00Z"),
      },
      {
        customer: customerMahlet,
        providerUsername: "kidus_hvac",
        category: "HVAC Technician",
        serviceDate: "2026-08-24",
        timeSlot: "Morning (10:00 AM - 01:00 PM)",
        address: "Lake Awassa Drive, Villa 4",
        city: "Hawassa",
        subCity: "Piazza",
        notes: "Dining room dual-inverter AC unit not blowing cool air.",
        status: "pending",
        wasAccepted: false,
      },
      {
        customer: customerNatnael,
        providerUsername: "meron_paint",
        category: "Painter",
        serviceDate: "2026-08-23",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "Lake Tana Promenade, Office 10",
        city: "Bahir Dar",
        subCity: "Kebele 04",
        notes: "Two meeting room interior wall refresh with washable satin emulsion.",
        status: "accepted",
        wasAccepted: true,
        acceptedAt: new Date("2026-08-20T14:30:00Z"),
      },
      {
        customer: customerFrehiwot,
        providerUsername: "eden_gardens",
        category: "Landscaper & Gardener",
        serviceDate: "2026-08-25",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "Lakeside Road, Villa 10",
        city: "Bishoftu",
        subCity: "Babogaya",
        notes: "Lawn sodding and flowering shrub planting along the lakefront fence.",
        status: "pending",
        wasAccepted: false,
      },
      {
        customer: customerMeseret,
        providerUsername: "nebiyu_hvac",
        category: "HVAC Technician",
        serviceDate: "2026-08-26",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "Avenue Gabriel, Shop 4",
        city: "Dire Dawa",
        subCity: "Megala",
        notes: "Store cooling unit refrigerant recharge.",
        status: "pending",
        wasAccepted: false,
      },

      // Provider Cancelled Bookings (Demonstrating Anti-Gaming Score Penalties)
      {
        customer: customerHenok,
        providerUsername: "girma_appliance",
        category: "Appliance Repair",
        serviceDate: "2026-07-20",
        timeSlot: "Morning (10:00 AM - 01:00 PM)",
        address: "Mebrat Hail Condominium",
        city: "Addis Ababa",
        subCity: "Kolfe",
        notes: "Oven heating element repair.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
      {
        customer: customerSolomon,
        providerUsername: "girma_appliance",
        category: "Appliance Repair",
        serviceDate: "2026-07-28",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "Safari Junction",
        city: "Addis Ababa",
        subCity: "Kolfe",
        notes: "Washing machine belt diagnosis.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
      {
        customer: customerDawitB,
        providerUsername: "girma_appliance",
        category: "Appliance Repair",
        serviceDate: "2026-08-01",
        timeSlot: "Morning (09:00 AM - 12:00 PM)",
        address: "Ayat Zone 2",
        city: "Addis Ababa",
        subCity: "Kolfe",
        notes: "Water dispenser cooling element replacement.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
      {
        customer: customerYared,
        providerUsername: "binyam_tile",
        category: "Flooring & Tiling",
        serviceDate: "2026-07-22",
        timeSlot: "Morning (09:00 AM - 01:00 PM)",
        address: "ECA Road, Office 204",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Kitchen counter granite repair.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
      {
        customer: customerBethlehem,
        providerUsername: "binyam_tile",
        category: "Flooring & Tiling",
        serviceDate: "2026-07-30",
        timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
        address: "Bole Medhanialem",
        city: "Addis Ababa",
        subCity: "Bole",
        notes: "Balcony tile regrouting.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
      {
        customer: customerTsion,
        providerUsername: "zerihun_auto_keys",
        category: "Locksmith & Security",
        serviceDate: "2026-07-25",
        timeSlot: "Morning (10:00 AM - 12:00 PM)",
        address: "Karl Square",
        city: "Addis Ababa",
        subCity: "Gotera",
        notes: "Toyota remote key duplication.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
      {
        customer: customerBiruk,
        providerUsername: "zerihun_auto_keys",
        category: "Locksmith & Security",
        serviceDate: "2026-08-02",
        timeSlot: "Afternoon (03:00 PM - 05:00 PM)",
        address: "South Africa Street",
        city: "Addis Ababa",
        subCity: "Gotera",
        notes: "Ignition lock rekeying.",
        status: "cancelled",
        wasAccepted: true,
        cancelledBy: "provider",
      },
    ];

    for (const spec of bookingSpecs) {
      const provider = seededProviders[spec.providerUsername];
      if (!provider) {
        console.warn(`Provider ${spec.providerUsername} not found during booking creation.`);
        continue;
      }

      const booking = await BookingModel.create({
        customer: spec.customer._id,
        provider: provider._id,
        category: spec.category,
        serviceDate: spec.serviceDate,
        timeSlot: spec.timeSlot,
        address: spec.address,
        city: spec.city,
        subCity: spec.subCity,
        notes: spec.notes,
        status: spec.status,
        wasAccepted: spec.wasAccepted,
        cancelledBy: spec.cancelledBy || null,
        acceptedAt: spec.acceptedAt,
        completedAt: spec.completedAt,
      });

      if (spec.status === "completed" && spec.rating && spec.reviewComment) {
        await ReviewModel.create({
          booking: booking._id,
          customer: spec.customer._id,
          provider: provider._id,
          rating: spec.rating,
          comment: spec.reviewComment,
        });
      }
    }

    console.log("\n========================================================");
    console.log("Database successfully seeded!");
    console.log("========================================================");
    console.log(`Summary:`);
    console.log(`  - 1 Admin account (Dawit Haile)`);
    console.log(`  - 18 Customer accounts across Addis Ababa, Hawassa, Bahir Dar, Adama, Dire Dawa, Bishoftu`);
    console.log(`  - ${providerDefs.length} Provider accounts spanning 20 service categories and 8 Ethiopian cities`);
    console.log(`  - ${bookingSpecs.length} Bookings (Completed, Accepted, Pending, and Provider-Penalized Cancellations)`);
    console.log(`  - 20+ Qualitative 5-Star Reviews`);
    console.log("\nDemo Credentials:");
    console.log("  Customer: customer@sureservice.com | DemoPassword123! (Bethlehem Girma)");
    console.log("  Provider: provider@sureservice.com | DemoPassword123! (Abebe Kebede - Master Electrician)");
    console.log("  Admin:    admin@sureservice.com    | DemoPassword123! (Dawit Haile)");
    console.log("========================================================");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();
