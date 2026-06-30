function runAlgorithm() {
  const algo = document.getElementById("algo").value;
  const framesCount = parseInt(document.getElementById("framesInput").value);
  const pageInput = document.getElementById("pagesInput").value.trim();
  const pages = pageInput.split(/\s+/).map(Number);

  if (!framesCount || pages.some(isNaN)) {
    alert("Please enter valid inputs.");
    return;
  }

  let log = [];
  let hits = 0;
  let faults = 0;

  if (algo === "FIFO") {
    [log, hits, faults] = runFIFO(pages, framesCount);
  } else if (algo === "LRU") {
    [log, hits, faults] = runLRU(pages, framesCount);
  } else if (algo === "Optimal") {
    [log, hits, faults] = runOptimal(pages, framesCount);
  }

  displayResults(log, hits, faults, pages.length);
}

function displayResults(log, hits, faults, total) {
  const table = ['<table><tr><th>Page</th><th>Frames</th><th>Status</th></tr>'];
  log.forEach(row => {
    table.push(`<tr><td>${row.page}</td><td>${row.frames}</td><td class="${row.status.toLowerCase()}">${row.status}</td></tr>`);
  });
  table.push('</table>');

  const summary = `
    <p>Hits: ${hits}</p>
    <p>Page Faults: ${faults}</p>
    <p>Hit Ratio: ${(hits / total).toFixed(2)}</p>
    <p>Fault Ratio: ${(faults / total).toFixed(2)}</p>
  `;

  document.getElementById("resultTable").innerHTML = table.join('');
  document.getElementById("summary").innerHTML = summary;
  document.getElementById("resultArea").classList.remove("hidden");
}

// FIFO
function runFIFO(pages, framesCount) {
  let frames = [];
  let log = [], hits = 0, faults = 0;

  pages.forEach(page => {
    if (frames.includes(page)) {
      hits++;
      log.push({ page, frames: frames.join(", "), status: "Hit" });
    } else {
      faults++;
      if (frames.length >= framesCount) frames.shift();
      frames.push(page);
      log.push({ page, frames: frames.join(", "), status: "Fault" });
    }
  });

  return [log, hits, faults];
}

// LRU
function runLRU(pages, framesCount) {
  let frames = [], log = [], hits = 0, faults = 0;
  let recent = new Map();

  pages.forEach((page, index) => {
    if (frames.includes(page)) {
      hits++;
      log.push({ page, frames: frames.join(", "), status: "Hit" });
    } else {
      faults++;
      if (frames.length < framesCount) {
        frames.push(page);
      } else {
        let lru = [...frames].sort((a, b) => recent.get(a) - recent.get(b))[0];
        frames[frames.indexOf(lru)] = page;
      }
      log.push({ page, frames: frames.join(", "), status: "Fault" });
    }
    recent.set(page, index);
  });

  return [log, hits, faults];
}

// Optimal
function runOptimal(pages, framesCount) {
  let frames = [], log = [], hits = 0, faults = 0;

  pages.forEach((page, i) => {
    if (frames.includes(page)) {
      hits++;
      log.push({ page, frames: frames.join(", "), status: "Hit" });
    } else {
      faults++;
      if (frames.length < framesCount) {
        frames.push(page);
      } else {
        let future = frames.map(f => {
          let idx = pages.slice(i + 1).indexOf(f);
          return idx === -1 ? Infinity : idx;
        });
        let indexToReplace = future.indexOf(Math.max(...future));
        frames[indexToReplace] = page;
      }
      log.push({ page, frames: frames.join(", "), status: "Fault" });
    }
  });

  return [log, hits, faults];
}
