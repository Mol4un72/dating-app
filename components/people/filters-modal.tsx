'use client'

import { useState } from 'react'
import { Modal } from '@/components/modal'
import { Tag } from '@/components/tag'
import { PillButton } from '@/components/pill-button'

export function FiltersModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {

  const [interestedIn, setInterestedIn] = useState('Everyone')
  const [ageRange, setAgeRange] = useState('25 – 35')
  const [distance, setDistance] = useState('20')

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      description="Refine who you see."
    >

      <div className="flex flex-col gap-6">

        {/* Interested in */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Interested in
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              'Men',
              'Women',
              'Everyone',
            ].map((item) => (
              <Tag
                key={item}
                active={interestedIn === item}
                onClick={() => setInterestedIn(item)}
              >
                {item}
              </Tag>
            ))}
          </div>
        </div>

        {/* Age range */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Age range
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              '18 – 25',
              '25 – 35',
              '35 – 45',
              '45+',
            ].map((item) => (
              <Tag
                key={item}
                active={ageRange === item}
                onClick={() => setAgeRange(item)}
              >
                {item}
              </Tag>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Distance
          </h3>

          <div className="mt-3">

            <input
              type="range"
              min="0"
              max="51"
              value={distance}
              onChange={(e) =>
                setDistance(e.target.value)
              }
              className="w-full"
            />

            <div className="mt-3 text-center text-sm font-medium text-foreground">
              {
                distance === '51'
                  ? 'Any distance'
                  : `${distance} km`
              }
            </div>

          </div>
        </div>

        <PillButton
          block
          size="lg"
          onClick={() => onOpenChange(false)}
        >
          Show people
        </PillButton>

      </div>
    </Modal>
  )
}