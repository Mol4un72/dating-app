'use client'

import { useState } from 'react'
import { Modal } from '@/components/modal'
import { Field, Select } from '@/components/field'
import { Tag } from '@/components/tag'
import { PillButton } from '@/components/pill-button'

const interests = ['Coffee', 'Hiking', 'Art', 'Music', 'Cooking', 'Travel', 'Reading', 'Fitness', 'Film']

export function FiltersModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [active, setActive] = useState<string[]>(['Coffee', 'Travel'])

  function toggle(tag: string) {
    setActive((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Filters" description="Refine who you see.">
      <div className="flex flex-col gap-5">
        <Field label="Interested in">
          <Select defaultValue="Everyone">
            <option>Women</option>
            <option>Men</option>
            <option>Everyone</option>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Min age">
            <Select defaultValue="25">
              {Array.from({ length: 40 }, (_, i) => i + 18).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </Select>
          </Field>
          <Field label="Max age">
            <Select defaultValue="35">
              {Array.from({ length: 40 }, (_, i) => i + 18).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Maximum distance">
          <Select defaultValue="20 km">
            <option>5 km</option>
            <option>10 km</option>
            <option>20 km</option>
            <option>50 km</option>
          </Select>
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Shared interests</p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button key={interest} type="button" onClick={() => toggle(interest)}>
                <Tag active={active.includes(interest)}>{interest}</Tag>
              </button>
            ))}
          </div>
        </div>
        <PillButton block size="lg" onClick={() => onOpenChange(false)}>
          Show 240+ people
        </PillButton>
      </div>
    </Modal>
  )
}
