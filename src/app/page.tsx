'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hero } from '@/components/sections/Hero'
import { Button } from '@/components/ui/Button'
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Infection Resistance',
    description: 'Biofilm reduction without antibiotics or antimicrobials.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
    title: 'Reduced Encrustation',
    description: 'Fewer blockages, fewer replacements, reduced trauma.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Cost Efficiency',
    description: 'Decrease complication-related expenses.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Enhanced Comfort',
    description: 'Superior lubricity for patient wellbeing.',
  },
]

const newsItems = [
  {
    source: 'PR Newswire',
    title: 'Silq Technologies Awarded Group Purchasing Agreement for ClearTract® Catheters with Premier, Inc.',
    url: 'https://www.prnewswire.com/news-releases/silq-technologies-awarded-group-purchasing-agreement-for-cleartract-catheters-with-premier-inc-301234567.html',
    logo: '/images/news/prnewswire.svg',
  },
  {
    source: 'Business Wire',
    title: 'Silq Technologies and NuSil Announce Collaboration Agreement to Drive Broad-based Adoption',
    url: 'https://www.businesswire.com/',
    logo: '/images/news/businesswire.svg',
  },
  {
    source: 'Business Wire',
    title: 'Silq Technologies Receives Innovative Technology Contract From Vizient for ClearTract® Foley Catheter',
    url: 'https://www.businesswire.com/',
    logo: '/images/news/businesswire.svg',
  },
  {
    source: 'UCLA Newsroom',
    title: 'Scientists Devise Method to Prevent Deadly Hospital Infections without Antibiotics',
    url: 'https://newsroom.ucla.edu/',
    logo: '/images/trust/ucla.jpg',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Section 1: Hero */}
      <Hero
        title="Transforming Surfaces Through"
        highlightedText="Advanced Material Science"
        description="Surface technology for better, safer medical implants. FDA Cleared, Antibiotic-free."
        primaryCta={{ text: 'Our Technology', href: '/technology' }}
        secondaryCta={{ text: 'ClearTract® Foley Catheters', href: '/products/cleartract' }}
        variant="default"
        size="large"
        backgroundMedia={{
          type: 'gif',
          src: '/images/hero/banner.gif'
        }}
      />

      {/* Section 2: Innovation That Matters + How It Works Video */}
      <section className="py-20 bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Text + Cards */}
            <div className="flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-silq-dark mb-4">
                Innovation That Matters
              </h2>
              <p className="text-silq-dark/70 mb-8">
                Zwitterionic molecules create a hydration barrier that repels proteins and bacteria. Designed for:
              </p>
              {/* 2x2 Feature Cards - Fill remaining space */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title} 
                    className="p-5 bg-silq-cream rounded-xl hover:shadow-xl transition-all duration-300 min-h-[140px] flex flex-col group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-silq-blue/10 flex items-center justify-center text-silq-blue mb-3 group-hover:bg-silq-blue group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-silq-dark text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-silq-dark/60">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Right: Video - Match height of left column */}
            <div className="flex flex-col h-full">
              <motion.div 
                className="rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <video 
                  src="/videos/silq-technology-demo.mp4" 
                  poster="/images/textures/tech-overview.gif"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover flex-1"
                />
                <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
                  <p className="text-sm font-medium">Surface Treatment in Action</p>
                </div>
              </motion.div>
              <div className="mt-4 text-center">
                <Link href="/technology" className="text-sm text-silq-blue hover:underline font-medium">
                  Learn how it works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />

      {/* Section 3: ClearTract + Testimonials + Images (Combined Dark Section) */}
      <section className="py-20 bg-gradient-to-b from-silq-dark to-[#1a3a52] text-white">
        <div className="container-silq">
          {/* Title */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              ClearTract® Foley Catheters
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort.
            </p>
          </motion.div>

          {/* Buttons - IMMEDIATELY after title */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/products/cleartract"
              className="px-8 py-3 bg-silq-blue hover:bg-silq-blue/90 text-white rounded-lg font-semibold transition-colors"
            >
              Product Information
            </Link>
            <Link
              href="/technology"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Learn the Science
            </Link>
            <Link
              href="/contact?inquiry=ordering"
              className="px-8 py-3 bg-silq-teal hover:bg-silq-teal/90 text-white rounded-lg font-semibold transition-colors"
            >
              Facility Ordering Information
            </Link>
            <Link
              href="/contact?inquiry=ordering"
              className="px-8 py-3 bg-silq-teal hover:bg-silq-teal/90 text-white rounded-lg font-semibold transition-colors"
            >
              Patient Ordering Information
            </Link>
          </motion.div>

          {/* Images Row - Testimonial + Box on left, Publication on right */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left Column: Testimonial above Box */}
            <div className="flex flex-col gap-6">
              {/* Compact Testimonial Carousel */}
              <div className="flex-shrink-0">
                <TestimonialCarousel
                  testimonials={[
                    // 1. Stephen Newhouse
                    {
                      quote: "The first time this SILQ catheter was used we saw an immediate improvement. This has been a life-changing event for not only Nathan, but also his group home and us.",
                      fullContent: `My son Nathan who has been developmentally disabled since birth needed to have his condom catheter replaced by a suprapubic catheter in 2016 due to recurring urinary tract infections. The surgery was successful and for the first couple of years the tube would stay free of blockage by sediment for about 4 weeks after which it would need to be replaced. Starting about 1 and a half years ago the interval between replacements due to sediment blockage became 3 weeks. And then it was 2 weeks and then about a year ago, one week and then finally it had to be replaced every 4-5 days.

Sometime in the last year the University of Michigan Hospital Urology Clinic received the SILQ sp catheter and part of samples to try. The first time this SILQ catheter was used we saw an immediate improvement in there being no clogging or sediment buildup in the catheter. Right from the first replacement we have been able to 6 weeks between replacements (the recommended interval) and there was still no sediment buildup in the catheter.

Needless to say, this has been a life-changing event for not only Nathan, but also his group home and us, his parents who take him to his appointments!`,
                      author: "Stephen Newhouse",
                      role: "Caregiver to ClearTract Patient",
                      initials: "SN",
                    },
                    // 2. Matthew Bui
                    {
                      quote: "It has been a gamechanger. Not only did the Silq coating promote biofilm resistance, but it also improved patient comfort significantly.",
                      fullContent: `I recently had the opportunity to use Foley catheters with Silq coating, and I must say, it has been a gamechanger. Not only did the Silq coating promote biofilm resistance, but it also improved patient comfort significantly. As a urologist, I utilize a significant number of foley catheters in the course of providing urological care. The fact that patients who have had to rely on Foley catheters for an extended period report back to me the reduction in discomfort and irritation was remarkable. The smooth and soft surface of the Silq coating made a noticeable difference in my overall comfort level.

Moreover, the use of the Silq coating on Foley catheters had an impressive impact on reducing urinary tract infections. Generally, foley catheter-acquired infections are a major problem in the medical profession, costing billions of dollars in hospitalization and treatment. Before using Silq-coated catheters, I experienced unacceptable rate of recurrent UTIs in patients with traditional foley catheters. Since switching to Silq coated catheters, the incidence of UTIs has dramatically decreased. This has not only improved my patients' quality of life but also resulted in a reduction in healthcare costs and need for antibiotic treatments.

I highly recommend Foley catheters with Silq coating to anyone in need of long-term urinary catheterization. The combination of biofilm resistance, enhanced patient comfort, and reduced urinary tract infections makes these catheters an exceptional choice.`,
                      author: "Matthew Bui, M.D., Ph.D.",
                      role: "Director, Tower Urology Institute for Robotic Surgery, Cedars-Sinai",
                      initials: "MB",
                    },
                    // 3. Dulce Garcia
                    {
                      quote: "From the time I started using Silq everything changed. I no longer had to flush with anything whatsoever. I won't use any other catheter.",
                      fullContent: `I would like to start off with sharing with you how life altering the Silq catheter has been to me. I used to have chronic UTIs when using the latex and plastic catheters. I struggled with the catheters for 3+ years in the sense of chronic infection, having to flush saline daily and use a compound antibiotic flush I would use 2/3 a week. That would not always work so I had to take oral antibiotics too. With my health being what it is taking oral antibiotics tends to cause other issues in my body that requires me to take an additional 2 antibiotics with the one for the UTI. I'm a firm believer in quality of life over quantity of life, believe me when I say I did not have quality of life. I even had to be hospitalized because of the severe infections, it finally went down to where I had to have a catheter change every 4/5 days.

When I was approached with the option to try the Silq catheter I was excited to see if it would help. From the time I started using Silq everything changed, I no longer had to flush with anything whatsoever. I went over 6 months before I had a slight infection. I was able to clear out the infection in no time and stayed clear. I have said it more than once, but I won't use any other catheter out there, I will do everything possible to make sure I don't use any other. If Silq made this big of a change in my quality of life I can only imagine how many other lives it can and has impacted.`,
                      author: "Dulce Garcia",
                      role: "Long-term ClearTract Patient",
                      initials: "DG",
                    },
                    // 4. Evgeniy Kreydin
                    {
                      quote: "Silq Technologies is bringing a game changing innovation to the care of patients who require catheters for bladder drainage.",
                      fullContent: `Although urinary catheters are an integral part of any healthcare setting, they can cause significant complications, such as urinary tract infections and stone formation. In addition, urinary catheters can become obstructed or calcified. By providing a coating that resists bacterial and protein adhesion, Silq Technologies is bringing a game changing innovation to the care of patients who require catheters for bladder drainage. My early experience using these catheters indicates that they are less likely to result in infection and become obstructed, and that patients are more satisfied with their use than with the standard non-coated catheters available today.`,
                      author: "Evgeniy Kreydin, M.D.",
                      role: "Assistant Professor of Clinical Urology, Keck Hospital of USC",
                      initials: "EK",
                    },
                    // 5. Ana Garcia
                    {
                      quote: "I was immediately impressed with the difference with this catheter. There was no pain or bladder spasms on a daily basis.",
                      fullContent: `My name is Ana Garcia; I am one of Dr. Kreydin's patients who was able to use the ClearTract catheters as a trial. I have Spinal Muscular Dystrophy; I am in a wheelchair for 12 hrs a day. I have full sensation but using a suprapubic catheter provided me with more independence and the ability to stay hydrated. I however did not know that there would be obstacles when having a catheter. When using the regular red catheters there was lots of pain when changing it, foul odor coming through the rubber, and general discomfort from my bladder. I also developed bladder stones.

One day Dr. Kreydin presented the ClearTract catheter for me to use as a trial. I was immediately impressed with the difference with this catheter. There was no pain or bladder spasms on a daily basis. I noticed there were no particles floating around when irrigation was done. I do not have pain when catheter is changed. I also have not developed any bladder stones since using this catheter. I do not think I would go back to the other catheters ever again.`,
                      author: "Ana Garcia",
                      role: "Long-term ClearTract Patient",
                      initials: "AG",
                    },
                    // 6. Jennifer Linehan
                    {
                      quote: "Since I have been using the Silq ClearTract catheters, not only have we seen a decrease in symptomatic infection, but also decrease in obstruction and leaking.",
                      fullContent: `I have been using the Silq ClearTract catheters in my neurogenic bladder patients who use chronic indwelling suprapubic tubes. These are a population of patients that are at high risk for infections, colonization and the SPT often will get clogged/encrusted. Since I have been using the Silq ClearTract catheters, not only have we seen a decrease in symptomatic infection, but also decrease in obstruction and leaking from the catheter becoming clogged with sediment and debris. Just recently, I had three patients who were in the ER every other week for SPT changes because the tubes were clogged. Now I am seeing them every 4 weeks for change with no recent ER visits.`,
                      author: "Jennifer Linehan, M.D.",
                      role: "Associate Professor of Urology, St. John Cancer Institute",
                      initials: "JL",
                    },
                    // 7. Lora Plaskon
                    {
                      quote: "Silq catheter-coating technology has the potential to revolutionize how we manage the constant threat of microbial colonization.",
                      fullContent: `There have been no significant medical advances since the advent of antibiotics and handwashing that have the potential to reduce biofilm and catheter-associated infections like SILQ's zwitterion technology. Silq catheter-coating technology has the potential to revolutionize how we manage the constant threat of microbial colonization in all temporary and permanent implantable devices in humans.`,
                      author: "Lora A. Plaskon, M.D.",
                      role: "Board Certified in Urology & Female Pelvic Medicine, Evergreen Health",
                      initials: "LP",
                    },
                    // 8. Jesus Trevino
                    {
                      quote: "Ever since my mom started using the new Silq suprapubic tube, her urinary tract infections have subsided, no more blockage of sediment.",
                      fullContent: `My mother was diagnosed with an epidural cyst at the T7 level which left her paralyzed from the waist down after removing the cyst via surgery. After surgery, my mom was wheelchair bound and with incontinence. When she arrived home, she was doing intermittent catheterization every 3 hours. This was too much on my mother physically to keep doing the IC. I believe it was 2010 that my mom went under surgery to utilize the suprapubic catheter. It was somewhat of a relief for my mom to have the suprapubic catheter except for the constant urinary tract infections that my mom had acquired. Her urologist at the time told her it was the downside of having the suprapubic tube. My mom tried cranberry supplements, probiotics, countless gallons of cranberry juice and medications to prevent urinary tract infections with little to no relief.

On one of my mom's monthly appointments to replace the old catheter, her physician Dr. Kreydin told her of a new suprapubic product called Silq and she agreed to try it. Ever since my mom started using the new Silq suprapubic tube (5 months), her urinary tract infections have subsided, no more blockage of sediment and the tube doesn't stick to the stroma during removal for replacement of new tubes every month. My mom is completely relieved and satisfied with the new Silq suprapubic tubes. It has improved my mom's health both physically and mentally.`,
                      author: "Jesus Trevino",
                      role: "Caregiver to ClearTract Patient",
                      initials: "JT",
                    },
                  ]}
                  className="!max-w-none"
                />
              </div>

              {/* Product Box - Takes remaining space */}
              <motion.div 
                className="flex justify-center flex-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/images/products/BoxV2.jpg"
                  alt="ClearTract Foley Catheter"
                  width={450}
                  height={550}
                  className="rounded-2xl shadow-2xl object-contain w-full max-w-md"
                  unoptimized
                />
              </motion.div>
            </div>

            {/* Right: Publication - Full height */}
            <motion.div 
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <a 
                href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow bg-white"
              >
                <Image 
                  src="/images/publications/advanced-materials-cover.jpg"
                  alt="Advanced Materials Journal Cover"
                  width={400}
                  height={520}
                  className="object-contain"
                />
              </a>
              <div className="mt-4 text-center max-w-sm">
                <p className="text-white/80 text-sm">
                  <span className="font-semibold text-white">Published in Advanced Materials (2022)</span>
                  <br />
                  &ldquo;A Readily Scalable, Clinically Demonstrated, Antibiofouling Zwitterionic Surface Treatment&rdquo;
                </p>
                <a 
                  href="https://onlinelibrary.wiley.com/doi/10.1002/adma.202200254"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-silq-teal hover:text-white text-sm font-medium transition-colors"
                >
                  Read the full paper →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Surface Treatment Services Teaser */}
      <section className="py-20 bg-silq-cream relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="container-silq relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
                B2B Partnerships
              </span>
              <h2 className="text-display-sm font-bold text-silq-dark mb-4">
                Surface Treatment Services
              </h2>
              <p className="text-silq-dark/70 mb-6">
                Bring our proven antibiofouling technology to your medical devices. We offer contract surface treatment services with customizable properties for various substrates.
              </p>
              
              {/* Key capabilities grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ), label: 'Custom Formulations' },
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  ), label: 'Multi-Substrate' },
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ), label: 'Scalable Production' },
                  { icon: (
                    <svg className="w-5 h-5 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ), label: 'FDA Cleared Platform' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-silq-dark/80">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/products/surface-treatment">
                  <Button variant="primary" size="lg">Explore Partnership</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">Contact Us</Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
                <Image 
                  src="/images/science/silq-machine.gif"
                  alt="Silq surface treatment process"
                  width={500}
                  height={400}
                  className="w-full object-cover"
                  unoptimized
                />
                <div className="p-4 bg-gradient-to-r from-silq-blue to-silq-teal text-white">
                  <p className="text-sm font-medium">Scalable Treatment Process</p>
                  <p className="text-xs text-white/70">In-house manufacturing capability</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-silq-dark/10 to-transparent" />

      {/* Section 5: News */}
      <section className="py-12 bg-white">
        <div className="container-silq">
          <p className="text-sm font-semibold uppercase tracking-wider text-silq-blue text-center mb-8">
            In The News
          </p>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {newsItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-silq-cream rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-silq-dark/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image 
                    src={item.logo} 
                    alt={item.source} 
                    width={80} 
                    height={24} 
                    className="h-5 w-auto object-contain opacity-60"
                  />
                  <span className="text-xs text-silq-dark/40">{item.source}</span>
                </div>
                <h4 className="text-sm font-semibold text-silq-dark leading-snug line-clamp-3">
                  {item.title}
                </h4>
                <p className="text-xs text-silq-blue mt-3 flex items-center gap-1">
                  Read article 
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Trust Indicators - Text Only */}
      <section className="py-14 bg-white border-t border-silq-dark/5">
        <div className="container-silq">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[
              'FDA 510(k) Cleared',
              'UCLA Research',
              'Premier GPO Contract',
              'Vizient GPO Contract',
            ].map((item, index) => (
              <div 
                key={index} 
                className="text-center px-5 py-2.5 border border-silq-dark/10 rounded-lg bg-silq-cream/30"
              >
                <p className="font-semibold text-silq-dark text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: CTA with Promotional Video */}
      <section className="py-20 bg-gradient-to-br from-silq-dark to-silq-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-silq-teal blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-silq-blue blur-3xl" />
        </div>
        <div className="container-silq relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Learn More?
            </motion.h2>
            
            {/* Promotional video */}
            <motion.div 
              className="mb-8 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative aspect-video">
                <iframe
                  src="https://player.vimeo.com/video/710986413?h=&title=0&byline=0&portrait=0"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Silq Technology Overview"
                />
              </div>
              <div className="p-3 bg-gradient-to-r from-silq-blue to-silq-teal text-white text-center">
                <p className="text-sm font-medium">Silq Technology Overview</p>
              </div>
            </motion.div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button variant="primary" size="lg">Contact Us</Button>
              </Link>
              <Link href="/products/cleartract">
                <Button variant="secondary" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  ClearTract® Catheters
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
