# inflationCalculator

Go to https://no4jargon.github.io/inflationCalculator/

This tool provides a simple inflation calculator for India based on a sample
Consumer Price Index (CPI) dataset. Select a starting and ending month/year to
see how much a given amount of money would be worth in another time period.

The CPI values are loaded from the bundled `data/cpi-data.js` file,
which contains data extracted from the original Excel spreadsheet. The
spreadsheet and the helper script used to generate this module are kept
in the `data/` folder as well for reference. A plain JSON version of the
data (`cpi-data.json`) is also included there.
These values are approximate and meant for demonstration purposes only.

The month and year dropdowns are populated from this data, so they match
the available range (January&nbsp;2013 to May&nbsp;2025 in the provided file).

Open `index.html` in your browser to use the calculator.
