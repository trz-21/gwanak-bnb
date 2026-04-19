import { useState, useRef, useEffect } from 'react'
import DestinationDropdown from './DestinationDropdown'
import { RECOMMENDED_DESTINATIONS, searchDestinations } from './destinationData'
import { ClearIcon } from '../icons'

export default function DestinationSearch({ value, onChange, isOpen, onOpen, onClose }) {
  // typedQuery: 사용자가 실제로 입력한 텍스트, 드롭다운 필터링에 사용
  // displayQuery: 입력창에 표시되는 텍스트, 키보드 탐색 시 하이라이트된 항목 이름으로 변경
  const [typedQuery, setTypedQuery] = useState(value)
  const [displayQuery, setDisplayQuery] = useState(value)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  // useRef: input DOM 직접 접근 (포커스 제어)
  const inputRef = useRef(null)

  // useEffect: 패널이 열릴 때 input 포커스 (DOM 조작이므로 effect 적절한 사용처)
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const items = typedQuery.trim()
    ? searchDestinations(typedQuery)
    : RECOMMENDED_DESTINATIONS

  function handleInputChange(e) {
    const text = e.target.value
    setTypedQuery(text)
    setDisplayQuery(text)
    setHighlightedIndex(-1) // 타이핑하면 하이라이트 초기화
  }

  function handleKeyDown(e) {
    if (items.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = highlightedIndex === -1 ? 0 : (highlightedIndex + 1) % items.length
      setHighlightedIndex(next)
      setDisplayQuery(items[next].name) // 입력창에 선택된 항목 이름 표시
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = highlightedIndex === -1 ? items.length - 1 : (highlightedIndex - 1 + items.length) % items.length
      setHighlightedIndex(next)
      setDisplayQuery(items[next].name)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0) {
        select(items[highlightedIndex].name)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  function select(name) {
    onChange(name)
    setTypedQuery(name)
    setDisplayQuery(name)
    setHighlightedIndex(-1)
    onClose()
  }

  function handleClear(e) {
    e.preventDefault()    // mousedown 기본 동작(포커스 이동) 방지
    e.stopPropagation()   // 상위 div의 onClick으로 이벤트 전파 방지
    onChange('')
    setTypedQuery('')
    setDisplayQuery('')
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <div
        className={`flex flex-col items-start px-6 py-3 rounded-full transition-colors min-w-[210px] ${
          isOpen ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'
        }`}
        onClick={!isOpen ? () => {
          setTypedQuery(value)
          setDisplayQuery(value)
          setHighlightedIndex(-1)
          onOpen()
        } : undefined}
      >
        <span className="text-xs font-semibold text-gray-800 leading-none select-none">여행지</span>

        <div className="flex items-center w-full mt-0.5">
          {isOpen ? (
            <>
              <input
                ref={inputRef}
                type="text"
                value={displayQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="여행지 검색"
                className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder-gray-400 min-w-0"
                aria-label="여행지 검색"
                aria-autocomplete="list"
                aria-expanded={isOpen}
              />
              {displayQuery && (
                <button
                  onMouseDown={handleClear}
                  className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  aria-label="입력 지우기"
                >
                  <ClearIcon className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </>
          ) : (
            <span className={`text-sm truncate ${value ? 'text-gray-800' : 'text-gray-400'}`}>
              {value || '여행지 검색'}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-3 left-0 z-50">
          <DestinationDropdown
            query={typedQuery}
            highlightedIndex={highlightedIndex}
            onSelect={select}
          />
        </div>
      )}
    </div>
  )
}
