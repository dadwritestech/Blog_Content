---
title: "Annual Mileage Calculator"
date: "2024-07-12"
url: "/annual-mileage-calculator"
layout: "calculator/single"
---

<div class="calculator">
    <h1>Annual Mileage Calculator</h1>
    <form id="mileageForm">
        <label for="weekdayDays">Days you drive per week:</label>
        <input type="number" id="weekdayDays" name="weekdayDays" min="0" max="7" value="3"><br><br>

        <label for="weekdayKms">Kilometers per weekday:</label>
        <input type="number" id="weekdayKms" name="weekdayKms" min="0" value="50"><br><br>

        <label for="weeksOff">Weeks of vacation per year:</label>
        <input type="number" id="weeksOff" name="weeksOff" min="0" max="52" value="4"><br><br>

        <label for="weekendKms">Kilometers per weekend:</label>
        <input type="number" id="weekendKms" name="weekendKms" min="0" value="100"><br><br>

        <label for="vacationKms">Total kilometers during vacations:</label>
        <input type="number" id="vacationKms" name="vacationKms" min="0" value="2600"><br><br>

        <button type="button" onclick="calculateMileage()">Calculate</button>
    </form>

    <div id="result"></div>
</div>