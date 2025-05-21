import React, { useEffect, useState, useCallback,useRef } from 'react';
import CourtSearchBar from '../CourtSearchBar/CourtSearchBar';
import CourtSection from '../CourtSection/CourtSection';
import NearMeButton from '../NearMeButton/NearMeButton';
import haversineDistance from '../../utils/distance';
import MapView from '../MapView/MapView';
import './styles.css';

const LandingPage = () => {
  const [courts, setCourts] = useState([]);
  const [selectedCourtIndex, setSelectedCourtIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourt, setExpandedCourt] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchValue, setSearchValue] = useState('');

  const itemsPerPage = 10;
  const mapRef = useRef();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/Normalized.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load courts data');
        return response.json();
      })
      .then((data) => {
        setCourts(data);
      })
      .catch((error) => console.error('Error fetching courts:', error));
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleCourts = courts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(courts.length / itemsPerPage);

  const handleCourtClick = (index) => {
    const globalIndex = startIndex + index;
    const court = courts[globalIndex];
    const lat = parseFloat(court.Address.Latitude);
    const lng = parseFloat(court.Address.Longitude);
  
    if (expandedCourt === globalIndex) {
      setExpandedCourt(null);
      setExpandedSections({});
      setSelectedCourtIndex(null); 
      return;
    }
  
    setExpandedCourt(globalIndex);
    setExpandedSections({});
    setSelectedCourtIndex(globalIndex);
  
    if (!isNaN(lat) && !isNaN(lng)) {
      setTimeout(() => {
        if (mapRef.current && typeof mapRef.current.flyToCourt === 'function') {
          mapRef.current.flyToCourt(lat, lng);
        } else {
          console.warn("MapView ref or flyToCourt not defined");
        }
      }, 300);
    } else {
      console.warn("Invalid coordinates for court:", court);
    }
      // Scroll the court card into view after page update
    setTimeout(() => {
      const element = document.getElementById(`court-${globalIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 2000);
      }
    }, 400);
  };
  
  const handleNearbyFetch = (userLocation) => {
    const nearbyCourts = courts
      .map((court, index) => {
        const lat = parseFloat(court.Address.Latitude);
        const lng = parseFloat(court.Address.Longitude);
        if (isNaN(lat) || isNaN(lng)) return null;
        const distance = haversineDistance(userLocation, { lat, lng });
        return { court, distance, index };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, itemsPerPage); // closest N courts
  
    const filteredCourts = nearbyCourts.map((c) => c.court);
    const firstIndex = nearbyCourts[0]?.index ?? null;
  
    setCourts(filteredCourts);
    setCurrentPage(1);
    setExpandedCourt(null);
    setSelectedCourtIndex(firstIndex);
  
    if (firstIndex !== null) {
      const { lat, lng } = {
        lat: parseFloat(filteredCourts[0].Address.Latitude),
        lng: parseFloat(filteredCourts[0].Address.Longitude),
      };
      mapRef.current?.flyToCourt?.(lat, lng);
    }
  };
  

  const toggleSection = (courtIndex, section) => {
    const key = `${courtIndex}-${section}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  

  const onMarkerClick = useCallback((index) => {
    const pageIndex = Math.floor(index / itemsPerPage) + 1;
    setCurrentPage(pageIndex);
  
    setTimeout(() => {
      const element = document.getElementById(`court-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 2000);
      }
      setExpandedCourt(index);
      }, 100);
  }, [itemsPerPage]);


  return (
    <div className="app-wrapper">
      {/* Header */}
      <div className="header-bar">
        <div className="header-content">
          <h1
            className="main-heading"
            onClick={() => window.location.reload()}
            style={{ cursor: 'pointer', margin: 0 }}
          >
            Kourtwiz Court Finder
          </h1>
          <div className="search-container">
            <CourtSearchBar
              courts={courts}
              value={searchValue}
              onChange={setSearchValue}
              onSelect={(court) => {
                const index = courts.findIndex(c => c.ClubDetails.Name === court.ClubDetails.Name);
                if (index !== -1) {
                  const pageIndex = Math.floor(index / itemsPerPage) + 1;
                  setCurrentPage(pageIndex);
                  setTimeout(() => {
                    onMarkerClick(index);
                  }, 100);
                }
              }}
            />
          </div>
          <NearMeButton onNearbyFetch={handleNearbyFetch} />
        </div>
      </div>
  
      {/* Content */}
      <div className="flex-container">
        {/* Left Panel - Court List */}
        <div className="left-panel">
          {visibleCourts.length > 0 ? (
            <>
              <div className="grid-container">
                {visibleCourts.map((court, index) => {
                  const globalIndex = startIndex + index;
                  const isExpanded = expandedCourt === globalIndex;
  
                  return (
                    <div key={globalIndex} className="card" id={`court-${globalIndex}`}>
                      <h2 onClick={() => handleCourtClick(index)} className="card-title">
                        {court.ClubDetails.Name}
                      </h2>
                      <a
                        className="card-sub location-link"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${court.ClubDetails.Name} ${court.Address.Location}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📍 {court.Address.Location}
                      </a>
  
                      {isExpanded && (
                        <>
                          <CourtSection
                            title="ClubDetails"
                            data={court.ClubDetails}
                            index={globalIndex}
                            isExpanded={expandedSections[`${globalIndex}-ClubDetails`]}
                            toggleSection={toggleSection}
                          />
                          <CourtSection
                            title="Address"
                            data={court.Address}
                            index={globalIndex}
                            isExpanded={expandedSections[`${globalIndex}-Address`]}
                            toggleSection={toggleSection}
                          />
                          <CourtSection
                            title="Description"
                            data={court.Description}
                            index={globalIndex}
                            isExpanded={expandedSections[`${globalIndex}-Description`]}
                            toggleSection={toggleSection}
                          />
                          <CourtSection
                            title="Currency"
                            data={court.Currency}
                            index={globalIndex}
                            isExpanded={expandedSections[`${globalIndex}-Currency`]}
                            toggleSection={toggleSection}
                          />
                          <CourtSection
                            title="ClubDirector"
                            data={court.ClubDirector}
                            index={globalIndex}
                            isExpanded={expandedSections[`${globalIndex}-ClubDirector`]}
                            toggleSection={toggleSection}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
  
              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <div className="page-info">
                  Page&nbsp;
                  <input
                    type="number"
                    value={currentPage || ''}
                    min={1}
                    max={totalPages}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) setCurrentPage(page);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') setCurrentPage(1);
                    }}
                    className="page-input"
                  />
                  &nbsp;of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="loading-ring">
              <div className="loader"></div>
            </div>
          )}
        </div>
  
        {/* Right Panel - Map */}
        <div className="right-panel">
          <MapView
            courts={courts}
            onMarkerClick={onMarkerClick}
            ref={mapRef}
            selectedCourtIndex={selectedCourtIndex}
          />
        </div>
      </div>
    </div>
  );  
};

export default LandingPage;