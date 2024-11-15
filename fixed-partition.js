let originalMemoryPartitions = [
  { id: 1, size: 100, allocated: false, allocatedSize: 0, internalFragmentation: 0 },
  { id: 2, size: 25, allocated: false, allocatedSize: 0, internalFragmentation: 0 },
  { id: 3, size: 25, allocated: false, allocatedSize: 0, internalFragmentation: 0 },
  { id: 4, size: 50, allocated: false, allocatedSize: 0, internalFragmentation: 0 }
];

let memoryPartitions = cloneMemory(originalMemoryPartitions);
let nextProcessId = 1;

function allocateJobs() {
  const algorithmSelect = document.getElementById("algorithmSelect");
  const selectedAlgorithm = algorithmSelect.value;

  const partitionSizesInput = document.getElementById("partitionSizesInput");
  const processSizesInput = document.getElementById("processSizesInput");
  const outputDiv = document.getElementById("output");

  outputDiv.innerHTML = '';

  const partitionSizes = partitionSizesInput.value.split(" ").map(size => parseInt(size.trim()));
  const processSizes = processSizesInput.value.split(" ").map(size => parseInt(size.trim()));

  if (partitionSizes.some(isNaN) || partitionSizes.some(size => size <= 0) ||
      processSizes.some(isNaN) || processSizes.some(size => size <= 0)) {
    alert("Please enter valid positive numbers for partition and process sizes, separated by commas.");
    return;
  }

  originalMemoryPartitions = createMemoryPartitions(partitionSizes);
  memoryPartitions = cloneMemory(originalMemoryPartitions); // Reset memory partitions
  nextProcessId = 1; // Reset nextProcessId to 1

  // Call the appropriate allocation function based on the selected algorithm
  if (selectedAlgorithm === "firstFit") {
    processSizes.forEach((size) => {
      firstFit(nextProcessId, size);
      nextProcessId++;
    });
  } else if (selectedAlgorithm === "bestFit") {
    processSizes.forEach((size) => {
      bestFit(nextProcessId, size);
      nextProcessId++;
    });
  } else if (selectedAlgorithm === "worstFit") {
    processSizes.forEach((size) => {
      worstFit(nextProcessId, size);
      nextProcessId++;
    });
  }

  // Clear the input fields after allocating the jobs
  partitionSizesInput.value = '';
  processSizesInput.value = '';

  // Display the updated result
  displayResult(outputDiv);
}

function createMemoryPartitions(partitionSizes) {
  return partitionSizes.map((size, index) => ({
    id: index + 1,
    size,
    allocated: false,
    allocatedSize: 0,
    internalFragmentation: 0
  }));
}

function cloneMemory(originalMemory) {
  return originalMemory.map(partition => ({ ...partition }));
}

function firstFit(processId, processSize) {
  for (let i = 0; i < memoryPartitions.length; i++) {
    if (!memoryPartitions[i].allocated && memoryPartitions[i].size >= processSize) {
      memoryPartitions[i].allocated = true;
      memoryPartitions[i].allocatedSize = processSize;
      memoryPartitions[i].internalFragmentation = memoryPartitions[i].size - processSize;
      //logOutput(`Process ${processId} allocated to Partition ${memoryPartitions[i].id} with internal fragmentation ${memoryPartitions[i].internalFragmentation}`);
      return;
    }
  }
  logOutput(`Process ${processId} cannot be allocated.`);
}

function bestFit(processId, processSize) {
  let bestFitIndex = -1;
  let bestFitFragmentation = Infinity;

  for (let i = 0; i < memoryPartitions.length; i++) {
    if (!memoryPartitions[i].allocated && memoryPartitions[i].size >= processSize) {
      const fragmentation = memoryPartitions[i].size - processSize;

      if (fragmentation < bestFitFragmentation) {
        bestFitFragmentation = fragmentation;
        bestFitIndex = i;
      }
    }
  }

  if (bestFitIndex !== -1) {
    memoryPartitions[bestFitIndex].allocated = true;
    memoryPartitions[bestFitIndex].allocatedSize = processSize;
    memoryPartitions[bestFitIndex].internalFragmentation = bestFitFragmentation;
    logOutput(`Process ${processId} allocated to Partition ${memoryPartitions[bestFitIndex].id} with internal fragmentation ${bestFitFragmentation}`);
  } else {
    logOutput(`Process ${processId} cannot be allocated.`);
  }
}

function worstFit(processId, processSize) {
  let worstFitIndex = -1;
  let worstFitFragmentation = -1;

  for (let i = 0;  i < memoryPartitions.length; i++) {
    if (!memoryPartitions[i].allocated && memoryPartitions[i].size >= processSize) {
      const fragmentation = memoryPartitions[i].size - processSize;

      if (fragmentation > worstFitFragmentation) {
        worstFitFragmentation = fragmentation;
        worstFitIndex = i;
      }
    }
  }

  if (worstFitIndex !== -1) {
    memoryPartitions[worstFitIndex].allocated = true;
    memoryPartitions[worstFitIndex].allocatedSize = processSize;
    memoryPartitions[worstFitIndex].internalFragmentation = worstFitFragmentation;
    logOutput(`Process ${processId} allocated to Partition ${memoryPartitions[worstFitIndex].id} with internal fragmentation ${worstFitFragmentation}`);
  } else {
    logOutput(`Process ${processId} cannot be allocated.`);
  }
}

function displayResult(outputDiv) {
  logOutput("Final Memory Allocation:");
  logOutput("<div class='memory-partitions-container'> <div>ID</div> <div>Job Size</div> <div>Partition Size</div> <div>Allocated</div> <div>Internal Fragmentation</div>");

  memoryPartitions.forEach(partition => {
    logOutput(`
      <div class='memory-partition'>

        <div>${partition.id}</div>
        <div>${partition.size}</div>
        <div>${partition.allocatedSize}</div>
        <div>${partition.allocated}</div>
        <div>${partition.internalFragmentation}</div>
      </div>
    `);
  });

  logOutput("</div>");

  const totalInternalFragmentation = memoryPartitions.reduce((total, partition) => {
    if (partition.allocated) {
      return total + partition.internalFragmentation;
    }
    return total;
  }, 0);

  logOutput(`<p>Total Internal Fragmentation: ${totalInternalFragmentation}</p>`);
}

function logOutput(message) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML += `<p>${message}</p>`;
}