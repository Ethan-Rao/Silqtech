import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CTABanner } from '@/components/sections/CTABanner'
import { Button } from '@/components/ui/Button'
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

export const metadata: Metadata = {
  title: 'ClearTract® Foley Catheters',
  description: 'FDA-cleared urinary catheters with drug-free zwitterionic surface treatment to reduce infection, encrustation, and improve comfort.',
}

const testimonials = [
  // Patient first
  {
    quote: "I was immediately impressed with the difference with this catheter. There was no pain or bladder spasms on a daily basis.",
    fullContent: `My name is Ana Garcia; I am one of Dr. Kreydin's patients who was able to use the ClearTract catheters as a trial. I have Spinal Muscular Dystrophy; I am in a wheelchair for 12 hrs a day. I have full sensation but using a suprapubic catheter provided me with more independence and the ability to stay hydrated. I however did not know that there would be obstacles when having a catheter. When using the regular red catheters there was lots of pain when changing it, foul odor coming through the rubber, and general discomfort from my bladder. I also developed bladder stones.

One day Dr. Kreydin presented the ClearTract catheter for me to use as a trial. I was immediately impressed with the difference with this catheter. There was no pain or bladder spasms on a daily basis. I noticed there were no particles floating around when irrigation was done. I do not have pain when catheter is changed. I also have not developed any bladder stones since using this catheter. I am lucky because this catheter is being available at Rancho Los Amigos now. I do not think I would go back to the other catheters ever again. I believe it's important to make this product available to more patients who would not only benefit from the catheter but have a better quality of life with something so simple as a catheter.`,
    author: "Ana Garcia",
    role: "Long-term ClearTract Patient",
    initials: "AG",
  },
  // Physician second
  {
    quote: "Silq Technologies is bringing a game changing innovation to the care of patients who require catheters for bladder drainage.",
    fullContent: `Although urinary catheters are an integral part of any healthcare setting, they can cause significant complications, such as urinary tract infections and stone formation. In addition, urinary catheters can become obstructed or calcified. By providing a coating that resists bacterial and protein adhesion, Silq Technologies is bringing a game changing innovation to the care of patients who require catheters for bladder drainage. My early experience using these catheters indicates that they are less likely to result in infection and become obstructed, and that patients are more satisfied with their use than with the standard non-coated catheters available today.`,
    author: "Evgeniy Kreydin, M.D.",
    role: "Assistant Professor of Clinical Urology, Keck Hospital of USC",
    initials: "EK",
  },
  // Mixed order after
  {
    quote: "Since I have been using the Silq ClearTract catheters, not only have we seen a decrease in symptomatic infection, but also decrease in obstruction and leaking.",
    fullContent: `I have been using the Silq ClearTract catheters in my neurogenic bladder patients who use chronic indwelling suprapubic tubes. These are a population of patients that are at high risk for infections, colonization and the SPT often will get clogged/encrusted. Since I have been using the Silq ClearTract catheters, not only have we seen a decrease in symptomatic infection, but also decrease in obstruction and leaking from the catheter becoming clogged with sediment and debris. Just recently, I had three patients who were in the ER every other week for SPT changes because the tubes were clogged. Now I am seeing them every 4 weeks for change with no recent ER visits.`,
    author: "Jennifer Linehan, M.D.",
    role: "Associate Professor of Urology, St. John Cancer Institute",
    initials: "JL",
  },
  {
    quote: "Silq catheter-coating technology has the potential to revolutionize how we manage the constant threat of microbial colonization.",
    fullContent: `There have been no significant medical advances since the advent of antibiotics and handwashing that have the potential to reduce biofilm and catheter-associated infections like SILQ's zwitterion technology. Silq catheter-coating technology has the potential to revolutionize how we manage the constant threat of microbial colonization in all temporary and permanent implantable devices in humans.`,
    author: "Lora A. Plaskon, M.D.",
    role: "Board Certified in Urology & Female Pelvic Medicine, Evergreen Health",
    initials: "LP",
  },
  {
    quote: "It has been a gamechanger. Not only did the Silq coating promote biofilm resistance, but it also improved patient comfort significantly.",
    fullContent: `I recently had the opportunity to use Foley catheters with Silq coating, and I must say, it has been a gamechanger. Not only did the Silq coating promote biofilm resistance, but it also improved patient comfort significantly. As a urologist, I utilize a significant number of foley catheters in the course of providing urological care. The fact that patients who have had to rely on Foley catheters for an extended period report back to me the reduction in discomfort and irritation was remarkable. The smooth and soft surface of the Silq coating made a noticeable difference in my overall comfort level.

Moreover, the use of the Silq coating on Foley catheters had an impressive impact on reducing urinary tract infections. Generally, foley catheter-acquired infections are a major problem in the medical profession, costing billions of dollars in hospitalization and treatment. Before using Silq-coated catheters, I experienced unacceptable rate of recurrent UTIs in patients with traditional foley catheters. Since switching to Silq coated catheters, the incidence of UTIs has dramatically decreased. This has not only improved my patients' quality of life but also resulted in a reduction in healthcare costs and need for antibiotic treatments.

I highly recommend Foley catheters with Silq coating to anyone in need of long-term urinary catheterization. The combination of biofilm resistance, enhanced patient comfort, and reduced urinary tract infections makes these catheters an exceptional choice.`,
    author: "Matthew Bui, M.D., Ph.D.",
    role: "Director, Tower Urology Institute for Robotic Surgery, Cedars-Sinai",
    initials: "MB",
  },
  {
    quote: "From the time I started using Silq everything changed. I no longer had to flush with anything whatsoever. I won't use any other catheter.",
    fullContent: `I would like to start off with sharing with you how life altering the Silq catheter has been to me. I used to have chronic UTIs when using the latex and plastic catheters. I struggled with the catheters for 3+ years in the sense of chronic infection, having to flush saline daily and use a compound antibiotic flush I would use 2/3 a week. That would not always work so I had to take oral antibiotics too. With my health being what it is taking oral antibiotics tends to cause other issues in my body that requires me to take an additional 2 antibiotics with the one for the UTI. I'm a firm believer in quality of life over quantity of life, believe me when I say I did not have quality of life. I even had to be hospitalized because of the severe infections, it finally went down to where I had to have a catheter change every 4/5 days.

When I was approached with the option to try the Silq catheter I was excited to see if it would help. From the time I started using Silq everything changed, I no longer had to flush with anything whatsoever. I went over 6 months before I had a slight infection. I was able to clear out the infection in no time and stayed clear. I have said it more than once, but I won't use any other catheter out there, I will do everything possible to make sure I don't use any other. If Silq made this big of a change in my quality of life I can only imagine how many other lives it can and has impacted.`,
    author: "Dulce Garcia",
    role: "Long-term ClearTract Patient",
    initials: "DG",
  },
  {
    quote: "Ever since my mom started using the new Silq suprapubic tube, her urinary tract infections have subsided, no more blockage of sediment.",
    fullContent: `My mother was diagnosed with an epidural cyst at the T7 level which left her paralyzed from the waist down after removing the cyst via surgery. After surgery, my mom was wheelchair bound and with incontinence. When she arrived home, she was doing intermittent catheterization every 3 hours. This was too much on my mother physically to keep doing the IC. I believe it was 2010 that my mom went under surgery to utilize the suprapubic catheter. It was somewhat of a relief for my mom to have the suprapubic catheter except for the constant urinary tract infections that my mom had acquired. Her urologist at the time told her it was the downside of having the suprapubic tube. My mom tried cranberry supplements, probiotics, countless gallons of cranberry juice and medications to prevent urinary tract infections with little to no relief. Even with flushing and irrigating the tube twice a day she would get blockage and infections.

On one of my mom's monthly appointments to replace the old catheter, her physician Dr. Kreydin told her of a new suprapubic product called Silq and she agreed to try it. Ever since my mom started using the new Silq suprapubic tube (5 months), her urinary tract infections have subsided, no more blockage of sediment and the tube doesn't stick to the stroma during removal for replacement of new tubes every month. My mom is completely relieved and satisfied with the new Silq suprapubic tubes. She hopes this testimony helps other patients with similar situations that may benefit from the new Silq suprapubic tubes. It has improved my mom's health both physically and mentally.`,
    author: "Maria Luisa Trevino",
    role: "Caregiver to ClearTract Patient",
    initials: "MT",
  },
  {
    quote: "The first time this SILQ catheter was used we saw an immediate improvement. This has been a life-changing event for not only Nathan, but also his group home and us.",
    fullContent: `My son Nathan who has been developmentally disabled since birth needed to have his condom catheter replaced by a suprapubic catheter in 2016 due to recurring urinary tract infections. The surgery was successful and for the first couple of years the tube would stay free of blockage by sediment for about 4 weeks after which it would need to be replaced. Starting about 1 and a half years ago the interval between replacements due to sediment blockage became 3 weeks. Then we started flushing once a day with gentamicin instead of Cipro once after every sp tube change, but it didn't seem to cut down on the clogging. And then it was 2 weeks and then about a year ago, one week and then finally it had to be replaced every 4-5 days. Not only did this require more frequent Urology Clinic visits but also trips to the Emergency Room and then finally me being trained to do the replacement procedure at his group home when we couldn't get into the clinic in time.

Sometime in the last year the University of Michigan Hospital Urology Clinic received the SILQ sp catheter and part of samples to try. The first time this SILQ catheter was used we saw an immediate improvement in there being no clogging or sediment buildup in the catheter. Right from the first replacement we have been able to 6 weeks between replacements (the recommended interval) and there was still no sediment buildup in the catheter.

Needless to say, this has been a life-changing event for not only Nathan, but also his group home and us, his parents who take him to his appointments! This has been like a miracle for us and are unbelievably grateful for Brian McVerry and the SILQ Corporation for this incredible breakthrough and hope that this technology will soon be available widespread to any and all who need it.`,
    author: "Stephen Newhouse",
    role: "Caregiver to ClearTract Patient",
    initials: "SN",
  },
]

export default function ClearTractPage() {

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
        <div className="container-silq">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-silq-blue bg-silq-blue/10 rounded-full">
                FDA 510(k) Cleared
              </span>
              <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
                ClearTract® Foley Catheters
              </h1>
              <p className="mt-4 text-lg text-silq-dark/70">
                Drug-free surface treatment designed to reduce infection, encrustation, and improve patient comfort.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg">Request Samples</Button>
                </Link>
                <Link href="/technology">
                  <Button variant="secondary" size="lg">Learn the Science</Button>
                </Link>
                <Link href="/contact?inquiry=ordering">
                  <Button variant="teal" size="lg">
                    Facility Ordering Information
                  </Button>
                </Link>
                <Link href="/contact?inquiry=ordering">
                  <Button variant="teal" size="lg">
                    Patient Ordering Information
                  </Button>
                </Link>
              </div>
            </div>
            
            <Image
              src="/images/products/boxnew.jpeg"
              alt="ClearTract"
              width={600}
              height={600}
              className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Product Specs + Compact Testimonials (Combined Dark Section) */}
      <section className="py-10 bg-gradient-to-br from-silq-blue-900 via-silq-dark to-silq-blue-800 text-white">
        <div className="container-silq">
          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-base font-semibold text-silq-teal">Medical Grade Silicone</p>
              <p className="text-sm text-white/60">Latex, BPA, DEHP-free</p>
            </div>
            <div>
              <p className="text-base font-semibold text-silq-teal">FDA Cleared</p>
              <p className="text-sm text-white/60">510(k) regulatory approval</p>
            </div>
            <div>
              <p className="text-base font-semibold text-silq-teal">Drug-Free</p>
              <p className="text-sm text-white/60">No antibiotics or antimicrobials</p>
            </div>
            <div>
              <p className="text-base font-semibold text-silq-teal">Low Endotoxin</p>
              <p className="text-sm text-white/60">Safe for suprapubic insertions</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-20 h-px bg-white/15 mx-auto my-8" />
          
          {/* Testimonials Carousel */}
          <h2 className="text-xl font-bold text-center mb-5">What People Are Saying</h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-silq-cream">
        <div className="container-silq">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
              Clinical Benefits
            </h2>
          </div>

          {/* Row 1: Bacteria Panel - Full Width */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl mx-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-silq-blue mb-2">Resisting Bacterial Adhesion</h3>
                <p className="text-silq-dark/70 text-sm">
                  Permanent zwitterionic bond repels bacteria without antibiotics.
                </p>
              </div>
              <Image 
                src="/images/science/Bacteria%20Panel.png"
                alt="Bacterial adhesion comparison"
                width={1200}
                height={400}
                className="w-full object-contain"
              />
            </div>
          </div>
          
          {/* Row 2: Encrustation + Drug-Free + Comfort + FDA cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Reduced Encrustation - Text-only card */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-teal/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">Reduced Encrustation</h4>
              <p className="text-sm text-silq-dark/60">Zwitterionic surfaces reduce mineral buildup for longer catheter life and fewer replacements.</p>
            </div>

            {/* Drug-Free */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">Drug-Free</h4>
              <p className="text-sm text-silq-dark/60">No antibiotics or antimicrobial agents that contribute to resistance</p>
            </div>
            
            {/* Designed for Comfort */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">Designed for Comfort</h4>
              <p className="text-sm text-silq-dark/60">Enhanced lubricity alleviating patient discomfort during insertion and removal</p>
            </div>
            
            {/* FDA Cleared */}
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-silq-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-silq-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="font-semibold text-silq-blue mb-2">FDA Cleared</h4>
              <p className="text-sm text-silq-dark/60">510(k) cleared for urethral, suprapubic, and nephrostomy use</p>
            </div>
          </div>

          {/* Data on file footnote */}
          <p className="text-center text-xs text-silq-dark/40 mt-10">
            *Data on file available by request
          </p>
        </div>
      </section>

      {/* Ordering CTA Section */}
      <section className="py-12 bg-white">
        <div className="container-silq">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-silq-dark mb-4">Ready to Order?</h2>
            <p className="text-silq-dark/70 mb-6">
              Contact our team to discuss ordering options and availability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">Request Samples</Button>
              </Link>
              <Link href="/contact?inquiry=ordering">
                <Button variant="teal" size="lg">Facility Ordering Information</Button>
              </Link>
              <Link href="/contact?inquiry=ordering">
                <Button variant="teal" size="lg">Patient Ordering Information</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Learn About Our Technology"
        cta={{ text: 'View Technology', href: '/technology' }}
        secondaryCta={{ text: 'Contact Us', href: '/contact' }}
        variant="gradient"
      />
    </>
  )
}
