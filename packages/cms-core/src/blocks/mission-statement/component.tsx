'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { MissionStatementBlockProps, MissionPhotoSize } from './types'

const sizeMap: Record<MissionPhotoSize, string> = {
  small: 'h-[90px] md:h-[110px] lg:h-[130px] w-[130px] md:w-[160px] lg:w-[190px]',
  medium: 'h-[130px] md:h-[150px] lg:h-[180px] w-[180px] md:w-[210px] lg:w-[250px]',
  large: 'h-[170px] md:h-[200px] lg:h-[220px] w-[240px] md:w-[280px] lg:w-[310px]',
}

export function MissionStatementBlock({
  missionHeading,
  missionBody,
  visionHeading,
  visionBody,
  photos,
}: MissionStatementBlockProps) {
  return (
    /* ── UPDATED BACKGROUND: Replaced with a solid, uniform light sky blue surface ── */
    <section className="relative w-full overflow-hidden bg-[#EBF5FF] py-16 px-6 md:py-24 md:px-12 lg:px-20">

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* ── Side-by-Side Dual Column Layout (Mission & Vision) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start mb-16 md:mb-24">
          
          {/* Mission Card Column */}
          <motion.div variants={fadeInUp} className="flex flex-col space-y-4 md:space-y-6">
            <div className="inline-flex items-center space-x-2">
              <span className="h-px w-8 bg-sky-500 rounded" />
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Our Mission</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 tracking-tight leading-tight whitespace-pre-line">
              {missionHeading}
            </h2>
            <p className="text-sm md:text-[17px] text-gray-600 font-normal leading-relaxed whitespace-pre-line">
              {missionBody}
            </p>
          </motion.div>

          {/* Vision Card Column */}
          <motion.div variants={fadeInUp} className="flex flex-col space-y-4 md:space-y-6 md:pt-0 pt-4">
            <div className="inline-flex items-center space-x-2">
              <span className="h-px w-8 bg-pink-500 rounded" />
              <p className="text-xs font-bold uppercase tracking-widest text-pink-600">Our Vision</p>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 tracking-tight leading-tight whitespace-pre-line">
              {visionHeading}
            </h2>
            <p className="text-sm md:text-[17px] text-gray-600 font-normal leading-relaxed whitespace-pre-line">
              {visionBody}
            </p>
          </motion.div>

        </div>

        {/* ── Bottom Section: Staggered Floating Gallery ── */}
        {photos && photos.length > 0 && (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="
              relative mt-12 pt-4 w-full
              grid grid-cols-2 gap-x-4 gap-y-12 
              md:flex md:flex-wrap md:items-end md:justify-center lg:justify-between md:gap-5 lg:gap-6
            "
          >
            {photos.map((photo, i) => {
              return (
                <div key={i} className="relative shrink-0">
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.04, y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    className={`
                      relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm bg-slate-50 z-10
                      ${sizeMap[photo.size]}
                      
                      /* Structural Layout Offsets */
                      ${i === 0 ? 'justify-self-start mt-12 md:mt-16' : ''}
                      ${i === 1 ? 'justify-self-end mt-0' : ''}
                      ${i === 2 ? 'justify-self-start mt-8 md:mt-4' : ''}
                      ${i === 3 ? 'justify-self-end mt-0 md:mt-12' : ''}
                      
                      md:justify-self-auto
                    `}
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.alt || 'Gallery Presentation Image'}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="(max-width: 768px) 45vw, 25vw"
                    />
                  </motion.div>
                </div>
              )
            })}
          </motion.div>
        )}

      </motion.div>
    </section>
  )
}