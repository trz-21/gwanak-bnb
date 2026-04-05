import SearchBar from './components/SearchBar'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center">
          <SearchBar />
        </div>
      </header>
    </div>
  )
}
