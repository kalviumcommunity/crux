// Mock database utilities - can be replaced with real MongoDB later
export interface User {
  id: string
  username: string
  email: string
  password: string // In real implementation, this would be hashed
  createdAt: Date
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  urlToImage: string
  url: string
  source: {
    id: string
    name: string
  }
}

// Mock users database
const users: User[] = [
  {
    id: "1",
    username: "demo",
    email: "demo@crux.com",
    password: "demo123", // In real app, this would be hashed
    createdAt: new Date(),
  },
]

// Mock articles database (simulating NewsAPI response)
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Revolutionary AI Breakthrough in Medical Diagnosis",
    description: "Scientists develop AI system that can diagnose rare diseases with 95% accuracy",
    content:
      "A groundbreaking artificial intelligence system developed by researchers at Stanford University has achieved a remarkable 95% accuracy rate in diagnosing rare medical conditions. The system, called MedAI, uses advanced machine learning algorithms to analyze patient symptoms, medical history, and diagnostic images to provide accurate diagnoses for conditions that often take months or years to identify correctly. The research team, led by Dr. Sarah Chen, trained the AI on over 100,000 medical cases spanning 500 rare diseases. The system has already been tested in clinical trials across 15 hospitals, showing consistent results that match or exceed specialist physicians in diagnostic accuracy. This breakthrough could revolutionize healthcare by providing faster, more accurate diagnoses for patients with rare conditions, potentially saving thousands of lives annually.",
    author: "Dr. Michael Rodriguez",
    publishedAt: "2024-01-15T10:30:00Z",
    urlToImage: "/medical-ai.png",
    url: "https://example.com/ai-medical-breakthrough",
    source: { id: "medical-news", name: "Medical News Today" },
  },
  {
    id: "2",
    title: "Global Climate Summit Reaches Historic Agreement",
    description: "World leaders commit to ambitious carbon reduction targets",
    content:
      'In a historic moment for global climate action, representatives from 195 countries have reached a comprehensive agreement at the Global Climate Summit in Geneva. The agreement, dubbed the "Geneva Accord," establishes binding carbon reduction targets that aim to limit global warming to 1.5°C above pre-industrial levels. Key provisions include a commitment to reduce global carbon emissions by 50% by 2030 and achieve net-zero emissions by 2050. The accord also establishes a $500 billion climate fund to support developing nations in their transition to renewable energy. UN Secretary-General António Guterres called it "the most significant climate agreement since the Paris Accord," while environmental groups praised the binding nature of the commitments. The agreement will require ratification by individual nations, with implementation beginning in 2025.',
    author: "Emma Thompson",
    publishedAt: "2024-01-14T14:20:00Z",
    urlToImage: "/climate-summit-leaders.png",
    url: "https://example.com/climate-summit-agreement",
    source: { id: "global-news", name: "Global News Network" },
  },
  {
    id: "3",
    title: "Quantum Computing Milestone: 1000-Qubit Processor Unveiled",
    description: "Tech giant announces breakthrough in quantum computing with unprecedented processing power",
    content:
      "TechCorp has unveiled the world's first 1000-qubit quantum processor, marking a significant milestone in quantum computing development. The processor, named \"QuantumMax,\" represents a 10-fold increase in quantum processing power compared to previous systems. The breakthrough was achieved through innovative error correction techniques and advanced superconducting qubit design. Initial tests show the processor can solve complex optimization problems in minutes that would take classical computers years to complete. The technology has immediate applications in drug discovery, financial modeling, and cryptography. Dr. Lisa Wang, TechCorp's Chief Quantum Officer, stated that this advancement brings practical quantum computing applications within reach for enterprises. The company plans to make the processor available through cloud services starting in Q3 2024, with partnerships already established with major pharmaceutical and financial institutions.",
    author: "James Liu",
    publishedAt: "2024-01-13T09:15:00Z",
    urlToImage: "/quantum-computer-processor-technology.png",
    url: "https://example.com/quantum-computing-milestone",
    source: { id: "tech-today", name: "Tech Today" },
  },
]

export const dbUtils = {
  // User operations
  findUserByEmail: async (email: string): Promise<User | null> => {
    return users.find((user) => user.email === email) || null
  },

  findUserById: async (id: string): Promise<User | null> => {
    return users.find((user) => user.id === id) || null
  },

  createUser: async (userData: Omit<User, "id" | "createdAt">): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },

  // Article operations
  getArticles: async (limit = 20): Promise<Article[]> => {
    return mockArticles.slice(0, limit)
  },

  getArticleById: async (id: string): Promise<Article | null> => {
    return mockArticles.find((article) => article.id === id) || null
  },

  searchArticles: async (query: string): Promise<Article[]> => {
    return mockArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()),
    )
  },
}
