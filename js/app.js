// Productivity Dashboard Application

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'productivity-dashboard-tasks',
  QUICK_LINKS: 'productivity-dashboard-quick-links',
  THEME: 'productivity-dashboard-theme',
  USER_NAME: 'productivity-dashboard-user-name',
  SORT_METHOD: 'productivity-dashboard-sort-method'
};

// Constants
const DEFAULT_TIMER_SECONDS = 1500; // 25 minutes

// StorageUtil - Local Storage wrapper with error handling
class StorageUtil {
  static save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please clear some data.');
      } else {
        console.error('Failed to save to storage:', error);
      }
      return false;
    }
  }

  static load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return defaultValue;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from storage:', error);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  static isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// DOMUtil - DOM manipulation helpers
class DOMUtil {
  static createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
    
    return element;
  }

  static query(selector, parent = document) {
    return parent.querySelector(selector);
  }

  static queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  static addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
  }

  static removeEventListener(element, event, handler) {
    element.removeEventListener(event, handler);
  }

  static empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}



// GreetingWidget - Displays time, date, and greeting
class GreetingWidget {
  constructor(containerElement, storageKey) {
    this.container = containerElement;
    this.storageKey = storageKey;
    this.intervalId = null;
    this.userName = null;
  }

  init() {
    this.loadUserName();
    this.render();
    this.updateDisplay();
    this.intervalId = setInterval(() => this.updateDisplay(), 1000);
  }

  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    return `${dayName}, ${monthName} ${day}`;
  }

  updateDisplay() {
    const now = new Date();
    const timeEl = DOMUtil.query('.time', this.container);
    const dateEl = DOMUtil.query('.date', this.container);
    const greetingEl = DOMUtil.query('.greeting', this.container);
    
    if (timeEl) timeEl.textContent = this.formatTime(now);
    if (dateEl) dateEl.textContent = this.formatDate(now);
    if (greetingEl) greetingEl.textContent = this.getGreeting(now.getHours(), this.userName);
  }

  render() {
    this.container.innerHTML = `
      <div class="time"></div>
      <div class="date"></div>
      <div class="greeting"></div>
      <form class="name-form">
        <input type="text" class="name-input" placeholder="Enter your name (optional)" value="${this.userName || ''}">
        <button type="submit">Save</button>
        <button type="button" class="btn-clear">Clear</button>
      </form>
    `;
    
    const form = DOMUtil.query('.name-form', this.container);
    const input = DOMUtil.query('.name-input', this.container);
    const clearBtn = DOMUtil.query('.btn-clear', this.container);
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.setUserName(input.value);
    });
    
    clearBtn.addEventListener('click', () => {
      input.value = '';
      this.setUserName(null);
    });
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadUserName() {
    this.userName = StorageUtil.load(this.storageKey, null);
  }

  saveUserName() {
    if (this.userName && this.userName.trim()) {
      StorageUtil.save(this.storageKey, this.userName.trim());
    } else {
      StorageUtil.remove(this.storageKey);
    }
  }

  setUserName(name) {
    this.userName = name ? name.trim() : null;
    this.saveUserName();
    this.updateDisplay();
  }

  getGreeting(hour, userName) {
    let greeting;
    if (hour >= 5 && hour <= 11) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour <= 16) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    
    if (userName && userName.trim()) {
      return `${greeting}, ${userName}`;
    }
    return greeting;
  }
}



// TimerWidget - 25-minute countdown timer
class TimerWidget {
  constructor(containerElement) {
    this.container = containerElement;
    this.remainingSeconds = DEFAULT_TIMER_SECONDS;
    this.isRunning = false;
    this.intervalId = null;
  }

  init() {
    this.render();
    this.updateDisplay();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minsStr = mins < 10 ? '0' + mins : mins;
    const secsStr = secs < 10 ? '0' + secs : secs;
    return `${minsStr}:${secsStr}`;
  }

  updateDisplay() {
    const display = DOMUtil.query('.timer-display', this.container);
    if (display) {
      display.textContent = this.formatTime(this.remainingSeconds);
    }
  }

  render() {
    this.container.innerHTML = `
      <h2 class="widget-title">Focus Timer</h2>
      <div class="timer-display">25:00</div>
      <div class="timer-controls">
        <button class="btn-start">Start</button>
        <button class="btn-stop">Stop</button>
        <button class="btn-reset">Reset</button>
      </div>
    `;
    
    const startBtn = DOMUtil.query('.btn-start', this.container);
    const stopBtn = DOMUtil.query('.btn-stop', this.container);
    const resetBtn = DOMUtil.query('.btn-reset', this.container);
    
    startBtn.addEventListener('click', () => this.start());
    stopBtn.addEventListener('click', () => this.stop());
    resetBtn.addEventListener('click', () => this.reset());
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.remainingSeconds = DEFAULT_TIMER_SECONDS;
    this.updateDisplay();
  }

  tick() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.updateDisplay();
    } else {
      this.stop();
    }
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}



// TaskManager - Task CRUD operations with sorting
class TaskManager {
  constructor(containerElement, storageKey, sortMethodKey) {
    this.container = containerElement;
    this.storageKey = storageKey;
    this.sortMethodKey = sortMethodKey;
    this.tasks = [];
    this.sortMethod = 'created';
  }

  init() {
    this.loadTasks();
    this.loadSortMethod();
    this.render();
  }

  loadTasks() {
    this.tasks = StorageUtil.load(this.storageKey, []);
  }

  saveTasks() {
    StorageUtil.save(this.storageKey, this.tasks);
  }

  loadSortMethod() {
    this.sortMethod = StorageUtil.load(this.sortMethodKey, 'created');
  }

  saveSortMethod() {
    StorageUtil.save(this.sortMethodKey, this.sortMethod);
  }

  addTask(text, dueDate = null) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const task = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
      dueDate: dueDate || null
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
  }

  editTask(id, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = trimmedText;
      this.saveTasks();
      this.renderTasks();
    }
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  }

  setSortMethod(method) {
    this.sortMethod = method;
    this.saveSortMethod();
    this.renderTasks();
  }

  sortTasks(tasks, method) {
    const sorted = [...tasks];
    
    if (method === 'created') {
      sorted.sort((a, b) => a.createdAt - b.createdAt);
    } else if (method === 'dueDate') {
      sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return a.createdAt - b.createdAt;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (method === 'alphabetical') {
      sorted.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
    }
    
    return sorted;
  }

  render() {
    this.container.innerHTML = `
      <h2 class="widget-title">Tasks</h2>
      <form class="task-form">
        <input type="text" class="task-input" placeholder="Add a new task..." required>
        <input type="date" class="task-date" placeholder="Due date (optional)">
        <button type="submit">Add</button>
      </form>
      <div class="sort-controls">
        <label>Sort by:</label>
        <select class="sort-select">
          <option value="created">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>
      <ul class="task-list"></ul>
    `;

    const form = DOMUtil.query('.task-form', this.container);
    const taskInput = DOMUtil.query('.task-input', this.container);
    const taskDate = DOMUtil.query('.task-date', this.container);
    const sortSelect = DOMUtil.query('.sort-select', this.container);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTask(taskInput.value, taskDate.value);
      taskInput.value = '';
      taskDate.value = '';
    });

    sortSelect.value = this.sortMethod;
    sortSelect.addEventListener('change', (e) => {
      this.setSortMethod(e.target.value);
    });

    this.renderTasks();
  }

  renderTasks() {
    const taskList = DOMUtil.query('.task-list', this.container);
    if (!taskList) return;

    DOMUtil.empty(taskList);

    const sortedTasks = this.sortTasks(this.tasks, this.sortMethod);

    sortedTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => this.toggleTask(task.id));

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;

      const dueDateSpan = document.createElement('span');
      dueDateSpan.className = 'task-due-date';
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        dueDateSpan.textContent = `Due: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-edit';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null) {
          this.editTask(task.id, newText);
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      if (task.dueDate) li.appendChild(dueDateSpan);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      taskList.appendChild(li);
    });
  }

  destroy() {
    // Cleanup if needed
  }
}



// QuickLinksManager - Favorite website link management
class QuickLinksManager {
  constructor(containerElement, storageKey) {
    this.container = containerElement;
    this.storageKey = storageKey;
    this.links = [];
  }

  init() {
    this.loadLinks();
    this.render();
  }

  loadLinks() {
    this.links = StorageUtil.load(this.storageKey, []);
  }

  saveLinks() {
    StorageUtil.save(this.storageKey, this.links);
  }

  addLink(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    
    if (!trimmedName || !trimmedUrl) return;
    
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      alert('URL must start with http:// or https://');
      return;
    }

    const link = {
      id: Date.now().toString(),
      name: trimmedName,
      url: trimmedUrl
    };

    this.links.push(link);
    this.saveLinks();
    this.renderLinks();
  }

  deleteLink(id) {
    this.links = this.links.filter(l => l.id !== id);
    this.saveLinks();
    this.renderLinks();
  }

  openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  render() {
    this.container.innerHTML = `
      <h2 class="widget-title">Quick Links</h2>
      <form class="link-form">
        <input type="text" class="link-name" placeholder="Link name" required>
        <input type="url" class="link-url" placeholder="https://example.com" required>
        <button type="submit">Add Link</button>
      </form>
      <div class="links-container"></div>
    `;

    const form = DOMUtil.query('.link-form', this.container);
    const nameInput = DOMUtil.query('.link-name', this.container);
    const urlInput = DOMUtil.query('.link-url', this.container);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addLink(nameInput.value, urlInput.value);
      nameInput.value = '';
      urlInput.value = '';
    });

    this.renderLinks();
  }

  renderLinks() {
    const linksContainer = DOMUtil.query('.links-container', this.container);
    if (!linksContainer) return;

    DOMUtil.empty(linksContainer);

    this.links.forEach(link => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      linkItem.dataset.id = link.id;

      const linkButton = document.createElement('button');
      linkButton.className = 'link-button';
      linkButton.textContent = link.name;
      linkButton.addEventListener('click', () => this.openLink(link.url));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete-link';
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', () => this.deleteLink(link.id));

      linkItem.appendChild(linkButton);
      linkItem.appendChild(deleteBtn);
      linksContainer.appendChild(linkItem);
    });
  }

  destroy() {
    // Cleanup if needed
  }
}

// ThemeManager - Light/dark theme switching
class ThemeManager {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.currentTheme = 'light';
  }

  init() {
    this.loadTheme();
    this.applyTheme(this.currentTheme);
    this.setupToggle();
  }

  loadTheme() {
    this.currentTheme = StorageUtil.load(this.storageKey, 'light');
  }

  saveTheme() {
    StorageUtil.save(this.storageKey, this.currentTheme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.saveTheme();
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    this.updateToggleIcon();
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  setupToggle() {
    const toggleBtn = DOMUtil.query('.btn-theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  updateToggleIcon() {
    const sunIcon = DOMUtil.query('.icon-sun');
    const moonIcon = DOMUtil.query('.icon-moon');
    
    if (this.currentTheme === 'light') {
      if (sunIcon) sunIcon.style.display = 'inline';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'inline';
    }
  }

  destroy() {
    // Cleanup if needed
  }
}

// Main initialization
function initApp() {
  try {
    // Check Local Storage availability
    if (!StorageUtil.isAvailable()) {
      console.warn('Local Storage is not available. Data will not persist.');
    }

    // Initialize theme first
    const themeManager = new ThemeManager(STORAGE_KEYS.THEME);
    themeManager.init();

    // Initialize widgets
    const greetingContainer = document.getElementById('greeting-container');
    if (greetingContainer) {
      const greetingWidget = new GreetingWidget(greetingContainer, STORAGE_KEYS.USER_NAME);
      greetingWidget.init();
    }

    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
      const timerWidget = new TimerWidget(timerContainer);
      timerWidget.init();
    }

    const taskContainer = document.getElementById('task-container');
    if (taskContainer) {
      const taskManager = new TaskManager(taskContainer, STORAGE_KEYS.TASKS, STORAGE_KEYS.SORT_METHOD);
      taskManager.init();
    }

    const quickLinksContainer = document.getElementById('quick-links-container');
    if (quickLinksContainer) {
      const quickLinksManager = new QuickLinksManager(quickLinksContainer, STORAGE_KEYS.QUICK_LINKS);
      quickLinksManager.init();
    }

  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    alert('Failed to initialize the dashboard. Please refresh the page.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
