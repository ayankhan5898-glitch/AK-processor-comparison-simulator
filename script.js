
const $ = (id) => document.getElementById(id);

// ===============================
// PROCESSOR CALCULATIONS
// ===============================

function readProcessor(label) {
    const clockGHz = Number($(`clock${label}`).value);
    const cpi = Number($(`cpi${label}`).value);
    const instructionCount = Number($(`instructions${label}`).value);

    if (!Number.isFinite(clockGHz) || clockGHz <= 0) {
        throw new Error(`Processor ${label}: Clock speed must be greater than zero.`);
    }

    if (!Number.isFinite(cpi) || cpi <= 0) {
        throw new Error(`Processor ${label}: CPI must be greater than zero.`);
    }

    if (!Number.isSafeInteger(instructionCount) || instructionCount <= 0) {
        throw new Error(`Processor ${label}: Instruction count must be a positive whole number.`);
    }

    const clockRateHz = clockGHz * 1000000000;
    const totalCycles = instructionCount * cpi;
    const executionSeconds = totalCycles / clockRateHz;

    return {
        clockGHz,
        cpi,
        instructionCount,
        totalCycles,
        executionSeconds
    };
}

// ===============================
// FORMATTING
// ===============================

function formatNumber(value) {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2
    }).format(value);
}

function formatTime(seconds) {
    if (seconds < 1) {
        return `${(seconds * 1000).toFixed(4)} ms`;
    }

    return `${seconds.toFixed(6)} s`;
}

// ===============================
// WINNER DETECTION
// ===============================

function getWinner(a, b) {
    if (a.executionSeconds < b.executionSeconds) {
        return "Processor A";
    }

    if (b.executionSeconds < a.executionSeconds) {
        return "Processor B";
    }

    return "Tie";
}

// ===============================
// SHOW RESULTS
// ===============================

function showResults(a, b) {

    $("cyclesA").textContent = formatNumber(a.totalCycles);
    $("cyclesB").textContent = formatNumber(b.totalCycles);

    $("timeA").textContent = formatTime(a.executionSeconds);
    $("timeB").textContent = formatTime(b.executionSeconds);

    $("tableClockA").textContent = `${a.clockGHz} GHz`;
    $("tableClockB").textContent = `${b.clockGHz} GHz`;

    $("tableCpiA").textContent = a.cpi;
    $("tableCpiB").textContent = b.cpi;

    $("tableIcA").textContent = formatNumber(a.instructionCount);
    $("tableIcB").textContent = formatNumber(b.instructionCount);

    $("tableCyclesA").textContent = formatNumber(a.totalCycles);
    $("tableCyclesB").textContent = formatNumber(b.totalCycles);

    $("tableTimeA").textContent = formatTime(a.executionSeconds);
    $("tableTimeB").textContent = formatTime(b.executionSeconds);

    const maxTime = Math.max(a.executionSeconds, b.executionSeconds);

    $("barA").style.width =
        `${(a.executionSeconds / maxTime) * 100}%`;

    $("barB").style.width =
        `${(b.executionSeconds / maxTime) * 100}%`;

    $("barLabelA").textContent = formatTime(a.executionSeconds);
    $("barLabelB").textContent = formatTime(b.executionSeconds);

    const winner = getWinner(a, b);

    $("winnerBadge").textContent =
        winner === "Tie" ? "Tie" : `Faster: ${winner}`;

    if (winner === "Processor A") {

        $("explanation").textContent =
            `Processor A completes this workload in ${formatTime(a.executionSeconds)}, while Processor B takes ${formatTime(b.executionSeconds)}. Therefore, Processor A is faster for the entered values.`;

        $("speedup").textContent =
            `Processor A is ${(b.executionSeconds / a.executionSeconds).toFixed(2)}× as fast as Processor B.`;

    } else if (winner === "Processor B") {

        $("explanation").textContent =
            `Processor B completes this workload in ${formatTime(b.executionSeconds)}, while Processor A takes ${formatTime(a.executionSeconds)}. Therefore, Processor B is faster for the entered values.`;

        $("speedup").textContent =
            `Processor B is ${(a.executionSeconds / b.executionSeconds).toFixed(2)}× as fast as Processor A.`;

    } else {

        $("explanation").textContent =
            "Both processors have the same calculated execution time.";

        $("speedup").textContent =
            "Neither processor is faster for this workload.";
    }

    $("results").classList.remove("hidden");
}

// ===============================
// PERMANENT SIMULATION HISTORY
// ===============================

const STORAGE_KEY = "processorHistory";

function loadHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {
        console.error("History loading error:", error);
        return [];
    }
}

let simulationHistory = loadHistory();

function saveHistory() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(simulationHistory)
        );
    } catch (error) {
        console.error("History saving error:", error);
        $("errorMessage").textContent =
            "Unable to save history in browser storage.";
    }
}

function addToHistory(a, b) {

    const record = {
        date: new Date().toLocaleString(),
        aTime: formatTime(a.executionSeconds),
        bTime: formatTime(b.executionSeconds),
        winner: getWinner(a, b)
    };

    simulationHistory.unshift(record);

    // Keep latest 10 records
    simulationHistory = simulationHistory.slice(0, 10);

    saveHistory();
    displayHistory();
}

function displayHistory() {

    const historyBody = $("historyBody");

    if (!historyBody) return;

    historyBody.innerHTML = "";

    if (simulationHistory.length === 0) {
        historyBody.innerHTML =
            '<tr><td colspan="4">No simulations yet.</td></tr>';
        return;
    }

    simulationHistory.forEach((item, index) => {

        const row = document.createElement("tr");

        const values = [
            index + 1,
            item.aTime,
            item.bTime,
            item.winner
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        historyBody.appendChild(row);
    });
}

// ===============================
// CLEAR HISTORY
// ===============================

function clearHistory() {

    simulationHistory = [];

    localStorage.removeItem(STORAGE_KEY);

    displayHistory();
}

// ===============================
// RUN SIMULATION
// ===============================

function runSimulation() {

    $("errorMessage").textContent = "";

    try {

        const processorA = readProcessor("A");
        const processorB = readProcessor("B");

        showResults(processorA, processorB);

        addToHistory(processorA, processorB);

    } catch (error) {

        $("results").classList.add("hidden");
        $("errorMessage").textContent = error.message;
    }
}

// ===============================
// SAMPLE VALUES
// ===============================

function setSampleValues() {

    $("clockA").value = 2.5;
    $("cpiA").value = 1.5;
    $("instructionsA").value = 1000000;

    $("clockB").value = 3;
    $("cpiB").value = 2;
    $("instructionsB").value = 1000000;

    runSimulation();
}

// ===============================
// RESET FORM
// ===============================

function resetForm() {

    $("clockA").value = "";
    $("cpiA").value = "";
    $("instructionsA").value = "";

    $("clockB").value = "";
    $("cpiB").value = "";
    $("instructionsB").value = "";

    $("results").classList.add("hidden");
    $("errorMessage").textContent = "";
}

// ===============================
// DOWNLOAD REPORT
// ===============================

function downloadReport() {

    $("errorMessage").textContent = "";

    try {

        const a = readProcessor("A");
        const b = readProcessor("B");

        const winner = getWinner(a, b);

        const report = `
PROCESSOR PERFORMANCE COMPARISON REPORT
========================================

DATE: ${new Date().toLocaleString()}

PROCESSOR A
----------------------------------------
Clock Speed: ${a.clockGHz} GHz
CPI: ${a.cpi}
Instruction Count: ${a.instructionCount}
Total Clock Cycles: ${formatNumber(a.totalCycles)}
Execution Time: ${formatTime(a.executionSeconds)}

PROCESSOR B
----------------------------------------
Clock Speed: ${b.clockGHz} GHz
CPI: ${b.cpi}
Instruction Count: ${b.instructionCount}
Total Clock Cycles: ${formatNumber(b.totalCycles)}
Execution Time: ${formatTime(b.executionSeconds)}

RESULT
----------------------------------------
Winner: ${winner}

FORMULA
CPU Time = (Instruction Count × CPI) / Clock Rate

Note: This is an educational mathematical simulation,
not a real hardware benchmark.
`;

        const blob = new Blob([report], {
            type: "text/plain;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Processor_Comparison_Report.txt";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

    } catch (error) {

        $("errorMessage").textContent = error.message;
    }
}

// ===============================
// BUTTON EVENTS
// ===============================

$("compareBtn").addEventListener("click", runSimulation);

$("sampleBtn").addEventListener("click", setSampleValues);

$("resetBtn").addEventListener("click", resetForm);

$("clearHistoryBtn").addEventListener("click", clearHistory);

$("downloadReportBtn").addEventListener("click", downloadReport);

// ===============================
// PAGE INITIALIZATION
// ===============================

// Load saved history without adding a duplicate record
displayHistory();
