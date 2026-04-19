import Accommodation from '../models/Accommodation.js'

function buildLocationQuery(destination) {
  if (!destination) return {}
  return {
    $or: [
      { location: { $regex: destination, $options: 'i' } },
      { title: { $regex: destination, $options: 'i' } },
    ],
  }
}

export async function findBySearch({ destination, minGuests, checkIn, checkOut, type, minPrice, maxPrice }) {
  const query = { ...buildLocationQuery(destination) }

  if (minGuests > 0) query.maxGuests = { $gte: Number(minGuests) }
  if (checkIn && checkOut) {
    query.availableFrom = { $lte: new Date(checkIn) }
    query.availableTo = { $gte: new Date(checkOut) }
  }
  if (type && type !== 'all') query.type = type
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.pricePerNight = {}
    if (minPrice !== undefined) query.pricePerNight.$gte = Number(minPrice)
    if (maxPrice !== undefined) query.pricePerNight.$lte = Number(maxPrice)
  }

  return Accommodation.find(query).sort({ rating: -1 })
}

export async function countByPriceRange({ destination, minGuests, minPrice, maxPrice }) {
  const query = { ...buildLocationQuery(destination) }

  if (minGuests > 0) query.maxGuests = { $gte: Number(minGuests) }
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.pricePerNight = {}
    if (minPrice !== undefined) query.pricePerNight.$gte = Number(minPrice)
    if (maxPrice !== undefined) query.pricePerNight.$lte = Number(maxPrice)
  }

  return Accommodation.countDocuments(query)
}

export async function getPriceDistribution({ destination, minGuests }) {
  const matchStage = { ...buildLocationQuery(destination) }

  if (minGuests > 0) {
    matchStage.maxGuests = { $gte: Number(minGuests) }
  }

  const BUCKET_COUNT = 30
  const MIN = 0
  const MAX = 2000000
  const width = (MAX - MIN) / BUCKET_COUNT
  const boundaries = Array.from({ length: BUCKET_COUNT + 1 }, (_, i) => MIN + i * width)

  const buckets = await Accommodation.aggregate([
    { $match: matchStage },
    {
      $bucket: {
        groupBy: '$pricePerNight',
        boundaries,
        default: 'other',
        output: { count: { $sum: 1 } },
      },
    },
  ])

  const result = boundaries.slice(0, -1).map((min, i) => ({
    min,
    max: boundaries[i + 1],
    count: buckets.find((b) => b._id === min)?.count ?? 0,
  }))

  const allPrices = await Accommodation.find(matchStage).select('pricePerNight -_id')
  const prices = allPrices.map((a) => a.pricePerNight)
  const globalMin = prices.length ? Math.min(...prices) : 0
  const globalMax = prices.length ? Math.max(...prices) : MAX

  return { buckets: result, globalMin, globalMax }
}
