import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.aiMessage.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.documentEmbedding.deleteMany();
  await prisma.workshopRegistration.deleteMany();
  await prisma.workshopSession.deleteMany();
  await prisma.userCourseProgress.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.pinnedResource.deleteMany();
  await prisma.resourceInitiativeLink.deleteMany();
  await prisma.resourceTag.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.initiativeSave.deleteMany();
  await prisma.initiativeCapability.deleteMany();
  await prisma.initiativeUpdate.deleteMany();
  await prisma.initiativeObjective.deleteMany();
  await prisma.initiativeTeamMember.deleteMany();
  await prisma.initiativeTag.deleteMany();
  await prisma.initiative.deleteMany();
  await prisma.initiativeCategory.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.userContribution.deleteMany();
  await prisma.userProject.deleteMany();
  await prisma.userTool.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Hash passwords
  const adminHash = await bcrypt.hash('admin123', 10);
  const authorHash = await bcrypt.hash('author123', 10);
  const viewerHash = await bcrypt.hash('viewer123', 10);

  // ─── USERS ──────────────────────────────────────────────────────────────────
  const jhon = await prisma.user.create({
    data: {
      email: 'jhon.daniel@biomarin.com',
      firstName: 'Jhon',
      lastName: 'Daniel',
      displayName: 'Jhon Daniel',
      passwordHash: adminHash,
      title: 'EVP Digital Operations',
      department: 'Executive Team',
      location: 'New York, USA',
      role: 'admin',
      status: 'active',
      teamsHandle: '@jhon.daniel',
      bio: 'Executive Vice President overseeing all digital operations and transformation initiatives at BioMarin.',
      availabilityStatus: 'available',
      orgLevel: 0,
    },
  });

  const david = await prisma.user.create({
    data: {
      email: 'david.chen@biomarin.com',
      firstName: 'David',
      lastName: 'Chen',
      displayName: 'David Chen',
      passwordHash: adminHash,
      title: 'Director of Digital Transformation',
      department: 'Digital Transformation Team',
      location: 'San Francisco, USA',
      role: 'admin',
      status: 'active',
      teamsHandle: '@david.chen',
      bio: 'Leading BioMarin\'s digital transformation strategy, driving innovation and operational excellence across all business units.',
      availabilityStatus: 'available',
      reportsToId: jhon.id,
      orgLevel: 1,
    },
  });

  const animesh = await prisma.user.create({
    data: {
      email: 'animesh.sarkar@biomarin.com',
      firstName: 'Animesh',
      lastName: 'Sarkar',
      displayName: 'Animesh Sarkar',
      passwordHash: authorHash,
      title: 'VP Engineering',
      department: 'Engineering',
      location: 'Bengaluru, IND',
      role: 'author',
      status: 'active',
      teamsHandle: '@animesh.sarkar',
      bio: 'VP Engineering with 15+ years of experience building scalable enterprise systems.',
      availabilityStatus: 'available',
      reportsToId: david.id,
      orgLevel: 2,
    },
  });

  const ishika = await prisma.user.create({
    data: {
      email: 'ishika.gupta@biomarin.com',
      firstName: 'Ishika',
      lastName: 'Gupta',
      displayName: 'Ishika Gupta',
      passwordHash: authorHash,
      title: 'Director of AI Innovation',
      department: 'Digital Transformation Team',
      location: 'Bengaluru, IND',
      role: 'author',
      status: 'active',
      teamsHandle: '@ishika.gupta',
      phone: '+1 (555) 123-4567',
      bio: 'Passionate about leveraging AI and machine learning to drive business outcomes. Leading AI strategy and implementation across BioMarin\'s digital transformation initiatives.',
      availabilityStatus: 'available',
      reportsToId: david.id,
      orgLevel: 2,
    },
  });

  const raghavendra = await prisma.user.create({
    data: {
      email: 'raghavendra.agara@biomarin.com',
      firstName: 'Raghavendra',
      lastName: 'Agara',
      displayName: 'Raghavendra Agara',
      passwordHash: authorHash,
      title: 'Head of Data Platform',
      department: 'Data Team',
      location: 'Hyderabad, IND',
      role: 'author',
      status: 'active',
      teamsHandle: '@raghavendra.agara',
      bio: 'Building the data infrastructure that powers BioMarin\'s analytics and AI capabilities.',
      availabilityStatus: 'available',
      reportsToId: david.id,
      orgLevel: 2,
    },
  });

  const rahul = await prisma.user.create({
    data: {
      email: 'rahul.sharma@biomarin.com',
      firstName: 'Rahul',
      lastName: 'Sharma',
      displayName: 'Rahul Sharma',
      passwordHash: viewerHash,
      title: 'Senior Cloud Architect',
      department: 'Engineering',
      location: 'Bengaluru, IND',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@rahul.sharma',
      bio: 'Cloud architect specializing in AWS and DevOps practices.',
      availabilityStatus: 'available',
      reportsToId: animesh.id,
      orgLevel: 3,
    },
  });

  const elena = await prisma.user.create({
    data: {
      email: 'elena.chen@biomarin.com',
      firstName: 'Elena',
      lastName: 'Chen',
      displayName: 'Elena Chen',
      passwordHash: viewerHash,
      title: 'Data Science Lead',
      department: 'Analytics Team',
      location: 'Boston, USA',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@elena.chen',
      bio: 'Data scientist with expertise in machine learning and predictive analytics.',
      availabilityStatus: 'available',
      reportsToId: animesh.id,
      orgLevel: 3,
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: 'priya.sharma@biomarin.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      displayName: 'Priya Sharma',
      passwordHash: authorHash,
      title: 'Senior Product Manager',
      department: 'Product Team',
      location: 'Mumbai, IND',
      role: 'author',
      status: 'active',
      teamsHandle: '@priya.sharma',
      bio: 'Product manager with experience in enterprise software and digital health.',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  const sofia = await prisma.user.create({
    data: {
      email: 'sofia.martinez@biomarin.com',
      firstName: 'Sofia',
      lastName: 'Martinez',
      displayName: 'Sofia Martinez',
      passwordHash: viewerHash,
      title: 'Legal Counsel',
      department: 'Legal Team',
      location: 'Madrid, ESP',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@sofia.martinez',
      bio: 'Legal counsel specializing in IP law and pharmaceutical regulatory compliance.',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: 'maria.gomez@biomarin.com',
      firstName: 'Maria',
      lastName: 'Gomez',
      displayName: 'Maria Gomez',
      passwordHash: viewerHash,
      title: 'Marketing Manager',
      department: 'Marketing Team',
      location: 'Barcelona, ESP',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@maria.gomez',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  const raj = await prisma.user.create({
    data: {
      email: 'raj.patel@biomarin.com',
      firstName: 'Raj',
      lastName: 'Patel',
      displayName: 'Raj Patel',
      passwordHash: authorHash,
      title: 'Solutions Architect',
      department: 'Engineering',
      location: 'London, UK',
      role: 'author',
      status: 'active',
      teamsHandle: '@raj.patel',
      bio: 'Solutions architect focused on cloud-native enterprise architecture.',
      availabilityStatus: 'busy',
      orgLevel: 3,
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.jenkins@biomarin.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      displayName: 'Sarah Jenkins',
      passwordHash: viewerHash,
      title: 'Clinical Data Analyst',
      department: 'Clinical Team',
      location: 'San Francisco, USA',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@sarah.jenkins',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  const marcus = await prisma.user.create({
    data: {
      email: 'marcus.t@biomarin.com',
      firstName: 'Marcus',
      lastName: 'Thompson',
      displayName: 'Marcus Thompson',
      passwordHash: viewerHash,
      title: 'Regulatory Affairs Manager',
      department: 'Regulatory Team',
      location: 'New York, USA',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@marcus.t',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  const amiyangsu = await prisma.user.create({
    data: {
      email: 'amiyangsu.ray@biomarin.com',
      firstName: 'Amiyangsu',
      lastName: 'Ray',
      displayName: 'Amiyangsu Ray',
      passwordHash: authorHash,
      title: 'DevOps Lead',
      department: 'Infrastructure',
      location: 'Kolkata, IND',
      role: 'author',
      status: 'active',
      teamsHandle: '@amiyangsu.ray',
      bio: 'DevOps lead driving infrastructure automation and CI/CD excellence.',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  const lukas = await prisma.user.create({
    data: {
      email: 'lukas.muller@biomarin.com',
      firstName: 'Lukas',
      lastName: 'Müller',
      displayName: 'Lukas Müller',
      passwordHash: viewerHash,
      title: 'Business Analyst',
      department: 'Strategy Team',
      location: 'Munich, DEU',
      role: 'viewer',
      status: 'active',
      teamsHandle: '@lukas.muller',
      availabilityStatus: 'available',
      orgLevel: 3,
    },
  });

  console.log('✅ Users created');

  // ─── USER SKILLS ────────────────────────────────────────────────────────────
  await prisma.userSkill.createMany({
    data: [
      { userId: ishika.id, skill: 'AI Strategy', category: 'domain' },
      { userId: ishika.id, skill: 'Machine Learning', category: 'domain' },
      { userId: ishika.id, skill: 'Data Analytics', category: 'domain' },
      { userId: ishika.id, skill: 'CRM Integration', category: 'domain' },
      { userId: ishika.id, skill: 'Enterprise Architecture', category: 'domain' },
      { userId: ishika.id, skill: 'Python', category: 'technical' },
      { userId: ishika.id, skill: 'SQL', category: 'technical' },
      { userId: ishika.id, skill: 'AWS Cloud', category: 'technical' },
      { userId: ishika.id, skill: 'Agile Methodologies', category: 'methodology' },
      { userId: rahul.id, skill: 'AWS', category: 'technical' },
      { userId: rahul.id, skill: 'DevOps', category: 'domain' },
      { userId: rahul.id, skill: 'Security', category: 'domain' },
      { userId: rahul.id, skill: 'Kubernetes', category: 'technical' },
      { userId: rahul.id, skill: 'Terraform', category: 'technical' },
      { userId: elena.id, skill: 'Machine Learning', category: 'domain' },
      { userId: elena.id, skill: 'Python', category: 'technical' },
      { userId: elena.id, skill: 'Analytics', category: 'domain' },
      { userId: elena.id, skill: 'TensorFlow', category: 'technical' },
      { userId: elena.id, skill: 'Data Visualization', category: 'technical' },
      { userId: sofia.id, skill: 'Contracts', category: 'domain' },
      { userId: sofia.id, skill: 'Compliance', category: 'domain' },
      { userId: sofia.id, skill: 'IP Law', category: 'domain' },
      { userId: sofia.id, skill: 'Regulatory Affairs', category: 'domain' },
      { userId: raghavendra.id, skill: 'Data Engineering', category: 'domain' },
      { userId: raghavendra.id, skill: 'Snowflake', category: 'technical' },
      { userId: raghavendra.id, skill: 'Databricks', category: 'technical' },
      { userId: raghavendra.id, skill: 'Apache Spark', category: 'technical' },
      { userId: animesh.id, skill: 'Engineering Leadership', category: 'domain' },
      { userId: animesh.id, skill: 'System Design', category: 'domain' },
      { userId: animesh.id, skill: 'Microservices', category: 'technical' },
      { userId: david.id, skill: 'Digital Strategy', category: 'domain' },
      { userId: david.id, skill: 'Change Management', category: 'domain' },
      { userId: david.id, skill: 'Product Management', category: 'domain' },
      { userId: amiyangsu.id, skill: 'Docker', category: 'technical' },
      { userId: amiyangsu.id, skill: 'Kubernetes', category: 'technical' },
      { userId: amiyangsu.id, skill: 'CI/CD', category: 'domain' },
      { userId: raj.id, skill: 'Cloud Architecture', category: 'domain' },
      { userId: raj.id, skill: 'AWS', category: 'technical' },
      { userId: raj.id, skill: 'Azure', category: 'technical' },
      { userId: priya.id, skill: 'Product Strategy', category: 'domain' },
      { userId: priya.id, skill: 'Agile', category: 'methodology' },
      { userId: priya.id, skill: 'UX Research', category: 'domain' },
      { userId: marcus.id, skill: 'Regulatory Submissions', category: 'domain' },
      { userId: marcus.id, skill: 'Veeva Vault', category: 'tool' },
      { userId: sarah.id, skill: 'Clinical Data', category: 'domain' },
      { userId: sarah.id, skill: 'SAS', category: 'technical' },
      { userId: sarah.id, skill: 'R', category: 'technical' },
    ],
  });

  // ─── USER INTERESTS ──────────────────────────────────────────────────────────
  await prisma.userInterest.createMany({
    data: [
      { userId: ishika.id, interest: 'Hiking' },
      { userId: ishika.id, interest: 'Photography' },
      { userId: ishika.id, interest: 'Classical Music' },
      { userId: ishika.id, interest: 'Travelling' },
      { userId: rahul.id, interest: 'Open Source' },
      { userId: rahul.id, interest: 'Gaming' },
      { userId: elena.id, interest: 'Data Science Blogging' },
      { userId: elena.id, interest: 'Running' },
    ],
  });

  // ─── USER TOOLS ──────────────────────────────────────────────────────────────
  await prisma.userTool.createMany({
    data: [
      { userId: ishika.id, toolName: 'Jira' },
      { userId: ishika.id, toolName: 'Confluence' },
      { userId: ishika.id, toolName: 'AWS' },
      { userId: ishika.id, toolName: 'Tableau' },
      { userId: rahul.id, toolName: 'AWS' },
      { userId: rahul.id, toolName: 'Terraform' },
      { userId: rahul.id, toolName: 'Grafana' },
      { userId: elena.id, toolName: 'Jupyter' },
      { userId: elena.id, toolName: 'Python' },
      { userId: elena.id, toolName: 'Tableau' },
    ],

  });

  console.log('✅ User skills, interests, tools created');

  // ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────
  const now = new Date();
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Q4 Digital Transformation Goals',
        description: 'Our Q4 goals focus on accelerating AI adoption, improving data governance, and launching 3 new digital tools.',
        content: 'BioMarin\'s Q4 digital transformation strategy focuses on three core pillars: AI-powered automation, data ecosystem expansion, and platform modernization.',
        category: 'announcement',
        authorId: david.id,
        team: 'Digital Transformation Team',
        publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        isFeatured: true,
      },
      {
        title: 'New AI Assistant Feature Launch',
        description: 'We\'re excited to announce the launch of our AI Knowledge Assistant, now available to all employees.',
        content: 'The AI Knowledge Assistant leverages RAG technology to provide instant answers from our knowledge base.',
        category: 'announcement',
        authorId: ishika.id,
        team: 'Digital Transformation Team',
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        isFeatured: true,
      },
      {
        title: 'Supply Chain AI Initiative Update',
        description: 'Phase 2 deployment successful — 40% improvement in query performance across the supply chain data platform.',
        content: 'The Supply Chain Optimization AI initiative has reached a major milestone with Phase 2 deployment.',
        category: 'initiative',
        authorId: raghavendra.id,
        team: 'Data Team',
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        isFeatured: false,
      },
      {
        title: 'Global Data Standards Framework Published',
        description: 'The data governance team has published comprehensive global data standards for all teams.',
        content: 'Consistent data standards are critical to our AI and analytics capabilities.',
        category: 'announcement',
        authorId: david.id,
        team: 'Data Governance',
        publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        isFeatured: false,
      },
      {
        title: 'Expert Directory Now Live',
        description: 'Connect with subject matter experts across the organization through our new Expert Directory.',
        content: 'The Expert Directory makes it easy to find and connect with the right people for your projects.',
        category: 'announcement',
        authorId: priya.id,
        team: 'Product Team',
        publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        isFeatured: false,
      },
    ],
  });

  console.log('✅ Announcements created');

  // ─── TOOLS ───────────────────────────────────────────────────────────────────
  await prisma.tool.createMany({
    data: [
      {
        name: 'AI Content Generator',
        description: 'Generate marketing copy, emails, and content at scale using AI.',
        category: 'Marketing',
        icon: 'sparkles',
        usageCount: 1200,
        isTrending: true,
      },
      {
        name: 'Data Viz Dashboard',
        description: 'Interactive data visualization and analytics dashboard.',
        category: 'Analytics',
        icon: 'bar-chart',
        usageCount: 850,
        isTrending: true,
      },
      {
        name: 'Standard MSA Template',
        description: 'Master Service Agreement template for vendor contracts.',
        category: 'Legal',
        icon: 'file-text',
        usageCount: 540,
        isTrending: false,
      },
      {
        name: 'Cloud Cost Calculator',
        description: 'Estimate and optimize your cloud infrastructure costs.',
        category: 'Engineering',
        icon: 'calculator',
        usageCount: 420,
        isTrending: false,
      },
    ],
  });

  console.log('✅ Tools created');

  // ─── INITIATIVE CATEGORIES ────────────────────────────────────────────────────
  const catTech = await prisma.initiativeCategory.create({
    data: {
      name: 'Technology in Motion',
      slug: 'technology-in-motion',
      description: 'Digital and technology modernization initiatives transforming BioMarin\'s core platforms.',
      sortOrder: 1,
    },
  });

  const catProcess = await prisma.initiativeCategory.create({
    data: {
      name: 'Process Transformation',
      slug: 'process-transformation',
      description: 'Initiatives reimagining and streamlining key business processes.',
      sortOrder: 2,
    },
  });

  const catDataAI = await prisma.initiativeCategory.create({
    data: {
      name: 'Data & AI',
      slug: 'data-ai',
      description: 'Data infrastructure and artificial intelligence initiatives.',
      sortOrder: 3,
    },
  });

  console.log('✅ Initiative categories created');

  // ─── INITIATIVES ──────────────────────────────────────────────────────────────
  const sfmc = await prisma.initiative.create({
    data: {
      title: 'Reimagine Marketing with SFMC',
      slug: 'reimagine-marketing-sfmc',
      subtitle: 'Transform customer engagement through Salesforce Marketing Cloud',
      description: 'Leveraging Salesforce Marketing Cloud to revolutionize BioMarin\'s customer engagement strategy across all touchpoints. This initiative drives personalized communication at scale, automates patient outreach programs, and provides deep analytics into campaign performance.',
      categoryId: catTech.id,
      status: 'active',
      impactLevel: 'high',
      isTrending: true,
      isNew: false,
      startDate: new Date('2025-01-12'),
      targetLaunchDate: new Date('2025-09-30'),
      teamName: 'Commercial IT',
      icon: 'megaphone',
      createdById: david.id,
    },
  });

  const pulseCrm = await prisma.initiative.create({
    data: {
      title: 'Get Started with Pulse CRM',
      slug: 'get-started-pulse-crm',
      subtitle: 'Unified CRM platform for sales and commercial teams',
      description: 'Deploying and adopting Pulse CRM across commercial operations to provide a single source of truth for customer data, improve sales productivity, and enable data-driven decision making.',
      categoryId: catTech.id,
      status: 'active',
      impactLevel: 'medium',
      isTrending: false,
      isNew: false,
      startDate: new Date('2025-02-01'),
      targetLaunchDate: new Date('2025-10-15'),
      teamName: 'Sales Operations',
      icon: 'users',
      createdById: priya.id,
    },
  });

  const dataEcosystem = await prisma.initiative.create({
    data: {
      title: 'Engineer a Connected Data Ecosystem',
      slug: 'engineer-connected-data-ecosystem',
      subtitle: 'Building a unified data platform with DataPoint',
      description: 'Creating a comprehensive data infrastructure that connects disparate data sources across the organization, enabling real-time analytics, improved data quality, and accelerated insights delivery.',
      categoryId: catDataAI.id,
      status: 'active',
      impactLevel: 'high',
      isTrending: false,
      isNew: true,
      startDate: new Date('2025-03-01'),
      targetLaunchDate: new Date('2025-11-30'),
      teamName: 'Data Engineering',
      icon: 'database',
      createdById: raghavendra.id,
    },
  });

  const aiDecision = await prisma.initiative.create({
    data: {
      title: 'Unlock AI-Driven Decision Making',
      slug: 'unlock-ai-decision-making',
      subtitle: 'AI and automation for smarter business operations',
      description: 'Implementing AI-powered tools and models across business functions to automate routine decisions, surface actionable insights, and augment human decision-making with predictive intelligence.',
      categoryId: catDataAI.id,
      status: 'active',
      impactLevel: 'high',
      isTrending: true,
      isNew: false,
      startDate: new Date('2025-01-20'),
      targetLaunchDate: new Date('2025-12-31'),
      teamName: 'AI Team',
      icon: 'cpu',
      createdById: ishika.id,
    },
  });

  const regulatory = await prisma.initiative.create({
    data: {
      title: 'Automate Regulatory Submissions',
      slug: 'automate-regulatory-submissions',
      subtitle: 'Streamlining Veeva Vault regulatory workflows',
      description: 'Automating the end-to-end regulatory submission process using Veeva Vault, reducing manual effort, improving compliance tracking, and accelerating time-to-submission across global markets.',
      categoryId: catProcess.id,
      status: 'active',
      impactLevel: 'high',
      isTrending: false,
      isNew: false,
      startDate: new Date('2025-02-15'),
      targetLaunchDate: new Date('2025-11-15'),
      teamName: 'Regulatory Affairs',
      icon: 'shield-check',
      createdById: marcus.id,
    },
  });

  const biomarkers = await prisma.initiative.create({
    data: {
      title: 'Accelerate Trials with Digital Biomarkers',
      slug: 'accelerate-trials-digital-biomarkers',
      subtitle: 'IoT and wearables for clinical trial optimization',
      description: 'Integrating digital biomarker collection through wearable devices and IoT sensors into clinical trial protocols, enabling continuous patient monitoring and richer clinical data capture.',
      categoryId: catProcess.id,
      status: 'active',
      impactLevel: 'high',
      isTrending: false,
      isNew: true,
      startDate: new Date('2025-04-01'),
      targetLaunchDate: new Date('2026-03-31'),
      teamName: 'Clinical Innovation',
      icon: 'activity',
      createdById: sarah.id,
    },
  });

  const supplyChain = await prisma.initiative.create({
    data: {
      title: 'Supply Chain Optimization AI',
      slug: 'supply-chain-optimization-ai',
      subtitle: 'AI-powered supply chain visibility and optimization',
      description: 'Deploying machine learning models to optimize BioMarin\'s supply chain operations, predict demand, automate vendor rerouting, and reduce transportation costs through intelligent route optimization.',
      categoryId: catDataAI.id,
      status: 'active',
      impactLevel: 'high',
      isTrending: false,
      isNew: false,
      startDate: new Date('2025-01-05'),
      targetLaunchDate: new Date('2025-10-31'),
      teamName: 'Operations',
      icon: 'truck',
      createdById: raghavendra.id,
    },
  });

  const cdp = await prisma.initiative.create({
    data: {
      title: 'CDP 2.0 Migration',
      slug: 'cdp-2-0-migration',
      subtitle: 'Next-generation Customer Data Platform migration',
      description: 'Migrating to the next-generation Customer Data Platform, unifying first-party data, improving identity resolution, and enabling real-time audience segmentation for marketing activation.',
      categoryId: catTech.id,
      status: 'active',
      impactLevel: 'medium',
      isTrending: false,
      isNew: false,
      startDate: new Date('2025-03-15'),
      targetLaunchDate: new Date('2025-12-15'),
      teamName: 'Marketing Technology',
      icon: 'layers',
      createdById: maria.id,
    },
  });

  console.log('✅ Initiatives created');

  // ─── INITIATIVE TAGS ─────────────────────────────────────────────────────────
  await prisma.initiativeTag.createMany({
    data: [
      { initiativeId: sfmc.id, tag: 'Marketing', color: 'blue' },
      { initiativeId: sfmc.id, tag: 'SFMC', color: 'blue' },
      { initiativeId: sfmc.id, tag: 'High Impact', color: 'green' },
      { initiativeId: pulseCrm.id, tag: 'Commercial', color: 'purple' },
      { initiativeId: pulseCrm.id, tag: 'Pulse CRM', color: 'blue' },
      { initiativeId: pulseCrm.id, tag: 'Sales', color: 'green' },
      { initiativeId: dataEcosystem.id, tag: 'Data & AI', color: 'blue' },
      { initiativeId: dataEcosystem.id, tag: 'DataPoint', color: 'purple' },
      { initiativeId: dataEcosystem.id, tag: 'Infrastructure', color: 'orange' },
      { initiativeId: aiDecision.id, tag: 'AI', color: 'blue' },
      { initiativeId: aiDecision.id, tag: 'Automation', color: 'green' },
      { initiativeId: aiDecision.id, tag: 'OpenAI', color: 'purple' },
      { initiativeId: regulatory.id, tag: 'Regulatory', color: 'orange' },
      { initiativeId: regulatory.id, tag: 'Veeva', color: 'blue' },
      { initiativeId: regulatory.id, tag: 'Process', color: 'gray' },
      { initiativeId: biomarkers.id, tag: 'Clinical', color: 'green' },
      { initiativeId: biomarkers.id, tag: 'IoT', color: 'blue' },
      { initiativeId: biomarkers.id, tag: 'R&D', color: 'purple' },
      { initiativeId: supplyChain.id, tag: 'Supply Chain', color: 'blue' },
      { initiativeId: supplyChain.id, tag: 'AI', color: 'green' },
      { initiativeId: supplyChain.id, tag: 'Operations', color: 'orange' },
      { initiativeId: cdp.id, tag: 'Marketing', color: 'blue' },
      { initiativeId: cdp.id, tag: 'CDP', color: 'purple' },
      { initiativeId: cdp.id, tag: 'Data', color: 'gray' },
    ],

  });

  // ─── INITIATIVE CAPABILITIES ─────────────────────────────────────────────────
  await prisma.initiativeCapability.createMany({
    data: [
      { initiativeId: sfmc.id, name: 'Salesforce Marketing Cloud' },
      { initiativeId: sfmc.id, name: 'Analytics' },
      { initiativeId: sfmc.id, name: 'CRM' },
      { initiativeId: dataEcosystem.id, name: 'AWS Cloud' },
      { initiativeId: dataEcosystem.id, name: 'Databricks' },
      { initiativeId: dataEcosystem.id, name: 'Snowflake' },
      { initiativeId: aiDecision.id, name: 'OpenAI' },
      { initiativeId: aiDecision.id, name: 'Python' },
      { initiativeId: aiDecision.id, name: 'Apache Airflow' },
      { initiativeId: regulatory.id, name: 'Veeva Vault' },
      { initiativeId: regulatory.id, name: 'RPA' },
      { initiativeId: regulatory.id, name: 'DocuSign' },
      { initiativeId: biomarkers.id, name: 'IoT Platform' },
      { initiativeId: biomarkers.id, name: 'AWS IoT' },
      { initiativeId: biomarkers.id, name: 'ML Models' },
      { initiativeId: supplyChain.id, name: 'AWS Cloud' },
      { initiativeId: supplyChain.id, name: 'Databricks' },
      { initiativeId: supplyChain.id, name: 'Snowflake' },
    ],

  });

  // ─── INITIATIVE TEAM MEMBERS ──────────────────────────────────────────────────
  await prisma.initiativeTeamMember.createMany({
    data: [
      { initiativeId: sfmc.id, userId: maria.id, role: 'Product Owner' },
      { initiativeId: sfmc.id, userId: priya.id, role: 'Lead Strategist' },
      { initiativeId: sfmc.id, userId: raj.id, role: 'Solutions Architect' },
      { initiativeId: dataEcosystem.id, userId: raghavendra.id, role: 'Lead Data Engineer' },
      { initiativeId: dataEcosystem.id, userId: elena.id, role: 'Data Scientist' },
      { initiativeId: dataEcosystem.id, userId: rahul.id, role: 'Cloud Architect' },
      { initiativeId: aiDecision.id, userId: ishika.id, role: 'Lead AI Architect' },
      { initiativeId: aiDecision.id, userId: elena.id, role: 'Data Scientist' },
      { initiativeId: aiDecision.id, userId: david.id, role: 'Project Sponsor' },
      { initiativeId: supplyChain.id, userId: raghavendra.id, role: 'Lead Architect' },
      { initiativeId: supplyChain.id, userId: raj.id, role: 'Solutions Architect' },
      { initiativeId: supplyChain.id, userId: lukas.id, role: 'Logistics SME' },
      { initiativeId: regulatory.id, userId: marcus.id, role: 'Regulatory SME' },
      { initiativeId: regulatory.id, userId: sofia.id, role: 'Legal Advisor' },
      { initiativeId: biomarkers.id, userId: sarah.id, role: 'Clinical Data Lead' },
      { initiativeId: biomarkers.id, userId: ishika.id, role: 'AI Consultant' },
      { initiativeId: pulseCrm.id, userId: priya.id, role: 'Product Manager' },
      { initiativeId: pulseCrm.id, userId: raj.id, role: 'Solutions Architect' },
      { initiativeId: cdp.id, userId: maria.id, role: 'Marketing Lead' },
      { initiativeId: cdp.id, userId: priya.id, role: 'Product Owner' },
    ],

  });

  console.log('✅ Initiative tags, capabilities, team members created');

  // ─── INITIATIVE OBJECTIVES ────────────────────────────────────────────────────
  await prisma.initiativeObjective.createMany({
    data: [
      // Supply Chain
      {
        initiativeId: supplyChain.id,
        title: 'Reduce average shipping transit time by 15%',
        isCompleted: true,
        sortOrder: 1,
        completedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: supplyChain.id,
        title: 'Automate 80% of vendor rerouting decisions',
        isCompleted: false,
        sortOrder: 2,
      },
      {
        initiativeId: supplyChain.id,
        title: 'Establish data quality score of 95%+',
        isCompleted: false,
        sortOrder: 3,
      },
      // Data Ecosystem
      {
        initiativeId: dataEcosystem.id,
        title: 'Connect all 24 enterprise data sources',
        isCompleted: true,
        sortOrder: 1,
        completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: dataEcosystem.id,
        title: 'Achieve sub-5 second query latency on key dashboards',
        isCompleted: false,
        sortOrder: 2,
      },
      {
        initiativeId: dataEcosystem.id,
        title: 'Implement data governance framework',
        isCompleted: false,
        sortOrder: 3,
      },
      // AI Decision Making
      {
        initiativeId: aiDecision.id,
        title: 'Deploy AI models for 5 core business processes',
        isCompleted: true,
        sortOrder: 1,
        completedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: aiDecision.id,
        title: 'Achieve 90% model accuracy on decision recommendations',
        isCompleted: false,
        sortOrder: 2,
      },
      {
        initiativeId: aiDecision.id,
        title: 'Onboard 200+ users to AI-powered tools',
        isCompleted: false,
        sortOrder: 3,
      },
    ],
  });

  // ─── INITIATIVE UPDATES ────────────────────────────────────────────────────────
  await prisma.initiativeUpdate.createMany({
    data: [
      {
        initiativeId: dataEcosystem.id,
        title: 'Phase 2 Deployment Successful',
        body: 'We\'ve successfully deployed the second phase of the data ecosystem, connecting 12 new data sources and improving query performance by 40%. The unified data platform is now processing over 2TB of data daily with 99.9% uptime.',
        authorId: raghavendra.id,
        isPinned: true,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: dataEcosystem.id,
        title: 'Vendor API Integration Completed',
        body: 'All third-party vendor APIs have been successfully integrated into the unified data platform. This includes integrations with Salesforce, SAP, and 8 other enterprise systems.',
        authorId: raghavendra.id,
        isPinned: false,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: supplyChain.id,
        title: 'Phase 2 Deployment Successful',
        body: 'Supply chain AI models have been deployed to production. Early results show a 12% reduction in transit times across major shipping lanes.',
        authorId: raghavendra.id,
        isPinned: true,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: aiDecision.id,
        title: 'AI Model Accuracy Milestone Reached',
        body: 'Our recommendation models have reached 87% accuracy across the board, ahead of our Q2 target. We\'re on track to hit 90% by end of Q3.',
        authorId: ishika.id,
        isPinned: true,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        initiativeId: sfmc.id,
        title: 'Campaign Automation Live',
        body: 'The first automated patient outreach campaign is now live on SFMC. Initial engagement rates are 23% above our benchmark.',
        authorId: maria.id,
        isPinned: false,
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Initiative objectives and updates created');

  // ─── RESOURCES ────────────────────────────────────────────────────────────────
  const res1 = await prisma.resource.create({
    data: {
      title: 'Q3 Go-to-Market Strategy',
      description: 'Comprehensive framework covering market entry strategies, competitive positioning, and go-to-market execution playbooks for Q3 2025.',
      type: 'framework',
      department: 'Marketing',
      createdById: maria.id,
      isFeatured: true,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const res2 = await prisma.resource.create({
    data: {
      title: 'Marketing Budget Template',
      description: 'Standardized budget template for marketing campaigns with built-in approval workflows and ROI tracking.',
      type: 'template',
      department: 'Marketing',
      createdById: maria.id,
      isFeatured: false,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  const res3 = await prisma.resource.create({
    data: {
      title: 'Sales Pitch Deck v4',
      description: 'Latest version of the standard sales pitch deck with updated product positioning and customer success stories.',
      type: 'presentation',
      department: 'Sales',
      createdById: priya.id,
      isFeatured: false,
      createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
    },
  });

  const res4 = await prisma.resource.create({
    data: {
      title: 'Product Launch Framework',
      description: 'Step-by-step framework for planning and executing successful product launches across all channels.',
      type: 'framework',
      department: 'Product',
      createdById: priya.id,
      isFeatured: false,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  const res5 = await prisma.resource.create({
    data: {
      title: 'Employee Handbook 2024',
      description: 'Comprehensive guide covering BioMarin policies, benefits, code of conduct, and employee resources.',
      type: 'document',
      department: 'HR',
      createdById: david.id,
      isFeatured: true,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  const res6 = await prisma.resource.create({
    data: {
      title: 'Q4 Consolidated Budget Template',
      description: 'Q4 consolidated budget template with automated rollup formulas for departmental planning.',
      type: 'template',
      department: 'Finance',
      createdById: david.id,
      isFeatured: false,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  const res7 = await prisma.resource.create({
    data: {
      title: 'Global Brand Guidelines V3',
      description: 'Official brand guidelines covering logo usage, typography, color palette, and design principles.',
      type: 'document',
      department: 'Marketing',
      createdById: maria.id,
      isFeatured: false,
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    },
  });

  const res8 = await prisma.resource.create({
    data: {
      title: 'API Security Best Practices',
      description: 'Security guidelines for API development, authentication patterns, and vulnerability prevention.',
      type: 'guide',
      department: 'Engineering',
      createdById: rahul.id,
      isFeatured: false,
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Resources created');

  // ─── RESOURCE TAGS ────────────────────────────────────────────────────────────
  await prisma.resourceTag.createMany({
    data: [
      { resourceId: res1.id, tag: 'Framework' },
      { resourceId: res1.id, tag: 'Q3' },
      { resourceId: res1.id, tag: 'Marketing' },
      { resourceId: res2.id, tag: 'Template' },
      { resourceId: res2.id, tag: 'Budget' },
      { resourceId: res2.id, tag: 'Marketing' },
      { resourceId: res3.id, tag: 'Presentation' },
      { resourceId: res3.id, tag: 'Sales' },
      { resourceId: res4.id, tag: 'Framework' },
      { resourceId: res4.id, tag: 'Product' },
      { resourceId: res5.id, tag: 'HR' },
      { resourceId: res5.id, tag: 'Policy' },
      { resourceId: res5.id, tag: '2024' },
      { resourceId: res6.id, tag: 'Template' },
      { resourceId: res6.id, tag: 'Finance' },
      { resourceId: res6.id, tag: 'Q4' },
      { resourceId: res7.id, tag: 'Marketing' },
      { resourceId: res7.id, tag: 'Brand' },
      { resourceId: res7.id, tag: 'Guidelines' },
      { resourceId: res8.id, tag: 'Engineering' },
      { resourceId: res8.id, tag: 'Security' },
      { resourceId: res8.id, tag: 'API' },
    ],

  });

  // ─── PINNED RESOURCES (for Ishika) ────────────────────────────────────────────
  await prisma.pinnedResource.createMany({
    data: [
      { userId: ishika.id, resourceId: res5.id },
      { userId: ishika.id, resourceId: res6.id },
      { userId: ishika.id, resourceId: res7.id },
      { userId: david.id, resourceId: res1.id },
      { userId: david.id, resourceId: res5.id },
    ],
  });

  console.log('✅ Resource tags and pins created');

  // ─── COURSES ──────────────────────────────────────────────────────────────────
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Generative AI',
      description: 'A comprehensive introduction to generative AI concepts, tools, and practical applications in the enterprise.',
      category: 'AI',
      totalModules: 8,
      estimatedMinutes: 180,
      isPublished: true,
    },
  });

  const modules1 = await prisma.courseModule.createMany({
    data: [
      { courseId: course1.id, title: 'What is Generative AI', sortOrder: 1, durationMinutes: 20 },
      { courseId: course1.id, title: 'Prompt Engineering Basics', sortOrder: 2, durationMinutes: 25 },
      { courseId: course1.id, title: 'Working with LLMs', sortOrder: 3, durationMinutes: 25 },
      { courseId: course1.id, title: 'AI Safety and Alignment', sortOrder: 4, durationMinutes: 20 },
      { courseId: course1.id, title: 'Building AI Apps', sortOrder: 5, durationMinutes: 30 },
      { courseId: course1.id, title: 'AI Ethics in Enterprise', sortOrder: 6, durationMinutes: 20 },
      { courseId: course1.id, title: 'Real-world Use Cases', sortOrder: 7, durationMinutes: 25 },
      { courseId: course1.id, title: 'Capstone Project', sortOrder: 8, durationMinutes: 15 },
    ],
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Agile Methodologies Workshop',
      description: 'Practical guide to Agile, Scrum, and Kanban methodologies for enterprise teams.',
      category: 'Process',
      totalModules: 6,
      estimatedMinutes: 120,
      isPublished: true,
    },
  });

  await prisma.courseModule.createMany({
    data: [
      { courseId: course2.id, title: 'Agile Fundamentals', sortOrder: 1, durationMinutes: 20 },
      { courseId: course2.id, title: 'Scrum Framework', sortOrder: 2, durationMinutes: 25 },
      { courseId: course2.id, title: 'Kanban Methodology', sortOrder: 3, durationMinutes: 20 },
      { courseId: course2.id, title: 'Sprint Planning', sortOrder: 4, durationMinutes: 20 },
      { courseId: course2.id, title: 'Retrospectives', sortOrder: 5, durationMinutes: 15 },
      { courseId: course2.id, title: 'Scaling Agile', sortOrder: 6, durationMinutes: 20 },
    ],
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Cloud Architecture Fundamentals',
      description: 'Deep dive into cloud architecture patterns, AWS services, and enterprise cloud strategy.',
      category: 'Technical',
      totalModules: 10,
      estimatedMinutes: 240,
      isPublished: true,
    },
  });

  await prisma.courseModule.createMany({
    data: [
      { courseId: course3.id, title: 'Cloud Computing Basics', sortOrder: 1, durationMinutes: 20 },
      { courseId: course3.id, title: 'AWS Core Services', sortOrder: 2, durationMinutes: 30 },
      { courseId: course3.id, title: 'Networking in Cloud', sortOrder: 3, durationMinutes: 25 },
      { courseId: course3.id, title: 'Security & IAM', sortOrder: 4, durationMinutes: 25 },
      { courseId: course3.id, title: 'Storage Solutions', sortOrder: 5, durationMinutes: 25 },
      { courseId: course3.id, title: 'Compute Services', sortOrder: 6, durationMinutes: 25 },
      { courseId: course3.id, title: 'Database Services', sortOrder: 7, durationMinutes: 25 },
      { courseId: course3.id, title: 'Serverless Architecture', sortOrder: 8, durationMinutes: 20 },
      { courseId: course3.id, title: 'Cost Optimization', sortOrder: 9, durationMinutes: 20 },
      { courseId: course3.id, title: 'Well-Architected Framework', sortOrder: 10, durationMinutes: 25 },
    ],
  });

  console.log('✅ Courses created');

  // ─── USER COURSE PROGRESS (for Ishika) ────────────────────────────────────────
  const module2 = await prisma.courseModule.findFirst({
    where: { courseId: course1.id, sortOrder: 2 },
  });

  await prisma.userCourseProgress.create({
    data: {
      userId: ishika.id,
      courseId: course1.id,
      currentModuleId: module2?.id,
      progressPercent: 45,
      startedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.userCourseProgress.create({
    data: {
      userId: rahul.id,
      courseId: course3.id,
      progressPercent: 60,
      startedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ User course progress created');

  // ─── WORKSHOP SESSIONS ────────────────────────────────────────────────────────
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(10, 0, 0, 0);

  const workshop1 = await prisma.workshopSession.create({
    data: {
      title: 'Agile Methodologies Workshop',
      description: 'Interactive hands-on workshop on implementing Agile practices in enterprise settings.',
      scheduledAt: tomorrow,
      durationMinutes: 120,
      location: 'Virtual',
      instructorId: animesh.id,
      maxAttendees: 50,
    },
  });

  const workshop2 = await prisma.workshopSession.create({
    data: {
      title: 'AI Innovation Summit',
      description: 'Annual AI innovation summit featuring demos, case studies, and future roadmap discussions.',
      scheduledAt: nextWeek,
      durationMinutes: 240,
      location: 'Conference Room A',
      instructorId: ishika.id,
      maxAttendees: 100,
    },
  });

  // Register Ishika for workshop1
  await prisma.workshopRegistration.createMany({
    data: [
      { userId: ishika.id, sessionId: workshop1.id },
      { userId: david.id, sessionId: workshop1.id },
      { userId: ishika.id, sessionId: workshop2.id },
      { userId: raghavendra.id, sessionId: workshop2.id },
    ],

  });

  console.log('✅ Workshops created');

  // ─── NOTIFICATIONS (for Ishika) ───────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: ishika.id,
        title: 'New Success Story Published',
        description: 'Global Data Pipeline Rollout story is now available.',
        type: 'success_story',
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        userId: ishika.id,
        title: 'Initiative Update',
        description: 'Supply Chain AI initiative reached Phase 2 milestone.',
        type: 'initiative_update',
        referenceType: 'initiative',
        referenceId: supplyChain.id,
        isRead: false,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      },
      {
        userId: ishika.id,
        title: 'Resource Added',
        description: 'New framework template added to Marketing resources.',
        type: 'resource_update',
        referenceType: 'resource',
        referenceId: res1.id,
        isRead: true,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: ishika.id,
        title: 'Workshop Reminder',
        description: 'Agile Methodologies Workshop is scheduled for tomorrow at 2:00 PM.',
        type: 'system',
        isRead: false,
        createdAt: new Date(now.getTime() - 30 * 60 * 1000),
      },
      {
        userId: david.id,
        title: 'New Resource Published',
        description: 'API Security Best Practices guide is now available in Engineering resources.',
        type: 'resource_update',
        isRead: false,
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
      {
        userId: david.id,
        title: 'Initiative Milestone',
        description: 'AI-Driven Decision Making initiative reached 90% of Phase 1 objectives.',
        type: 'initiative_update',
        isRead: false,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Notifications created');

  // ─── USER PROJECTS ────────────────────────────────────────────────────────────
  await prisma.userProject.createMany({
    data: [
      {
        userId: ishika.id,
        initiativeId: aiDecision.id,
        role: 'Lead AI Architect',
        description: 'Leading the AI model development and deployment strategy.',
        isActive: true,
      },
      {
        userId: ishika.id,
        initiativeId: biomarkers.id,
        role: 'AI Consultant',
        description: 'Providing AI expertise for digital biomarker analysis.',
        isActive: true,
      },
      {
        userId: raghavendra.id,
        initiativeId: dataEcosystem.id,
        role: 'Lead Data Engineer',
        description: 'Architecting the unified data platform.',
        isActive: true,
      },
      {
        userId: raghavendra.id,
        initiativeId: supplyChain.id,
        role: 'Lead Architect',
        description: 'Designing the supply chain optimization data flows.',
        isActive: true,
      },
    ],

  });

  // ─── USER CONTRIBUTIONS ───────────────────────────────────────────────────────
  await prisma.userContribution.createMany({
    data: [
      {
        userId: ishika.id,
        type: 'resource_publish',
        title: 'Q3 AI Strategy Framework.pdf',
        description: 'Published in Strategy Resources',
        referenceType: 'resource',
        referenceId: res1.id,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: ishika.id,
        type: 'initiative_create',
        title: 'Unlock AI-Driven Decision Making',
        description: 'Created new initiative board',
        referenceType: 'initiative',
        referenceId: aiDecision.id,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: ishika.id,
        type: 'comment',
        title: 'Best Practices for API Security',
        description: 'Commented on discussion thread',
        referenceType: 'resource',
        referenceId: res8.id,
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        userId: raghavendra.id,
        type: 'initiative_create',
        title: 'Engineer a Connected Data Ecosystem',
        description: 'Created new initiative board',
        referenceType: 'initiative',
        referenceId: dataEcosystem.id,
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ User projects and contributions created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('  Admin:  david.chen@biomarin.com / admin123');
  console.log('  Admin:  jhon.daniel@biomarin.com / admin123');
  console.log('  Author: ishika.gupta@biomarin.com / author123');
  console.log('  Author: priya.sharma@biomarin.com / author123');
  console.log('  Viewer: rahul.sharma@biomarin.com / viewer123');
  console.log('  Viewer: elena.chen@biomarin.com / viewer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
