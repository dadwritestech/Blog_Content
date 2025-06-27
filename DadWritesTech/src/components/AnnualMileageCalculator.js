import React, { useState, useEffect } from 'react';

function AnnualMileageCalculator() {
    const [currentUnit, setCurrentUnit] = useState('km');
    const [weekdayDays, setWeekdayDays] = useState(3);
    const [weekdayDistance, setWeekdayDistance] = useState(50);
    const [weeksOff, setWeeksOff] = useState(4);
    const [weekendDistance, setWeekendDistance] = useState(100);
    const [vacationDistance, setVacationDistance] = useState(2600);
    const [result, setResult] = useState('');

    const kmToMilesFactor = 0.621371;

    const updateUnit = (unit) => {
        setCurrentUnit(unit);
        setResult(''); // Clear result when unit changes
    };

    const calculateDistance = () => {
        if (isNaN(weekdayDays) || isNaN(weekdayDistance) || isNaN(weeksOff) || isNaN(weekendDistance) || isNaN(vacationDistance)) {
            setResult('Please enter valid numbers in all fields.');
            return;
        }

        const weeksPerYear = 52;
        const drivingWeeks = weeksPerYear - weeksOff;

        const weekdayTotal = weekdayDays * weekdayDistance * drivingWeeks;
        const weekendTotal = weekendDistance * weeksPerYear;

        let totalDistance = weekdayTotal + weekendTotal + vacationDistance;

        if (currentUnit === 'miles') {
            totalDistance *= kmToMilesFactor;
        }

        setResult(`Total Annual Distance: ${totalDistance.toFixed(2)} ${currentUnit}`);
    };

    // Initial calculation on component mount and when inputs change
    useEffect(() => {
        calculateDistance();
    }, [weekdayDays, weekdayDistance, weeksOff, weekendDistance, vacationDistance, currentUnit]);

    return (
        <div className="calculator">
            <h2>Annual Distance Calculator</h2>
            <div className="unit-toggle">
                <label htmlFor="unitToggle">Unit:</label>
                <select id="unitToggle" value={currentUnit} onChange={(e) => updateUnit(e.target.value)}>
                    <option value="km">Kilometers</option>
                    <option value="miles">Miles</option>
                </select>
            </div>
            <form id="mileageForm">
                <div className="form-group">
                    <label htmlFor="weekdayDays">Days you drive per week:</label>
                    <input
                        type="number"
                        id="weekdayDays"
                        name="weekdayDays"
                        min="0"
                        max="7"
                        value={weekdayDays}
                        onChange={(e) => setWeekdayDays(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="weekdayDistance">Distance per weekday: <span className="unit">{currentUnit}</span></label>
                    <input
                        type="number"
                        id="weekdayDistance"
                        name="weekdayDistance"
                        min="0"
                        value={weekdayDistance}
                        onChange={(e) => setWeekdayDistance(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="weeksOff">Weeks of vacation per year:</label>
                    <input
                        type="number"
                        id="weeksOff"
                        name="weeksOff"
                        min="0"
                        max="52"
                        value={weeksOff}
                        onChange={(e) => setWeeksOff(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="weekendDistance">Distance per weekend: <span className="unit">{currentUnit}</span></label>
                    <input
                        type="number"
                        id="weekendDistance"
                        name="weekendDistance"
                        min="0"
                        value={weekendDistance}
                        onChange={(e) => setWeekendDistance(parseFloat(e.target.value))}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="vacationDistance">Total distance during vacations: <span className="unit">{currentUnit}</span></label>
                    <input
                        type="number"
                        id="vacationDistance"
                        name="vacationDistance"
                        min="0"
                        value={vacationDistance}
                        onChange={(e) => setVacationDistance(parseFloat(e.target.value))}
                    />
                </div>
                <button type="button" onClick={calculateDistance}>Calculate Annual Mileage</button>
            </form>
            <div id="result">{result}</div>
        </div>
    );
}

export default AnnualMileageCalculator;
