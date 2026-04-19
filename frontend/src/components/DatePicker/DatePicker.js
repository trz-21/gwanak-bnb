import { useState } from 'react'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function isSameDay(a, b) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isBetween(date, start, end) {
  if (!start || !end) return false
  return date > start && date < end
}

function MonthCalendar({ year, month, checkIn, checkOut, hovered, onHover, onSelect, today }) {
  const ciDate = parseDate(checkIn)
  const coDate = parseDate(checkOut)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = `${year}년 ${month + 1}월`

  function getState(d) {
    if (!d) return null
    const date = new Date(year, month, d)
    const isPast = date < today
    if (isPast) return 'past'
    if (isSameDay(date, ciDate)) return 'start'
    if (isSameDay(date, coDate)) return 'end'
    const rangeEnd = coDate || hovered
    if (ciDate && rangeEnd && isBetween(date, ciDate, rangeEnd)) return 'range'
    return 'normal'
  }

  return (
    <div className="w-72">
      <h3 className="text-center font-semibold text-gray-900 mb-4">{monthLabel}</h3>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const state = getState(d)
          const isStart = state === 'start'
          const isEnd = state === 'end'
          const isRange = state === 'range'
          const isPast = state === 'past'

          return (
            <div
              key={i}
              className={`relative flex items-center justify-center h-9 ${isRange ? 'bg-gray-100' : ''}`}
            >
              {d && (
                <button
                  disabled={isPast}
                  onMouseEnter={() => !isPast && onHover && onHover(new Date(year, month, d))}
                  onClick={() => !isPast && onSelect(toDateStr(year, month, d))}
                  className={`
                    w-9 h-9 rounded-full text-sm font-medium transition-colors z-10 relative
                    ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
                    ${isStart || isEnd ? 'bg-gray-900 text-white hover:bg-gray-900' : ''}
                    ${isRange ? 'bg-gray-100 rounded-none text-gray-900' : ''}
                    ${!isPast && !isStart && !isEnd && !isRange ? 'text-gray-900' : ''}
                  `}
                >
                  {d}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DatePicker({ checkIn, checkOut, onChange }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [baseMonth, setBaseMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [hovered, setHovered] = useState(null)

  const left = baseMonth
  const right = baseMonth.month === 11
    ? { year: baseMonth.year + 1, month: 0 }
    : { year: baseMonth.year, month: baseMonth.month + 1 }

  function prevMonth() {
    setBaseMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    )
  }
  function nextMonth() {
    setBaseMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    )
  }

  function handleSelect(dateStr) {
    if (!checkIn || (checkIn && checkOut)) {
      onChange(dateStr, null)
    } else {
      if (dateStr < checkIn) {
        onChange(dateStr, checkIn)
      } else {
        onChange(checkIn, dateStr)
      }
    }
  }

  return (
    <div
      className="bg-white rounded-3xl shadow-2xl p-6"
      onMouseLeave={() => setHovered(null)}
    >
      {/* 탭 */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button className="px-6 py-2 rounded-full bg-white text-sm font-medium shadow text-gray-900">
            날짜 지정
          </button>
          <button className="px-6 py-2 rounded-full text-sm font-medium text-gray-500">
            유연한 일정
          </button>
        </div>
      </div>

      <div className="flex items-start gap-8">
        {/* 이전 버튼 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-0">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="이전 달"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <MonthCalendar
            year={left.year}
            month={left.month}
            checkIn={checkIn}
            checkOut={checkOut}
            hovered={hovered}
            onHover={setHovered}
            onSelect={handleSelect}
            today={today}
          />
        </div>

        {/* 오른쪽 달 */}
        <div className="flex flex-col">
          <div className="flex items-center justify-end mb-0">
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="다음 달"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <MonthCalendar
            year={right.year}
            month={right.month}
            checkIn={checkIn}
            checkOut={checkOut}
            hovered={hovered}
            onHover={setHovered}
            onSelect={handleSelect}
            today={today}
          />
        </div>
      </div>

      {/* 하단 액션 */}
      {(checkIn || checkOut) && (
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onChange(null, null)}
            className="text-sm font-semibold text-gray-700 underline"
          >
            날짜 지우기
          </button>
        </div>
      )}
    </div>
  )
}
