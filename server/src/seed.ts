import "dotenv/config";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import UserModel, { VerificationStatus } from "./models/User.js";
import BookingModel from "./models/Booking.js";
import ReviewModel from "./models/Review.js";
import { computeTrustScore } from "./services/trustScoreService.js";

const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || "DemoPassword123!";

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

const seedDatabase = async () => {
  try {
    await connectDb();
    console.log("Connected to MongoDB for SureService seeding...");

    // Clear existing collections
    await ReviewModel.deleteMany({});
    await BookingModel.deleteMany({});
    await UserModel.deleteMany({});

    console.log("Cleared existing collections.");

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

    // 2. Create Customers
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
      bio: "Small business manager in Kazanchis.",
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
      bio: "Homeowner in Summit looking for reliable electrical and plumbing specialists.",
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
      bio: "Tech entrepreneur in Bahir Dar.",
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
      bio: "Branch manager in Adama.",
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
      bio: "Heritage gallery owner in Piassa.",
      location: { city: "Addis Ababa", subCity: "Piassa", address: "Cunningham Street" },
    });

    // 3. Create Providers with diverse Ethiopian trades and Trust tiers
    const providerDefs: ProviderDef[] = [
      // Elite Tier (85–90+ pts)
      {
        name: "Abebe Kebede",
        username: "abebe_electric",
        email: "provider@sureservice.com",
        category: "Electrical",
        hourlyRate: 450,
        experienceYears: 9,
        skills: ["Breaker Panel Upgrades", "Emergency Diagnostics", "Industrial Wiring", "Solar Inverter Setup"],
        phone: "+251 91 122 3344",
        bio: "Certified master electrician with 9+ years experience resolving complex residential and commercial electrical faults across Addis Ababa.",
        location: { city: "Addis Ababa", subCity: "Bole", address: "Bole Medhanialem Street" },
        verificationStatus: "approved",
        verificationDocType: "Trade Competency License Level IV",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 12,
        repeatCustomerCount: 3,
        providerCancelledCount: 0,
      },
      {
        name: "Almaz Tesfaye",
        username: "almaz_cleaning",
        email: "almaz.cleaning@sureservice.com",
        category: "Cleaning",
        hourlyRate: 300,
        experienceYears: 6,
        skills: ["Deep Cleaning", "Move-in/Move-out Sanitization", "Window & Glass Detailing", "Post-Construction Clean"],
        phone: "+251 91 233 4455",
        bio: "Thorough, meticulous professional residential and commercial cleaning specialist equipped with eco-friendly sanitizing equipment.",
        location: { city: "Addis Ababa", subCity: "Kazanchis", address: "Near UNECA Compound" },
        verificationStatus: "approved",
        verificationDocType: "National ID & Commercial Registry",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 10,
        repeatCustomerCount: 2,
        providerCancelledCount: 0,
      },
      {
        name: "Dr. Bereket Zewdu",
        username: "bereket_stem",
        email: "bereket.tutor@sureservice.com",
        category: "Tutoring",
        hourlyRate: 500,
        experienceYears: 10,
        skills: ["University Physics", "Advanced Calculus", "AP / SAT Prep", "Machine Learning & Python Basics"],
        phone: "+251 91 333 7788",
        bio: "University lecturer and private STEM tutor with 10 years experience preparing top candidates for national exams and university competitions.",
        location: { city: "Addis Ababa", subCity: "Ayat", address: "Zone 3, Villa 102" },
        verificationStatus: "approved",
        verificationDocType: "Doctoral Degree & National ID",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 11,
        repeatCustomerCount: 3,
        providerCancelledCount: 0,
      },
      {
        name: "Ermias Desta",
        username: "ermias_solar",
        email: "ermias.solar@sureservice.com",
        category: "Electrical",
        hourlyRate: 480,
        experienceYears: 8,
        skills: ["Solar Photovoltaic Design", "Battery Bank Storage", "Hybrid Inverter Systems", "Commercial Wiring"],
        phone: "+251 91 444 8899",
        bio: "Renewable energy electrical specialist installing turnkey hybrid solar systems for hotels, farms, and homes in Hawassa and SNNPR.",
        location: { city: "Hawassa", subCity: "Tabor", address: "Tabor Mountain Road" },
        verificationStatus: "approved",
        verificationDocType: "Ministry of Water & Energy Solar License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 10,
        repeatCustomerCount: 2,
        providerCancelledCount: 0,
      },

      // Trusted Tier (70–84 pts)
      {
        name: "Selamawit Alemu",
        username: "selam_tutor",
        email: "selamawit.tutor@sureservice.com",
        category: "Tutoring",
        hourlyRate: 350,
        experienceYears: 5,
        skills: ["Mathematics (Grade 9-12)", "Calculus & Algebra", "SAT / National Exam Prep", "Physics Fundamentals"],
        phone: "+251 91 455 6677",
        bio: "B.Sc. in Mathematics from Addis Ababa University with 5 years experience helping students achieve top scores in national exams.",
        location: { city: "Addis Ababa", subCity: "Sarbet", address: "Old Airport Road" },
        verificationStatus: "approved",
        verificationDocType: "AAU Degree Certificate & Kebele ID",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 8,
        repeatCustomerCount: 2,
        providerCancelledCount: 0,
      },
      {
        name: "Yohannes Tadesse",
        username: "yohannes_plumb",
        email: "yohannes.plumbing@sureservice.com",
        category: "Plumbing",
        hourlyRate: 400,
        experienceYears: 8,
        skills: ["Leak Detection", "Boiler Repair", "Bathroom Fixtures Installation", "Water Pump Systems"],
        phone: "+251 91 344 5566",
        bio: "Expert plumber specializing in underground leak repair, water pump pressure systems, and sanitary pipe fitting.",
        location: { city: "Addis Ababa", subCity: "Piassa", address: "Churchill Avenue" },
        verificationStatus: "approved",
        verificationDocType: "Municipal Trade Certificate",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 7,
        repeatCustomerCount: 1,
        providerCancelledCount: 0,
      },
      {
        name: "Hiwot Mengesha",
        username: "hiwot_clean",
        email: "hiwot.clean@sureservice.com",
        category: "Cleaning",
        hourlyRate: 280,
        experienceYears: 5,
        skills: ["Corporate Office Cleaning", "Steam Carpet Sanitizing", "Kitchen Grease Removal", "Post-Event Cleanup"],
        phone: "+251 91 555 9900",
        bio: "Reliable commercial and domestic sanitation expert leading trained cleaning teams with professional pressure steam washers.",
        location: { city: "Addis Ababa", subCity: "Gerji", address: "Jakros Area" },
        verificationStatus: "approved",
        verificationDocType: "Commercial Cleaning License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 8,
        repeatCustomerCount: 1,
        providerCancelledCount: 0,
      },
      {
        name: "Samuel Girma",
        username: "samuel_plumb",
        email: "samuel.plumbing@sureservice.com",
        category: "Plumbing",
        hourlyRate: 420,
        experienceYears: 9,
        skills: ["Borehole Pump Installation", "Drip Irrigation Pipelines", "Water Tank Plumbing", "Drainage Unblocking"],
        phone: "+251 91 666 0011",
        bio: "Master plumber specializing in deep borehole submersible pumps, agricultural water distribution, and domestic plumbing in Adama.",
        location: { city: "Adama", subCity: "Posta Bet", address: "Station Quarter" },
        verificationStatus: "approved",
        verificationDocType: "Oromia Trade Competency Level IV",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 9,
        repeatCustomerCount: 2,
        providerCancelledCount: 0,
      },
      {
        name: "Surafel Belay",
        username: "surafel_wood",
        email: "surafel.carpentry@sureservice.com",
        category: "Carpentry",
        hourlyRate: 400,
        experienceYears: 7,
        skills: ["Hardwood Parquet Flooring", "Bespoke Dining Sets", "Office Workstations", "Security Door Framing"],
        phone: "+251 91 777 1122",
        bio: "Experienced wood artisan creating elegant furniture, durable door frames, and customized cabinetry with fine Ethiopian timber.",
        location: { city: "Addis Ababa", subCity: "Lebu", address: "Musika Sefer" },
        verificationStatus: "approved",
        verificationDocType: "National TVET Level III Carpentry",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 7,
        repeatCustomerCount: 1,
        providerCancelledCount: 0,
      },
      {
        name: "Eden Haile",
        username: "eden_gardens",
        email: "eden.landscape@sureservice.com",
        category: "Landscaping",
        hourlyRate: 350,
        experienceYears: 6,
        skills: ["Garden Architecture", "Lawn Sodding & Aeration", "Fruit Tree Pruning", "Automatic Sprinkler Setup"],
        phone: "+251 91 888 2233",
        bio: "Horticulturist designing lush residential gardens, hotel landscaping, and tranquil water fountain greenery in Bishoftu and Addis.",
        location: { city: "Bishoftu", subCity: "Babogaya", address: "Lake Babogaya View Point" },
        verificationStatus: "approved",
        verificationDocType: "Horticulture Diploma & Business License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 8,
        repeatCustomerCount: 2,
        providerCancelledCount: 0,
      },

      // Active Tier (45–69 pts)
      {
        name: "Kidus Yohannes",
        username: "kidus_hvac",
        email: "kidus.hvac@sureservice.com",
        category: "HVAC",
        hourlyRate: 500,
        experienceYears: 6,
        skills: ["Commercial Chiller Maintenance", "Cold Storage Systems", "AC Installation", "Thermostat Calibration"],
        phone: "+251 91 677 8899",
        bio: "Certified refrigeration and AC technician serving businesses, restaurants, and homes across Hawassa and southern regions.",
        location: { city: "Hawassa", subCity: "Piazza", address: "Lake View Boulevard" },
        verificationStatus: "approved",
        verificationDocType: "National Trade License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 5,
        repeatCustomerCount: 1,
        providerCancelledCount: 0,
      },
      {
        name: "Fitsum Bekele",
        username: "fitsum_wood",
        email: "fitsum.carpentry@sureservice.com",
        category: "Carpentry",
        hourlyRate: 380,
        experienceYears: 7,
        skills: ["Custom Cabinetry", "Door & Window Fitting", "Hardwood Repair", "Modular Furniture"],
        phone: "+251 91 566 7788",
        bio: "Artisan carpenter crafting bespoke wood fixtures, kitchen cabinets, and durable furniture assemblies.",
        location: { city: "Addis Ababa", subCity: "Meganagna", address: "Zefmesh Grand Mall Area" },
        verificationStatus: "approved",
        verificationDocType: "Vocational Carpentry Diploma",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 4,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Meron Assefa",
        username: "meron_paint",
        email: "meron.painter@sureservice.com",
        category: "Painting",
        hourlyRate: 280,
        experienceYears: 4,
        skills: ["Interior Emulsion", "Weatherproof Exterior Coating", "Textured Wall Finishes", "Epoxy Floor Coatings"],
        phone: "+251 91 788 9900",
        bio: "Professional painter offering smooth, durable interior and exterior finishes for residential houses and hotels in Bahir Dar.",
        location: { city: "Bahir Dar", subCity: "Kebele 04", address: "Felege Hiwot Road" },
        verificationStatus: "approved",
        verificationDocType: "National ID",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 2,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Elias Worku",
        username: "elias_paint",
        email: "elias.paint@sureservice.com",
        category: "Painting",
        hourlyRate: 320,
        experienceYears: 5,
        skills: ["Decorative Wall Stenciling", "Anti-Fungal Coatings", "Industrial Steel Painting", "Waterproofing Primer"],
        phone: "+251 91 999 3344",
        bio: "Experienced painter providing sharp, flawless coats with premium washable emulsion paint for apartments and commercial spaces.",
        location: { city: "Addis Ababa", subCity: "Gotera", address: "Near Pepsi Factory" },
        verificationStatus: "approved",
        verificationDocType: "Trade Certificate & Kebele ID",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 5,
        repeatCustomerCount: 1,
        providerCancelledCount: 0,
      },
      {
        name: "Daniel Teshome",
        username: "daniel_plumb",
        email: "daniel.plumb@sureservice.com",
        category: "Plumbing",
        hourlyRate: 360,
        experienceYears: 6,
        skills: ["Solar Water Heater Piping", "Bathroom Drainage Rerouting", "Pipe Descaling", "PPR Pipe Welding"],
        phone: "+251 91 000 4455",
        bio: "Trusted plumber in Gondar handling residential solar heater connections, bathroom renovations, and pressurized water systems.",
        location: { city: "Gondar", subCity: "Arada", address: "Fasiledes Castle Avenue" },
        verificationStatus: "approved",
        verificationDocType: "Amhara Vocational Competency Certificate",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 4,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Kalkidan Dagnachew",
        username: "kalkidan_tech",
        email: "kalkidan.tech@sureservice.com",
        category: "IT Support",
        hourlyRate: 400,
        experienceYears: 4,
        skills: ["Wi-Fi Mesh Network Setup", "CCTV Security Camera Setup", "Server Maintenance", "OS Recovery & Virus Removal"],
        phone: "+251 91 111 5566",
        bio: "Certified network technician setting up robust Wi-Fi mesh routers, IP camera surveillance, and hardware diagnostics for offices.",
        location: { city: "Addis Ababa", subCity: "Bole", address: "Japan Embassy Road" },
        verificationStatus: "approved",
        verificationDocType: "B.Sc. Computer Science & CCNA Certificate",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 3,
        repeatCustomerCount: 1,
        providerCancelledCount: 0,
      },
      {
        name: "Marta Alemu",
        username: "marta_upholstery",
        email: "marta.upholstery@sureservice.com",
        category: "Upholstery",
        hourlyRate: 320,
        experienceYears: 6,
        skills: ["Sofa Re-covering & Cushion Foam Replacement", "Custom Curtains & Drapes", "Car Seat Leather Reupholstery"],
        phone: "+251 91 222 6677",
        bio: "Skilled upholstery specialist reviving worn living room furniture, custom drapery, and quality fabric cushion tailoring.",
        location: { city: "Addis Ababa", subCity: "Kera", address: "Gofa Sefer" },
        verificationStatus: "approved",
        verificationDocType: "National ID & Craft Trade License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 4,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Ephrem Tilahun",
        username: "ephrem_locks",
        email: "ephrem.locks@sureservice.com",
        category: "Locksmith",
        hourlyRate: 350,
        experienceYears: 5,
        skills: ["Digital Smart Lock Setup", "Emergency Lockout Service", "Master Key Duplication", "Deadbolt Installation"],
        phone: "+251 91 333 8899",
        bio: "Mobile security technician providing on-call emergency lock repairs, electronic biometric locks, and high-security deadbolts.",
        location: { city: "Addis Ababa", subCity: "Piassa", address: "Arada Post Office Lane" },
        verificationStatus: "approved",
        verificationDocType: "Police Clearance & Security Trade Cert",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 3,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },

      // Penalized Tier (< 40 pts with Reliability Deductions)
      {
        name: "Binyam Mengistu",
        username: "binyam_tile",
        email: "binyam.tile@sureservice.com",
        category: "Flooring",
        hourlyRate: 350,
        experienceYears: 4,
        skills: ["Ceramic Tile Laying", "Granite Kitchen Counters", "Grout Repair"],
        phone: "+251 91 011 2233",
        bio: "Tile installer for bathrooms, kitchens and terrace corridors across Bole and surrounding areas.",
        location: { city: "Addis Ababa", subCity: "Bole", address: "Rwanda Street" },
        verificationStatus: "approved",
        verificationDocType: "National ID",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 2,
        repeatCustomerCount: 0,
        providerCancelledCount: 2, // Penalized with 2 cancellations (-20 pts)
      },
      {
        name: "Girma Lemma",
        username: "girma_appliance",
        email: "girma.appliance@sureservice.com",
        category: "Appliance Repair",
        hourlyRate: 300,
        experienceYears: 5,
        skills: ["Washing Machine Belt Fix", "Oven Heating Element Repair", "Water Dispenser Service"],
        phone: "+251 91 444 9900",
        bio: "Household appliance repairman serving residential compounds in Kolfe and Ayer Tena.",
        location: { city: "Addis Ababa", subCity: "Kolfe", address: "18 Mazoria" },
        verificationStatus: "approved",
        verificationDocType: "Technical License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 3,
        repeatCustomerCount: 0,
        providerCancelledCount: 3, // Penalized with 3 cancellations (-30 pts)
      },

      // Pending Verification Tier (Documents Submitted, Awaiting Admin Review)
      {
        name: "Tewodros Kassahun",
        username: "tewodros_auto",
        email: "tewodros.mechanic@sureservice.com",
        category: "Mechanic",
        hourlyRate: 400,
        experienceYears: 3,
        skills: ["OBD2 Engine Diagnostics", "Brake Pad Replacement", "Battery & Alternator Servicing"],
        phone: "+251 91 899 0011",
        bio: "Mobile mechanic providing on-site roadside diagnostic troubleshooting and preventive maintenance.",
        location: { city: "Addis Ababa", subCity: "CMC", address: "Near Michael Roundabout" },
        verificationStatus: "pending",
        verificationDocType: "Automotive Tech Diploma",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 1,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Abel Tesfaye",
        username: "abel_mechanic",
        email: "abel.mechanic@sureservice.com",
        category: "Mechanic",
        hourlyRate: 450,
        experienceYears: 5,
        skills: ["Transmission Diagnostics", "Suspension & Shock Absorber Tuning", "Electronic Sensor Calibration"],
        phone: "+251 91 555 3322",
        bio: "Automotive technician specializing in modern Japanese and European vehicle engine electronics in Summit.",
        location: { city: "Addis Ababa", subCity: "Summit", address: "Near Pepsi Roundabout" },
        verificationStatus: "pending",
        verificationDocType: "National Automotive Trade License",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 2,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Nebiyu Asrat",
        username: "nebiyu_hvac",
        email: "nebiyu.hvac@sureservice.com",
        category: "HVAC",
        hourlyRate: 420,
        experienceYears: 4,
        skills: ["Split AC Gas Refill", "Ductwork Maintenance", "Compressor Replacement"],
        phone: "+251 91 666 4433",
        bio: "AC & refrigeration cooling technician working across eastern Ethiopia high-temperature commercial environments.",
        location: { city: "Dire Dawa", subCity: "Megala", address: "Commercial District 01" },
        verificationStatus: "pending",
        verificationDocType: "TVET Refrigeration Diploma",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 1,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },

      // Unverified Tier (New Onboarding Baseline)
      {
        name: "Hanan Mohammed",
        username: "hanan_appliance",
        email: "hanan.appliance@sureservice.com",
        category: "Appliance Repair",
        hourlyRate: 320,
        experienceYears: 2,
        skills: ["Washing Machine Diagnostics", "Microwave & Oven Repair", "Refrigerator Gas Refill"],
        phone: "+251 91 900 1122",
        bio: "Technician fixing common household appliances with genuine replacement parts.",
        location: { city: "Dire Dawa", subCity: "Kebele 02", address: "Station Road" },
        verificationStatus: "unverified",
        verificationDocType: "National ID",
        verificationDocUrl: "",
        completedJobsCount: 0,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Ruth Negash",
        username: "ruth_languages",
        email: "ruth.tutor@sureservice.com",
        category: "Tutoring",
        hourlyRate: 300,
        experienceYears: 3,
        skills: ["Conversational English", "Amharic Grammar & Writing", "IELTS Academic Prep", "Essay Writing"],
        phone: "+251 91 777 5544",
        bio: "Language instructor offering engaging bilingual tutoring sessions for children, students, and professionals in Bole.",
        location: { city: "Addis Ababa", subCity: "Bole", address: "Friendship Park View" },
        verificationStatus: "unverified",
        verificationDocType: "National ID",
        verificationDocUrl: "",
        completedJobsCount: 0,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
      {
        name: "Biniam Hailu",
        username: "biniam_roofing",
        email: "biniam.roofing@sureservice.com",
        category: "Roofing",
        hourlyRate: 380,
        experienceYears: 3,
        skills: ["Corrugated Sheet Replacement", "Bitumen Sheet Waterproofing", "Gutter Drainage Installation"],
        phone: "+251 91 888 6655",
        bio: "Roofing and rainy season leak sealing specialist handling corrugated iron sheets and concrete roof decks in Hawassa.",
        location: { city: "Hawassa", subCity: "Menaharia", address: "Bus Station Road" },
        verificationStatus: "unverified",
        verificationDocType: "National ID",
        verificationDocUrl: "",
        completedJobsCount: 0,
        repeatCustomerCount: 0,
        providerCancelledCount: 0,
      },
    ];

    const seededProviders: Record<string, any> = {};

    for (const def of providerDefs) {
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(def.name)}&backgroundColor=2563eb,10b981,f59e0b,8b5cf6,ec4899`;
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
      console.log(`Seeded Provider: ${provider.name.padEnd(20)} | Category: ${provider.category.padEnd(16)} | Trust Score: ${String(trustScore).padStart(2)}/100`);
    }

    // 4. Seed Verified Bookings & Customer Interactions
    const providerAbebe = seededProviders["abebe_electric"];
    const providerAlmaz = seededProviders["almaz_cleaning"];
    const providerBereket = seededProviders["bereket_stem"];
    const providerErmias = seededProviders["ermias_solar"];
    const providerSelam = seededProviders["selam_tutor"];
    const providerYohannes = seededProviders["yohannes_plumb"];
    const providerHiwot = seededProviders["hiwot_clean"];
    const providerSamuel = seededProviders["samuel_plumb"];
    const providerSurafel = seededProviders["surafel_wood"];
    const providerEden = seededProviders["eden_gardens"];
    const providerFitsum = seededProviders["fitsum_wood"];
    const providerKidus = seededProviders["kidus_hvac"];
    const providerMeron = seededProviders["meron_paint"];

    // Booking 1: Bethlehem & Abebe (Completed Job 1)
    const booking1 = await BookingModel.create({
      customer: customerBethlehem._id,
      provider: providerAbebe._id,
      category: "Electrical",
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
    });

    // Booking 2: Bethlehem & Abebe (Completed Job 2 - Repeat Customer Bonus)
    const booking2 = await BookingModel.create({
      customer: customerBethlehem._id,
      provider: providerAbebe._id,
      category: "Electrical",
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
    });

    // Booking 3: Bethlehem & Almaz (Completed)
    const booking3 = await BookingModel.create({
      customer: customerBethlehem._id,
      provider: providerAlmaz._id,
      category: "Cleaning",
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
    });

    // Booking 4: Tsion & Selamawit (Completed)
    const booking4 = await BookingModel.create({
      customer: customerTsion._id,
      provider: providerSelam._id,
      category: "Tutoring",
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
    });

    // Booking 5: Henok & Dr. Bereket (Completed)
    const booking5 = await BookingModel.create({
      customer: customerHenok._id,
      provider: providerBereket._id,
      category: "Tutoring",
      serviceDate: "2026-08-03",
      timeSlot: "Morning (10:00 AM - 12:00 PM)",
      address: "Mebrat Hail Condominium, Block 12",
      city: "Addis Ababa",
      subCity: "Gerji",
      notes: "Advanced Physics and Calculus revision for entrance examination.",
      status: "completed",
      wasAccepted: true,
      acceptedAt: new Date("2026-08-02T11:00:00Z"),
      completedAt: new Date("2026-08-03T12:00:00Z"),
    });

    // Booking 6: Mahlet & Ermias (Completed)
    const booking6 = await BookingModel.create({
      customer: customerMahlet._id,
      provider: providerErmias._id,
      category: "Electrical",
      serviceDate: "2026-08-06",
      timeSlot: "Full Day (09:00 AM - 04:00 PM)",
      address: "Lake Awassa Drive, Villa 4",
      city: "Hawassa",
      subCity: "Tabor",
      notes: "10kVA solar hybrid inverter installation with 8 lithium battery modules.",
      status: "completed",
      wasAccepted: true,
      acceptedAt: new Date("2026-08-05T08:30:00Z"),
      completedAt: new Date("2026-08-06T16:00:00Z"),
    });

    // Booking 7: Rahel & Hiwot (Completed)
    const booking7 = await BookingModel.create({
      customer: customerRahel._id,
      provider: providerHiwot._id,
      category: "Cleaning",
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
    });

    // Booking 8: Senait & Samuel (Completed)
    const booking8 = await BookingModel.create({
      customer: customerSenait._id,
      provider: providerSamuel._id,
      category: "Plumbing",
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
    });

    // Booking 9: Solomon & Surafel (Completed)
    const booking9 = await BookingModel.create({
      customer: customerSolomon._id,
      provider: providerSurafel._id,
      category: "Carpentry",
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
    });

    // Booking 10: Eyerusalem & Eden (Completed)
    const booking10 = await BookingModel.create({
      customer: customerEyerusalem._id,
      provider: providerEden._id,
      category: "Landscaping",
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
    });

    // Active Bookings: Pending & Accepted requests
    // Active Booking 1: Pending request from Bethlehem to Yohannes (Plumbing)
    await BookingModel.create({
      customer: customerBethlehem._id,
      provider: providerYohannes._id,
      category: "Plumbing",
      serviceDate: "2026-08-22",
      timeSlot: "Morning (09:00 AM - 12:00 PM)",
      address: "Bole Medhanialem, House 412",
      city: "Addis Ababa",
      subCity: "Bole",
      notes: "Kitchen sink drain is clogged and leaking under the wooden counter.",
      status: "pending",
      wasAccepted: false,
    });

    // Active Booking 2: Accepted request from Yared to Fitsum (Carpentry)
    await BookingModel.create({
      customer: customerYared._id,
      provider: providerFitsum._id,
      category: "Carpentry",
      serviceDate: "2026-08-20",
      timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
      address: "ECA Road, Office 204",
      city: "Addis Ababa",
      subCity: "Kazanchis",
      notes: "Custom conference room storage shelves and document organizer.",
      status: "accepted",
      wasAccepted: true,
      acceptedAt: new Date("2026-08-19T11:00:00Z"),
    });

    // Active Booking 3: Pending request from Mahlet to Kidus (HVAC)
    await BookingModel.create({
      customer: customerMahlet._id,
      provider: providerKidus._id,
      category: "HVAC",
      serviceDate: "2026-08-24",
      timeSlot: "Morning (10:00 AM - 01:00 PM)",
      address: "Lake Awassa Drive, Villa 4",
      city: "Hawassa",
      subCity: "Piazza",
      notes: "Dining room dual-inverter AC unit not blowing cool air.",
      status: "pending",
      wasAccepted: false,
    });

    // Active Booking 4: Accepted request from Natnael to Meron (Painting)
    await BookingModel.create({
      customer: customerNatnael._id,
      provider: providerMeron._id,
      category: "Painting",
      serviceDate: "2026-08-23",
      timeSlot: "Morning (09:00 AM - 01:00 PM)",
      address: "Lake Tana Promenade, Office 10",
      city: "Bahir Dar",
      subCity: "Kebele 04",
      notes: "Two meeting room interior wall refresh with washable satin emulsion.",
      status: "accepted",
      wasAccepted: true,
      acceptedAt: new Date("2026-08-20T14:30:00Z"),
    });

    // 5. Seed Qualitative Reviews for Completed Jobs
    const reviewsData = [
      {
        booking: booking1._id,
        customer: customerBethlehem._id,
        provider: providerAbebe._id,
        rating: 5,
        comment: "Abebe is extraordinarily competent and arrived promptly. Diagnosed our breaker overload issue in 20 minutes.",
      },
      {
        booking: booking2._id,
        customer: customerBethlehem._id,
        provider: providerAbebe._id,
        rating: 5,
        comment: "Hired Abebe again for inverter setup. Clean workmanship, fair pricing, and clear explanations.",
      },
      {
        booking: booking3._id,
        customer: customerBethlehem._id,
        provider: providerAlmaz._id,
        rating: 5,
        comment: "Almaz and her team did an immaculate job. Every corner of the house was spotless and fresh.",
      },
      {
        booking: booking4._id,
        customer: customerTsion._id,
        provider: providerSelam._id,
        rating: 5,
        comment: "Selamawit makes complex math concepts very approachable. My daughter gained huge confidence for her national exam.",
      },
      {
        booking: booking5._id,
        customer: customerHenok._id,
        provider: providerBereket._id,
        rating: 5,
        comment: "Dr. Bereket is unmatched in physics problem-solving. Structured pedagogy and deep conceptual clarity.",
      },
      {
        booking: booking6._id,
        customer: customerMahlet._id,
        provider: providerErmias._id,
        rating: 5,
        comment: "Flawless solar hybrid installation in Hawassa. Our resort now operates 24/7 without power disruptions.",
      },
      {
        booking: booking7._id,
        customer: customerRahel._id,
        provider: providerHiwot._id,
        rating: 5,
        comment: "Hiwot's steam cleaning equipment removed all renovation gypsum dust without a trace. Highly recommended!",
      },
      {
        booking: booking8._id,
        customer: customerSenait._id,
        provider: providerSamuel._id,
        rating: 5,
        comment: "Samuel fixed our pump pressure in Adama swiftly. Fair pricing, genuine parts, and friendly demeanor.",
      },
      {
        booking: booking9._id,
        customer: customerSolomon._id,
        provider: providerSurafel._id,
        rating: 5,
        comment: "The TV console craftsmanship is top-tier. Clean mitred joints and solid finish.",
      },
      {
        booking: booking10._id,
        customer: customerEyerusalem._id,
        provider: providerEden._id,
        rating: 5,
        comment: "Eden transformed our terrace into a blooming paradise in Bishoftu. Wonderful eye for aesthetic greenery.",
      },
    ];

    for (const rev of reviewsData) {
      await ReviewModel.create(rev);
    }

    console.log("\n========================================================");
    console.log("Database successfully seeded!");
    console.log("========================================================");
    console.log(`Summary:`);
    console.log(`  - 1 Admin account`);
    console.log(`  - 10 Customer accounts`);
    console.log(`  - ${providerDefs.length} Provider accounts spanning 14 trades and 8 Ethiopian cities`);
    console.log(`  - 14 Bookings (10 Completed, 2 Accepted, 2 Pending)`);
    console.log(`  - 10 Qualitative 5-Star Reviews`);
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
