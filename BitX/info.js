function runInfoScript() {
    return new Promise((resolve) => {
        const infoData = {
            "status": "success",
            "message": "Welcome to our API! Here are some important details:",
            "data": {
                "team_members": [
                    {
                        "name": "Nethindu Thaminda",
                        "role": "Lead Developer 🖥️",
                        "bio": "Nethindu is a passionate software engineer with experience in web development, machine learning, and system architecture.",
                        "skills": ["JavaScript", "Node.js", "MongoDB", "React", "Python"],
                        "contact": {
                            "email": "nethindu@example.com",
                            "linkedin": "https://linkedin.com/in/nethinduthaminda"
                        }
                    },
                    {
                        "name": "Jithula Bashitha",
                        "role": "Lead Developer😎",
                        "bio": "Jithula is an experienced UI/UX designer, focusing on creating visually appealing and user-friendly interfaces.",
                        "skills": ["JavaScript", "Node.js", "MongoDB", "React", "Python"],
                        "contact": {
                            "email": "jithula@example.com",
                            "linkedin": "https://linkedin.com/in/jithulabashitha"
                        }
                    }
                ],
                "project_details": {
                    "name": "Tech Innovations 🚀",
                    "description": "A cutting-edge platform aimed at solving real-world problems using technology.",
                    "status": "In Progress 🛠️",
                    "expected_launch": "2025-12-01"
                }
            },
            "footer": {
                "note": "Stay tuned for more updates! ✨",
                "social_media": {
                    "twitter": "https://twitter.com/TechInnovations 🐦",
                    "facebook": "https://facebook.com/TechInnovations 📘",
                    "instagram": "https://instagram.com/TechInnovations 📸"
                }
            }
        };
        resolve(infoData);
    });
}

module.exports = { runInfoScript };
