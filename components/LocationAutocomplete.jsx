'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'

function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Search city, pincode, or address...',
  label = 'Location',
  required = false,
}) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.trim().length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=6&addressdetails=1`
      )
      if (!res.ok) throw new Error('Nominatim request failed')
      const data = await res.json()

      const mapped = data.map((item) => ({
        display: item.display_name,
        value: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }))

      setSuggestions(mapped)
      setShowDropdown(mapped.length > 0)
    } catch {
      setSuggestions([])
      setShowDropdown(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    onChange(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400)
  }

  const handleSelect = (item) => {
    setQuery(item.value)
    onChange(item.value)
    setSuggestions([])
    setShowDropdown(false)
  }

  const handleFocus = () => {
    if (query.trim().length >= 2) {
      fetchSuggestions(query)
    }
  }

  const InputClass =
    'w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:border-pawport-orange focus:outline-none transition-colors text-sm font-body'

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-body">
          {label}{required ? ' *' : ''}
        </label>
      )}
      <div className="relative">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5"
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`${InputClass} pl-9`}
          autoComplete="off"
        />
        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="absolute right-3 top-1/2 -translate-y-1/2 text-pawport-orange w-3.5 h-3.5"
          />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-56 overflow-y-auto shadow-xl">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2.5 text-sm hover:bg-pawport-orange/10 cursor-pointer text-black border-b border-gray-100 last:border-b-0 font-body"
              onMouseDown={() => handleSelect(item)}
            >
              <div className="flex items-start gap-2">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-pawport-orange w-3 h-3 mt-0.5 shrink-0"
                />
                <span className="line-clamp-2 leading-snug">{item.display}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-400 mt-1 font-body">
        Type city, pincode, or full address — anywhere in the world. You can also type manually.
      </p>
    </div>
  )
}

export default LocationAutocomplete