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
      if (editingTimestamp !== null) resetEditState();
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
      if (lastStartTime) frequency = (startTime - lastStartTime) / 1000;
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
    if (entryIntensity.current) entryIntensity.current.value = '';
    if (entryNotes.current) entryNotes.current.value = '';
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
          setContractions(parsedHistory.map(c => ({
            startTime: Number(c.startTime),
            duration: Number(c.duration),
            frequency: (c.frequency === null || typeof c.frequency === 'undefined') ? null : Number(c.frequency),
            intensity: c.intensity || '',
            notes: c.notes || '',
          })));
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
    if (historyIsSaved) confirmMsg += "\nAlso delete saved history?";
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
      if (historyIsSaved) localStorage.removeItem(STORAGE_KEY);
      displayStatus("History cleared.", 3000);
    }
  };

  const handleExportHistoryClick = () => {
    if (contractions.length === 0) {
      displayStatus("No history to export.", 3000);
      return;
    }
    const choice = prompt("JSON Export: 'D'ownload or 'C'opy?", "D");
    if (choice === null) { displayStatus("JSON Export cancelled.", 2000); return; }
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
    if (!pastedData) { displayStatus("Paste JSON data first.", 3000); return; }
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
      setContractions(parsedData.map(c => ({
        startTime: Number(c.startTime),
        duration: Number(c.duration),
        frequency: (c.frequency === null || typeof c.frequency === 'undefined') ? null : Number(c.frequency),
        intensity: c.intensity || '',
        notes: c.notes || '',
      })));
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

  const handleCancelEditClick = () => resetEditState();

  const calculateAverages = () => {
    let totalDuration = 0, totalFrequency = 0, frequencyCount = 0, durationCount = 0;
    contractions.forEach(c => {
      if (typeof c.duration === 'number') { totalDuration += c.duration; durationCount++; }
      if (typeof c.frequency === 'number') { totalFrequency += c.frequency; frequencyCount++; }
    });
    return { avgDuration: durationCount > 0 ? totalDuration / durationCount : null, avgFrequency: frequencyCount > 0 ? totalFrequency / frequencyCount : null };
  };

  const { avgDuration, avgFrequency } = calculateAverages();

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Contraction Timer</h2>

      {/* Timer Controls */}
      <div className="flex items-center gap-3">
        <button
          id="timerButton"
          onClick={handleTimerClick}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            isTiming
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTiming ? 'Stop Contraction' : 'Start Contraction'}
        </button>
      </div>

      {/* Timer Display */}
      <div className="grid grid-cols-2 gap-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          Current Duration: <span className="font-bold ml-1">{currentDuration}</span>
        </p>
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          Time Since Last: <span className="font-bold ml-1">{timeSinceLast}</span>
        </p>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-2 gap-4 p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Avg Duration: <span className="font-bold ml-1">{formatTime(avgDuration)}</span>
        </p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Avg Frequency: <span className="font-bold ml-1">{formatTime(avgFrequency)}</span>
        </p>
      </div>

      {/* Entry Details (pending or editing) */}
      {(pendingEntry || editingTimestamp) && (
        <div className="p-4 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {editingTimestamp ? `Edit Entry (Started ${formatTimestamp(editingTimestamp)})` : 'Add Details for Last Contraction'}
          </h3>
          <div>
            <label htmlFor="entryIntensity" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Intensity:</label>
            <select id="entryIntensity" ref={entryIntensity} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">--Select--</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Strong">Strong</option>
            </select>
          </div>
          <div>
            <label htmlFor="entryNotes" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Notes:</label>
            <textarea id="entryNotes" ref={entryNotes} rows="2" placeholder="Optional notes..." className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" />
          </div>
          <div className="flex gap-2">
            <button id="confirmEntryButton" onClick={handleConfirmEntryClick} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition-colors">
              {editingTimestamp ? 'Update Entry' : 'Confirm Entry'}
            </button>
            {editingTimestamp && (
              <button id="cancelEditButton" onClick={handleCancelEditClick} className="px-4 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-slate-100 rounded-md font-semibold text-sm transition-colors">
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Table */}
      <div>
        <h3 className="text-base font-bold mb-2 text-slate-800 dark:text-slate-200">Contraction History</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th className="px-3 py-2 text-left font-semibold">Start Time</th>
                <th className="px-3 py-2 text-left font-semibold">Duration</th>
                <th className="px-3 py-2 text-left font-semibold">Frequency</th>
                <th className="px-3 py-2 text-left font-semibold">Intensity</th>
                <th className="px-3 py-2 text-left font-semibold">Notes</th>
                <th className="px-3 py-2 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {contractions.length === 0 ? (
                <tr><td colSpan="6" className="px-3 py-4 text-center text-slate-500 italic">No contractions recorded yet.</td></tr>
              ) : (
                contractions.map((contraction) => (
                  <tr key={contraction.startTime} className="bg-white dark:bg-slate-900/50">
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{formatTimestamp(contraction.startTime)}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{formatTime(contraction.duration)}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{contraction.frequency === null ? "N/A" : formatTime(contraction.frequency)}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{contraction.intensity || ''}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{contraction.notes || ''}</td>
                    <td className="px-3 py-2 text-center">
                      <button className="edit-button mr-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" title="Edit intensity/notes" onClick={() => handleEditClick(contraction)}>Edit</button>
                      <button className="delete-button text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Delete this entry" onClick={() => handleDeleteClick(contraction.startTime)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button id="saveHistoryButton" onClick={handleSaveHistoryClick} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-sm transition-colors">Save History</button>
        <button id="exportHistoryButton" onClick={handleExportHistoryClick} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-sm transition-colors">Export JSON</button>
        <button id="clearHistoryButton" onClick={handleClearHistoryClick} className="px-4 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-slate-100 rounded-md font-semibold text-sm transition-colors">Clear History</button>
      </div>
      <p id="storageStatus" className="text-xs text-slate-500">{status}</p>

      {/* Import Section */}
      <div className="p-4 rounded-md border border-slate-200 dark:border-slate-700 space-y-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Import History (JSON)</h3>
        <label htmlFor="importDataArea" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Paste JSON data here:</label>
        <textarea id="importDataArea" ref={importDataArea} rows="4" className="w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" />
        <button id="importHistoryButton" onClick={handleImportHistoryClick} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition-colors">Import Data (Replaces Current)</button>
      </div>
    </div>
  );
};

export default ContractionTimer;
