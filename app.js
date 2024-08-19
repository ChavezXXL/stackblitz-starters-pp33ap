document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('projects');
  const employeeList = document.getElementById('employees');
  const addProjectBtn = document.getElementById('add-project-btn');
  const addEmployeeBtn = document.getElementById('add-employee-btn');
  const projectModal = document.getElementById('project-modal');
  const employeeModal = document.getElementById('employee-modal');
  const closeProjectModal = document.getElementById('close-project-modal');
  const closeEmployeeModal = document.getElementById('close-employee-modal');
  const saveProjectBtn = document.getElementById('save-project-btn');
  const saveEmployeeBtn = document.getElementById('save-employee-btn');
  const projectNameInput = document.getElementById('project-name');
  const purchaseOrderInput = document.getElementById('purchase-order');
  const partNumberInput = document.getElementById('part-number');
  const jobNumberInput = document.getElementById('job-number');
  const dueDateInput = document.getElementById('due-date');
  const quantityInput = document.getElementById('quantity');
  const notesInput = document.getElementById('notes');
  const employeeNameInput = document.getElementById('employee-name');
  const projectEmployeesSelect = document.getElementById('project-employees');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectPriorityInput = document.getElementById('project-priority');
  const menuIcon = document.getElementById('menu-icon');
  const sideMenu = document.getElementById('side-menu');
  const showProjectListBtn = document.getElementById('show-project-list-btn');
  const showEmployeeListBtn = document.getElementById('show-employee-list-btn');
  const showWorkLogBtn = document.getElementById('show-work-log-btn');
  const clearDataBtn = document.getElementById('clear-data-btn');
  const exportDataBtn = document.getElementById('export-data-btn');
  const importDataBtn = document.getElementById('import-data-btn');
  const fileInput = document.getElementById('file-input');
  const projectListSection = document.getElementById('project-list');
  const employeeListSection = document.getElementById('employee-list');
  const workLogSection = document.getElementById('work-log');
  const workLogEntries = document.getElementById('work-log-entries');
  const projectDetailsModal = document.getElementById('project-details-modal');
  const projectDetailsContent = document.getElementById('project-details-content');
  const closeProjectDetailsModal = document.getElementById('close-project-details-modal');
  const printProjectDetailsBtn = document.getElementById('print-project-details-btn');
  const selectOperationModal = document.getElementById('select-operation-modal');
  const closeSelectOperationModal = document.getElementById('close-select-operation-modal');
  const operationSelect = document.getElementById('operation-select');
  const operationEmployeesSelect = document.getElementById('operation-employees');
  const startOperationBtn = document.getElementById('start-operation-btn');
  const workLogSearchInput = document.getElementById('work-log-search-input');
  const projectSearchInput = document.getElementById('project-search-input');
  const employeeSearchInput = document.getElementById('employee-search-input');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsModal = document.getElementById('close-settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const addOperationBtn = document.getElementById('add-operation-btn');
  const newOperationInput = document.getElementById('new-operation-input');
  const operationsList = document.getElementById('operations-list');

  let editingProject = null;
  let workLogs = [];
  let employees = [];
  let operations = JSON.parse(localStorage.getItem('operations')) || [];
  let timers = {};

  function showProjectModal(edit = false) {
    projectModal.style.display = 'block';
    projectModalTitle.textContent = edit ? 'Edit Project' : 'Add Project';
  }

  function hideProjectModal() {
    projectModal.style.display = 'none';
    clearProjectInputs();
  }

  function showEmployeeModal() {
    employeeModal.style.display = 'block';
  }

  function hideEmployeeModal() {
    employeeModal.style.display = 'none';
    employeeNameInput.value = '';
  }

  function showProjectDetailsModal() {
    projectDetailsModal.style.display = 'block';
  }

  function hideProjectDetailsModal() {
    projectDetailsModal.style.display = 'none';
  }

  function showSelectOperationModal(projectItem) {
    loadOperationEmployees();
    selectOperationModal.style.display = 'block';
    startOperationBtn.onclick = () => {
      startProjectOperation(projectItem);
    };
  }

  function hideSelectOperationModal() {
    selectOperationModal.style.display = 'none';
  }

  function toggleSideMenu() {
    sideMenu.style.width = sideMenu.style.width === '250px' ? '0' : '250px';
  }

  function showProjectList() {
    projectListSection.style.display = 'block';
    employeeListSection.style.display = 'none';
    workLogSection.style.display = 'none';
    closeSideMenu();
  }

  function showEmployeeList() {
    projectListSection.style.display = 'none';
    employeeListSection.style.display = 'block';
    workLogSection.style.display = 'none';
    closeSideMenu();
  }

  function showWorkLog() {
    projectListSection.style.display = 'none';
    employeeListSection.style.display = 'none';
    workLogSection.style.display = 'block';
    closeSideMenu();
    loadWorkLogs();
  }

  function closeSideMenu() {
    sideMenu.style.width = '0';
  }

  function loadEmployees() {
    projectEmployeesSelect.innerHTML = '';
    operationEmployeesSelect.innerHTML = '';
    employees.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee.name;
      option.textContent = employee.name;
      projectEmployeesSelect.appendChild(option);

      const selectOption = document.createElement('option');
      selectOption.value = employee.name;
      selectOption.textContent = employee.name;
      operationEmployeesSelect.appendChild(selectOption);
    });
  }

  function clearProjectInputs() {
    projectNameInput.value = '';
    purchaseOrderInput.value = '';
    partNumberInput.value = '';
    jobNumberInput.value = '';
    dueDateInput.value = '';
    quantityInput.value = '';
    notesInput.value = '';
    projectEmployeesSelect.innerHTML = '';
    projectPriorityInput.value = 'medium'; // Default to medium
    editingProject = null;
  }

  function generateUniqueId() {
    return 'project-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function addProject() {
    const projectName = projectNameInput.value.trim();
    const purchaseOrder = purchaseOrderInput.value.trim();
    const partNumber = partNumberInput.value.trim();
    const jobNumber = jobNumberInput.value.trim();
    const dueDate = dueDateInput.value;
    const quantity = quantityInput.value.trim();
    const notes = notesInput.value.trim();
    const assignedEmployees = Array.from(projectEmployeesSelect.selectedOptions).map(option => option.value);
    const priority = projectPriorityInput.value;

    if (projectName && purchaseOrder) {
      const projectId = generateUniqueId();
      const projectItem = document.createElement('div');
      projectItem.className = 'project-bubble';
      projectItem.setAttribute('data-project-id', projectId);
      projectItem.innerHTML = `
        <h3>${projectName}</h3>
        <div class="project-details">
          <p><strong>Purchase Order:</strong> ${purchaseOrder}</p>
          <p><strong>Part Number:</strong> ${partNumber}</p>
          <p><strong>Job Number:</strong> ${jobNumber}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Notes:</strong> ${notes}</p>
          <p><strong>Assigned Employees:</strong> ${assignedEmployees.join(', ')}</p>
          <p><strong>Priority:</strong> <span class="priority priority-${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span></p>
          <p><strong>Status:</strong> <span class="status">Not Started</span></p>
          <p><strong>Timer:</strong> <span class="timer" data-timer="0">00:00:00</span></p>
        </div>
        <div class="action-buttons">
          <button class="start-btn">Start</button>
          <button class="pause-btn" style="display: none;">Pause</button>
          <button class="end-btn" disabled>End</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="copy-btn">Copy</button>
          <button class="print-btn">Print</button>
        </div>
      `;
      projectItem.addEventListener('click', (e) => {
        if (!e.target.classList.contains('start-btn') &&
          !e.target.classList.contains('pause-btn') &&
          !e.target.classList.contains('end-btn') &&
          !e.target.classList.contains('edit-btn') &&
          !e.target.classList.contains('delete-btn') &&
          !e.target.classList.contains('copy-btn') &&
          !e.target.classList.contains('print-btn')) {
          showSelectOperationModal(projectItem);
        }
      });
      projectList.appendChild(projectItem);

      attachEventListenersToProjectItem(projectItem);

      clearProjectInputs();
      hideProjectModal();
      saveDataToLocalStorage();
    }
  }

  function editProject(projectItem, projectName, purchaseOrder, partNumber, jobNumber, dueDate, quantity, notes, assignedEmployees, priority) {
    editingProject = projectItem;
    projectNameInput.value = projectName;
    purchaseOrderInput.value = purchaseOrder;
    partNumberInput.value = partNumber;
    jobNumberInput.value = jobNumber;
    dueDateInput.value = dueDate;
    quantityInput.value = quantity;
    notesInput.value = notes;
    projectPriorityInput.value = priority;
    loadEmployees();
    Array.from(projectEmployeesSelect.options).forEach(option => {
      if (assignedEmployees.includes(option.value)) {
        option.selected = true;
      }
    });
    showProjectModal(true);
  }

  function saveProject() {
    if (editingProject) {
      const projectName = projectNameInput.value.trim();
      const purchaseOrder = purchaseOrderInput.value.trim();
      const partNumber = partNumberInput.value.trim();
      const jobNumber = jobNumberInput.value.trim();
      const dueDate = dueDateInput.value;
      const quantity = quantityInput.value.trim();
      const notes = notesInput.value.trim();
      const assignedEmployees = Array.from(projectEmployeesSelect.selectedOptions).map(option => option.value);
      const priority = projectPriorityInput.value;

      editingProject.innerHTML = `
        <h3>${projectName}</h3>
        <div class="project-details">
          <p><strong>Purchase Order:</strong> ${purchaseOrder}</p>
          <p><strong>Part Number:</strong> ${partNumber}</p>
          <p><strong>Job Number:</strong> ${jobNumber}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Notes:</strong> ${notes}</p>
          <p><strong>Assigned Employees:</strong> ${assignedEmployees.join(', ')}</p>
          <p><strong>Priority:</strong> <span class="priority priority-${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span></p>
          <p><strong>Status:</strong> <span class="status">${editingProject.querySelector('.status').textContent}</span></p>
          <p><strong>Timer:</strong> <span class="timer" data-timer="${editingProject.querySelector('.timer').getAttribute('data-timer')}">${editingProject.querySelector('.timer').textContent}</span></p>
        </div>
        <div class="action-buttons">
          <button class="start-btn">Start</button>
          <button class="pause-btn" style="display: none;">Pause</button>
          <button class="end-btn" disabled>End</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="copy-btn">Copy</button>
          <button class="print-btn">Print</button>
        </div>
      `;

      attachEventListenersToProjectItem(editingProject);

      hideProjectModal();
      saveDataToLocalStorage();
    } else {
      addProject();
    }
  }

  function addEmployee() {
    const employeeName = employeeNameInput.value.trim();
    if (employeeName) {
      const employeeItem = document.createElement('li');
      const employeeNameSpan = document.createElement('span');
      employeeNameSpan.className = 'employee-name';
      employeeNameSpan.textContent = employeeName;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        employeeItem.remove();
        saveDataToLocalStorage();
      });

      employeeItem.appendChild(employeeNameSpan);
      employeeItem.appendChild(deleteBtn);
      employeeList.appendChild(employeeItem);

      employees.push({
        name: employeeName,
        projectCount: 0,
        totalProfit: 0,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
      });

      employeeNameInput.value = '';
      hideEmployeeModal();
      saveDataToLocalStorage();
    }
  }

  function startProjectOperation(projectItem) {
    const selectedOperation = operationSelect.value;
    const selectedEmployees = Array.from(operationEmployeesSelect.selectedOptions).map(option => option.value);
    const startTime = Date.now();
    const projectName = projectItem.querySelector('h3').textContent;

    // Reset timer state for the project
    const projectId = projectItem.getAttribute('data-project-id');
    timers[projectId] = { intervalId: null, startTime, elapsed: 0 };

    const logEntry = {
      project: projectName,
      operation: selectedOperation,
      employees: selectedEmployees,
      start: startTime,
      end: null,
      duration: null,
      pauses: [],
      individualDurations: {}
    };
    selectedEmployees.forEach(employee => {
      logEntry.individualDurations[employee] = { start: startTime, duration: 0 };
    });
    workLogs.push(logEntry);

    const statusSpan = projectItem.querySelector('.status');
    statusSpan.textContent = selectedOperation ? `In Progress: ${selectedOperation}` : 'In Progress';
    statusSpan.setAttribute('data-start-time', startTime);
    statusSpan.setAttribute('data-assigned-employees', selectedEmployees.join(', '));

    projectItem.querySelector('.start-btn').style.display = 'none';
    projectItem.querySelector('.pause-btn').style.display = 'inline-block';
    projectItem.querySelector('.end-btn').disabled = false;
    projectItem.querySelector('.project-details p:nth-child(7)').textContent = `Assigned Employees: ${selectedEmployees.join(', ')}`;

    startTimer(projectItem);

    saveDataToLocalStorage();
    hideSelectOperationModal();
  }

  function startTimer(projectItem) {
    const projectId = projectItem.getAttribute('data-project-id');
    if (!timers[projectId]) {
      timers[projectId] = { intervalId: null, startTime: Date.now(), elapsed: 0 };
    }
    if (!timers[projectId].intervalId) {
      timers[projectId].intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = now - timers[projectId].startTime + timers[projectId].elapsed;
        const timerSpan = projectItem.querySelector('.timer');
        timerSpan.setAttribute('data-timer', elapsed);
        timerSpan.textContent = formatTime(elapsed);
      }, 1000);
    }
  }

  function pauseTimer(projectItem) {
    const projectId = projectItem.getAttribute('data-project-id');
    if (timers[projectId] && timers[projectId].intervalId) {
      clearInterval(timers[projectId].intervalId);
      timers[projectId].intervalId = null;
      const now = Date.now();
      timers[projectId].elapsed += now - timers[projectId].startTime;
    }
  }

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function pauseProjectOperation(projectItem) {
    const projectName = projectItem.querySelector('h3').textContent;
    const logEntry = workLogs.find(log => log.project === projectName && log.end === null);
    if (logEntry) {
      const pauseTime = Date.now();
      logEntry.pauses.push({ start: pauseTime, end: null });

      const statusSpan = projectItem.querySelector('.status');
      statusSpan.textContent = `Paused: ${logEntry.operation}`;

      const pauseBtn = projectItem.querySelector('.pause-btn');
      pauseBtn.textContent = 'Resume';

      pauseTimer(projectItem);

      saveDataToLocalStorage();
    }
  }

  function resumeProjectOperation(projectItem) {
    const projectName = projectItem.querySelector('h3').textContent;
    const logEntry = workLogs.find(log => log.project === projectName && log.end === null);
    if (logEntry) {
      const resumeTime = Date.now();
      const lastPause = logEntry.pauses[logEntry.pauses.length - 1];
      if (lastPause && !lastPause.end) {
        lastPause.end = resumeTime;
        lastPause.duration = (resumeTime - lastPause.start) / 3600000; // Convert to hours
      }

      const statusSpan = projectItem.querySelector('.status');
      statusSpan.textContent = `In Progress: ${logEntry.operation}`;

      const pauseBtn = projectItem.querySelector('.pause-btn');
      pauseBtn.textContent = 'Pause';

      timers[projectItem.getAttribute('data-project-id')].startTime = Date.now();
      startTimer(projectItem);

      saveDataToLocalStorage();
    }
  }

  function endProject(projectItem) {
    const endTime = Date.now();
    const projectName = projectItem.querySelector('h3').textContent;
    const logEntry = workLogs.find(log => log.project === projectName && log.end === null);
    if (logEntry) {
      logEntry.end = endTime;
      logEntry.duration = (logEntry.end - logEntry.start) / 3600000;
      logEntry.pauses.forEach(pause => {
        logEntry.duration -= pause.duration;
      });

      const logEntryDiv = document.createElement('div');
      logEntryDiv.className = 'work-log-entry';
      logEntryDiv.innerHTML = `
        <h4>${logEntry.project}</h4>
        <p><strong>Operation:</strong> ${logEntry.operation}</p>
        <p><strong>Employees:</strong> ${logEntry.employees.join(', ')}</p>
        <p><strong>Start Time:</strong> ${new Date(logEntry.start).toLocaleString()}</p>
        <p><strong>End Time:</strong> ${new Date(logEntry.end).toLocaleString()}</p>
        <p><strong>Duration (hours):</strong> ${logEntry.duration.toFixed(2)}</p>
        ${logEntry.employees.map(employee => `<p><strong>${employee} Break Duration:</strong> ${logEntry.individualDurations[employee].duration.toFixed(2)} hours</p>`).join('')}
        <p><strong>Stopwatch Time:</strong> ${formatTime(logEntry.end - logEntry.start)}</p>
        <button class="delete-log-btn" onclick="deleteWorkLog(${workLogs.indexOf(logEntry)})">Delete</button>
      `;
      workLogEntries.appendChild(logEntryDiv);
      saveDataToLocalStorage();
    }

    projectItem.querySelector('.start-btn').style.display = 'inline-block';
    projectItem.querySelector('.pause-btn').style.display = 'none';
    projectItem.querySelector('.end-btn').disabled = true;
    const statusSpan = projectItem.querySelector('.status');
    statusSpan.textContent = `Completed: ${logEntry.operation}`;
    statusSpan.style.textDecoration = 'line-through';

    pauseTimer(projectItem);
    resetTimer(projectItem);

    saveDataToLocalStorage();
  }

  function resetTimer(projectItem) {
    const timerSpan = projectItem.querySelector('.timer');
    timerSpan.setAttribute('data-timer', 0);
    timerSpan.textContent = '00:00:00';

    const projectId = projectItem.getAttribute('data-project-id');
    if (timers[projectId]) {
      timers[projectId].elapsed = 0;
      timers[projectId].startTime = Date.now();
    }
  }

  function copyProject(projectItem) {
    const projectName = projectItem.querySelector('h3').textContent;
    const purchaseOrder = projectItem.querySelector('.project-details p:nth-child(1)').textContent.split(': ')[1];
    const partNumber = projectItem.querySelector('.project-details p:nth-child(2)').textContent.split(': ')[1];
    const jobNumber = projectItem.querySelector('.project-details p:nth-child(3)').textContent.split(': ')[1];
    const dueDate = projectItem.querySelector('.project-details p:nth-child(4)').textContent.split(': ')[1];
    const quantity = projectItem.querySelector('.project-details p:nth-child(5)').textContent.split(': ')[1];
    const notes = projectItem.querySelector('.project-details p:nth-child(6)').textContent.split(': ')[1];
    const assignedEmployees = projectItem.querySelector('.project-details p:nth-child(7)').textContent.split(': ')[1];
    const priority = projectItem.querySelector('.priority').textContent.toLowerCase();

    const newProjectId = generateUniqueId();
    const copiedProjectItem = document.createElement('div');
    copiedProjectItem.className = 'project-bubble';
    copiedProjectItem.setAttribute('data-project-id', newProjectId);
    copiedProjectItem.innerHTML = `
      <h3>${projectName} (Copy)</h3>
      <div class="project-details">
        <p><strong>Purchase Order:</strong> ${purchaseOrder}</p>
        <p><strong>Part Number:</strong> ${partNumber}</p>
        <p><strong>Job Number:</strong> ${jobNumber}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <p><strong>Assigned Employees:</strong> ${assignedEmployees}</p>
        <p><strong>Priority:</strong> <span class="priority priority-${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span></p>
        <p><strong>Status:</strong> <span class="status">Not Started</span></p>
        <p><strong>Timer:</strong> <span class="timer" data-timer="0">00:00:00</span></p>
      </div>
      <div class="action-buttons">
        <button class="start-btn">Start</button>
        <button class="pause-btn" style="display: none;">Pause</button>
        <button class="end-btn" disabled>End</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="copy-btn">Copy</button>
        <button class="print-btn">Print</button>
      </div>
    `;
    projectItem.parentNode.insertBefore(copiedProjectItem, projectItem.nextSibling);

    attachEventListenersToProjectItem(copiedProjectItem);

    saveDataToLocalStorage();
  }

  function deleteWorkLog(index) {
    workLogs.splice(index, 1);
    loadWorkLogs();
    saveDataToLocalStorage();
  }

  function saveDataToLocalStorage() {
    const projectsData = Array.from(projectList.children).map(item => {
      const projectId = item.getAttribute('data-project-id');
      const projectDetails = item.querySelector('.project-details');
      return {
        id: projectId,
        name: item.querySelector('h3').textContent,
        purchaseOrder: projectDetails.querySelector('p:nth-child(1)').textContent.split(': ')[1],
        partNumber: projectDetails.querySelector('p:nth-child(2)').textContent.split(': ')[1],
        jobNumber: projectDetails.querySelector('p:nth-child(3)').textContent.split(': ')[1],
        dueDate: projectDetails.querySelector('p:nth-child(4)').textContent.split(': ')[1],
        quantity: projectDetails.querySelector('p:nth-child(5)').textContent.split(': ')[1],
        notes: projectDetails.querySelector('p:nth-child(6)').textContent.split(': ')[1],
        assignedEmployees: projectDetails.querySelector('p:nth-child(7)').textContent.split(': ')[1],
        priority: projectDetails.querySelector('.priority').textContent.toLowerCase(),
        status: projectDetails.querySelector('.status').textContent,
        startTime: projectDetails.querySelector('.status').getAttribute('data-start-time') || '',
        endTime: projectDetails.querySelector('.status').getAttribute('data-end-time') || '',
        pauses: projectDetails.querySelector('.status').getAttribute('data-pauses') ? JSON.parse(projectDetails.querySelector('.status').getAttribute('data-pauses')) : [],
        timer: projectDetails.querySelector('.timer').getAttribute('data-timer')
      };
    });

    localStorage.setItem('projects', JSON.stringify(projectsData));
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('workLogs', JSON.stringify(workLogs));
    localStorage.setItem('operations', JSON.stringify(operations));
  }

  function loadDataFromLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const savedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    operations = JSON.parse(localStorage.getItem('operations')) || [];
    timers = {};

    projectList.innerHTML = '';
    projects.forEach(project => {
      const projectItem = document.createElement('div');
      projectItem.className = 'project-bubble';
      projectItem.setAttribute('data-project-id', project.id);
      projectItem.innerHTML = `
        <h3>${project.name}</h3>
        <div class="project-details">
          <p><strong>Purchase Order:</strong> ${project.purchaseOrder}</p>
          <p><strong>Part Number:</strong> ${project.partNumber}</p>
          <p><strong>Job Number:</strong> ${project.jobNumber}</p>
          <p><strong>Due Date:</strong> ${project.dueDate}</p>
          <p><strong>Quantity:</strong> ${project.quantity}</p>
          <p><strong>Notes:</strong> ${project.notes}</p>
          <p><strong>Assigned Employees:</strong> ${project.assignedEmployees}</p>
          <p><strong>Priority:</strong> <span class="priority priority-${project.priority}">${project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}</span></p>
          <p><strong>Status:</strong> <span class="status" data-start-time="${project.startTime}" data-end-time="${project.endTime}" data-pauses='${JSON.stringify(project.pauses)}'>${project.status}</span></p>
          <p><strong>Timer:</strong> <span class="timer" data-timer="${project.timer}">${formatTime(project.timer)}</span></p>
        </div>
        <div class="action-buttons">
          <button class="start-btn" ${project.status === 'Completed' ? 'disabled' : ''}>Start</button>
          <button class="pause-btn" style="display: none;">Pause</button>
          <button class="end-btn" ${project.status !== 'In Progress' ? 'disabled' : ''}>End</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="copy-btn">Copy</button>
          <button class="print-btn">Print</button>
        </div>
      `;
      projectItem.addEventListener('click', (e) => {
        if (!e.target.classList.contains('start-btn') &&
          !e.target.classList.contains('pause-btn') &&
          !e.target.classList.contains('end-btn') &&
          !e.target.classList.contains('edit-btn') &&
          !e.target.classList.contains('delete-btn') &&
          !e.target.classList.contains('copy-btn') &&
          !e.target.classList.contains('print-btn')) {
          showSelectOperationModal(projectItem);
        }
      });
      projectList.appendChild(projectItem);

      attachEventListenersToProjectItem(projectItem);
      if (project.status.includes('In Progress')) {
        startTimer(projectItem);
      }
    });

    employeeList.innerHTML = '';
    savedEmployees.forEach(emp => {
      const employeeItem = document.createElement('li');
      employeeItem.innerHTML = `
        <span class="employee-name">${emp.name}</span>
        <button class="delete-btn">Delete</button>
      `;
      employeeList.appendChild(employeeItem);
    });

    employees = savedEmployees;

    loadOperations();
    attachEventListeners();
    loadWorkLogs();
    loadEmployees(); // Ensure employee select options are loaded
  }

  function loadWorkLogs() {
    workLogEntries.innerHTML = '';
    const groupedLogs = workLogs.reduce((acc, log) => {
      acc[log.project] = acc[log.project] || [];
      acc[log.project].push(log);
      return acc;
    }, {});

    Object.keys(groupedLogs).forEach(projectName => {
      const projectHeader = document.createElement('h3');
      projectHeader.textContent = projectName;
      workLogEntries.appendChild(projectHeader);

      groupedLogs[projectName].forEach((logEntry, index) => {
        const logEntryDiv = document.createElement('div');
        logEntryDiv.className = 'work-log-entry';
        logEntryDiv.innerHTML = `
          <p><strong>Operation:</strong> ${logEntry.operation}</p>
          <p><strong>Employees:</strong> ${logEntry.employees.join(', ')}</p>
          <p><strong>Start Time:</strong> ${new Date(logEntry.start).toLocaleString()}</p>
          <p><strong>End Time:</strong> ${new Date(logEntry.end).toLocaleString()}</p>
          <p><strong>Duration (hours):</strong> ${logEntry.duration ? logEntry.duration.toFixed(2) : ''}</p>
          ${logEntry.employees.map(employee => `<p><strong>${employee} Break Duration:</strong> ${logEntry.individualDurations[employee].duration.toFixed(2)} hours</p>`).join('')}
          <p><strong>Stopwatch Time:</strong> ${formatTime(logEntry.end - logEntry.start)}</p>
          <button class="delete-log-btn" data-index="${index}">Delete</button>
        `;
        logEntryDiv.querySelector('.delete-log-btn').addEventListener('click', () => deleteWorkLog(index));
        workLogEntries.appendChild(logEntryDiv);
      });
    });
  }

  // Function to filter projects by Purchase Order (PO)
  function filterProjects() {
    const searchTerm = projectSearchInput.value.toLowerCase();
    const projectItems = document.querySelectorAll('.project-bubble');
    projectItems.forEach(item => {
      const poText = item.querySelector('.project-details p:nth-child(1)').textContent.toLowerCase();
      item.style.display = poText.includes(searchTerm) ? 'block' : 'none';
    });
  }

  // Function to filter employees (optional, not related to PO)
  function filterEmployees() {
    const searchTerm = employeeSearchInput.value.toLowerCase();
    const employeeItems = document.querySelectorAll('#employees li');
    employeeItems.forEach(item => {
      const itemName = item.querySelector('.employee-name').textContent.toLowerCase();
      item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
    });
  }

  // Function to filter work logs by Purchase Order (PO)
  function filterWorkLogs() {
    const searchTerm = workLogSearchInput.value.toLowerCase();
    const workLogEntries = document.querySelectorAll('.work-log-entry');
    
    workLogEntries.forEach(entry => {
      const poText = entry.querySelector('p:nth-child(1)').textContent.toLowerCase();
      entry.style.display = poText.includes(searchTerm) ? 'block' : 'none';
    });
  }

  function attachEventListenersToProjectItem(projectItem) {
    const projectName = projectItem.querySelector('h3').textContent;

    projectItem.querySelector('.start-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showSelectOperationModal(projectItem);
    });
    projectItem.querySelector('.pause-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const pauseBtn = projectItem.querySelector('.pause-btn');
      if (pauseBtn.textContent === 'Pause') {
        pauseProjectOperation(projectItem);
      } else {
        resumeProjectOperation(projectItem);
      }
    });
    projectItem.querySelector('.end-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      endProject(projectItem);
    });
    projectItem.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const projectDetails = projectItem.querySelector('.project-details');
      const purchaseOrder = projectDetails.querySelector('p:nth-child(1)').textContent.split(': ')[1];
      const partNumber = projectDetails.querySelector('.project-details p:nth-child(2)').textContent.split(': ')[1];
      const jobNumber = projectDetails.querySelector('.project-details p:nth-child(3)').textContent.split(': ')[1];
      const dueDate = projectDetails.querySelector('.project-details p:nth-child(4)').textContent.split(': ')[1];
      const quantity = projectDetails.querySelector('.project-details p:nth-child(5)').textContent.split(': ')[1];
      const notes = projectDetails.querySelector('.project-details p:nth-child(6)').textContent.split(': ')[1];
      const assignedEmployees = projectDetails.querySelector('.project-details p:nth-child(7)').textContent.split(': ')[1].split(', ');
      const priority = projectDetails.querySelector('.priority').textContent.toLowerCase();
      editProject(projectItem, projectName, purchaseOrder, partNumber, jobNumber, dueDate, quantity, notes, assignedEmployees, priority);
    });
    projectItem.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      projectItem.remove();
      saveDataToLocalStorage();
    });
    projectItem.querySelector('.copy-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      copyProject(projectItem);
    });
    projectItem.querySelector('.print-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      printProjectDetails(projectItem);
    });
  }

  function attachEventListeners() {
    projectList.querySelectorAll('.project-bubble').forEach(projectItem => {
      attachEventListenersToProjectItem(projectItem);
    });
    employeeList.querySelectorAll('li').forEach(employeeItem => {
      const deleteBtn = employeeItem.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        const employeeName = employeeItem.querySelector('.employee-name').textContent;
        const employeeIndex = employees.findIndex(e => e.name === employeeName);
        if (employeeIndex !== -1) {
          employees.splice(employeeIndex, 1);
        }
        employeeItem.remove();
        saveDataToLocalStorage();
      });
    });
    settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'block';
    });
    closeSettingsModal.addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });
    addOperationBtn.addEventListener('click', () => {
      const newOperation = newOperationInput.value.trim();
      if (newOperation) {
        operations.push(newOperation);
        saveDataToLocalStorage();
        loadOperations();
        newOperationInput.value = '';
      }
    });
  }

  function loadOperations() {
    operationsList.innerHTML = '';
    operations.forEach((operation, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${operation}</span>
        <button class="delete-operation-btn" data-index="${index}">Delete</button>
      `;
      operationsList.appendChild(li);
    });

    document.querySelectorAll('.delete-operation-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        operations.splice(index, 1);
        saveDataToLocalStorage();
        loadOperations();
      });
    });

    // Reload operations in the select dropdown
    operationSelect.innerHTML = '';
    const noneOption = document.createElement('option');
    noneOption.value = '';
    noneOption.textContent = 'None';
    operationSelect.appendChild(noneOption);
    operations.forEach(operation => {
      const option = document.createElement('option');
      option.value = operation;
      option.textContent = operation;
      operationSelect.appendChild(option);
    });
  }

  function showProjectDetails(projectItem) {
    const projectName = projectItem.querySelector('h3').textContent;
    const projectDetails = projectItem.querySelector('.project-details');
    const purchaseOrder = projectDetails.querySelector('p:nth-child(1)').textContent.split(': ')[1];
    const partNumber = projectDetails.querySelector('.project-details p:nth-child(2)').textContent.split(': ')[1];
    const jobNumber = projectDetails.querySelector('.project-details p:nth-child(3)').textContent.split(': ')[1];
    const dueDate = projectDetails.querySelector('p:nth-child(4)').textContent.split(': ')[1];
    const quantity = projectDetails.querySelector('p:nth-child(5)').textContent.split(': ')[1];
    const notes = projectDetails.querySelector('p:nth-child(6)').textContent.split(': ')[1];
    const assignedEmployees = projectDetails.querySelector('p:nth-child(7)').textContent.split(': ')[1];
    const priority = projectDetails.querySelector('.priority').textContent.toLowerCase();
    const status = projectDetails.querySelector('.status').textContent;

    projectDetailsContent.innerHTML = `
      <div><strong>Project Name:</strong> ${projectName}</div>
      <div><strong>Purchase Order:</strong> ${purchaseOrder}</div>
      <div><strong>Part Number:</strong> ${partNumber}</div>
      <div><strong>Job Number:</strong> ${jobNumber}</div>
      <div><strong>Due Date:</strong> ${dueDate}</div>
      <div><strong>Quantity:</strong> ${quantity}</div>
      <div><strong>Notes:</strong> ${notes}</div>
      <div><strong>Assigned Employees:</strong> ${assignedEmployees}</div>
      <div><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)}</div>
      <div><strong>Status:</strong> ${status}</div>
    `;

    showProjectDetailsModal();
  }

  function printProjectDetails(projectItem) {
    const projectName = projectItem.querySelector('h3').textContent;
    const projectDetails = projectItem.querySelector('.project-details');
    const purchaseOrder = projectDetails.querySelector('p:nth-child(1)').textContent.split(': ')[1];
    const partNumber = projectDetails.querySelector('.project-details p:nth-child(2)').textContent.split(': ')[1];
    const jobNumber = projectDetails.querySelector('.project-details p:nth-child(3)').textContent.split(': ')[1];
    const dueDate = projectDetails.querySelector('p:nth-child(4)').textContent.split(': ')[1];
    const quantity = projectDetails.querySelector('p:nth-child(5)').textContent.split(': ')[1];
    const notes = projectDetails.querySelector('p:nth-child(6)').textContent.split(': ')[1];
    const assignedEmployees = projectDetails.querySelector('p:nth-child(7)').textContent.split(': ')[1];
    const priority = projectDetails.querySelector('.priority').textContent.toLowerCase();
    const status = projectDetails.querySelector('.status').textContent;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const printContents = `
      <div><strong>Project Name:</strong> ${projectName}</div>
      <div><strong>Purchase Order:</strong> ${purchaseOrder}</div>
      <div><strong>Part Number:</strong> ${partNumber}</div>
      <div><strong>Job Number:</strong> ${jobNumber}</div>
      <div><strong>Due Date:</strong> ${dueDate}</div>
      <div><strong>Quantity:</strong> ${quantity}</div>
      <div><strong>Notes:</strong> ${notes}</div>
      <div><strong>Assigned Employees:</strong> ${assignedEmployees}</div>
      <div><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)}</div>
      <div><strong>Status:</strong> ${status}</div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Project Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              margin: 20px;
            }
            div {
              font-size: 2em;
              margin: 20px 0;
            }
          </style>
        </head>
        <body> 
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  function clearAllData() {
    const password = prompt("Enter the password to clear all data:");
    if (password === "Pencilvester70@") {
      localStorage.clear();
      projectList.innerHTML = '';
      employeeList.innerHTML = '';
      workLogEntries.innerHTML = '';
      workLogs = [];
      employees = [];
      operations = [];
      timers = {};
      alert("All data has been cleared.");
    } else {
      alert("Incorrect password. Data not cleared.");
    }
  }

  function exportData() {
    const projectsData = Array.from(projectList.children).map(item => item.outerHTML);
    const data = {
      projects: projectsData,
      employees,
      workLogs,
      operations
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-management-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        localStorage.setItem('projects', JSON.stringify(data.projects));
        localStorage.setItem('employees', JSON.stringify(data.employees));
        localStorage.setItem('workLogs', JSON.stringify(data.workLogs));
        localStorage.setItem('operations', JSON.stringify(data.operations));
        loadDataFromLocalStorage();
      };
      reader.readAsText(file);
    }
  }

  // Function to adjust modal position when the keyboard is active
  function adjustModalForKeyboard(modal) {
    const screenHeight = window.innerHeight;
    const modalContent = modal.querySelector('.modal-content');

    // Adjust modal content height
    modalContent.style.maxHeight = `${screenHeight - 150}px`;
  }

  // Detect when the keyboard is shown and adjust the modal
  document.querySelectorAll('.modal-content input, .modal-content textarea').forEach(input => {
    input.addEventListener('focus', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        adjustModalForKeyboard(modal);
      }
    });
  });

  // Restore original modal height when the keyboard is hidden
  window.addEventListener('resize', () => {
    document.querySelectorAll('.modal-content').forEach(modalContent => {
      modalContent.style.maxHeight = '';
    });
  });

  window.addEventListener('orientationchange', () => {
    document.querySelectorAll('.modal-content').forEach(modalContent => {
      modalContent.style.maxHeight = '';
    });
  });

  printProjectDetailsBtn.addEventListener('click', printProjectDetails);
  clearDataBtn.addEventListener('click', clearAllData);
  exportDataBtn.addEventListener('click', exportData);
  importDataBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', importData);

  addProjectBtn.addEventListener('click', () => {
    loadEmployees();
    showProjectModal();
  });

  addEmployeeBtn.addEventListener('click', showEmployeeModal);
  closeProjectModal.addEventListener('click', hideProjectModal);
  closeEmployeeModal.addEventListener('click', hideEmployeeModal);
  closeProjectDetailsModal.addEventListener('click', hideProjectDetailsModal);
  closeSelectOperationModal.addEventListener('click', hideSelectOperationModal);
  saveProjectBtn.addEventListener('click', saveProject);
  saveEmployeeBtn.addEventListener('click', addEmployee);
  menuIcon.addEventListener('click', toggleSideMenu);
  showProjectListBtn.addEventListener('click', showProjectList);
  showEmployeeListBtn.addEventListener('click', showEmployeeList);
  showWorkLogBtn.addEventListener('click', showWorkLog);
  projectSearchInput.addEventListener('input', filterProjects);
  employeeSearchInput.addEventListener('input', filterEmployees);
  workLogSearchInput.addEventListener('input', filterWorkLogs);

  loadDataFromLocalStorage();
  showProjectList();
});

function loadOperationEmployees() {
  const operationEmployeesSelect = document.getElementById('operation-employees');
  operationEmployeesSelect.innerHTML = '';
  const employees = JSON.parse(localStorage.getItem('employees')) || [];
  employees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.name;
    option.textContent = employee.name;
    operationEmployeesSelect.appendChild(option);
  });
}
