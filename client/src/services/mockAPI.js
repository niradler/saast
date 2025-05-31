// Mock server middleware for authentication and chat
const mockResponses = {
  // AI response templates for demo
  getAIResponse: (userMessage) => {
    const responses = [
      {
        trigger: ['hello', 'hi', 'hey'],
        response: "Hello! 👋 I'm your AI assistant. I can help you with various tasks including:\n\n- **Code examples** in multiple languages\n- **Mermaid diagrams** for visualizations\n- **Markdown formatting** for rich content\n- **Data analysis** and explanations\n\nWhat would you like to explore today?"
      },
      {
        trigger: ['mermaid', 'diagram', 'flowchart'],
        response: "I'd be happy to create a Mermaid diagram for you! Here's an example:\n\n```mermaid\ngraph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E\n```\n\nMermaid supports many diagram types:\n- Flowcharts\n- Sequence diagrams\n- Gantt charts\n- Class diagrams\n- And more!\n\nWhat kind of diagram would you like me to create?"
      },
      {
        trigger: ['code', 'programming', 'javascript', 'python', 'react'],
        response: "Here's a React component example with modern hooks:\n\n```jsx\nimport { useState, useEffect } from 'react';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetchUser(userId)\n      .then(setUser)\n      .finally(() => setLoading(false));\n  }, [userId]);\n\n  if (loading) return <div>Loading...</div>;\n  if (!user) return <div>User not found</div>;\n\n  return (\n    <div className=\"user-profile\">\n      <h2>{user.name}</h2>\n      <p>{user.email}</p>\n    </div>\n  );\n}\n```\n\nAnd here's a Python example:\n\n```python\nclass DataProcessor:\n    def __init__(self, data):\n        self.data = data\n    \n    def process(self):\n        return [\n            item.upper() \n            for item in self.data \n            if isinstance(item, str)\n        ]\n\n# Usage\nprocessor = DataProcessor(['hello', 'world', 123])\nresult = processor.process()\nprint(result)  # ['HELLO', 'WORLD']\n```\n\nWhat programming topic would you like to explore?"
      },
      {
        trigger: ['markdown', 'format', 'styling'],
        response: "# Markdown Formatting Guide\n\nI support **full Markdown** rendering! Here are some examples:\n\n## Text Styling\n- **Bold text**\n- *Italic text*\n- ~~Strikethrough~~\n- `Inline code`\n\n## Lists\n### Unordered:\n- Item 1\n- Item 2\n  - Nested item\n  - Another nested item\n\n### Ordered:\n1. First item\n2. Second item\n3. Third item\n\n## Tables\n| Feature | Supported | Notes |\n|---------|-----------|-------|\n| Headers | ✅ | H1-H6 |\n| Links | ✅ | [Example](https://example.com) |\n| Images | ✅ | ![Alt text](url) |\n| Code | ✅ | Syntax highlighting |\n\n## Blockquotes\n> This is a blockquote. It's great for highlighting important information or quotes from other sources.\n\n---\n\nTry sending me some Markdown and I'll render it beautifully!"
      },
      {
        trigger: ['math', 'calculation', 'formula'],
        response: "I can help with mathematical concepts! While LaTeX math rendering is coming soon, I can explain formulas using text and code:\n\n```python\n# Quadratic formula: x = (-b ± √(b²-4ac)) / 2a\nimport math\n\ndef quadratic_formula(a, b, c):\n    discriminant = b**2 - 4*a*c\n    if discriminant < 0:\n        return \"No real solutions\"\n    elif discriminant == 0:\n        return -b / (2*a)\n    else:\n        x1 = (-b + math.sqrt(discriminant)) / (2*a)\n        x2 = (-b - math.sqrt(discriminant)) / (2*a)\n        return x1, x2\n\n# Example: x² - 5x + 6 = 0\nresult = quadratic_formula(1, -5, 6)\nprint(result)  # (3.0, 2.0)\n```\n\n**Common formulas:**\n- Area of circle: A = πr²\n- Pythagorean theorem: a² + b² = c²\n- Compound interest: A = P(1 + r/n)^(nt)\n\nWhat mathematical concept would you like to explore?"
      }
    ];

    const userMsg = userMessage.toLowerCase();
    
    // Find matching response
    for (const response of responses) {
      if (response.trigger.some(trigger => userMsg.includes(trigger))) {
        return response.response;
      }
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! Let me think about that...\n\n" +
      "I can help you with:\n" +
      "- **Code examples** and programming concepts\n" +
      "- **Mermaid diagrams** for visualizations\n" +
      "- **Markdown formatting** and documentation\n" +
      "- **Data analysis** and explanations\n\n" +
      "Could you provide more details about what you'd like to explore?",
      
      "I understand you're asking about: *" + userMessage + "*\n\n" +
      "Here's my analysis:\n\n" +
      "```mermaid\ngraph LR\n    A[Your Question] --> B[AI Processing]\n    B --> C[Knowledge Search]\n    C --> D[Response Generation]\n    D --> E[Formatted Output]\n```\n\n" +
      "This is a great topic! Would you like me to:\n" +
      "1. Provide code examples\n" +
      "2. Create a detailed explanation\n" +
      "3. Show visual diagrams\n" +
      "4. Give practical applications",
      
      "Excellent question about: **" + userMessage + "**\n\n" +
      "> This is exactly the kind of inquiry that showcases the power of AI-assisted conversations!\n\n" +
      "Let me break this down:\n\n" +
      "| Aspect | Details |\n" +
      "|--------|----------|\n" +
      "| Topic | " + userMessage + " |\n" +
      "| Complexity | Moderate to Advanced |\n" +
      "| Applications | Multiple domains |\n\n" +
      "Would you like me to dive deeper into any specific aspect?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
const mockAPI = {
  // Authentication
  login: async (email, password) => {
    await delay(1000);
    if (email === 'demo@example.com' && password === 'password123') {
      return {
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (name, email, password) => {
    await delay(1200);
    // Simulate unique email check
    if (email === 'demo@example.com') {
      throw new Error('Email already exists');
    }
    return {
      user: {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString()
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  // Chat
  sendMessage: async (message, conversationId) => {
    await delay(800 + Math.random() * 1200); // Simulate varying response times
    
    const aiResponse = mockResponses.getAIResponse(message);
    
    return {
      message: {
        id: Date.now().toString(),
        conversationId: conversationId || '1',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        metadata: {
          model: 'gpt-3.5-turbo',
          tokens: Math.floor(Math.random() * 500) + 100
        }
      }
    };
  }
};

// Export for use in services
if (typeof window !== 'undefined') {
  window.mockAPI = mockAPI;
}

export default mockAPI;