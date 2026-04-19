import { useState } from 'react'

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
      <path
        d="M16 28c-.3 0-.7-.1-.9-.4C7.5 20.8 4 17.2 4 12.5 4 8.9 6.8 6 10.4 6c2 0 3.9.9 5.6 2.7C17.7 6.9 19.6 6 21.6 6 25.2 6 28 8.9 28 12.5c0 4.7-3.5 8.3-11.1 15.1-.2.3-.6.4-.9.4z"
        fill={filled ? '#FF385C' : 'none'}
        stroke={filled ? '#FF385C' : 'white'}
        strokeWidth="2"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-3 h-3 fill-current" aria-hidden="true">
      <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.483-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.542-1.735l-9.86-1.271-4.124-8.885a1 1 0 0 0-1.816 0z" />
    </svg>
  )
}

export default function AccommodationCard({ accommodation }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [liked, setLiked] = useState(false)

  const images = accommodation.images?.length ? accommodation.images : [
    `https://picsum.photos/seed/${accommodation._id}/800/600`,
  ]
  const total = images.length

  function prev(e) {
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + total) % total)
  }
  function next(e) {
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % total)
  }

  const typeLabel = accommodation.type === 'room' ? '방' : '집 전체'
  const bedroomText = `침실 ${accommodation.bedrooms}개 · 침대 ${accommodation.beds}개`
  const priceFormatted = accommodation.pricePerNight.toLocaleString('ko-KR')

  return (
    <div className="group cursor-pointer">
      {/* 이미지 캐러셀 */}
      <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-200 mb-3">
        <img
          src={images[imgIdx]}
          alt={accommodation.title}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${accommodation.title}/800/600`
          }}
        />

        {/* 배지 */}
        {accommodation.tag && (
          <div className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            {accommodation.tag}
          </div>
        )}

        {/* 찜 버튼 */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="absolute top-3 right-3 p-1"
          aria-label="찜하기"
        >
          <HeartIcon filled={liked} />
        </button>

        {/* 이전/다음 */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity"
              aria-label="이전 사진"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity"
              aria-label="다음 사진"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* 인디케이터 점 */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 숙소 정보 */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{accommodation.title}</p>
          <div className="flex items-center gap-1 flex-shrink-0 text-sm">
            <StarIcon />
            <span>{accommodation.rating?.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{accommodation.description}</p>
        <p className="text-gray-400 text-sm">{bedroomText}</p>
        <p className="text-gray-400 text-sm">{typeLabel}</p>

        <p className="mt-2 text-sm text-gray-900">
          <span className="font-semibold">총액 ₩{priceFormatted}</span>
        </p>
        <p className="text-gray-500 text-xs">오늘 W0 결제 · 취소 수수료 없음</p>
      </div>
    </div>
  )
}
