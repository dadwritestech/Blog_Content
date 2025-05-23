---
title: "Pregnancy Contraction Timer"
date: 2025-04-15
draft: false
description: "A simple tool to time pregnancy contractions, calculate duration and frequency, with options for saving, exporting, and importing history." # Updated Description
---

Use this tool to time your contractions. Click "**Start Contraction**" when one begins and "**Stop Contraction**" when it ends. The duration and frequency (time from the start of one to the start of the next) will be recorded below.

**Understanding History:**

* **By default:** The history list only remembers contractions recorded while this page is open in your browser (current session). If you close the tab or reload the page, the list will normally be empty again.
* **Saving History (Optional):** If you want to keep your history for your next visit on *this specific browser/device*, click the "**Save History**" button.
    * You will be asked to confirm.
    * If you confirm, the current list of contractions will be saved **only within your web browser's local storage** on this computer or device.
* **Loading Saved History:** When you return to this page later using the same browser, any history previously saved using the "Save History" button will be loaded automatically. A message "Loaded previously saved history" will appear briefly.
* **Exporting History:** Click the "**Export History**" button to download a file (`.json` format) containing the currently listed contractions. This file can serve as a backup or be used to transfer your history to another device or browser using the Import function.
* **Importing History:** To load history from a previously exported `.json` file:
    1.  Open the `.json` file in a text editor.
    2.  Select and copy its entire content.
    3.  Paste the copied text into the text box under the "Import History" heading on this page.
    4.  Click the "**Import Data**" button.
    5.  **Warning:** Importing will **replace** any history currently shown on the page (both timed and previously loaded). If you want to *keep* the imported data persistently, you must click "**Save History**" *after* importing.
* **Clearing History:** Clicking the "**Clear History**" button will:
    * Ask for confirmation.
    * Clear the contractions currently listed on the page.
    * **Permanently delete** any history you had previously saved in this browser's storage using the "Save History" button. (It does *not* delete exported files).
* **Privacy:** The contraction data you record, optionally save (to local storage), export, or import is processed **only locally in your browser**. It is **never** sent over the internet or stored on any external server.

{{< contraction-timer >}}

**Disclaimer:** This tool is for informational purposes only and does not replace professional medical advice. Consult your healthcare provider regarding your contractions.