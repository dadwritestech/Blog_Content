import React, { useState, useEffect, useRef } from 'react';


const ContractionTimer = () => {
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [lastStartTime, setLastStartTime] = useState(null);
  const [contractions, setContractions] = useState([]);
  const [pendingEntry, setPendingEntry] = useState(null);
  const [editingTimestamp, setEditingTimestamp] = useState(null);
  const [currentDuration, setCurrentDuration] = useState('00:00');
  const [timeSinceLast, setTimeSinceLast] = useState('--:--');
  const [status, setStatus] = useState('');

  const timerInterval = useRef(null);
  const timeSinceLastInterval = useRef(null);
  const entryIntensity = useRef(null);
  const entryNotes = useRef(null);
  const importDataArea = useRef(null);

  const STORAGE_KEY = 'contractionHistory';

  useEffect(() => {
    const wasHistoryLoaded = loadHistoryFromStorage();
    if (wasHistoryLoaded) {
      displayStatus("Loaded saved history.", 3000);
    }
    return () => {
      clearInterval(timerInterval.current);
      clearInterval(timeSinceLastInterval.current);
    };
  }, []);

  useEffect(() => {
    if (lastStartTime && !isTiming) {
      clearInterval(timeSinceLastInterval.current);
      timeSinceLastInterval.current = setInterval(updateTimeSinceLastDisplay, 1000);
    }
    return () => clearInterval(timeSinceLastInterval.current);
  }, [lastStartTime, isTiming]);

  const displayStatus = (message, durationMs = 0) => {
    setStatus(message);
    if (durationMs > 0) {
      setTimeout(() => {
        setStatus(prevStatus => (prevStatus === message ? '' : prevStatus));
      }, durationMs);
    }
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds === null || typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return "--:--";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number' || isNaN(timestamp)) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const updateDurationDisplay = () => {
    if (!startTime) return;
    const now = Date.now();
    const elapsedSeconds = (now - startTime) / 1000;
    setCurrentDuration(formatTime(elapsedSeconds));
  };

  const updateTimeSinceLastDisplay = () => {
    if (!lastStartTime) {
      setTimeSinceLast('--:--');
      return;
    }
    const now = Date.now();
    const elapsedSeconds = (now - lastStartTime) / 1000;
    setTimeSinceLast(formatTime(elapsedSeconds));
  };

  const handleTimerClick = () => {
    const now = Date.now();
    if (!isTiming) {
      if (editingTimestamp !== null) {
        resetEditState();
      }
      setIsTiming(true);
      setStartTime(now);
      clearInterval(timerInterval.current);
      timerInterval.current = setInterval(updateDurationDisplay, 500);
      updateDurationDisplay();
      clearInterval(timeSinceLastInterval.current);
      setTimeSinceLast('--:--');
      setPendingEntry(null);
    } else {
      setIsTiming(false);
      const endTime = now;
      const duration = (endTime - startTime) / 1000;
      clearInterval(timerInterval.current);
      setCurrentDuration(formatTime(duration));
      let frequency = null;
      if (lastStartTime) {
        frequency = (startTime - lastStartTime) / 1000;
      }
      setPendingEntry({ startTime: startTime, duration: duration, frequency: frequency });
      setEditingTimestamp(null);
    }
  };

  const handleConfirmEntryClick = () => {
    if (editingTimestamp) {
      const indexToUpdate = contractions.findIndex(c => c.startTime === editingTimestamp);
      if (indexToUpdate !== -1) {
        const updatedContractions = [...contractions];
        updatedContractions[indexToUpdate].notes = entryNotes.current.value;
        updatedContractions[indexToUpdate].intensity = entryIntensity.current.value;
        setContractions(updatedContractions);
        resetEditState();
        displayStatus("Entry updated.", 2000);
      }
    } else if (pendingEntry) {
      const newContraction = {
        ...pendingEntry,
        intensity: entryIntensity.current.value,
        notes: entryNotes.current.value,
      };
      setContractions([newContraction, ...contractions]);
      setLastStartTime(pendingEntry.startTime);
      setStartTime(null);
      setPendingEntry(null);
      displayStatus("Entry added.", 2000);
    }
  };

  const resetEditState = () => {
    setEditingTimestamp(null);
    if(entryIntensity.current) entryIntensity.current.value = '';
    if(entryNotes.current) entryNotes.current.value = '';
    setPendingEntry(null);
  };

  const handleSaveHistoryClick = () => {
    if (contractions.length === 0) {
      displayStatus("No history to save.", 3000);
      return;
    }
    if (confirm("Save history to browser storage?")) {
      saveHistoryToStorage();
    }
  };

  const saveHistoryToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contractions));
      displayStatus("History saved.", 3000);
    } catch (e) {
      console.error("Error saving history:", e);
      displayStatus("Error saving: " + e.message, 5000);
    }
  };

  const loadHistoryFromStorage = () => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    let loaded = false;
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (isValidHistoryData(parsedHistory)) {
          setContractions(parsedHistory.map(c => ({ startTime: Number(c.startTime), duration: Number(c.duration), frequency: (c.frequency === null || typeof c.frequency === 'undefined') ? null : Number(c.frequency), intensity: c.intensity || '', notes: c.notes || '' })));
          setLastStartTime(parsedHistory.length > 0 ? parsedHistory[0].startTime : null);
          loaded = true;
        } else {
          console.error("Invalid stored history.");
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error parsing stored history:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return loaded;
  };

  const isValidHistoryData = (data) => {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return true;
    return data.every(item =>
      typeof item === 'object' && item !== null &&
      typeof item.startTime === 'number' && !isNaN(item.startTime) &&
      typeof item.duration === 'number' && !isNaN(item.duration) &&
      (item.frequency === null || (typeof item.frequency === 'number' && !isNaN(item.frequency))) &&
      (typeof item.intensity === 'string' || item.intensity == null) &&
      (typeof item.notes === 'string' || item.notes == null)
    );
  };

  const handleClearHistoryClick = () => {
    let confirmMsg = "Clear current history?";
    let historyIsSaved = localStorage.getItem(STORAGE_KEY) !== null;
    if (contractions.length === 0 && !historyIsSaved) {
      displayStatus("History empty.", 3000);
      return;
    }
    if (historyIsSaved) {
      confirmMsg += "\nAlso delete saved history?";
    }
    if (confirm(confirmMsg)) {
      setContractions([]);
      setLastStartTime(null);
      setStartTime(null);
      setIsTiming(false);
      setPendingEntry(null);
      clearInterval(timerInterval.current);
      clearInterval(timeSinceLastInterval.current);
      setCurrentDuration('00:00');
      setTimeSinceLast('--:--');
      resetEditState();
      if (historyIsSaved) {
        localStorage.removeItem(STORAGE_KEY);
      }
      displayStatus("History cleared.", 3000);
    }
  };

  const handleExportHistoryClick = () => {
    if (contractions.length === 0) {
      displayStatus("No history to export.", 3000);
      return;
    }
    const choice = prompt("JSON Export: 'D'ownload or 'C'opy?", "D");
    if (choice === null) {
      displayStatus("JSON Export cancelled.", 2000);
      return;
    }
    const choiceUpper = choice.toUpperCase();
    if (choiceUpper === 'D') {
      try {
        const jsonData = JSON.stringify(contractions, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        link.download = `contraction_history_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        displayStatus("JSON exported.", 3000);
      } catch (e) {
        console.error("JSON Export error:", e);
        displayStatus("Error exporting JSON.", 5000);
      }
    } else if (choiceUpper === 'C') {
      try {
        const jsonDataPlain = JSON.stringify(contractions, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(jsonDataPlain)
            .then(() => { displayStatus("JSON copied.", 3000); })
            .catch(err => {
              console.error('Clipboard error:', err);
              alert("Copy manually:\n\n" + jsonDataPlain);
              displayStatus("Copy manually.", 5000);
            });
        } else {
          alert("Copy manually:\n\n" + jsonDataPlain);
          displayStatus("Copy manually.", 5000);
        }
      } catch (e) {
        console.error("JSON Copy error:", e);
        displayStatus("Error copying JSON.", 5000);
      }
    } else {
      displayStatus("Invalid choice.", 3000);
    }
  };

  const handleImportHistoryClick = () => {
    const pastedData = importDataArea.current.value.trim();
    if (!pastedData) {
      displayStatus("Paste JSON data first.", 3000);
      return;
    }
    if (contractions.length > 0) {
      if (!confirm("Importing replaces current history. Continue?")) {
        displayStatus("Import cancelled.", 2000);
        return;
      }
    }
    try {
      const parsedData = JSON.parse(pastedData);
      if (!isValidHistoryData(parsedData)) {
        throw new Error(Array.isArray(parsedData) ? "Invalid format." : "Not an array.");
      }
      setContractions(parsedData.map(c => ({ startTime: Number(c.startTime), duration: Number(c.duration), frequency: (c.frequency === null || typeof c.frequency === 'undefined') ? null : Number(c.frequency), intensity: c.intensity || '', notes: c.notes || '' })));
      setLastStartTime(parsedData.length > 0 ? parsedData[0].startTime : null);
      importDataArea.current.value = '';
      displayStatus("History imported.", 3000);
    } catch (e) {
      console.error("Import error:", e);
      displayStatus(`Import failed: ${e.message}.`, 6000);
    }
  };

  const handleDeleteClick = (timestampToDelete) => {
    if (confirm(`Delete entry started at ${formatTimestamp(timestampToDelete)}?`)) {
      const indexToDelete = contractions.findIndex(c => c.startTime === timestampToDelete);
      if (indexToDelete !== -1) {
        const wasMostRecent = (indexToDelete === 0);
        const newContractions = contractions.filter(c => c.startTime !== timestampToDelete);
        setContractions(newContractions);
        if (wasMostRecent) {
          setLastStartTime(newContractions.length > 0 ? newContractions[0].startTime : null);
        }
        displayStatus("Entry deleted.", 2000);
      }
    }
  };

  const handleEditClick = (entryToEdit) => {
    setEditingTimestamp(entryToEdit.startTime);
    entryIntensity.current.value = entryToEdit.intensity || '';
    entryNotes.current.value = entryToEdit.notes || '';
  };

  const handleCancelEditClick = () => {
    resetEditState();
  };

  const calculateAverages = () => {
    let totalDuration = 0, totalFrequency = 0, frequencyCount = 0, durationCount = 0;
    contractions.forEach(c => {
      if (typeof c.duration === 'number') { totalDuration += c.duration; durationCount++; }
      if (typeof c.frequency === 'number') { totalFrequency += c.frequency; frequencyCount++; }
    });
    const avgDuration = durationCount > 0 ? totalDuration / durationCount : null;
    const avgFrequency = frequencyCount > 0 ? totalFrequency / frequencyCount : null;
    return { avgDuration, avgFrequency };
  };

  const { avgDuration, avgFrequency } = calculateAverages();

  return (
    <div className="calculator contraction-timer-container">
      <h2>Contraction Timer</h2>
      <div className="form-group timer-controls">
        <button id="timerButton" onClick={handleTimerClick} className={isTiming ? 'timing' : ''}>
          {isTiming ? 'Stop Contraction' : 'Start Contraction'}
        </button>
      </div>
      <div id="result" className="timer-display">
        <p>Current Duration:<span>{currentDuration}</span></p>
        <p>Time Since Last Start:<span>{timeSinceLast}</span></p>
      </div>
      <div className="form-group analysis-section">
        <div id="summarySection">
          <p>Average Duration:<span>{formatTime(avgDuration)}</span></p>
          <p>Average Frequency:<span>{formatTime(avgFrequency)}</span></p>
        </div>
      </div>
      {(pendingEntry || editingTimestamp) && (
        <div className="form-group entry-details-section" id="entryDetailsSection" style={{ display: 'block' }}>
          <h3>{editingTimestamp ? `Edit Entry (Started ${formatTimestamp(editingTimestamp)})` : 'Add Details for Last Contraction'}</h3>
          <label htmlFor="entryIntensity">Intensity:</label>
          <select id="entryIntensity" ref={entryIntensity}>
            <option value="">--Select--</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Strong">Strong</option>
          </select>
          <label htmlFor="entryNotes">Notes:</label>
          <textarea id="entryNotes" ref={entryNotes} rows="2" placeholder="Optional notes..."></textarea>
          <div className="confirm-button-container">
            <button id="confirmEntryButton" onClick={handleConfirmEntryClick}>
              {editingTimestamp ? 'Update Entry' : 'Confirm Entry'}
            </button>
            {editingTimestamp && <button id="cancelEditButton" onClick={handleCancelEditClick}>Cancel Edit</button>}
          </div>
        </div>
      )}
      <h2>Contraction History</h2>
      <div className="history-table-container">
        <table id="historyTable" className="history-table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Frequency</th>
              <th>Intensity</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contractions.length === 0 ? (
              <tr id="no-history-row">
                <td colSpan="6" className="no-history">No contractions recorded yet.</td>
              </tr>
            ) : (
              contractions.map((contraction) => (
                <tr key={contraction.startTime}>
                  <td>{formatTimestamp(contraction.startTime)}</td>
                  <td>{formatTime(contraction.duration)}</td>
                  <td>{contraction.frequency === null ? "N/A" : formatTime(contraction.frequency)}</td>
                  <td>{contraction.intensity || ''}</td>
                  <td>{contraction.notes || ''}</td>
                  <td className="action-cell">
                    <button className="edit-button" title="Edit intensity/notes" onClick={() => handleEditClick(contraction)}>✎</button>
                    <button className="delete-button" title="Delete this entry" onClick={() => handleDeleteClick(contraction.startTime)}>×</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="button-section">
        <button id="saveHistoryButton" onClick={handleSaveHistoryClick}>Save History</button>
        <button id="exportHistoryButton" onClick={handleExportHistoryClick}>Export JSON</button>
        <button id="clearHistoryButton" onClick={handleClearHistoryClick}>Clear History</button>
        <p id="storageStatus" className="storage-status">{status}</p>
      </div>
      <div className="import-section">
        <h3>Import History (JSON)</h3>
        <label htmlFor="importDataArea">Paste JSON data here:</label>
        <textarea id="importDataArea" ref={importDataArea} rows="4"></textarea>
        <div className="import-button-container">
          <button id="importHistoryButton" onClick={handleImportHistoryClick}>Import Data (Replaces Current)</button>
        </div>
      </div>
    </div>
  );
};

export default ContractionTimer;