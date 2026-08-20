'use client'

import { useState, useEffect } from 'react'
import { useFilters, defaultFilters } from '@/context/filters-context'
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
  const { filters, setFilters } = useFilters()

  // Local draft state for filters
  const [draft, setDraft] = useState(filters)

  // Sync draft whenever modal opens
  useEffect(() => {
    if (open) {
      setDraft(filters)
    }
  }, [open, filters])

  const handleApply = () => {
    setFilters(draft)
    onOpenChange(false)
  }

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
                active={draft.interestedIn === item}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    interestedIn: item,
                  }))
                }
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
                active={draft.ageRange === item}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    ageRange: item,
                  }))
                }
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
              value={draft.distance}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  distance: e.target.value,
                }))
              }
              className="w-full"
            />

            <div className="mt-3 text-center text-sm font-medium text-foreground">
              {draft.distance === '51'
                ? 'Any distance'
                : `${draft.distance} km`}
            </div>
          </div>
        </div>


        <div className="flex flex-col gap-2 mt-1">
          <PillButton
            block
            size="lg"
            onClick={handleApply}
          >
            Show people
          </PillButton>
        </div>

      </div>
    </Modal>
  )
}