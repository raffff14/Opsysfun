function calculateWaitingTime(at, bt, n) {
    let wt = new Array(n);
    let finishTime = new Array(n);
    let turnaroundTime = new Array(n);
  
    wt[0] = 0;
    finishTime[0] = at[0] + bt[0];
    turnaroundTime[0] = finishTime[0] - at[0];
  
    let output = "<table>";
    output += "<thead>";
    output += "<tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Finish Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>";
    output += "</thead>";
    output += "<tbody>";
    output += `<tr><td>A</td><td>${at[0]}</td><td>${bt[0]}</td><td>${finishTime[0]}</td><td>${turnaroundTime[0]}</td><td>${wt[0]}</td></tr>`;
  
    for (let i = 1; i < n; i++) {
      wt[i] = (at[i - 1] + bt[i - 1] + wt[i - 1]) - at[i];
      finishTime[i] = at[i] + bt[i] + wt[i];
      turnaroundTime[i] = finishTime[i] - at[i];
  
      output += `<tr><td>${String.fromCharCode(65 + i)}</td><td>${at[i]}</td><td>${bt[i]}</td><td>${finishTime[i]}</td><td>${turnaroundTime[i]}</td><td>${wt[i]}</td></tr>`;
    }
  
    let averageWaitingTime;
    let averageTurnaroundTime;
    let sumWaitingTime = wt.reduce((sum, val) => sum + val, 0);
    let sumTurnaroundTime = turnaroundTime.reduce((sum, val) => sum + val, 0);
  
    averageWaitingTime = sumWaitingTime / n;
    averageTurnaroundTime = sumTurnaroundTime / n;
  
    output += "</tbody>";
    output += "</table>";
    output += `<p class="avg-time">Average waiting time = ${averageWaitingTime}</p>`;
    output += `<p class="avg-time">Average turnaround time = ${averageTurnaroundTime}</p>`;
  
    document.querySelector('.result2-output').innerHTML = output;
  }
  
  function calculateRoundRobin(at, bt, n, quantum) {
    let wt = new Array(n).fill(0);
    let tat = new Array(n).fill(0);
    let total_wt = 0, total_tat = 0;
  
    const findWaitingTime = (processes, n, bt, wt, quantum) => {
      let rem_bt = new Array(n).fill(0);
      for (let i = 0; i < n; i++)
        rem_bt[i] = bt[i];
  
      let t = 0;
      while (1) {
        let done = true;
  
        for (let i = 0; i < n; i++) {
          if (rem_bt[i] > 0) {
            done = false;
  
            if (rem_bt[i] > quantum) {
              t += quantum;
              rem_bt[i] -= quantum;
            } else {
              t = t + rem_bt[i];
              wt[i] = t - bt[i];
              rem_bt[i] = 0;
            }
          }
        }
  
        if (done == true)
          break;
      }
    }
  
    const findTurnAroundTime = (processes, n, bt, wt, tat) => {
      for (let i = 0; i < n; i++)
        tat[i] = bt[i] + wt[i];
    }
  
    const findavgTime = (processes, n, bt, quantum) => {
      let wt = new Array(n).fill(0),
        tat = new Array(n).fill(0),
        finishTime = new Array(n).fill(0);
  
      findWaitingTime(processes, n, bt, wt, quantum);
      findTurnAroundTime(processes, n, bt, wt, tat);
  
      for (let i = 0; i < n; i++) {
        finishTime[i] = tat[i] + processes[i];
      }
  
      let output = "<table>";
      output += "<thead>";
      output += "<tr><th>Job</th><th>Arrival Time</th><th>Burst Time</th><th>Finish Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr>";
      output += "</thead>";
      output += "<tbody>";
  
      for (let i = 0; i < n; i++) {
        output += `<tr><td>${String.fromCharCode(65 + i)}</td><td>${processes[i]}</td><td>${bt[i]}</td><td>${finishTime[i]}</td><td>${tat[i]}</td><td>${wt[i]}</td></tr>`;
      }
  
      total_wt = wt.reduce((sum, val) => sum + val, 0);
      total_tat = tat.reduce((sum, val) => sum + val, 0);
  
      output += "</tbody>";
      output += "</table>";
      output += `<p class="avg-time">Average waiting time = ${total_wt / n}</p>`;
      output += `<p class="avg-time">Average turnaround time = ${total_tat / n}</p>`;
  
      document.querySelector('.result2-output').innerHTML = output;
    }
  
    findavgTime(at, n, bt, quantum);
  }
  
  function toggleTimeQuantumInput() {
    let schedulingAlgorithm = document.getElementById('scheduling-algorithm').value;
    let timeQuantumInput = document.getElementById('time-quantum-input');
  
    if (schedulingAlgorithm === 'rr') {
      timeQuantumInput.style.display = 'block';
    } else {
      timeQuantumInput.style.display = 'none';
    }
  }
  
  function solveMemory() {
    let algorithm = document.getElementById('memory-algorithm').value;
    let arrivalTimeInput = document.getElementById('arrival-time-input').value;
    let burstTimeInput = document.getElementById('burst-time-input').value;
  
    let at = arrivalTimeInput.split(' ').map(Number);
    let bt = burstTimeInput.split(' ').map(Number);
  
    calculateWaitingTime(at, bt, at.length);
  }
  
  function solveScheduling() {
    let algorithm = document.getElementById('scheduling-algorithm').value;
    let arrivalTimeInput = document.getElementById('arrival-time-scheduling').value;
    let burstTimeInput = document.getElementById('burst-time-scheduling').value;
  
    let at = arrivalTimeInput.split(' ').map(Number);
    let bt = burstTimeInput.split(' ').map(Number);
  
    if (algorithm === 'fcfs') {
      calculateWaitingTime(at, bt, at.length);
    } else if (algorithm === 'rr') {
      let quantum = parseInt(document.getElementById('time-quantum').value);
      calculateRoundRobin(at, bt, at.length, quantum);
    }
  }
  