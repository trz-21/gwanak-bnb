import { useState, useRef, useEffect } from 'react'
import GuestModal from './GuestModal'

const INITIAL_GUESTS = { adults: 0, children: 0, infants: 0, pets: 0 }

function totalGuests({ adults, children, infants, pets }) {
  return adults + children + infants + pets
}

function guestLabel(guests) {
  const total = totalGuests(guests)
  if (total === 0) return null

  const parts = []
  const people = guests.adults + guests.children + guests.infants
  if (people > 0) parts.push(`게스트 ${people}명`)
  if (guests.pets > 0) parts.push(`반려동물 ${guests.pets}마리`)
  return parts.join(', ')
}

export default function SearchBar() {
  const [guests, setGuests] = useState(INITIAL_GUESTS)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  // 외부 클릭 시 모달 닫기
  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const label = guestLabel(guests)

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      {/* 검색 pill 버튼 */}
      <div
        className={`
          flex items-center bg-white rounded-full border transition-shadow cursor-pointer
          ${open
            ? 'shadow-[0_2px_16px_rgba(0,0,0,0.15)] border-gray-300'
            : 'shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] border-gray-200 hover:shadow-md'}
        `}
      >
        {/* 여행자 텍스트 영역 */}
        <button
          onClick={() => setOpen(prev => !prev)}
          className={`
            flex flex-col items-start text-left px-6 py-3 rounded-full transition-colors w-44
            ${open ? 'bg-white' : 'hover:bg-gray-50'}
          `}
        >
          <span className="text-xs font-semibold text-gray-800 leading-none">여행자</span>
          <span className={`text-sm mt-0.5 truncate w-full ${label ? 'text-gray-800' : 'text-gray-400'}`}>
            {label ?? '게스트 추가'}
          </span>
        </button>

        {/* 구분선 */}
        <div className="w-px h-7 bg-gray-200" />

        {/* 검색 버튼 */}
        <div className="pr-2 pl-2">
          <button
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold text-sm rounded-full px-5 py-3 transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            검색
          </button>
        </div>
      </div>

      {/* 여행자 선택 모달 드롭다운 */}
      {open && (
        <div className="absolute top-full mt-3 left-0 z-50">
          <GuestModal guests={guests} onChange={setGuests} />
        </div>
      )}
    </div>
  )
}
