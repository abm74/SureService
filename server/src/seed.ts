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

    // 3. Create Providers with diverse Ethiopian trades and Trust tiers
    const providerDefs: ProviderDef[] = [
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
        name: "Binyam Mengistu",
        username: "binyam_tile",
        email: "binyam.tile@sureservice.com",
        category: "Flooring",
        hourlyRate: 350,
        experienceYears: 4,
        skills: ["Ceramic Tile Laying", "Granite Kitchen Counters", "Grout Repair"],
        phone: "+251 91 011 2233",
        bio: "Tile installer for bathrooms, kitchens and terrace corridors.",
        location: { city: "Addis Ababa", subCity: "Bole", address: "Rwanda Street" },
        verificationStatus: "approved",
        verificationDocType: "National ID",
        verificationDocUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
        completedJobsCount: 2,
        repeatCustomerCount: 0,
        providerCancelledCount: 2, // Penalized with 2 cancellations
      },
    ];

    const seededProviders: Record<string, any> = {};

    for (const def of providerDefs) {
      const { trustScore, breakdown } = computeTrustScore(def);

      const provider = await UserModel.create({
        name: def.name,
        username: def.username,
        email: def.email,
        password: DEMO_PASSWORD,
        role: "provider",
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
      console.log(`Seeded Provider: ${provider.name} | Category: ${provider.category} | Trust Score: ${trustScore}/100`);
    }

    // 4. Seed Verified Bookings & Interactions
    const providerAbebe = seededProviders["abebe_electric"];
    const providerAlmaz = seededProviders["almaz_cleaning"];
    const providerSelam = seededProviders["selam_tutor"];
    const providerYohannes = seededProviders["yohannes_plumb"];
    const providerFitsum = seededProviders["fitsum_wood"];

    // Completed Booking 1: Bethlehem & Abebe (Job 1)
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

    // Completed Booking 2: Bethlehem & Abebe (Job 2 - Repeat Customer!)
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

    // Completed Booking 3: Bethlehem & Almaz
    const booking3 = await BookingModel.create({
      customer: customerBethlehem._id,
      provider: providerAlmaz._id,
      category: "Cleaning",
      serviceDate: "2026-08-05",
      timeSlot: "Morning (08:30 AM - 01:00 PM)",
      address: "Bole Medhanialem, House 412",
      city: "Addis Ababa",
      subCity: "Bole",
      notes: "Deep cleaning for 3 bedrooms and living room before holiday gathering.",
      status: "completed",
      wasAccepted: true,
      acceptedAt: new Date("2026-08-04T10:00:00Z"),
      completedAt: new Date("2026-08-05T12:45:00Z"),
    });

    // Completed Booking 4: Tsion & Selamawit
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

    // Active Booking: Pending request from Bethlehem to Yohannes
    await BookingModel.create({
      customer: customerBethlehem._id,
      provider: providerYohannes._id,
      category: "Plumbing",
      serviceDate: "2026-08-20",
      timeSlot: "Morning (09:00 AM - 12:00 PM)",
      address: "Bole Medhanialem, House 412",
      city: "Addis Ababa",
      subCity: "Bole",
      notes: "Kitchen sink drain is clogged and leaking under the wooden counter.",
      status: "pending",
      wasAccepted: false,
    });

    // Active Booking: Accepted request from Yared to Fitsum
    await BookingModel.create({
      customer: customerYared._id,
      provider: providerFitsum._id,
      category: "Carpentry",
      serviceDate: "2026-08-19",
      timeSlot: "Afternoon (02:00 PM - 05:00 PM)",
      address: "ECA Road, Office 204",
      city: "Addis Ababa",
      subCity: "Kazanchis",
      notes: "Custom conference room storage shelves and document organizer.",
      status: "accepted",
      wasAccepted: true,
      acceptedAt: new Date("2026-08-18T11:00:00Z"),
    });

    // 5. Seed Qualitative Reviews
    await ReviewModel.create({
      booking: booking1._id,
      customer: customerBethlehem._id,
      provider: providerAbebe._id,
      rating: 5,
      comment: "Abebe is extraordinarily competent and arrived promptly. Diagnosed our breaker overload issue in 20 minutes.",
    });

    await ReviewModel.create({
      booking: booking2._id,
      customer: customerBethlehem._id,
      provider: providerAbebe._id,
      rating: 5,
      comment: "Hired Abebe again for inverter setup. Clean workmanship, fair pricing, and clear explanations.",
    });

    await ReviewModel.create({
      booking: booking3._id,
      customer: customerBethlehem._id,
      provider: providerAlmaz._id,
      rating: 5,
      comment: "Almaz and her team did an immaculate job. Every corner was spotless.",
    });

    await ReviewModel.create({
      booking: booking4._id,
      customer: customerTsion._id,
      provider: providerSelam._id,
      rating: 5,
      comment: "Selamawit makes complex math concepts very approachable. My daughter gained huge confidence.",
    });

    console.log("Database successfully seeded with Ethiopian providers, bookings, reviews, and demo credentials!");
    console.log("\nDemo Credentials:");
    console.log("  Customer: customer@sureservice.com | DemoPassword123!");
    console.log("  Provider: provider@sureservice.com | DemoPassword123!");
    console.log("  Admin:    admin@sureservice.com    | DemoPassword123!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();
