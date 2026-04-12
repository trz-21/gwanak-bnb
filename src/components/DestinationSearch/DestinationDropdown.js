import { RECOMMENDED_DESTINATIONS, searchDestinations } from './destinationData'
import { PinIcon, BuildingIcon } from '../icons'

// 검색어와 일치하는 부분을 굵게 표시
function HighlightedText({ text, query }) {
  const q = query.trim().toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-gray-900">{text.slice(idx, idx + q.length)}</strong>
      {text.slice(idx + q.length)}
    </>
  )
}

export default function DestinationDropdown({ query, highlightedIndex, onSelect }) {
  const isSearching = query.trim().length > 0
  const items = isSearching ? searchDestinations(query) : RECOMMENDED_DESTINATIONS

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl px-6 py-8 w-[480px] text-center text-gray-400 text-sm">
        검색 결과가 없습니다
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl py-5 w-[480px] max-h-[440px] overflow-y-auto">
      {!isSearching && (
        <p className="px-6 pb-2 text-xs font-bold text-gray-500 tracking-wider">추천 여행지</p>
      )}
      <ul role="listbox">
        {items.map((item, index) => {
          const isHighlighted = index === highlightedIndex
          return (
            <li key={item.id} role="option" aria-selected={isHighlighted}>
              <button
                className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors ${
                  isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                // onMouseDown + preventDefault: 클릭 시 input 포커스를 빼앗기지 않기 위함
                onMouseDown={e => {
                  e.preventDefault()
                  onSelect(item.name)
                }}
              >
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                  {isSearching ? <PinIcon /> : <BuildingIcon />}
                </span>
                <span className="flex flex-col min-w-0 text-sm">
                  <span className="font-medium text-gray-800 truncate">
                    {isSearching
                      ? <HighlightedText text={item.name} query={query} />
                      : item.name
                    }
                  </span>
                  <span className="text-gray-400 truncate mt-0.5">
                    {isSearching ? item.subtext : item.desc}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
