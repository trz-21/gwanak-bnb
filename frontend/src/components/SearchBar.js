import { useState, useRef, useEffect } from 'react'
import GuestModal from './GuestModal'
import DestinationSearch from './DestinationSearch/DestinationSearch'
import DatePicker from './DatePicker/DatePicker'
import { SearchIcon } from './icons'

const INITIAL_GUESTS = { adults: 0, children: 0, infants: 0, pets: 0 }

function guestLabel(guests) {
  const total = guests.adults + guests.children + guests.infants + guests.pets
  if (total === 0) return null
  const parts = []
  const people = guests.adults + guests.children + guests.infants
  if (people > 0) parts.push(`게스트 ${people}명`)
  if (guests.pets > 0) parts.push(`반려동물 ${guests.pets}마리`)
  return parts.join(', ')
}

function formatDateShort(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState('')
  const [guests, setGuests] = useState(INITIAL_GUESTS)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [activePanel, setActivePanel] = useState(null) // 'destination' | 'date' | 'guest' | null

  const containerRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActivePanel(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const label = guestLabel(guests)
  const isAnyOpen = activePanel !== null
  const s = formatDateShort(checkIn)
  const e = formatDateShort(checkOut)
  const dateLabel = s && e ? `${s} ~ ${e}` : s ? `${s} ~` : null

  function handleSearch() {
    const totalGuests = guests.adults + guests.children + guests.infants
    onSearch?.({ destination, guests: totalGuests, checkIn, checkOut })
    setActivePanel(null)
  }

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      <div
        className={`
          flex items-center bg-white rounded-full border transition-shadow
          ${isAnyOpen
            ? 'shadow-[0_2px_16px_rgba(0,0,0,0.15)] border-gray-300'
            : 'shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] border-gray-200 hover:shadow-md'}
        `}
      >
        {/* 여행지 섹션 */}
        <DestinationSearch
          value={destination}
          onChange={setDestination}
          isOpen={activePanel === 'destination'}
          onOpen={() => setActivePanel('destination')}
          onClose={() => setActivePanel(null)}
        />

        <div className="w-px h-7 bg-gray-200 flex-shrink-0" />

        {/* 날짜 섹션 */}
        <button
          onClick={() => setActivePanel(prev => prev === 'date' ? null : 'date')}
          className={`
            flex flex-col items-start text-left px-6 py-3 rounded-full transition-colors w-44 flex-shrink-0
            ${activePanel === 'date' ? 'bg-white' : 'hover:bg-gray-50'}
          `}
        >
          <span className="text-xs font-semibold text-gray-800 leading-none">날짜</span>
          <span className={`text-sm mt-0.5 truncate w-full ${dateLabel ? 'text-gray-800' : 'text-gray-400'}`}>
            {dateLabel ?? '날짜 추가'}
          </span>
        </button>

        <div className="w-px h-7 bg-gray-200 flex-shrink-0" />

        {/* 여행자 섹션 */}
        <button
          onClick={() => setActivePanel(prev => prev === 'guest' ? null : 'guest')}
          className={`
            flex flex-col items-start text-left px-6 py-3 rounded-full transition-colors w-44 flex-shrink-0
            ${activePanel === 'guest' ? 'bg-white' : 'hover:bg-gray-50'}
          `}
        >
          <span className="text-xs font-semibold text-gray-800 leading-none">여행자</span>
          <span className={`text-sm mt-0.5 truncate w-full ${label ? 'text-gray-800' : 'text-gray-400'}`}>
            {label ?? '게스트 추가'}
          </span>
        </button>

        <div className="w-px h-7 bg-gray-200 flex-shrink-0" />

        {/* 검색 버튼 */}
        <div className="pr-2 pl-2 flex-shrink-0">
          <button
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-sm rounded-full px-5 py-3 transition-colors"
            onClick={handleSearch}
          >
            <SearchIcon />
            검색
          </button>
        </div>
      </div>

      {/* 날짜 선택 드롭다운 */}
      {activePanel === 'date' && (
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50">
          <DatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co) }}
          />
        </div>
      )}

      {/* 여행자 선택 모달 드롭다운 */}
      {activePanel === 'guest' && (
        <div className="absolute top-full mt-3 right-0 z-50">
          <GuestModal guests={guests} onChange={setGuests} />
        </div>
      )}
    </div>
  )
}
