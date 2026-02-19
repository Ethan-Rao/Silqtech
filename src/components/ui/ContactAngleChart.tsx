'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface MaterialData {
  name: string
  displayName: string
  untreatedAngle: string
  treatedAngle: string
  untreatedImage: string
  treatedImage: string
}

const materials: MaterialData[] = [
  {
    name: 'silicone',
    displayName: 'Silicone (PDMS)',
    untreatedAngle: '108°',
    treatedAngle: '32°',
    untreatedImage: '/images/science/contact-angles/silicone-control.jpg',
    treatedImage: '/images/science/contact-angles/silicone-treated.jpg',
  },
  {
    name: 'nylon',
    displayName: 'Nylon',
    untreatedAngle: '72°',
    treatedAngle: '25°',
    untreatedImage: '/images/science/contact-angles/nylon-control.jpg',
    treatedImage: '/images/science/contact-angles/nylon-treated.jpg',
  },
  {
    name: 'peek',
    displayName: 'PEEK',
    untreatedAngle: '72°',
    treatedAngle: '35°',
    untreatedImage: '/images/science/contact-angles/peek-untreated.png',
    treatedImage: '/images/science/contact-angles/peek-treated.png',
  },
  {
    name: 'polyethylene',
    displayName: 'Polyethylene',
    untreatedAngle: '95°',
    treatedAngle: '28°',
    untreatedImage: '/images/science/contact-angles/polyethylene-control.jpg',
    treatedImage: '/images/science/contact-angles/polyethylene-treated.jpg',
  },
  {
    name: 'polystyrene',
    displayName: 'Polystyrene',
    untreatedAngle: '87°',
    treatedAngle: '22°',
    untreatedImage: '/images/science/contact-angles/polystyrene-control.jpg',
    treatedImage: '/images/science/contact-angles/polystyrene-treated.jpg',
  },
  {
    name: 'pvc',
    displayName: 'PVC',
    untreatedAngle: '82°',
    treatedAngle: '26°',
    untreatedImage: '/images/science/contact-angles/pvc-control.jpg',
    treatedImage: '/images/science/contact-angles/pvc-treated.jpg',
  },
  {
    name: 'stainless-steel',
    displayName: 'Stainless Steel',
    untreatedAngle: '75°',
    treatedAngle: '33°',
    untreatedImage: '/images/science/contact-angles/stainless-steel-untreated.png',
    treatedImage: '/images/science/contact-angles/stainless-steel-treated.png',
  },
  {
    name: 'titanium',
    displayName: 'Titanium',
    untreatedAngle: '68°',
    treatedAngle: '29°',
    untreatedImage: '/images/science/contact-angles/titanium-untreated.jpg',
    treatedImage: '/images/science/contact-angles/titanium-treated.jpg',
  },
]

interface ContactAngleChartProps {
  className?: string
}

export function ContactAngleChart({ className = '' }: ContactAngleChartProps) {
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    material: string
    type: 'untreated' | 'treated'
    angle: string
  } | null>(null)

  return (
    <div className={className}>
      {/* Table */}
      <div className="bg-gradient-to-br from-silq-cream to-white rounded-2xl p-6 border border-silq-dark/5 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-silq-dark/50 border-b border-silq-dark/10">
              <th className="pb-3 font-medium text-xs uppercase tracking-wider">Material</th>
              <th className="pb-3 font-medium text-center text-xs uppercase tracking-wider" colSpan={2}>
                Contact Angle
              </th>
            </tr>
            <tr className="text-left text-silq-dark/40 border-b border-silq-dark/5">
              <th className="pb-2"></th>
              <th className="pb-2 font-normal text-xs text-center">Untreated</th>
              <th className="pb-2 font-normal text-xs text-center">Treated</th>
            </tr>
          </thead>
          <tbody className="text-silq-dark">
            {materials.map((material, i, arr) => (
              <tr 
                key={material.name} 
                className={`${i < arr.length - 1 ? 'border-b border-silq-dark/5' : ''} hover:bg-silq-blue/[0.02] transition-colors`}
              >
                <td className="py-3 font-medium">{material.displayName}</td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => setSelectedImage({
                      src: material.untreatedImage,
                      material: material.displayName,
                      type: 'untreated',
                      angle: material.untreatedAngle,
                    })}
                    className="text-silq-dark/60 hover:text-silq-blue hover:underline cursor-pointer transition-colors"
                  >
                    {material.untreatedAngle}
                  </button>
                </td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => setSelectedImage({
                      src: material.treatedImage,
                      material: material.displayName,
                      type: 'treated',
                      angle: material.treatedAngle,
                    })}
                    className="inline-flex items-center gap-1.5 text-silq-teal font-semibold hover:underline cursor-pointer transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-silq-teal" />
                    {material.treatedAngle}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-silq-dark/40 mt-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Click any angle to view the contact angle measurement. Lower = more hydrophilic.
        </p>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-silq-cream border-b border-silq-dark/10">
                <h3 className="font-semibold text-silq-dark">
                  {selectedImage.material} — {selectedImage.type === 'untreated' ? 'Untreated' : 'Silq Treated'}
                </h3>
                <p className="text-sm text-silq-dark/60">
                  Contact Angle: <span className={selectedImage.type === 'treated' ? 'text-silq-teal font-semibold' : ''}>{selectedImage.angle}</span>
                </p>
              </div>
              <div className="relative aspect-[4/3]">
                <Image
                  src={selectedImage.src}
                  alt={`${selectedImage.material} ${selectedImage.type} contact angle`}
                  fill
                  className="object-contain bg-white"
                />
              </div>
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 text-sm font-medium text-silq-dark/70 hover:text-silq-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
