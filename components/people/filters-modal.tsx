'use client'

import { useFilters } from '@/context/filters-context'
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
                active={filters.interestedIn === item}
                onClick={() =>
                  setFilters((prev) => ({
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
                active={filters.ageRange === item}
                onClick={() =>
                  setFilters((prev) => ({
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
              value={filters.distance}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  distance: e.target.value,
                }))
              }
              className="w-full"
            />

            <div className="mt-3 text-center text-sm font-medium text-foreground">
              {filters.distance === '51'
                ? 'Any distance'
                : `${filters.distance} km`}
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