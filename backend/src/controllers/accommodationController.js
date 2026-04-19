import {
  searchAccommodations,
  getCountByPriceRange,
  getPriceDistributionData,
} from '../services/accommodationService.js'

export async function search(req, res) {
  try {
    const { destination, guests, checkIn, checkOut, type, minPrice, maxPrice } = req.query
    const accommodations = await searchAccommodations({ destination, guests, checkIn, checkOut, type, minPrice, maxPrice })
    res.json({ accommodations, total: accommodations.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function countByPrice(req, res) {
  try {
    const { destination, guests, minPrice, maxPrice } = req.query
    const count = await getCountByPriceRange({ destination, guests, minPrice, maxPrice })
    res.json({ count })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function priceDistribution(req, res) {
  try {
    const { destination, guests } = req.query
    const data = await getPriceDistributionData({ destination, guests })
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
