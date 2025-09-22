// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    // Traffic Status Elements
    const trafficStatus = document.getElementById('traffic-status');
    const statusText = document.getElementById('status-text');
    
    // Traffic Light Control
    const intersectionSelect = document.getElementById('intersection-select');
    const lightRed = document.getElementById('light-red');
    const lightYellow = document.getElementById('light-yellow');
    const lightGreen = document.getElementById('light-green');
    const autoModeBtn = document.getElementById('auto-mode');
    const manualModeBtn = document.getElementById('manual-mode');
    
    // Timing Controls
    const greenTimeSlider = document.getElementById('green-time');
    const yellowTimeSlider = document.getElementById('yellow-time');
    const redTimeSlider = document.getElementById('red-time');
    const greenTimeValue = document.getElementById('green-time-value');
    const yellowTimeValue = document.getElementById('yellow-time-value');
    const redTimeValue = document.getElementById('red-time-value');
    
    // Emergency Controls
    const emergencyOverrideBtn = document.getElementById('emergency-override');
    const emergencyRouteSelect = document.getElementById('emergency-route');
    const activateRouteBtn = document.getElementById('activate-route');
    const emergencyStatus = document.getElementById('emergency-status');
    
    // Simulation Controls
    const trafficDensitySlider = document.getElementById('traffic-density');
    const timeOfDaySlider = document.getElementById('time-of-day');
    const weatherConditionSelect = document.getElementById('weather-condition');
    const densityValue = document.getElementById('density-value');
    const timeValue = document.getElementById('time-value');
    const startSimulationBtn = document.getElementById('start-simulation');
    const pauseSimulationBtn = document.getElementById('pause-simulation');
    const resetSimulationBtn = document.getElementById('reset-simulation');
    
    // Traffic Map Elements
    const roads = document.querySelectorAll('.road');
    
    // Chart Elements
    const trafficVolumeChart = document.getElementById('traffic-volume-chart');
    const speedChart = document.getElementById('speed-chart');
    const trafficTrendsChart = document.getElementById('traffic-trends-chart');
    const peakHoursChart = document.getElementById('peak-hours-chart');
    const trafficCompositionChart = document.getElementById('traffic-composition-chart');
    const weeklyComparisonChart = document.getElementById('weekly-comparison-chart');
    
    // Navigation Functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = document.querySelector(this.getAttribute('href'));
            targetSection.classList.add('active');
        });
    });
    
    // Initialize Traffic Status
    function updateTrafficStatus(status) {
        trafficStatus.className = 'status-light';
        
        switch(status) {
            case 'low':
                trafficStatus.classList.add('green');
                statusText.textContent = 'Low';
                break;
            case 'moderate':
                trafficStatus.classList.add('yellow');
                statusText.textContent = 'Moderate';
                break;
            case 'high':
                trafficStatus.classList.add('red');
                statusText.textContent = 'High';
                break;
        }
    }
    
    // Initialize Traffic Light Control
    let currentLight = 'red';
    let autoMode = true;
    let lightInterval;
    
    function startTrafficLightCycle() {
        if (!autoMode) return;
        
        clearInterval(lightInterval);
        
        const greenTime = parseInt(greenTimeSlider.value) * 1000;
        const yellowTime = parseInt(yellowTimeSlider.value) * 1000;
        const redTime = parseInt(redTimeSlider.value) * 1000;
        
        lightInterval = setInterval(() => {
            switch(currentLight) {
                case 'red':
                    setTrafficLight('green');
                    setTimeout(() => {
                        if (autoMode) setTrafficLight('yellow');
                    }, greenTime);
                    break;
                case 'yellow':
                    setTrafficLight('red');
                    break;
                case 'green':
                    setTrafficLight('yellow');
                    setTimeout(() => {
                        if (autoMode) setTrafficLight('red');
                    }, yellowTime);
                    break;
            }
        }, currentLight === 'red' ? redTime : 
           currentLight === 'yellow' ? yellowTime : greenTime);
    }
    
    function setTrafficLight(color) {
        lightRed.classList.remove('active');
        lightYellow.classList.remove('active');
        lightGreen.classList.remove('active');
        
        switch(color) {
            case 'red':
                lightRed.classList.add('active');
                currentLight = 'red';
                break;
            case 'yellow':
                lightYellow.classList.add('active');
                currentLight = 'yellow';
                break;
            case 'green':
                lightGreen.classList.add('active');
                currentLight = 'green';
                break;
        }
    }
    
    // Traffic Light Mode Controls
    autoModeBtn.addEventListener('click', function() {
        autoMode = true;
        autoModeBtn.classList.add('active');
        manualModeBtn.classList.remove('active');
        startTrafficLightCycle();
    });
    
    manualModeBtn.addEventListener('click', function() {
        autoMode = false;
        clearInterval(lightInterval);
        manualModeBtn.classList.add('active');
        autoModeBtn.classList.remove('active');
    });
    
    // Timing Controls Event Listeners
    greenTimeSlider.addEventListener('input', function() {
        greenTimeValue.textContent = this.value + 's';
        if (autoMode) startTrafficLightCycle();
    });
    
    yellowTimeSlider.addEventListener('input', function() {
        yellowTimeValue.textContent = this.value + 's';
        if (autoMode) startTrafficLightCycle();
    });
    
    redTimeSlider.addEventListener('input', function() {
        redTimeValue.textContent = this.value + 's';
        if (autoMode) startTrafficLightCycle();
    });
    
    // Emergency Controls
    let emergencyActive = false;
    
    emergencyOverrideBtn.addEventListener('click', function() {
        emergencyActive = !emergencyActive;
        
        if (emergencyActive) {
            clearInterval(lightInterval);
            setTrafficLight('green');
            emergencyOverrideBtn.textContent = 'Cancel Emergency';
            emergencyStatus.textContent = 'EMERGENCY MODE ACTIVE';
            emergencyStatus.style.backgroundColor = '#e74c3c';
            emergencyStatus.style.color = 'white';
        } else {
            emergencyOverrideBtn.textContent = 'Emergency Override';
            emergencyStatus.textContent = 'No active emergency routes';
            emergencyStatus.style.backgroundColor = '#ecf0f1';
            emergencyStatus.style.color = '#333';
            if (autoMode) startTrafficLightCycle();
        }
    });
    
    activateRouteBtn.addEventListener('click', function() {
        const selectedRoute = emergencyRouteSelect.value;
        emergencyStatus.textContent = `Route activated: ${emergencyRouteSelect.options[emergencyRouteSelect.selectedIndex].text}`;
        emergencyStatus.style.backgroundColor = '#f39c12';
        emergencyStatus.style.color = 'white';
        
        // Simulate route activation on map
        highlightEmergencyRoute(selectedRoute);
    });
    
    function highlightEmergencyRoute(routeId) {
        // Reset all roads
        roads.forEach(road => {
            road.querySelector('.traffic-indicator').style.backgroundColor = '';
        });
        
        // Highlight specific roads based on route
        if (routeId === 'route1') {
            document.querySelector('#road-1 .traffic-indicator').style.backgroundColor = '#3498db';
            document.querySelector('#road-4 .traffic-indicator').style.backgroundColor = '#3498db';
        } else if (routeId === 'route2') {
            document.querySelector('#road-2 .traffic-indicator').style.backgroundColor = '#3498db';
            document.querySelector('#road-5 .traffic-indicator').style.backgroundColor = '#3498db';
        } else if (routeId === 'route3') {
            document.querySelector('#road-3 .traffic-indicator').style.backgroundColor = '#3498db';
            document.querySelector('#road-6 .traffic-indicator').style.backgroundColor = '#3498db';
        }
    }
    
    // Simulation Controls
    let simulationRunning = false;
    let simulationInterval;
    
    trafficDensitySlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        let densityText;
        
        if (value <= 3) densityText = 'Low';
        else if (value <= 7) densityText = 'Medium';
        else densityText = 'High';
        
        densityValue.textContent = `${densityText} (${value})`;
    });
    
    timeOfDaySlider.addEventListener('input', function() {
        const hour = parseInt(this.value);
        const displayHour = hour < 10 ? '0' + hour : hour;
        timeValue.textContent = `${displayHour}:00`;
    });
    
    startSimulationBtn.addEventListener('click', function() {
        if (!simulationRunning) {
            simulationRunning = true;
            startSimulationBtn.textContent = 'Stop Simulation';
            pauseSimulationBtn.disabled = false;
            resetSimulationBtn.disabled = false;
            
            // Start simulation
            runTrafficSimulation();
        } else {
            simulationRunning = false;
            clearInterval(simulationInterval);
            startSimulationBtn.textContent = 'Start Simulation';
            pauseSimulationBtn.disabled = true;
            pauseSimulationBtn.textContent = 'Pause';
        }
    });
    
    pauseSimulationBtn.addEventListener('click', function() {
        if (this.textContent === 'Pause') {
            clearInterval(simulationInterval);
            this.textContent = 'Resume';
        } else {
            runTrafficSimulation();
            this.textContent = 'Pause';
        }
    });
    
    resetSimulationBtn.addEventListener('click', function() {
        clearInterval(simulationInterval);
        simulationRunning = false;
        startSimulationBtn.textContent = 'Start Simulation';
        pauseSimulationBtn.disabled = true;
        pauseSimulationBtn.textContent = 'Pause';
        resetSimulationBtn.disabled = true;
        
        // Reset traffic indicators
        roads.forEach(road => {
            road.querySelector('.traffic-indicator').style.backgroundColor = '';
        });
        
        // Reset traffic status
        updateTrafficStatus('moderate');
    });
    
    function runTrafficSimulation() {
        const density = parseInt(trafficDensitySlider.value);
        const timeOfDay = parseInt(timeOfDaySlider.value);
        const weather = weatherConditionSelect.value;
        
        simulationInterval = setInterval(() => {
            // Simulate traffic based on parameters
            simulateTraffic(density, timeOfDay, weather);
        }, 2000);
    }
    
    function simulateTraffic(density, timeOfDay, weather) {
        // Calculate traffic intensity based on parameters
        let baseIntensity = density / 10; // 0.1 to 1.0
        
        // Time of day factor (rush hours increase traffic)
        let timeFactors = {
            0: 0.3,  // Midnight
            1: 0.2,  // 1 AM
            2: 0.1,  // 2 AM
            3: 0.1,  // 3 AM
            4: 0.2,  // 4 AM
            5: 0.4,  // 5 AM
            6: 0.6,  // 6 AM
            7: 0.9,  // 7 AM
            8: 1.0,  // 8 AM (rush hour)
            9: 0.8,  // 9 AM
            10: 0.6, // 10 AM
            11: 0.5, // 11 AM
            12: 0.7, // Noon
            13: 0.6, // 1 PM
            14: 0.5, // 2 PM
            15: 0.6, // 3 PM
            16: 0.8, // 4 PM
            17: 1.0, // 5 PM (rush hour)
            18: 0.9, // 6 PM
            19: 0.7, // 7 PM
            20: 0.5, // 8 PM
            21: 0.4, // 9 PM
            22: 0.3, // 10 PM
            23: 0.2  // 11 PM
        };
        
        // Weather factor
        let weatherFactors = {
            'clear': 1.0,
            'rain': 1.2,
            'snow': 1.5,
            'fog': 1.3
        };
        
        let timeFactor = timeFactors[timeOfDay];
        let weatherFactor = weatherFactors[weather];
        
        // Calculate final traffic intensity
        let trafficIntensity = baseIntensity * timeFactor * weatherFactor;
        
        // Cap at 1.0
        trafficIntensity = Math.min(trafficIntensity, 1.0);
        
        // Update traffic status based on intensity
        if (trafficIntensity < 0.4) {
            updateTrafficStatus('low');
        } else if (trafficIntensity < 0.7) {
            updateTrafficStatus('moderate');
        } else {
            updateTrafficStatus('high');
        }
        
        // Update road colors based on traffic intensity
        roads.forEach(road => {
            // Random variation for each road
            let roadIntensity = trafficIntensity * (0.7 + Math.random() * 0.6);
            let color;
            
            if (roadIntensity < 0.4) {
                color = '#2ecc71'; // Green
            } else if (roadIntensity < 0.7) {
                color = '#f39c12'; // Yellow
            } else {
                color = '#e74c3c'; // Red
            }
            
            road.querySelector('.traffic-indicator').style.backgroundColor = color;
        });
    }
    
    // Initialize Charts
    function initializeCharts() {
        // Traffic Volume Chart
        new Chart(trafficVolumeChart, {
            type: 'line',
            data: {
                labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
                datasets: [{
                    label: 'Vehicles per hour',
                    data: [800, 1500, 1200, 1100, 1700, 900],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Speed Chart
        new Chart(speedChart, {
            type: 'bar',
            data: {
                labels: ['Main St', 'Broadway', 'Central', 'Park Rd', 'Market St'],
                datasets: [{
                    label: 'Average Speed (mph)',
                    data: [35, 28, 42, 30, 25],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Traffic Trends Chart
        new Chart(trafficTrendsChart, {
            type: 'line',
            data: {
                labels: ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
                datasets: [{
                    label: 'Today',
                    data: [200, 150, 100, 500, 1800, 1200, 1000, 900, 1500, 1700, 800, 400],
                    borderColor: '#3498db',
                    tension: 0.4
                }, {
                    label: 'Yesterday',
                    data: [250, 180, 120, 550, 1700, 1300, 950, 850, 1600, 1800, 750, 350],
                    borderColor: '#9b59b6',
                    tension: 0.4,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Vehicles per hour'
                        }
                    }
                }
            }
        });
        
        // Peak Hours Chart
        new Chart(peakHoursChart, {
            type: 'bar',
            data: {
                labels: ['7-9 AM', '11-1 PM', '4-6 PM'],
                datasets: [{
                    label: 'Traffic Volume',
                    data: [1700, 1100, 1800],
                    backgroundColor: ['#f39c12', '#2ecc71', '#e74c3c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Traffic Composition Chart
        new Chart(trafficCompositionChart, {
            type: 'doughnut',
            data: {
                labels: ['Cars', 'Buses', 'Trucks', 'Motorcycles', 'Bicycles'],
                datasets: [{
                    data: [65, 8, 12, 10, 5],
                    backgroundColor: ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
        // Weekly Comparison Chart
        new Chart(weeklyComparisonChart, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Average Daily Traffic',
                    data: [15000, 14500, 15200, 14800, 16500, 12000, 9000],
                    backgroundColor: '#3498db'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Initialize the application
    function init() {
        // Set default traffic status
        updateTrafficStatus('moderate');
        
        // Initialize traffic light
        setTrafficLight('red');
        startTrafficLightCycle();
        
        // Initialize charts
        initializeCharts();
    }
    
    // Start the application
    init();
});
