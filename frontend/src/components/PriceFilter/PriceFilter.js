import { useState, useEffect, useRef, useCallback } from 'react'
import PriceHistogram from './PriceHistogram'

const GLOBAL_MIN = 0
const GLOBAL_MAX = 2000000

function fmt(n) {
  return n.toLocaleString('ko-KR')
}

export default function PriceFilter({ searchParams, onClose, onApply }) {
  const [roomType, setRoomType] = useState('all') // 'all' | 'room' | 'entire_home'
  const [minPrice, setMinPrice] = useState(GLOBAL_MIN)
  const [maxPrice, setMaxPrice] = useState(GLOBAL_MAX)
  const [buckets, setBuckets] = useState([])
  const [count, setCount] = useState(null)
  const countTimerRef = useRef(null)

  const destination = searchParams?.destination || ''
  const guests = searchParams?.guests || 0

  // 히스토그램 데이터 초기 로드
  useEffect(() => {
    const qs = new URLSearchParams()
    if (destination) qs.set('destination', destination)
    if (guests > 0) qs.set('guests', guests)

    fetch(`/api/accommodations/price-distribution?${qs}`)
      .then(r => r.json())
      .then(data => {
        setBuckets(data.buckets || [])
      })
      .catch(console.error)
  }, [destination, guests])

  // 슬라이더 변경 시 count 조회 (debounce)
  const fetchCount = useCallback(() => {
    const qs = new URLSearchParams()
    if (destination) qs.set('destination', destination)
    if (guests > 0) qs.set('guests', guests)
    qs.set('minPrice', minPrice)
    if (maxPrice < GLOBAL_MAX) qs.set('maxPrice', maxPrice)

    fetch(`/api/accommodations/count?${qs}`)
      .then(r => r.json())
      .then(data => setCount(data.count))
      .catch(console.error)
  }, [destination, guests, minPrice, maxPrice])

  useEffect(() => {
    clearTimeout(countTimerRef.current)
    countTimerRef.current = setTimeout(fetchCount, 300)
    return () => clearTimeout(countTimerRef.current)
  }, [fetchCount])

  async function handleApply() {
    const qs = new URLSearchParams()
    if (destination) qs.set('destination', destination)
    if (guests > 0) qs.set('guests', guests)
    qs.set('minPrice', minPrice)
    if (maxPrice < GLOBAL_MAX) qs.set('maxPrice', maxPrice)
    if (searchParams?.checkIn) qs.set('checkIn', searchParams.checkIn)
    if (searchParams?.checkOut) qs.set('checkOut', searchParams.checkOut)
    if (roomType !== 'all') qs.set('type', roomType)

    const res = await fetch(`/api/accommodations/search?${qs}`)
    const data = await res.json()
    onApply(data.accommodations)
  }

  function handleReset() {
    setRoomType('all')
    setMinPrice(GLOBAL_MIN)
    setMaxPrice(GLOBAL_MAX)
  }

  // 듀얼 슬라이더: left thumb (minPrice), right thumb (maxPrice)
  function handleMinSlider(e) {
    const val = Number(e.target.value)
    if (val < maxPrice) setMinPrice(val)
  }
  function handleMaxSlider(e) {
    const val = Number(e.target.value)
    if (val > minPrice) setMaxPrice(val)
  }

  const minPct = ((minPrice - GLOBAL_MIN) / (GLOBAL_MAX - GLOBAL_MIN)) * 100
  const maxPct = ((maxPrice - GLOBAL_MIN) / (GLOBAL_MAX - GLOBAL_MIN)) * 100

  const buttonLabel = count === null
    ? '숙소 보기'
    : count >= 1000
      ? `숙소 1,000개 이상 표시`
      : `숙소 ${count}개 보기`

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="w-8" />
          <h2 className="text-base font-semibold text-gray-900">필터</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* 숙소 유형 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">숙소 유형</h3>
            <div className="grid grid-cols-3 border border-gray-300 rounded-xl overflow-hidden divide-x divide-gray-300">
              {[
                { key: 'all', label: '모든 유형' },
                { key: 'room', label: '방' },
                { key: 'entire_home', label: '집 전체' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setRoomType(key)}
                  className={`py-3 text-sm font-medium transition-colors ${
                    roomType === key
                      ? 'bg-gray-100 text-gray-900 font-semibold ring-2 ring-gray-900 ring-inset rounded-xl'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* 가격 범위 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900">가격 범위</h3>
            <p className="text-sm text-gray-500 mb-4">여행 요금, 모든 수수료 포함</p>

            <PriceHistogram buckets={buckets} minPrice={minPrice} maxPrice={maxPrice} />

            {/* 듀얼 슬라이더 */}
            <div className="relative mt-2 h-6">
              {/* 트랙 배경 */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-300 rounded" />
              {/* 선택 범위 표시 */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1 bg-gray-900 rounded"
                style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
              />
              {/* Min thumb */}
              <input
                type="range"
                min={GLOBAL_MIN}
                max={GLOBAL_MAX}
                step={10000}
                value={minPrice}
                onChange={handleMinSlider}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer range-thumb"
                style={{ zIndex: minPct > 90 ? 5 : 3 }}
              />
              {/* Max thumb */}
              <input
                type="range"
                min={GLOBAL_MIN}
                max={GLOBAL_MAX}
                step={10000}
                value={maxPrice}
                onChange={handleMaxSlider}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer range-thumb"
                style={{ zIndex: 4 }}
              />
            </div>

            {/* 가격 표시 */}
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">최저</span>
                <div className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-900 mt-1">
                  ₩{fmt(minPrice)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">최고</span>
                <div className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-900 mt-1">
                  ₩{fmt(maxPrice)}{maxPrice >= GLOBAL_MAX ? '+' : ''}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="text-sm font-semibold text-gray-700 underline"
          >
            전체 해제
          </button>
          <button
            onClick={handleApply}
            className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-colors"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.18);
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.18);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
