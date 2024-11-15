function simulateFIFO() {
  const numFrames = parseInt(document.getElementById("numFrames").value);
  const pageString = document.getElementById("pageString").value.trim();

  if (isNaN(numFrames) || numFrames <= 0) {
    alert("Please enter a valid number of frames (greater than 0).");
    return;
  }

  const pages = pageString.split(" ").map(page => parseInt(page.trim()));

  if (pages.some(isNaN)) {
    alert("Please enter valid page numbers, separated by commas.");
    return;
  }

  let frameQueue = new Array(numFrames).fill("-");
  let pageFaults = 0;
  let output2 = document.getElementById("output2");

  // Clear previous output
  output2.innerHTML = "";

  // Display initial page faults
  output2.innerHTML += `<p>Total Page Faults: ${pageFaults}</p>`;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (!frameQueue.includes(page)) {
      const replacedPage = frameQueue.shift();
      frameQueue.push(page);
      displayResultStep(output2, frameQueue.slice());
      pageFaults++;

      // Update displayed page faults after each page fault
      output2.firstChild.textContent = `Total Page Faults: ${pageFaults}`;
    } else {
      displayResultStep(output2, frameQueue.slice());
    }
  }
}


function displayResultStep(output2, frames) {
  const frameDiv = document.createElement("div");
  frameDiv.classList.add("output-frame");

  // Reverse the order of frames and append them
  for (let i = frames.length - 1; i >= 0; i--) {
    const frameSpan = document.createElement("span");
    frameSpan.textContent = frames[i];
    frameDiv.appendChild(frameSpan);

    // Add a line break if it's not the last element
    if (i > 0) {
      const lineBreak = document.createElement("br");
      frameDiv.appendChild(lineBreak);
    }
  }

  output2.appendChild(frameDiv);
}