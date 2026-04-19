import { useState } from 'react'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults/SearchResults'
import PriceFilter from './components/PriceFilter/PriceFilter'

export default function App() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearched, setIsSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState(null)
  const [showPriceFilter, setShowPriceFilter] = useState(false)

  async function handleSearch(params) {
    setIsLoading(true)
    try {
      const qs = new URLSearchParams()
      if (params.destination) qs.set('destination', params.destination)
      if (params.guests > 0) qs.set('guests', params.guests)
      if (params.checkIn) qs.set('checkIn', params.checkIn)
      if (params.checkOut) qs.set('checkOut', params.checkOut)

      const res = await fetch(`/api/accommodations/search?${qs}`)
      const data = await res.json()
      setSearchResults(data.accommodations)
      setSearchParams(params)
      setIsSearched(true)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleFilterApply(filtered) {
    setSearchResults(filtered)
    setShowPriceFilter(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {isSearched && (
        <SearchResults
          results={searchResults}
          isLoading={isLoading}
          searchParams={searchParams}
          onOpenPriceFilter={() => setShowPriceFilter(true)}
        />
      )}

      {showPriceFilter && (
        <PriceFilter
          searchParams={searchParams}
          onClose={() => setShowPriceFilter(false)}
          onApply={handleFilterApply}
        />
      )}
    </div>
  )
}
