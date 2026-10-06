import { cn } from '@/lib/utils'
import { ChatMessage } from '@/types/conversation'

export function Bubble({ message }: { message: ChatMessage }) {
  const { fromMe, text, image, time, reaction } = message
  return (
    <div className={cn('flex flex-col', fromMe ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'relative max-w-[78%] shadow-sm',
          image ? 'rounded-2xl' : 'rounded-2xl px-4 py-2.5',
          fromMe
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-foreground',
        )}
      >
        {image && (
          <img
            src={image || '/placeholder.svg'}
            alt="Shared"
            className="h-44 w-full max-w-56 rounded-2xl object-cover"
          />
        )}
        {text && (
          <p
            className={cn(
              'break-words text-sm leading-relaxed max-w-[45ch]',
              image && 'px-4 py-2.5'
            )}
          >
            {text}
          </p>
        )}
        {reaction && (
          <span className="absolute -bottom-2 right-2 rounded-full border border-border bg-card px-1 text-xs shadow-sm">
            {reaction}
          </span>
        )}
      </div>
      <span className="mt-1 px-1 text-[0.7rem] text-muted-foreground">{time}</span>
    </div>
  )
}