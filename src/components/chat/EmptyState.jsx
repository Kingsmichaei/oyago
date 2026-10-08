import { STARTER_PROMPTS } from '../../constants'
import PrivacyLink from '../layout/PrivacyLink'

export default function EmptyState({ onPick, onSavePlaces }) {
  return (
    <div className="pt-6">
      <p className="font-display text-2xl font-bold leading-tight md:text-4xl">Where you dey go today?</p>
      <p className="mt-2 text-sm text-chalk/70 md:max-w-xl md:text-base">
        Ask in English or Pidgin. I go tell you which bus, where to drop, and how much.{' '}
        <button onClick={onSavePlaces} className="text-danfo underline underline-offset-2">
          Save your home and work
        </button>{' '}
        so you can just say "take me go work".
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPick(prompt)}
            className="rounded-xl border border-road bg-tar px-4 py-3 text-left text-sm hover:border-danfo"
          >
            {prompt}
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-chalk/50 md:hidden">
        <PrivacyLink />
      </p>
    </div>
  )
}
