import AccommodationCard from './AccommodationCard'

export default function SearchResults({ results, isLoading, searchParams, onOpenPriceFilter }) {
  const destination = searchParams?.destination || ''
  const count = results.length

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-center text-gray-500">
        검색 중...
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {destination ? `${destination}의 숙소` : '검색 결과'}{' '}
          <span className="font-normal text-gray-700">{count}개 이상</span>
        </h2>
        <button
          onClick={onOpenPriceFilter}
          className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-700 transition-colors"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round" />
          </svg>
          필터
        </button>
      </div>

      {count === 0 ? (
        <p className="text-gray-500 text-center py-16">
          검색 결과가 없습니다. 여행지 또는 인원을 확인해주세요.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((accommodation) => (
            <AccommodationCard key={accommodation._id} accommodation={accommodation} />
          ))}
        </div>
      )}
    </div>
  )
}
