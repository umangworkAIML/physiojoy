import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.therapistProfile.deleteMany();
  await prisma.physioDanceVideo.deleteMany();
  await prisma.product.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleaned existing data");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@physioconnect.in",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created (admin@physioconnect.in / admin123)");

  // Create Patient Users
  const patientPassword = await bcrypt.hash("patient123", 12);
  const patients = await Promise.all(
    [
      { name: "Priya Patel", email: "priya@example.com", phone: "+919876543210" },
      { name: "Rajesh Shah", email: "rajesh@example.com", phone: "+919876543211" },
      { name: "Anita Desai", email: "anita@example.com", phone: "+919876543212" },
    ].map((p) =>
      prisma.user.create({
        data: { ...p, passwordHash: patientPassword, role: "PATIENT" },
      })
    )
  );
  console.log("✅ Patient users created");

  // Create Therapist Users & Profiles
  const therapistPassword = await bcrypt.hash("therapist123", 12);
  const therapistData = [
    {
      name: "Dr. Sarah Khan",
      email: "sarah@physioconnect.in",
      phone: "+919876543220",
      profile: {
        specializations: ["Orthopedic", "Sports Injury", "Spine & Back"],
        experience: 12,
        bio: "Senior physiotherapist with 12+ years of experience specializing in orthopedic and sports injury rehabilitation. Fellowship from AIIMS Delhi with expertise in manual therapy and modern rehabilitation techniques.",
        qualifications: "BPT, MPT (Ortho), AIIMS Fellow",
        hourlyRate: 1500,
        homeVisit: true,
        clinicVisit: true,
        onlineConsult: true,
        rating: 4.9,
        reviewCount: 156,
        verified: true,
        latitude: 23.0225,
        longitude: 72.5714,
        address: "Satellite, Ahmedabad",
      },
    },
    {
      name: "Dr. Amit Joshi",
      email: "amit@physioconnect.in",
      phone: "+919876543221",
      profile: {
        specializations: ["Neurological", "Geriatric", "Post-Surgical"],
        experience: 8,
        bio: "Specialized in neurological rehabilitation and post-surgical recovery. Expert in stroke rehabilitation and mobility restoration for elderly patients.",
        qualifications: "BPT, MPT (Neuro)",
        hourlyRate: 1200,
        homeVisit: true,
        clinicVisit: true,
        onlineConsult: true,
        rating: 4.8,
        reviewCount: 98,
        verified: true,
        latitude: 23.03,
        longitude: 72.58,
        address: "Navrangpura, Ahmedabad",
      },
    },
    {
      name: "Dr. Meera Reddy",
      email: "meera@physioconnect.in",
      phone: "+919876543222",
      profile: {
        specializations: ["Women's Health", "Pediatric", "Chronic Pain"],
        experience: 10,
        bio: "Passionate about women's health and pediatric physiotherapy. Certified in pelvic floor rehabilitation and prenatal/postnatal care.",
        qualifications: "BPT, MPT, CPPC",
        hourlyRate: 1300,
        homeVisit: true,
        clinicVisit: true,
        onlineConsult: true,
        rating: 4.9,
        reviewCount: 132,
        verified: true,
        latitude: 23.04,
        longitude: 72.55,
        address: "Prahladnagar, Ahmedabad",
      },
    },
    {
      name: "Dr. Vivek Mehta",
      email: "vivek@physioconnect.in",
      phone: "+919876543223",
      profile: {
        specializations: ["Sports Injury", "Cardiopulmonary", "Orthopedic"],
        experience: 6,
        bio: "Sports physiotherapist working with professional cricket and football teams. Expert in ACL rehabilitation, shoulder injuries, and cardiopulmonary rehabilitation.",
        qualifications: "BPT, MSc Sports Medicine",
        hourlyRate: 1000,
        homeVisit: true,
        clinicVisit: true,
        onlineConsult: false,
        rating: 4.7,
        reviewCount: 74,
        verified: true,
        latitude: 23.01,
        longitude: 72.56,
        address: "SG Highway, Ahmedabad",
      },
    },
    {
      name: "Dr. Nisha Sharma",
      email: "nisha@physioconnect.in",
      phone: "+919876543224",
      profile: {
        specializations: ["Chronic Pain", "Spine & Back", "Geriatric"],
        experience: 15,
        bio: "One of Ahmedabad's most experienced pain management physiotherapists. Specializes in chronic back pain, cervical issues, and elderly mobility improvement.",
        qualifications: "BPT, MPT, PhD Rehabilitation",
        hourlyRate: 2000,
        homeVisit: true,
        clinicVisit: true,
        onlineConsult: true,
        rating: 5.0,
        reviewCount: 210,
        verified: true,
        latitude: 23.05,
        longitude: 72.59,
        address: "Bodakdev, Ahmedabad",
      },
    },
    {
      name: "Dr. Karan Patel",
      email: "karan@physioconnect.in",
      phone: "+919876543225",
      profile: {
        specializations: ["Orthopedic", "Post-Surgical"],
        experience: 4,
        bio: "Young and dynamic physiotherapist specializing in post-surgical rehabilitation. Known for innovative exercises and patient-friendly approach.",
        qualifications: "BPT, MPT (Ortho)",
        hourlyRate: 800,
        homeVisit: true,
        clinicVisit: false,
        onlineConsult: true,
        rating: 4.6,
        reviewCount: 45,
        verified: true,
        latitude: 23.02,
        longitude: 72.57,
        address: "Vastrapur, Ahmedabad",
      },
    },
  ];

  for (const t of therapistData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        phone: t.phone,
        passwordHash: therapistPassword,
        role: "THERAPIST",
      },
    });

    const therapistProfile = await prisma.therapistProfile.create({
      data: {
        userId: user.id,
        ...t.profile,
      },
    });

    // Create availability (Mon-Sat 9-18)
    for (let day = 1; day <= 6; day++) {
      await prisma.availability.create({
        data: {
          therapistId: therapistProfile.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          isActive: true,
        },
      });
    }
  }
  console.log("✅ Therapist users and profiles created");

  // Create Clinics
  await prisma.clinic.createMany({
    data: [
      {
        name: "PhysioConnect Satellite Clinic",
        address: "201, Shivalik Complex, Satellite Cross Roads, Ahmedabad 380015",
        phone: "+919876543280",
        email: "satellite@physioconnect.in",
        latitude: 23.0225,
        longitude: 72.5714,
        description: "Our flagship clinic with state-of-the-art rehabilitation equipment and expert physiotherapists.",
        services: ["Orthopedic", "Sports Injury", "Spine Care", "Post-Surgical"],
        images: [],
        rating: 4.8,
        timings: "Mon-Sat: 8AM-8PM",
      },
      {
        name: "PhysioConnect SG Highway",
        address: "GF-12, Shapath Hexa, SG Highway, Ahmedabad 380054",
        phone: "+919876543281",
        email: "sghighway@physioconnect.in",
        latitude: 23.01,
        longitude: 72.56,
        description: "Modern clinic with hydrotherapy pool and advanced pain management facilities.",
        services: ["Neurological", "Hydrotherapy", "Pain Management", "Geriatric"],
        images: [],
        rating: 4.7,
        timings: "Mon-Sat: 9AM-7PM",
      },
      {
        name: "PhysioConnect Prahladnagar",
        address: "305, Venus Atlantis, Prahladnagar, Ahmedabad 380015",
        phone: "+919876543282",
        email: "prahladnagar@physioconnect.in",
        latitude: 23.04,
        longitude: 72.55,
        description: "Specialized in women's health and pediatric physiotherapy with dedicated kids area.",
        services: ["Women's Health", "Pediatric", "Prenatal", "Chronic Pain"],
        images: [],
        rating: 4.9,
        timings: "Mon-Sat: 9AM-6PM",
      },
      {
        name: "PhysioConnect CG Road",
        address: "108, Siddhivinayak Complex, CG Road, Ahmedabad 380006",
        phone: "+919876543283",
        email: "cgroad@physioconnect.in",
        latitude: 23.03,
        longitude: 72.58,
        description: "Central Ahmedabad's premium physiotherapy center with advanced equipment.",
        services: ["Orthopedic", "Cardiopulmonary", "Sports Medicine", "Rehabilitation"],
        images: [],
        rating: 4.6,
        timings: "Mon-Sat: 8AM-9PM, Sun: 9AM-1PM",
      },
    ],
  });
  console.log("✅ Clinics created");

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: "Premium Massage Gun Pro",
        slug: "premium-massage-gun-pro",
        description: "Professional-grade percussion massager with 6 interchangeable heads and 30 speed levels. Ideal for deep tissue massage and muscle recovery.",
        price: 4999,
        salePrice: 3499,
        category: "MASSAGE_GUNS",
        images: [],
        inStock: true,
        stockCount: 50,
        rating: 4.7,
        features: ["30 Speed Levels", "6 Massage Heads", "2400mAh Battery", "Ultra Quiet (<45dB)", "Carry Case Included"],
      },
      {
        name: "Ortho Relief Pain Cream",
        slug: "ortho-relief-pain-cream",
        description: "Fast-acting topical pain relief cream with natural ingredients. Provides targeted relief for joint and muscle pain.",
        price: 599,
        salePrice: 449,
        category: "PAIN_RELIEF",
        images: [],
        inStock: true,
        stockCount: 200,
        rating: 4.5,
        features: ["Natural Ingredients", "Fast Absorption", "Non-Greasy", "Doctor Recommended", "100ml Pack"],
      },
      {
        name: "Posture Corrector Belt",
        slug: "posture-corrector-belt",
        description: "Ergonomic posture correction belt that gently pulls shoulders back to improve posture. Adjustable and comfortable for all-day wear.",
        price: 1299,
        salePrice: 999,
        category: "POSTURE_CORRECTORS",
        images: [],
        inStock: true,
        stockCount: 80,
        rating: 4.3,
        features: ["Adjustable Straps", "Breathable Fabric", "Unisex Design", "Invisible Under Clothing", "Medical Grade"],
      },
      {
        name: "Therapeutic Arch Support Slippers",
        slug: "therapeutic-arch-support-slippers",
        description: "Premium orthopedic slippers with arch support and memory foam cushioning. Designed for plantar fasciitis relief and everyday comfort.",
        price: 1799,
        salePrice: 1299,
        category: "SLIPPERS",
        images: [],
        inStock: true,
        stockCount: 120,
        rating: 4.8,
        features: ["Memory Foam Cushion", "Arch Support", "Anti-Slip Sole", "Plantar Fasciitis Relief", "Multiple Sizes"],
      },
      {
        name: "Hot & Cold Therapy Pack",
        slug: "hot-cold-therapy-pack",
        description: "Reusable gel therapy pack for hot and cold treatment. Perfect for injuries, inflammation, and muscle soreness relief.",
        price: 799,
        category: "PAIN_RELIEF",
        images: [],
        inStock: true,
        stockCount: 150,
        rating: 4.4,
        features: ["Dual Temperature", "Reusable Gel", "Flexible Design", "Adjustable Wrap", "Medical Grade"],
      },
      {
        name: "Resistance Band Set (5 Bands)",
        slug: "resistance-band-set",
        description: "Complete set of 5 resistance bands with varying tension levels. Perfect for rehabilitation exercises and strength training.",
        price: 899,
        salePrice: 699,
        category: "EXERCISE_EQUIPMENT",
        images: [],
        inStock: true,
        stockCount: 90,
        rating: 4.6,
        features: ["5 Resistance Levels", "Natural Latex", "Door Anchor", "Carry Bag", "Exercise Guide Included"],
      },
      {
        name: "Cervical Neck Pillow",
        slug: "cervical-neck-pillow",
        description: "Ergonomic memory foam cervical pillow designed for neck pain relief and proper spinal alignment. Perfect for side and back sleepers.",
        price: 2499,
        salePrice: 1799,
        category: "PAIN_RELIEF",
        images: [],
        inStock: true,
        stockCount: 60,
        rating: 4.7,
        features: ["Memory Foam", "Ergonomic Design", "Hypoallergenic", "Removable Cover", "Cervical Support"],
      },
      {
        name: "Mini Massage Gun Lite",
        slug: "mini-massage-gun-lite",
        description: "Compact and portable percussion massager perfect for on-the-go relief. Lightweight design with 4 massage heads.",
        price: 2499,
        salePrice: 1999,
        category: "MASSAGE_GUNS",
        images: [],
        inStock: true,
        stockCount: 70,
        rating: 4.5,
        features: ["Compact Design", "4 Massage Heads", "USB-C Charging", "Weighs 400g", "Travel Friendly"],
      },
    ],
  });
  console.log("✅ Products created");

  // Create Physio Dance Videos
  await prisma.physioDanceVideo.createMany({
    data: [
      {
        title: "Morning Mobility Flow",
        description: "Start your day with this gentle 15-minute mobility routine. Perfect for loosening stiff joints and energizing your body.",
        videoUrl: "https://example.com/videos/morning-mobility",
        thumbnail: "",
        duration: "15:00",
        category: "General Mobility",
        difficulty: "Beginner",
        instructor: "Dr. Sarah Khan",
        views: 12500,
      },
      {
        title: "Lower Back Pain Relief Dance",
        description: "Rhythmic movements designed to relieve lower back tension. Combines gentle stretching with therapeutic music.",
        videoUrl: "https://example.com/videos/back-pain-dance",
        thumbnail: "",
        duration: "20:00",
        category: "Back Pain",
        difficulty: "Beginner",
        instructor: "Dr. Nisha Sharma",
        views: 28400,
      },
      {
        title: "Knee Recovery Rhythm",
        description: "Post-knee surgery or injury recovery exercise set to upbeat music. Strengthens supporting muscles gradually.",
        videoUrl: "https://example.com/videos/knee-recovery",
        thumbnail: "",
        duration: "18:00",
        category: "Knee Recovery",
        difficulty: "Intermediate",
        instructor: "Dr. Amit Joshi",
        views: 8900,
      },
      {
        title: "Shoulder & Neck Release Flow",
        description: "Release tension in your shoulders and neck with this calming dance therapy session. Great for desk workers.",
        videoUrl: "https://example.com/videos/shoulder-neck",
        thumbnail: "",
        duration: "12:00",
        category: "Shoulder",
        difficulty: "Beginner",
        instructor: "Dr. Meera Reddy",
        views: 15600,
      },
      {
        title: "Advanced Hip Mobility Dance",
        description: "Challenge your hip mobility with this advanced routine. Includes deep stretches and rotational movements.",
        videoUrl: "https://example.com/videos/hip-mobility",
        thumbnail: "",
        duration: "25:00",
        category: "Hip & Leg",
        difficulty: "Advanced",
        instructor: "Dr. Vivek Mehta",
        views: 6200,
      },
      {
        title: "Full Body Stretch & Dance",
        description: "Complete 30-minute full body stretch routine set to relaxing music. Perfect for end of day wind-down.",
        videoUrl: "https://example.com/videos/full-body",
        thumbnail: "",
        duration: "30:00",
        category: "General Mobility",
        difficulty: "Intermediate",
        instructor: "Dr. Sarah Khan",
        views: 19800,
      },
    ],
  });
  console.log("✅ Physio Dance videos created");

  // Create Some Reviews
  const therapistProfiles = await prisma.therapistProfile.findMany();
  const reviewComments = [
    "Excellent treatment! My back pain reduced significantly after just 3 sessions.",
    "Very professional and caring. Highly recommend for post-surgery recovery.",
    "The home visit was so convenient. Dr. was punctual and thorough.",
    "Great experience with online consultation. Got proper exercise plan.",
    "Best physiotherapist in Ahmedabad. Worth every rupee.",
  ];

  for (const profile of therapistProfiles.slice(0, 3)) {
    for (let i = 0; i < 2; i++) {
      await prisma.review.create({
        data: {
          userId: patients[i].id,
          therapistId: profile.id,
          rating: 4 + Math.round(Math.random()),
          comment: reviewComments[(i + therapistProfiles.indexOf(profile)) % reviewComments.length],
        },
      });
    }
  }
  console.log("✅ Reviews created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin:     admin@physioconnect.in / admin123");
  console.log("  Patient:   priya@example.com / patient123");
  console.log("  Therapist: sarah@physioconnect.in / therapist123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
