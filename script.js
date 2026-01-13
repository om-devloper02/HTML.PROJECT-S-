// Career Database
const careers = [
    {
        title: "🤖 AI/ML Engineer",
        description: "Design and develop artificial intelligence and machine learning models",
        salary: "$90K - $150K/year",
        skills: ["python", "ai", "datascience", "statistics"]
    },
    {
        title: "📊 Data Scientist",
        description: "Analyze complex data and extract valuable insights",
        salary: "$85K - $140K/year",
        skills: ["python", "datascience", "sql", "dataanalysis", "statistics"]
    },
    {
        title: "💻 Full Stack Developer",
        description: "Build complete web applications from front to back",
        salary: "$75K - $130K/year",
        skills: ["html", "css", "javascript", "nodejs", "sql", "react"]
    },
    {
        title: "🎨 Frontend Developer",
        description: "Create beautiful and responsive user interfaces",
        salary: "$70K - $120K/year",
        skills: ["html", "css", "javascript", "react"]
    },
    {
        title: "⚙️ Backend Developer",
        description: "Build server-side logic and manage databases",
        salary: "$75K - $125K/year",
        skills: ["python", "sql", "nodejs", "mongodb"]
    },
    {
        title: "☕ Java Developer",
        description: "Develop enterprise applications using Java",
        salary: "$75K - $120K/year",
        skills: ["java", "sql", "git"]
    },
    {
        title: "☁️ DevOps Engineer",
        description: "Automate and optimize development workflows",
        salary: "$85K - $140K/year",
        skills: ["docker", "git", "python"]
    },
    {
        title: "🗄️ Database Administrator",
        description: "Manage and optimize database systems",
        salary: "$70K - $115K/year",
        skills: ["sql", "mongodb", "python"]
    }
];

// Suggest Career Function
function suggestCareer() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedSkills = Array.from(checkboxes).map(cb => cb.value);
    const studentName = document.getElementById('studentName').value;

    if (selectedSkills.length === 0) {
        alert('⚠️ Please select at least one skill!');
        return;
    }

    // Find matching careers
    const matches = [];
    
    careers.forEach(career => {
        const matchedSkills = career.skills.filter(skill => selectedSkills.includes(skill));
        const matchPercentage = Math.round((matchedSkills.length / career.skills.length) * 100);
        
        if (matchPercentage >= 40) {
            matches.push({
                ...career,
                matchPercentage,
                matchedCount: matchedSkills.length
            });
        }
    });

    // Sort by match percentage
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Display results
    displayResults(matches, studentName, selectedSkills);
}

// Display Results
function displayResults(matches, name, skills) {
    const resultDiv = document.getElementById('result');
    
    if (matches.length === 0) {
        resultDiv.innerHTML = `
            <h3>Career Suggestions</h3>
            <div class="no-match">
                <h4>❗ No strong matches found</h4>
                <p>Try selecting more skills to get better recommendations</p>
            </div>
        `;
        resultDiv.classList.add('show');
        return;
    }

    let html = '<h3>Career Suggestions</h3>';
    
    if (name) {
        html += `<p class="greeting">Hi ${name}! Here are your career matches:</p>`;
    } else {
        html += `<p class="greeting">Based on your ${skills.length} selected skill(s):</p>`;
    }

    matches.forEach((career, index) => {
        html += `
            <div class="career-card">
                <h4>${index + 1}. ${career.title}</h4>
                <p>${career.description}</p>
                <p class="salary">💰 ${career.salary}</p>
                <span class="match">${career.matchPercentage}% Match</span>
            </div>
        `;
    });

    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
    
    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}