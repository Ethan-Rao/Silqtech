'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CTABanner } from '@/components/sections/CTABanner'
import { BiographyCard } from '@/components/ui/BiographyCard'

const teamMembers = [
  {
    name: 'D. Verne Sharma',
    credentials: 'MBA',
    title: 'CEO, Board of Directors',
    image: '/images/team/verne-sharma.jpg',
    bio: 'D. Verne Sharma is a former Chairman, Chief Executive Officer and President of both public and private companies. Mr. Sharma was most recently Chairman, CEO and President of Rx Sight Inc. (formerly Calhoun Vision Inc.), serving from 2008 until his retirement in early 2015. Rx Sight developed an intraocular lens that can be adjusted to the precise prescription of each patient by application of light, eliminating the need for glasses. The company received FDA approval in November 2017. Mr. Sharma has had 25 years of senior level medical device experience at public companies including General Electric Medical Systems, US Surgical Corp. and Summit Technology Inc. As President and COO of Summit, he pioneered the development and worldwide commercialization of LASIK, leading to the sale of the company in 2000 for $963 million. He served on the Board of American Medical Systems (acquired for $3 billion in 2011) and was a director of ZetaRx, which was acquired by Juno Therapeutics in 2013 (Juno was later acquired by Celgene for $10.1 billion). Mr. Sharma holds an MBA with distinction from the Wharton School of the University of Pennsylvania and an undergraduate degree in Chemical Engineering from the University of the West Indies.',
    shortBio: 'Former Chairman, CEO and President of Rx Sight Inc. 25 years of senior medical device experience at GE Medical Systems, US Surgical Corp, and Summit Technology. Pioneered LASIK commercialization. MBA from Wharton.',
    email: 'info@silq.tech',
  },
  {
    name: 'Jack Kavanaugh',
    credentials: 'MD, MBA',
    title: 'Chairman of the Board',
    image: '/images/team/jack-kavanaugh.jpg',
    bio: 'Dr. Kavanaugh has served as CEO and Chairman at a number of technology-driven startups, creating industry-leading products and investor profits. As founder, chairman and CEO of ZetaRx, Dr. Kavanaugh successfully combined exclusive technological licensing from top institutions to place ZetaRx at the leading edge of immunotherapy for the treatment of cancer. In late 2013, ZetaRx was sold, becoming the core of Juno Therapeutics, which raised approximately $270 million and announced 88% clinical trial complete remission of terminal cancer patients. Prior to ZetaRx, he served as Chairman of Calhoun, which developed the world\'s only light adjustable intraocular lens for cataract surgery. In 1996, Dr. Kavanaugh founded Amerident, a health care service provider serving as Chairman and CEO. Under his tenure, the company grew to over 600 employees by 1999. Amerident received over 30 community service awards and a state congressional medal of honor. As founder, Chairman and CEO of Team Global, Dr. Kavanaugh was responsible for taking the company public, with share price rising from 11 cents to approximately $27 per share. He also served on the board of PreCash, helping lead a major turnaround that resulted in Inc. Magazine rating it one of the fastest growing companies in the United States.',
    shortBio: 'Founder, Chairman and CEO of ZetaRx, which became the core of Juno Therapeutics. Former Chairman of Calhoun Vision. Founded Amerident and Team Global, with multiple successful exits totaling billions in value.',
  },
  {
    name: 'Richard B. Kaner',
    credentials: 'PhD',
    title: 'Chief Scientific Advisor, Board of Directors',
    image: '/images/team/richard-kaner.jpg',
    bio: 'Professor Richard B. Kaner focuses on the design of novel materials and their synthesis by new chemical methods at UCLA. Dr. Kaner has been continuously honored for his outstanding contributions to the fields of chemistry and biochemistry. He holds over 16 U.S. patents—with 20 more pending—and has published more than 275 papers in major peer-reviewed journals. He was named a fellow of the Royal Society of Chemistry and is the recipient of numerous awards, including Fulbright, Guggenheim, Alfred P. Sloan, and David and Lucile Packard fellowships, as well as premier awards from the American Chemical Society, a National Science Foundation Presidential Young Investigator Award, and UCLA\'s Distinguished Teaching Award. Dr. Kaner holds a joint appointment in the Department of Chemistry & Biochemistry as well as the Department of Materials Science & Engineering at UCLA. A graduate of Brown University, he received his Ph.D. in inorganic chemistry from the University of Pennsylvania in 1984. After postdoctoral research at UC Berkeley, he joined UCLA in 1987 as an Assistant Professor, was promoted to Full Professor in 1993, and Distinguished Professor in 2012. Awards include Most Cited Author (2014), ACS Award in the Chemistry of Materials (2012), and the ACS Tolman Medal (2010).',
    shortBio: 'Distinguished Professor at UCLA with joint appointment in Chemistry & Biochemistry and Materials Science & Engineering. 275+ publications, 16+ patents. Fellow of the Royal Society of Chemistry. Fulbright, Guggenheim, and Packard fellow.',
  },
  {
    name: 'Brian McVerry',
    credentials: 'PhD',
    title: 'Chief Technology Officer',
    image: '/images/team/brian-mcverry.jpg',
    bio: 'Dr. McVerry designed and developed the Silq Technologies Corporation coating during his Ph.D. studies at UCLA under the guidance of Professor Richard Kaner. He was awarded two fellowships from the National Science Foundation: the prestigious Graduate Research Fellowship Program (GRFP) award and the Clean Energy for Green Industry (CGI) award that helped him begin focusing on the technology for commercial application. The chemistry behind the Silq Technologies Corporation coating has led to multiple patents and publications in peer-reviewed journals, as well as earning Dr. McVerry a finalist position in the nationwide Collegiate Inventors Competition. In 2015, the coating was selected as the "Most Innovative Technology" at the Los Angeles Port Tech EXPO.',
    shortBio: 'Inventor of Silq\'s core coating technology, developed during PhD studies at UCLA. NSF Graduate Research Fellow. Multiple patents and publications. Named "Most Innovative Technology" at LA Port Tech EXPO 2015.',
    email: 'brianm@silq.tech',
  },
  {
    name: 'Mahi de Silva',
    title: 'Board of Directors',
    image: '/images/team/mahi-desilva.jpg',
    bio: 'Mahi de Silva is a Silicon Valley veteran with a strong track record for creating, financing, building and scaling businesses that have had $1B+ exits. He serves as Chairman of the Board of Directors at Pre-Cash, and is a strategic advisor to Opera Software, ASA, where he helped engineer a $1.4B acquisition by a consortium of Chinese investors. From 2010 until 2016, he was the Chief Executive Officer of Opera Mediaworks Inc., the largest subsidiary of Opera Software.',
    shortBio: 'Silicon Valley veteran with $1B+ exits. Chairman at Pre-Cash. Strategic advisor to Opera Software, engineering a $1.4B acquisition. Former CEO of Opera Mediaworks Inc.',
  },
  {
    name: 'Robert Snukal',
    title: 'Board of Directors',
    image: '/images/team/robert-snukal.jpg',
    bio: 'Robert Snukal, the chief executive officer of National Quality Care, Inc., brings expertise in developing prototypes and launching products across industries. His work with Dr. Kavanaugh dates back to 2009 when he joined ZetaRx Biosciences, Inc. as a Board member, where he was integrally involved in its sale to create Juno Therapeutics. In 1985, Mr. Snukal founded Fountain View, Inc. (now Skilled Healthcare) where he served as CEO. Under his management, Fountain View grew to operate 50 skilled nursing facilities, three institutional pharmacies and two therapy companies. Mr. Snukal remained a member of the board and major stockholder until 2005, when the company was sold. Mr. Snukal founded ITASCA Pictures in 1993 where he served as chairman.',
    shortBio: 'CEO of National Quality Care, Inc. Board member of ZetaRx, integral to its sale creating Juno Therapeutics. Founded Fountain View, Inc. (now Skilled Healthcare), growing it to 50 skilled nursing facilities.',
  },
]

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-silq-cream via-white to-silq-blue/5 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-silq-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-silq-blue/5 rounded-full blur-3xl" />
        </div>

        {/* Watermark */}
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-[0.03] pointer-events-none">
          <Image
            src="/images/logos/silq-monogram.png"
            alt=""
            width={600}
            height={600}
          />
        </div>

        <div className="container-silq text-center relative">
          <h1 className="text-hero-sm md:text-hero font-bold text-silq-dark">
            Leadership
          </h1>
          <p className="mt-6 text-lg text-silq-dark/70 max-w-2xl mx-auto">
            Silq Technologies brings together world-class experts in material science, medical devices, and business development to transform surface technology.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1E4A6D 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container-silq relative">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-silq-cream/50">
                <div className="text-3xl font-bold text-silq-blue mb-2">UCLA</div>
                <div className="text-sm text-silq-dark/60">Research Origins</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-silq-cream/50">
                <div className="text-3xl font-bold text-silq-blue mb-2">FDA</div>
                <div className="text-sm text-silq-dark/60">510(k) Cleared</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-silq-dark/70 leading-relaxed">
                Silq Technologies is a leader in advanced biomaterials, developing innovative
                surface modification technologies for medical devices, implants, microfluidics,
                lithium-ion batteries, and water treatment applications. Our mission is to
                provide life-changing clinical benefits for patients and address the widespread
                need for antibiofouling solutions across industries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid with Biography Cards */}
      <section className="py-20 bg-silq-cream">
        <div className="container-silq">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-silq-dark">
              Meet Our Team
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BiographyCard {...member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Join Our Mission"
        description="Interested in partnership opportunities or joining our team?"
        cta={{ text: 'Contact Us', href: '/contact' }}
        secondaryCta={{ text: 'Investor Information', href: '/about/investors' }}
        variant="gradient"
      />
    </>
  )
}
