// Global Variables
let currentSection = 0;
let isVoiceEnabled = false;
let chatBotMinimized = true;

const sections = ['home', 'about', 'experience', 'skills', 'projects', 'certificates', 'contact', 'cv'];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeKeyboardNavigation();
    initializeChatbot();
    initializeContactForm();
    initializeScrollAnimations();
    initializeStatsAnimation();
    setTimeout(showSmartPopup, 8000);
});

// Enhanced Navigation Functions
function initializeNavigation() {
    // Update active nav link on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            updateCurrentSection(targetId);
        });
    });
    
    // Right side navigation dots
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSection(sections[index]);
            updateCurrentSection(sections[index]);
        });
    });
    
    // Initialize current section
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150; // Adjusted offset for better detection
    let activeSection = 'home'; // Default to home
    
    // Find the current section based on scroll position
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if we're in this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
                currentSection = index;
            }
        }
    });
    
    // Update navbar active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeNavLink = document.querySelector(`[href="#${activeSection}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
    
    // Update right nav dots active state
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    const activeDot = document.querySelector(`[data-section="${activeSection}"]`);
    if (activeDot) {
        activeDot.classList.add('active');
    }
}

function updateCurrentSection(sectionId) {
    const index = sections.indexOf(sectionId);
    if (index !== -1) {
        currentSection = index;
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Calculate offset to account for fixed navbar
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.offsetTop - navbarHeight - 20; // 20px extra padding
        
        // Smooth scroll to position
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active states immediately for better UX
        setTimeout(() => {
            updateCurrentSection(sectionId);
            updateActiveNavLink();
        }, 100);
    }
}

function navigateSection(direction) {
    const newIndex = currentSection + direction;
    
    // Ensure we stay within bounds
    if (newIndex >= 0 && newIndex < sections.length) {
        const targetSection = sections[newIndex];
        scrollToSection(targetSection);
        currentSection = newIndex;
        
        // Add visual feedback to navigation arrows
        const arrow = direction > 0 ? 
            document.querySelector('.down-arrow') : 
            document.querySelector('.up-arrow');
        
        if (arrow) {
            arrow.style.transform = 'scale(1.2)';
            arrow.style.background = '#b08a65';
            arrow.style.color = '#111111';
            
            setTimeout(() => {
                arrow.style.transform = 'scale(1)';
                arrow.style.background = 'rgba(16, 16, 16, 0.8)';
                arrow.style.color = '#b08a65';
            }, 200);
        }
    }
}

// Add keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Only handle navigation if chatbot is not focused
        const chatInput = document.getElementById('chatbot-input-field');
        const isInputFocused = document.activeElement === chatInput;
        
        if (!isInputFocused) {
            switch(e.key) {
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    navigateSection(-1);
                    break;
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    navigateSection(1);
                    break;
                case 'Home':
                    e.preventDefault();
                    scrollToSection('home');
                    break;
                case 'End':
                    e.preventDefault();
                    scrollToSection('cv');
                    break;
            }
        }
    });
}

// Enhanced Chatbot Functions
let messageCount = 0;
let smartSuggestions = [
    "What makes Siya unique as a developer?",
    "Tell me about his AI projects",
    "What programming languages does he know?",
    "How can I contact Siya?",
    "Show me his latest achievements"
];

function initializeChatbot() {
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbot = document.getElementById('chatbot');
    const chatInput = document.getElementById('chatbot-input-field');
    
    // Show smart popup after 8 seconds
    setTimeout(showSmartPopup, 8000);
    
    // Enhanced input handling
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Input focus effects
    chatInput.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'rgba(176, 138, 101, 0.5)';
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(176, 138, 101, 0.1)';
    });
    
    chatInput.addEventListener('blur', function() {
        this.parentElement.style.borderColor = 'rgba(176, 138, 101, 0.2)';
        this.parentElement.style.boxShadow = 'none';
    });
    
    // Smart suggestions on input
    chatInput.addEventListener('input', function() {
        handleSmartSuggestions(this.value);
    });
    
    // Click outside to minimize
    document.addEventListener('click', function(e) {
        if (!chatbot.contains(e.target) && !chatbotBubble.contains(e.target)) {
            if (!chatBotMinimized) {
                minimizeChatbot();
            }
        }
    });
    
    // Initialize bubble notification rotation
    rotateBubbleNotifications();
}

function showSmartPopup() {
    const popup = document.getElementById('chatbot-popup');
    if (chatBotMinimized) {
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 6000);
    }
}

function hideSmartPopup() {
    const popup = document.getElementById('chatbot-popup');
    popup.classList.remove('show');
}

function openChatbot() {
    const chatbot = document.getElementById('chatbot');
    const bubble = document.getElementById('chatbot-bubble');
    const chatInput = document.getElementById('chatbot-input-field');
    const quickActions = document.getElementById('quick-actions');
    
    if (chatBotMinimized) {
        chatbot.style.display = 'flex';
        bubble.style.display = 'none';
        chatBotMinimized = false;
        
        // Show quick actions for first-time users
        if (messageCount === 0) {
            quickActions.style.display = 'flex';
        }
        
        // Focus input after animation
        setTimeout(() => {
            chatInput.focus();
        }, 400);
        
        // Hide smart popup
        hideSmartPopup();
    } else {
        chatInput.focus();
    }
}

function minimizeChatbot() {
    const chatbot = document.getElementById('chatbot');
    const bubble = document.getElementById('chatbot-bubble');
    
    chatbot.style.display = 'none';
    bubble.style.display = 'block';
    chatBotMinimized = true;
}

function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const voiceIcon = document.getElementById('voice-icon');
    
    if (isVoiceEnabled) {
        voiceIcon.className = 'fas fa-volume-up';
        voiceIcon.parentElement.title = 'Voice Enabled';
        showToast('🔊 Voice responses enabled', 'success');
    } else {
        voiceIcon.className = 'fas fa-volume-mute';
        voiceIcon.parentElement.title = 'Voice Disabled';
        showToast('🔇 Voice responses disabled', 'success');
        // Stop any current speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}

function clearChat() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="bot-avatar-small">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble bot-bubble">
                    <div class="message-text">
                        👋 <strong>Welcome back!</strong> I'm SiyaBot, your AI-powered portfolio assistant.
                        <br><br>
                        Ready to explore Siyasanga's amazing work? Ask me anything!
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        </div>
    `;
    messageCount = 0;
    
    // Show quick actions again
    const quickActions = document.getElementById('quick-actions');
    quickActions.style.display = 'flex';
    
    showToast('💬 Chat cleared', 'success');
}

function sendQuickMessage(message) {
    const input = document.getElementById('chatbot-input-field');
    input.value = message;
    sendMessage();
    
    // Hide quick actions after first use
    const quickActions = document.getElementById('quick-actions');
    quickActions.style.display = 'none';
}

function handleSmartSuggestions(inputValue) {
    const suggestionsContainer = document.getElementById('smart-suggestions');
    const suggestionsList = document.getElementById('suggestions-list');
    
    if (inputValue.length > 2) {
        const relevantSuggestions = smartSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) ||
            inputValue.toLowerCase().split(' ').some(word => 
                suggestion.toLowerCase().includes(word)
            )
        ).slice(0, 3);
        
        if (relevantSuggestions.length > 0) {
            suggestionsList.innerHTML = relevantSuggestions.map(suggestion => 
                `<button class="suggestion-btn" onclick="applySuggestion('${suggestion}')">${suggestion}</button>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

function applySuggestion(suggestion) {
    const input = document.getElementById('chatbot-input-field');
    input.value = suggestion;
    sendMessage();
    document.getElementById('smart-suggestions').style.display = 'none';
}

function rotateBubbleNotifications() {
    const notifications = [
        "💬 Ask me about Siya!",
        "🚀 Explore his projects!",
        "💡 Discover his skills!",
        "📧 Get contact info!",
        "🎯 Learn about his experience!"
    ];
    
    let currentIndex = 0;
    const bubbleNotification = document.getElementById('bubble-notification');
    
    if (bubbleNotification && chatBotMinimized) {
        setInterval(() => {
            if (chatBotMinimized) {
                bubbleNotification.innerHTML = `<span>${notifications[currentIndex]}</span>`;
                currentIndex = (currentIndex + 1) % notifications.length;
            }
        }, 4000);
    }
}

async function sendMessage() {
    const input = document.getElementById('chatbot-input-field');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        input.value = '';
        messageCount++;
        
        // Hide quick actions after first message
        if (messageCount === 1) {
            document.getElementById('quick-actions').style.display = 'none';
        }
        
        // Hide suggestions
        document.getElementById('smart-suggestions').style.display = 'none';
        
        // Show enhanced typing animation
        showEnhancedTypingAnimation();
        
        try {
            // Generate AI-powered response
            const response = await generateBotResponse(message);
            hideEnhancedTypingAnimation();
            addMessage(response, 'bot');
            
            // Speak response if voice is enabled
            if (isVoiceEnabled) {
                speakText(response);
            }
            
            // Update smart suggestions based on conversation
            updateSmartSuggestions(message, response);
            
        } catch (error) {
            console.error('Error generating response:', error);
            hideEnhancedTypingAnimation();
            addMessage("I'm experiencing some technical difficulties right now. Please try asking about Siya's background, projects, or experience!", 'bot');
        }
    }
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageGroup = document.createElement('div');
    messageGroup.className = sender === 'user' ? 'message-group user-message-group' : 'message-group';
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageGroup.innerHTML = `
        <div class="${sender === 'user' ? 'user-avatar-small' : 'bot-avatar-small'}">
            <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}">
                <div class="message-text">${message}</div>
                <div class="message-time">${currentTime}</div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageGroup);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add entrance animation
    messageGroup.style.opacity = '0';
    messageGroup.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        messageGroup.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        messageGroup.style.opacity = '1';
        messageGroup.style.transform = 'translateY(0)';
    });
}

function showEnhancedTypingAnimation() {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'flex';
    
    // Add typing animation to messages area
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message-group typing-message';
    typingDiv.id = 'typing-message';
    
    typingDiv.innerHTML = `
        <div class="bot-avatar-small">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble bot-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideEnhancedTypingAnimation() {
    const typingIndicator = document.getElementById('typing-indicator');
    const typingMessage = document.getElementById('typing-message');
    
    typingIndicator.style.display = 'none';
    
    if (typingMessage) {
        typingMessage.remove();
    }
}

function updateSmartSuggestions(userMessage, botResponse) {
    // Dynamic suggestion updates based on conversation context
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('project')) {
        smartSuggestions = [
            "Tell me more about the AI Bias Report project",
            "What technologies did he use for CropGuard?",
            "How does the Sentiment Analysis Dashboard work?",
            "Show me his GitHub repositories",
            "What's his most challenging project?"
        ];
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
        smartSuggestions = [
            "What programming languages is he best at?",
            "Does he have experience with cloud platforms?",
            "Tell me about his AI and ML skills",
            "What no-code tools does he use?",
            "How experienced is he with data engineering?"
        ];
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
        smartSuggestions = [
            "What's the best way to contact Siya?",
            "Is he available for freelance work?",
            "Can I see his LinkedIn profile?",
            "Does he have a portfolio website?",
            "How can I collaborate with him?"
        ];
    }
}

// Comprehensive Portfolio knowledge base for AI responses
const portfolioKnowledge = {
    personal: {
        name: "Siyasanga Mankayi",
        age: 25,
        birthday: "11 September 2000",
        gender: "Male",
        location: "Cape Town, South Africa",
        languages: "English (Fluent), Zulu (Fluent), Xhosa (Native)",
        email: "siyasangamankayi147@gmail.com",
        phone: "0691764940",
        linkedin: "https://www.linkedin.com/in/siyasanga-mankayi-8a86b636b/",
        github: "https://github.com/SiyasangaMankayi"
    },
    education: {
        timeline: "Completed Grade 12 in 2018, earned Higher Certificate in IT, progressed into BSc in IT with all coursework completed",
        grade12: {
            school: "Willowvale Senior Secondary School",
            year: "2018",
            status: "Completed"
        },
        higherCertificate: {
            institution: "Richfield Graduate Institute of Technology",
            qualification: "Higher Certificate in Information Technology",
            year: "2019",
            status: "Completed"
        },
        bscIT: {
            institution: "Richfield Graduate Institute of Technology",
            qualification: "BSc in Information Technology",
            period: "2020-2023",
            status: "All coursework completed, only project and work-integrated learning components remaining",
            note: "Despite financial challenges delaying completion, has full academic record and plans to finalize degree soon"
        }
    },
    experience: {
        current: {
            position: "CAPACITI Learnership Programme",
            period: "September 2025 - Present",
            description: "Building hands-on expertise in data engineering, cloud technologies, automation, and AI-driven solutions",
            achievements: [
                "Worked on real industry projects involving data pipelines",
                "Experience with structured and unstructured datasets",
                "Tools powering digital transformation",
                "Collaborating in agile teams",
                "Designing efficient, scalable, and business-aligned solutions",
                "Boosted technical confidence and problem-solving skills",
                "Gained practical insight into technology's real-world impact"
            ]
        }
    },
    skills: {
        technical: [
            "Full-Stack Web Development: React, Node.js, Vite, HTML, CSS, JavaScript, PHP, responsive web design",
            "Data Engineering: Data pipelines, ETL processes, structured & unstructured datasets",
            "Cloud & Automation: Cloud platforms, workflow automation, AI-driven solutions",
            "AI & Machine Learning: Applying AI tools for problem-solving, predictive analytics, intelligent systems",
            "Software Design: Efficient, scalable, and maintainable solutions",
            "No-Code & Productivity Tools: Streamlining workflows and automating repetitive tasks",
            "Python programming",
            "AI Tools (OpenAI, GPT APIs)",
            "Zapier automation",
            "Figma design",
            "Google Colab",
            "Jupyter Notebook"
        ],
        soft: [
            "Problem-solving and analytical thinking",
            "Collaboration and teamwork (experience in agile teams)",
            "Adaptability and continuous learning",
            "Creativity in designing practical solutions",
            "Clear communication and presenting technical concepts"
        ]
    },
    projects: [
        {
            name: "AI Chatbot (Q&A Assistant)",
            description: "A beginner-friendly AI chatbot built with Thinkstack + ChatGPT API, designed to answer basic AI questions.",
            technologies: ["Thinkstack", "ChatGPT API", "AI"],
            type: "AI/Automation",
            link: "https://app.thinkstack.ai/bot/previews/iframeview.html?bot=aHR0cHM6Ly9hcHAudGhpbmtzdGFjay5haS9ib3QvaW5kZXguaHRtbD9jaGF0Ym90X2lkPTY5NmUxNWIyODc5YjFhY2RhMGJiMDY4OSZ0eXBlPWlubGluZQ=="
        },
        {
            name: "CropGuard Prototype",
            description: "A Figma-based smart agriculture prototype for early crop protection alerts. Deliverables include design link and user flow.",
            technologies: ["Figma", "Prototype", "Agriculture"],
            type: "Design/Agriculture"
        },
        {
            name: "Sentiment Analysis Dashboard",
            description: "Created with Lovable and Google Colab, a dashboard that visualizes text sentiment. Deliverables include Colab notebook and dashboard preview.",
            technologies: ["Lovable", "Google Colab", "Data Visualization"],
            type: "Data Science"
        },
        {
            name: "AI Content Generator Tool",
            description: "Built in Blink to generate text, images, and code automatically using AI models.",
            technologies: ["Blink", "AI Generation", "Automation"],
            type: "AI/Automation"
        },
        {
            name: "Resume Generator",
            description: "Built using GPT APIs to automatically create resumes based on user input and preferences.",
            technologies: ["GPT API", "Automation", "Resume"],
            type: "AI/Automation"
        },
        {
            name: "AI Bias Report (Fairness Audit)",
            description: "A fairness and visualization dashboard created in Google Colab using the AIF360 toolkit to analyze bias and fairness in machine learning models. Deliverables include Colab notebook, fairness metrics, and data visualizations using Plotly and Matplotlib.",
            technologies: ["AIF360", "Plotly", "Matplotlib", "ML Fairness"],
            type: "AI Ethics/Data Science"
        }
    ],
    certificates: [
        {
            name: "Grade 12 Certificate",
            institution: "Willowvale Senior Secondary School",
            year: "2018"
        },
        {
            name: "Higher Certificate in Information Technology",
            institution: "Richfield Graduate Institute",
            year: "2019"
        },
        {
            name: "BSc IT Transcript",
            institution: "Richfield Graduate Institute",
            year: "2022",
            note: "All coursework completed"
        },
        {
            name: "AI for Everyone Certificate of Achievement",
            institution: "CAPACITI",
            year: "2025"
        },
        {
            name: "Certificate of Achievement AI & Machine Learning Fundamentals",
            institution: "CAPACITI",
            year: "2025"
        }
    ],
    career_goals: "Growing into a highly capable IT professional, focusing on AI, Data Engineering, and building technology that solves real problems and supports smarter decision-making",
    philosophy: "Enjoys building solutions that are clear, efficient, and genuinely useful whether through data pipelines, AI tools, or smart software design"
};

async function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for navigation commands first
    if (lowerMessage.includes('open projects') || lowerMessage.includes('show projects')) {
        scrollToSection('projects');
        return "Sure! I've scrolled to the Projects section for you. You can see all of Siya's impressive AI and no-code projects there.";
    }
    
    if (lowerMessage.includes('open cv') || lowerMessage.includes('show cv')) {
        scrollToSection('cv');
        return "I've taken you to the CV section where you can view and download Siya's curriculum vitae.";
    }
    
    if (lowerMessage.includes('open about') || lowerMessage.includes('show about')) {
        scrollToSection('about');
        return "Here's the About section with Siya's background story and personal details.";
    }
    
    // Try AI-powered response first
    try {
        const aiResponse = await getAIResponse(message);
        if (aiResponse && aiResponse.trim()) {
            return aiResponse;
        }
    } catch (error) {
        console.log('AI response failed, using fallback:', error);
    }
    
    // Fallback to rule-based responses
    return getFallbackResponse(lowerMessage);
}

async function getAIResponse(message) {
    const portfolioContext = `
COMPREHENSIVE PORTFOLIO INFORMATION FOR SIYASANGA MANKAYI:

PERSONAL DETAILS:
- Full Name: Siyasanga Mankayi
- Age: 25 (born 11 September 2000)
- Gender: Male
- Location: Cape Town, South Africa
- Languages: English (Fluent), Zulu (Fluent), Xhosa (Native)
- Contact: siyasangamankayi147@gmail.com, 0691764940
- LinkedIn: https://www.linkedin.com/in/siyasanga-mankayi-8a86b636b/
- GitHub: https://github.com/SiyasangaMankayi

EDUCATION JOURNEY:
- Grade 12: Completed at Willowvale Senior Secondary School in 2018
- Higher Certificate in IT: Earned from Richfield Graduate Institute in 2019
- BSc in Information Technology: Studied at Richfield Graduate Institute (2020-2023)
  * Successfully completed ALL coursework
  * Only project and work-integrated learning components remaining
  * Has full academic record despite financial challenges delaying completion
  * Plans to finalize degree soon

CURRENT EXPERIENCE:
- CAPACITI Learnership Programme (September 2025 - Present)
- Building hands-on expertise in data engineering, cloud technologies, automation, and AI-driven solutions
- Working on real industry projects with data pipelines and datasets
- Collaborating in agile teams on scalable, business-aligned solutions
- Gained practical insight into technology's real-world impact

TECHNICAL SKILLS:
- Full-Stack Web Development: React, Node.js, Vite, HTML, CSS, JavaScript, PHP
- Data Engineering: Data pipelines, ETL processes, structured & unstructured datasets
- Cloud & Automation: Cloud platforms, workflow automation, AI-driven solutions
- AI & Machine Learning: Problem-solving, predictive analytics, intelligent systems
- Software Design: Efficient, scalable, maintainable solutions
- No-Code Tools: Zapier, Blink, workflow automation
- Programming: Python, JavaScript, web technologies
- Design: Figma prototyping
- Data Science: Google Colab, Jupyter Notebook, Plotly, Matplotlib

SOFT SKILLS:
- Problem-solving and analytical thinking
- Collaboration and teamwork in agile environments
- Adaptability and continuous learning
- Creativity in practical solution design
- Clear technical communication

KEY PROJECTS:
1. AI Chatbot (Q&A Assistant) - Beginner-friendly chatbot built with Thinkstack & ChatGPT API for basic AI questions
2. CropGuard Prototype - Smart agriculture solution in Figma
3. Sentiment Analysis Dashboard - Lovable & Google Colab visualization
4. AI Content Generator - Blink-based automated content creation
5. Resume Generator - GPT API-powered resume automation
6. AI Bias Report - AIF360 toolkit for ML fairness analysis with Plotly/Matplotlib

CERTIFICATES & ACHIEVEMENTS:
- Grade 12 Certificate (2018) - Willowvale Senior Secondary School
- Higher Certificate in IT (2019) - Richfield Graduate Institute
- BSc IT Transcript (2022) - Richfield Graduate Institute (coursework completed)
- AI for Everyone Certificate (2025) - CAPACITI
- AI & Machine Learning Fundamentals Certificate (2025) - CAPACITI

CAREER PHILOSOPHY:
Siya enjoys building solutions that are clear, efficient, and genuinely useful through data pipelines, AI tools, or smart software design. He's committed to building technology that solves real problems and supports smarter decision-making, with the goal of growing into a highly capable IT professional.
`;

    const prompt = `You are SiyaBot, Siyasanga Mankayi's AI portfolio assistant. Answer the user's question about Siya using the comprehensive information provided. Be conversational, helpful, and enthusiastic. Keep responses to 2-3 sentences maximum unless asked for detailed information.

${portfolioContext}

User Question: ${message}

Answer as SiyaBot in a friendly, knowledgeable way. Use "Siya" when referring to him. Only use the information provided above. If the question is outside this scope, politely redirect to topics you can help with.`;

    try {
        // Use a simpler API endpoint that's more reliable
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        
        // Clean up the response
        let cleanResponse = data.trim();
        
        // Remove any unwanted prefixes or suffixes
        cleanResponse = cleanResponse.replace(/^(Response:|Answer:|SiyaBot:)/i, '').trim();
        
        // Ensure it's not too long
        if (cleanResponse.length > 400) {
            cleanResponse = cleanResponse.substring(0, 397) + '...';
        }
        
        return cleanResponse || null;
    } catch (error) {
        console.error('Pollinations AI error:', error);
        return null;
    }
}

function getFallbackResponse(lowerMessage) {
    // Education/Study questions
    if (lowerMessage.includes('study') || lowerMessage.includes('education') || lowerMessage.includes('qualification') || lowerMessage.includes('degree') || lowerMessage.includes('where did') || lowerMessage.includes('school') || lowerMessage.includes('university') || lowerMessage.includes('college')) {
        return "Siya completed Grade 12 at Willowvale Senior Secondary School in 2018, then earned a Higher Certificate in IT from Richfield Graduate Institute in 2019. He progressed into a BSc in Information Technology at Richfield (2020-2023), successfully completing ALL coursework with only the project and work-integrated learning components remaining. Despite financial challenges delaying completion, he has his full academic record and plans to finalize his degree soon.";
    }
    
    // Work/Experience questions
    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('experience') || lowerMessage.includes('capaciti') || lowerMessage.includes('current')) {
        return "Siya is currently part of the CAPACITI Learnership Programme (September 2025 - Present), where he's building hands-on expertise in data engineering, cloud technologies, automation, and AI-driven solutions. He's worked on real industry projects involving data pipelines, structured and unstructured datasets, and collaborates in agile teams designing efficient, scalable solutions.";
    }
    
    // Skills questions
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tools') || lowerMessage.includes('programming') || lowerMessage.includes('languages')) {
        return "Siya's technical skills include Full-Stack Web Development (React, Node.js, Vite, HTML, CSS, JavaScript, PHP), Data Engineering (pipelines, ETL processes), Cloud & Automation, AI & Machine Learning, Python programming, and No-Code tools like Zapier and Blink. He focuses on building efficient, scalable solutions and has strong problem-solving and collaboration skills.";
    }
    
    // Projects questions
    if (lowerMessage.includes('project') || lowerMessage.includes('built') || lowerMessage.includes('created') || lowerMessage.includes('portfolio')) {
        return "Siya has built impressive projects including a beginner-friendly AI Chatbot with Thinkstack & ChatGPT API for basic AI questions, CropGuard smart agriculture prototype in Figma, Sentiment Analysis Dashboard with Lovable & Google Colab, AI Content Generator in Blink, Resume Generator with GPT APIs, and an AI Bias Report using AIF360 toolkit for ML fairness analysis with Plotly and Matplotlib visualizations.";
    }
    
    // Personal details questions
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('live') || lowerMessage.includes('from') || lowerMessage.includes('age') || lowerMessage.includes('old') || lowerMessage.includes('birthday') || lowerMessage.includes('born')) {
        return "Siya is 25 years old (born 11 September 2000) and lives in Cape Town, South Africa. He's a male professional who speaks English (Fluent), Zulu (Fluent), and Xhosa (Native).";
    }
    
    // Contact questions
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('reach') || lowerMessage.includes('linkedin') || lowerMessage.includes('github')) {
        return "You can reach Siya at siyasangamankayi147@gmail.com, phone: 0691764940. Check out his LinkedIn: https://www.linkedin.com/in/siyasanga-mankayi-8a86b636b/ or GitHub: https://github.com/SiyasangaMankayi for his professional profiles and code repositories.";
    }
    
    // CV/Resume questions
    if (lowerMessage.includes('cv') || lowerMessage.includes('resume') || lowerMessage.includes('download')) {
        return "You can view and download Siya's CV from the CV section of this portfolio. Just scroll down to the CV section or click the CV link in the navigation to access his complete curriculum vitae.";
    }
    
    // Certificates questions
    if (lowerMessage.includes('certificate') || lowerMessage.includes('achievement') || lowerMessage.includes('award') || lowerMessage.includes('qualification')) {
        return "Siya has earned several certificates: Grade 12 Certificate (2018) from Willowvale Senior Secondary School, Higher Certificate in IT from Richfield (2019), BSc IT Transcript from Richfield (2022) showing completed coursework, AI for Everyone Certificate from CAPACITI (2025), and AI & Machine Learning Fundamentals Certificate from CAPACITI (2025).";
    }
    
    // Career/Goals questions
    if (lowerMessage.includes('goal') || lowerMessage.includes('future') || lowerMessage.includes('career') || lowerMessage.includes('aspiration') || lowerMessage.includes('plan')) {
        return "Siya is committed to growing into a highly capable IT professional, focusing on building technology that solves real problems and supports smarter decision-making. He enjoys creating clear, efficient, and genuinely useful solutions through data pipelines, AI tools, and smart software design.";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
        return "Hello! 👋 I'm SiyaBot, your AI-powered guide to Siyasanga's comprehensive portfolio. I have detailed knowledge about his education journey, technical skills, projects, experience, and career goals. What would you like to know about Siya?";
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
        return "You're very welcome! 😊 I'm here to help you learn everything about Siyasanga's background, projects, skills, and experience. Feel free to ask me anything else about his portfolio!";
    }
    
    // Default response
    return "I'm SiyaBot, powered by AI with comprehensive knowledge about Siyasanga Mankayi! I can tell you about his complete education journey (from Grade 12 through his BSc in IT), current experience at CAPACITI, technical skills, impressive projects, certificates, and career goals. Try asking me something like 'Tell me about Siya's education' or 'What projects has he built?'";
}

function speakText(text) {
    if ('speechSynthesis' in window && isVoiceEnabled) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to use a male voice
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('mark')
        );
        
        if (maleVoice) {
            utterance.voice = maleVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
}

// Contact Form Functions
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Get form data
    const formData = {
        from_name: form.name.value.trim(),
        from_email: form.email.value.trim(),
        message: form.message.value.trim(),
        to_email: 'siyasangamankayi147@gmail.com',
        reply_to: form.email.value.trim()
    };
    
    // Validate form
    if (!formData.from_name || !formData.from_email || !formData.message) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    
    try {
        // Use Formspree as a reliable email service
        const response = await fetch('https://formspree.io/f/xpwzgqpv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.from_name,
                email: formData.from_email,
                message: formData.message,
                _replyto: formData.from_email,
                _subject: `Portfolio Contact from ${formData.from_name}`
            })
        });
        
        if (response.ok) {
            showToast('✅ Message sent successfully! Siya will get back to you soon.', 'success');
            form.reset();
        } else {
            // Fallback to mailto if Formspree fails
            const mailtoLink = `mailto:siyasangamankayi147@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(formData.from_name)}&body=${encodeURIComponent(`From: ${formData.from_name} (${formData.from_email})\n\nMessage:\n${formData.message}`)}`;
            window.location.href = mailtoLink;
            showToast('📧 Opening your email client to send the message.', 'success');
            form.reset();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        // Fallback to mailto
        const mailtoLink = `mailto:siyasangamankayi147@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(formData.from_name)}&body=${encodeURIComponent(`From: ${formData.from_name} (${formData.from_email})\n\nMessage:\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        showToast('📧 Opening your email client to send the message.', 'success');
        form.reset();
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// CV Modal Functions
function openCVModal() {
    document.getElementById('cv-modal').style.display = 'block';
}

function closeCVModal() {
    document.getElementById('cv-modal').style.display = 'none';
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-card, .project-card, .certificate-card, .timeline-item, .detail-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Utility Functions
function scrollToProjects() {
    scrollToSection('projects');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cv-modal');
    if (event.target === modal) {
        closeCVModal();
    }
}

// Smooth scroll behavior for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add CSS for typing animation
const style = document.createElement('style');
style.textContent = `
    .typing-animation {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .typing-animation span {
        display: inline-block;
        animation: typing-pulse 1.4s infinite;
        font-size: 1.2rem;
        color: #b08a65;
    }
    
    .typing-animation span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-animation span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing-pulse {
        0%, 60%, 100% {
            opacity: 0.3;
        }
        30% {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Enhanced Modern Chatbot Features
function initializeModernFeatures() {
    // Add smooth scrolling to messages
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer) {
        messagesContainer.style.scrollBehavior = 'smooth';
    }
    
    // Add input character counter (optional)
    const input = document.getElementById('chatbot-input-field');
    if (input) {
        input.addEventListener('input', function() {
            const sendBtn = document.getElementById('send-btn');
            if (this.value.trim()) {
                sendBtn.style.background = 'linear-gradient(135deg, #b08a65, #a07955)';
                sendBtn.style.transform = 'scale(1.05)';
            } else {
                sendBtn.style.background = 'rgba(176, 138, 101, 0.5)';
                sendBtn.style.transform = 'scale(1)';
            }
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to open chatbot
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (chatBotMinimized) {
                openChatbot();
            }
        }
        
        // Escape to minimize chatbot
        if (e.key === 'Escape' && !chatBotMinimized) {
            minimizeChatbot();
        }
    });
}

// Smart context awareness
function getContextualGreeting() {
    const hour = new Date().getHours();
    let greeting = "Hello";
    
    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 17) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    
    return greeting;
}

// Enhanced error handling with retry
async function generateBotResponseWithRetry(message, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await generateBotResponse(message);
            return response;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed:`, error);
            if (i === retries) {
                return "I'm having some technical difficulties. Let me try to help you with what I know about Siya's portfolio!";
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Initialize modern features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add to existing initialization
    setTimeout(initializeModernFeatures, 100);
});

// Add visual feedback for interactions
function addVisualFeedback(element, type = 'success') {
    const originalTransform = element.style.transform;
    const originalBackground = element.style.background;
    
    if (type === 'success') {
        element.style.transform = 'scale(1.1)';
        element.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
        element.style.transform = 'scale(1.05)';
        element.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    setTimeout(() => {
        element.style.transform = originalTransform;
        element.style.background = originalBackground;
    }, 200);
}

// Smart message suggestions based on portfolio content
function getSmartMessageSuggestions(context) {
    const suggestions = {
        projects: [
            "What's the most innovative project Siya has worked on?",
            "How does his AI Bias Report help with fairness?",
            "Tell me about the CropGuard agriculture solution",
            "What makes his chatbot projects unique?"
        ],
        skills: [
            "What's Siya's strongest technical skill?",
            "How experienced is he with AI and machine learning?",
            "Does he work with both frontend and backend?",
            "What cloud platforms does he use?"
        ],
        experience: [
            "What has Siya learned at CAPACITI?",
            "How does his education support his career goals?",
            "What kind of projects does he work on professionally?",
            "What makes him stand out as a developer?"
        ],
        contact: [
            "What's the best way to reach Siya?",
            "Is he open to collaboration opportunities?",
            "Can I see his professional profiles?",
            "How can I learn more about his work?"
        ]
    };
    
    return suggestions[context] || suggestions.projects;
}

// Stats Animation Function
function initializeStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateStats() {
        if (hasAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 50; // Animation duration control
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 40);
        });
        
        hasAnimated = true;
    }

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }
}
// Floating Particles Effect
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles when page loads
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
});
// Dynamic Chatbot Positioning for Different Screen Types
function adjustChatbotForScreenSize() {
    const chatbot = document.getElementById('chatbot');
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (!chatbot || !chatbotBubble) return;
    
    // Laptop screens (1024px - 1366px)
    if (screenWidth >= 1024 && screenWidth <= 1366) {
        chatbot.style.setProperty('--chatbot-width', '370px');
        chatbot.style.setProperty('--chatbot-height', '550px');
        chatbot.style.setProperty('--chatbot-right', '40px');
        chatbot.style.setProperty('--chatbot-bottom', '120px');
    }
    // Large desktop screens (>1366px)
    else if (screenWidth > 1366) {
        chatbot.style.setProperty('--chatbot-width', '380px');
        chatbot.style.setProperty('--chatbot-height', '580px');
        chatbot.style.setProperty('--chatbot-right', '50px');
        chatbot.style.setProperty('--chatbot-bottom', '140px');
    }
    // Tablet screens (769px - 1023px)
    else if (screenWidth >= 769 && screenWidth <= 1023) {
        chatbot.style.setProperty('--chatbot-width', '330px');
        chatbot.style.setProperty('--chatbot-height', '480px');
        chatbot.style.setProperty('--chatbot-right', '25px');
        chatbot.style.setProperty('--chatbot-bottom', '90px');
    }
    
    // Adjust for very tall screens
    if (screenHeight > 900 && screenWidth > 1024) {
        chatbot.style.setProperty('--chatbot-height', Math.min(600, screenHeight * 0.7) + 'px');
    }
}

// Handle window resize for chatbot responsiveness
function handleChatbotResize() {
    adjustChatbotForScreenSize();
    
    // Reposition chatbot if it's open and goes off-screen
    const chatbot = document.getElementById('chatbot');
    if (chatbot && chatbot.style.display === 'flex') {
        const rect = chatbot.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Ensure chatbot stays within viewport
        if (rect.right > viewportWidth) {
            chatbot.style.right = '10px';
        }
        if (rect.bottom > viewportHeight) {
            chatbot.style.bottom = '10px';
        }
    }
}

// Initialize responsive chatbot on load and resize
document.addEventListener('DOMContentLoaded', function() {
    adjustChatbotForScreenSize();
});

window.addEventListener('resize', handleChatbotResize);
window.addEventListener('orientationchange', function() {
    setTimeout(handleChatbotResize, 100); // Small delay for orientation change
});