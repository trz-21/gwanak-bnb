export default function PriceHistogram({ buckets, minPrice, maxPrice }) {
  if (!buckets?.length) return <div className="h-24 bg-gray-100 rounded" />

  const maxCount = Math.max(...buckets.map(b => b.count), 1)

  return (
    <div className="flex items-end gap-0.5 h-24">
      {buckets.map((bucket, i) => {
        const height = Math.max((bucket.count / maxCount) * 100, 2)
        const inRange = bucket.min >= minPrice && bucket.max <= maxPrice
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-colors"
            style={{
              height: `${height}%`,
              backgroundColor: inRange ? '#FF385C' : '#d1d5db',
            }}
            title={`₩${bucket.min.toLocaleString()} ~ ₩${bucket.max.toLocaleString()}: ${bucket.count}개`}
          />
        )
      })}
    </div>
  )
}
