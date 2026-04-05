const MAX = 20

const GUEST_TYPES = [
  {
    key: 'adults',
    label: '성인',
    desc: '13세 이상',
  },
  {
    key: 'children',
    label: '어린이',
    desc: '2~12세',
  },
  {
    key: 'infants',
    label: '유아',
    desc: '2세 미만',
  },
  {
    key: 'pets',
    label: '반려동물',
    desc: '보조동물을 동반하시나요?',
    tooltip: '반려동물 동반이 가능한 숙소만 표시됩니다. 시각장애인 안내견 등 보조동물은 모든 숙소에 동반 가능합니다.',
    isPet: true,
  },
]

function Tooltip({ text }) {
  return (
    <span className="relative group inline-block">
      <span className="text-sm text-gray-400 underline cursor-help">{text}</span>
      <span
        className="
          pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          w-56 rounded-xl bg-gray-800 text-white text-xs leading-relaxed p-3
          opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50
        "
      >
        반려동물 동반이 가능한 숙소만 표시됩니다. 시각장애인 안내견 등 보조동물은 모든 숙소에 동반 가능합니다.
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </span>
    </span>
  )
}

function CounterRow({ label, desc, isPet, count, onDecrement, onIncrement }) {
  const canDecrement = count > 0
  const canIncrement = count < MAX

  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-gray-900">{label}</span>
        {isPet ? (
          <Tooltip text={desc} />
        ) : (
          <span className="text-sm text-gray-400">{desc}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label={`${label} 줄이기`}
          className="
            w-9 h-9 rounded-full border flex items-center justify-center
            text-gray-400 border-gray-300 transition-colors
            hover:border-gray-700 hover:text-gray-700
            disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-400
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <span className="w-5 text-center text-[15px] text-gray-900 select-none">{count}</span>

        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label={`${label} 늘리기`}
          className="
            w-9 h-9 rounded-full border flex items-center justify-center
            text-gray-400 border-gray-300 transition-colors
            hover:border-gray-700 hover:text-gray-700
            disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-400
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function GuestModal({ guests, onChange }) {
  function handleChange(key, delta) {
    const next = Math.min(MAX, Math.max(0, guests[key] + delta))
    onChange({ ...guests, [key]: next })
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl px-6 py-2 w-[420px]">
      {GUEST_TYPES.map(({ key, label, desc, isPet }) => (
        <CounterRow
          key={key}
          label={label}
          desc={desc}
          isPet={isPet}
          count={guests[key]}
          onDecrement={() => handleChange(key, -1)}
          onIncrement={() => handleChange(key, 1)}
        />
      ))}
    </div>
  )
}
