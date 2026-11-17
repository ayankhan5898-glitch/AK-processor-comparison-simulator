PROCESSOR PERFORMANCE SIMULATOR - BEGINNER GUIDE

WHAT YOU NEED
- A computer (Windows, Mac or Linux)
- A web browser (Chrome, Edge, Firefox, etc.)
- A text editor (Notepad is enough; VS Code is recommended)

HOW TO RUN
1. Extract the ZIP file.
2. Open the extracted folder named processor-performance-simulator.
3. Double-click index.html.
4. The website opens in your browser.
5. Change the values for Processor A and Processor B.
6. Click "Run Simulation".
7. Click "Load Sample Values" to restore the example.

FILES
- index.html: website structure and input fields
- style.css: colors, layout and responsive design
- script.js: calculations, validation and comparison logic

FORMULAS
Total Clock Cycles = Instruction Count x CPI
CPU Execution Time = (Instruction Count x CPI) / Clock Rate

IMPORTANT UNIT CONVERSION
Clock speed is entered in GHz.
1 GHz = 1,000,000,000 Hz.
The JavaScript converts GHz to Hz before calculating execution time.

SAMPLE VALUES
Processor A: 2.5 GHz, CPI 1.5, Instruction Count 1,000,000
Processor B: 3 GHz, CPI 2, Instruction Count 1,000,000

Expected:
Processor A cycles = 1,500,000
Processor B cycles = 2,000,000
Processor A time = 0.6 ms
Processor B time = approximately 0.6667 ms
Processor A is faster for this example.

FOR A FAIR COMPARISON
Use the same instruction count for both processors. In this simple simulator,
the instruction count is entered separately so you can also experiment with
different workloads, but different workloads are not a fair direct comparison.

PROJECT LIMITATION
This is an educational mathematical simulation. It does not execute real
machine instructions or model cache, memory latency, pipelining, branch
prediction, power consumption or multicore behaviour.
