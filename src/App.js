import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar/SearchBar";
import AutocompleteSuggestions from "./components/AutocompleteSuggestions/AutocompleteSuggestions";
import NearMeButton from "./components/NearMeButton/NearMeButton";
import MapComponent from "./components/MapComponent/MapComponent";
import FilterDropdown from "./components/FilterDropdown/FilterDropdown";
import CourtMetadataBox from "./components/CourtMetadataBox/CourtMetadataBox";
import FilteredList from "./components/FilteredList/FilteredList";
import useDebounce from "./hooks/useDebounce";

function App() {
  // ───── States ─────
  const [courts, setCourts] = useState([]);
  const [nearMeCourts, setNearMeCourts] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const [filters, setFilters] = useState({
    courtType: "All",
    access: "All",
    purpose: "All",
    lighting: "All",
  });

  
  // For autocomplete → search court
  const [selectedSearchCourt, setSelectedSearchCourt] = useState(null);
  const [searchRange, setSearchRange] = useState("");
  const [showSearchRange, setShowSearchRange] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);



  // ───── Fetch courts on mount ─────
  useEffect(() => {
    fetch("https://1abd-110-235-236-14.ngrok-free.app/api/courts")
      .then((res) => res.json())
      .then((data) => setCourts(data))
      .catch((err) => console.error("API Fetch error:", err));
  }, []);
  
  
  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0 && !selectedSearchCourt) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery, selectedSearchCourt]);
  

  // ───── Haversine helper ─────
  const haversineDistance = useCallback((c1, c2) => {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(c2.lat - c1.lat),
          dLng = toRad(c2.lng - c1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(c1.lat)) *
      Math.cos(toRad(c2.lat)) *
      Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);

  // ───── Dropdown filter logic ─────
  const applyDropdownFilters = useCallback(list => {
    return list.filter(court => {
      const matchCourtType =
        filters.courtType === "All" ||
        (filters.courtType === "Indoor" && court["Court Type"].toLowerCase().includes("indoor")) ||
        (filters.courtType === "Outdoor" && court["Court Type"].toLowerCase().includes("outdoor")) ||
        (filters.courtType === "Both" && court["Court Type"].toLowerCase().includes("both"));

      const matchAccess =
        filters.access === "All" ||
        (filters.access === "Free" && court.Access.includes("Free")) ||
        (filters.access === "Membership" && court.Access.includes("Membership"));

      const matchPurpose =
        filters.purpose === "All" ||
        (filters.purpose === "Dedicated Pickleball Court" && court["Court Purpose"].includes("Dedicated Pickleball")) ||
        (filters.purpose === "Tennis Court" && court["Court Purpose"].includes("Tennis")) ||
        (filters.purpose === "Others" && court["Court Purpose"].toLowerCase().includes("other"));
        
      const matchLighting =
        filters.lighting === "All" ||
        (filters.lighting === "Yes" && court.Lighting.includes("Has Lighting")) ||
        (filters.lighting === "No" && court.Lighting.includes("No Lighting"));

      return matchCourtType && matchAccess && matchPurpose && matchLighting;
    });
  }, [filters]);

  // ───── Final list logic ─────
  const filteredCourts = useMemo(() => {
    // 1) Near‑Me active?
    if (nearMeCourts) {
      return applyDropdownFilters(nearMeCourts);
    }

    // 2) Search‑court selected?
    if (selectedSearchCourt) {
      let nearby = courts
        .filter(c => c.SN !== selectedSearchCourt.SN)
        .map(c => ({
          ...c,
          distance: haversineDistance(
            { lat: selectedSearchCourt.Latitude, lng: selectedSearchCourt.Longitude },
            { lat: c.Latitude, lng: c.Longitude }
          )
        }));

      if (searchRange) {
        nearby = nearby.filter(c => c.distance <= searchRange);
      }

      nearby.sort((a, b) => a.distance - b.distance);
      return applyDropdownFilters([selectedSearchCourt, ...nearby]);
    }
    // 3) No filters or search
    return applyDropdownFilters(courts);
  }, [
    courts,
    nearMeCourts,
    selectedSearchCourt,
    searchRange,
    applyDropdownFilters,
    haversineDistance
  ]);

// ───── Handlers ─────
const handleCourtSelect = useCallback(court => {
  setSelectedCourt(court);
  setShowSuggestions(false);
  setSelectedSearchCourt(null);
  setSearchQuery("");
  setShowSearchRange(false);
}, []);

// ----------------------------------------------------------------------------
// Handler to filter courts by distance using the Haversine formula and by
// lighting condition (depending on current time). Triggered by NearMeButton.
// ----------------------------------------------------------------------------
const handleFilterByDistance = useCallback((userLocation, distance, userTime) => {
  // 1) Haversine distance helper
  const haversineDistance = (coord1, coord2) => {
    const R = 6371; // km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 2) Day vs night lighting rule
  const hour = userTime.getHours();
  const isDay = hour >= 8 && hour < 17;

  // 3) Enrich each court with its distance, filter by radius & lighting, then sort
  const nearby = courts
    .map((court) => ({
      ...court,
      distance: haversineDistance(
        userLocation,
        { lat: court.Latitude, lng: court.Longitude }
      ),
    }))
    .filter((court) => {
      const lightingOk = isDay
        ? court.Lighting.includes("No Lighting")
        : court.Lighting.includes("Has Lighting");
      return court.distance <= distance && lightingOk;
    })
    .sort((a, b) => a.distance - b.distance);

  // 4) Update state to this sorted list
  setNearMeCourts(nearby);
}, [courts]);

// Called when user picks from autocomplete
const onSuggestionSelect = court => {
  setSelectedSearchCourt(court);
  setSelectedCourt(court);
  setSearchQuery(court.Name);
  setShowSearchRange(true);
  setSearchRange("");
  setShowSuggestions(false);
};

   // Auto-cancel Near-Me on search focus
   const handleSearchFocus = useCallback(() => {
     if (nearMeCourts) {
       setNearMeCourts(null);
       setShowSearchRange(false);
       setSearchRange("");
     }
   }, [nearMeCourts]);

   const resetApp = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    setSelectedCourt(null);
    setSelectedSearchCourt(null);
    setNearMeCourts(null);
    setShowSearchRange(false);
    setSearchRange("");
  };

// ───── Render ─────
return (
  <div style={{ padding: 20 }}>
    {/* Header */}
    <h1 onClick={resetApp} >Kourtwiz Court Finder</h1>

    {/* Search & Near-Me Row */}
    <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", flexWrap: "wrap" }}>
      <NearMeButton onFilterByDistance={handleFilterByDistance} />

      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowSuggestions={setShowSuggestions}
          onFocus={handleSearchFocus}
        />

        {/* Autocomplete dropdown (styled by .autocomplete-suggestions) */}
        {showSuggestions && (
          <AutocompleteSuggestions
            onCourtSelect={handleCourtSelect}
            courts={courts}
            query={debouncedSearchQuery}
            onSelect={onSuggestionSelect}
          />
        )}

        {/* Search-range dropdown (inherits select styling) */}
        {showSearchRange && (
          <select
            value={searchRange}
            onChange={(e) => setSearchRange(parseInt(e.target.value, 10))}
            style={{ padding: "8px" }}
          >
            <option value="" disabled>
              Filter Court by Distance
            </option>
            {[5,10,15,20,25,30,35,40,45,50].map((km) => (
              <option key={km} value={km}>
                Within {km} km
              </option>
            ))}
          </select>
        )}
      </div>
    </div>

    {/* Main Section: Metadata + Map */}
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>

      {/* Metadata on top */}
      <div style={{ alignSelf: "flex-start", maxWidth: "600px", width: "auto" }}>
        <CourtMetadataBox court={selectedCourt} />
      </div>

      {/* Map below */}
      <div style={{ flex: "0 0 auto" }}>
        <MapComponent
          courts={filteredCourts}
          onCourtSelect={handleCourtSelect}
          selectedCourt={selectedCourt}
        />
      </div>
    </div>


    {/* Bottom Section: Filters + List */}
    <div style={{ display: "flex", marginTop: 20, gap: 10 }}>
      <div style={{ flex: "0 0 35%" }}>
        <FilterDropdown filters={filters} setFilters={setFilters} />
      </div>

      {/* Filtered List (wrapped for .filtered-list styling) */}
      <div style={{ flex: 1 }}>
        <FilteredList
          courts={filteredCourts}
          onCourtSelect={handleCourtSelect}
        />
      </div>
    </div>
  </div>
);
}

export default App;