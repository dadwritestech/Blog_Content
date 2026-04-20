import React, { useState } from "react";

const AnnualMileageCalculator = () => {
  const [currentUnit, setCurrentUnit] = useState("km");
  const [weekdayDays, setWeekdayDays] = useState(3);
  const [weekdayDistance, setWeekdayDistance] = useState(50);
  const [weeksOff, setWeeksOff] = useState(4);
  const [weekendDistance, setWeekendDistance] = useState(100);
  const [vacationDistance, setVacationDistance] = useState(2600);

  const kmToMilesFactor = 0.621371;

  const calculateDistance = () => {
    const weeksPerYear = 52;
    const drivingWeeks = 52 - weeksOff;

    const weekdayTotal = weekdayDays * weekdayDistance * drivingWeeks;
    const weekendTotal = weekendDistance * 52;

    let totalDistance = weekdayTotal + weekendTotal + vacationDistance;

    if (currentUnit === "miles") {
      totalDistance *= kmToMilesFactor;
    }

    return `Total Annual Distance: ${totalDistance.toFixed(2)} ${currentUnit}`;
  };

  const resultText = calculateDistance();

  const inputClass =
    "w-full px-3 py-2 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300";
  const unitLabel = (currentUnit === "km" ? "Kilometers" : "Miles");

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Annual Distance Calculator</h2>

      {/* Unit Toggle */}
      <div className="flex items-center gap-3 mb-3">
        <label htmlFor="unitToggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">Unit:</label>
        <select
          id="unitToggle"
          value={currentUnit}
          onChange={(e) => setCurrentUnit(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="km">{unitLabel}</option>
          <option value="miles">Miles</option>
        </select>
      </div>

      {/* Weekday Days */}
      <label htmlFor="weekdayDays" className={labelClass}>
        Days you drive per week:
      </label>
      <input
        type="number"
        id="weekdayDays"
        min="0"
        max="7"
        value={weekdayDays}
        onChange={(e) => setWeekdayDays(parseFloat(e.target.value) || 0)}
        className={inputClass}
      />

      {/* Weekday Distance */}
      <label htmlFor="weekdayDistance" className={labelClass}>
        Distance per weekday:{" "}
        <span className="text-blue-600 dark:text-blue-400">{currentUnit}</span>
      </label>
      <input
        type="number"
        id="weekdayDistance"
        min="0"
        value={weekdayDistance}
        onChange={(e) => setWeekdayDistance(parseFloat(e.target.value) || 0)}
        className={inputClass}
      />

      {/* Weeks Off */}
      <label htmlFor="weeksOff" className={labelClass}>
        Weeks of vacation per year:
      </label>
      <input
        type="number"
        id="weeksOff"
        min="0"
        max="52"
        value={weeksOff}
        onChange={(e) => setWeeksOff(parseFloat(e.target.value) || 0)}
        className={inputClass}
      />

      {/* Weekend Distance */}
      <label htmlFor="weekendDistance" className={labelClass}>
        Distance per weekend:{" "}
        <span className="text-blue-600 dark:text-blue-400">{currentUnit}</span>
      </label>
      <input
        type="number"
        id="weekendDistance"
        min="0"
        value={weekendDistance}
        onChange={(e) => setWeekendDistance(parseFloat(e.target.value) || 0)}
        className={inputClass}
      />

      {/* Vacation Distance */}
      <label htmlFor="vacationDistance" className={labelClass}>
        Total distance during vacations:{" "}
        <span className="text-blue-600 dark:text-blue-400">{currentUnit}</span>
      </label>
      <input
        type="number"
        id="vacationDistance"
        min="0"
        value={vacationDistance}
        onChange={(e) => setVacationDistance(parseFloat(e.target.value) || 0)}
        className={inputClass}
      />

      {/* Result */}
      <div className="mt-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm font-medium text-blue-800 dark:text-blue-300">
        {resultText}
      </div>
    </div>
  );
};

export default AnnualMileageCalculator;
