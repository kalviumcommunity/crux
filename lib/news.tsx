// News data types and mock API functions
export interface Article {
  id: string
  title: string
  snippet: string
  content: string
  thumbnail: string
  publishedAt: string
  source: string
  category: string
  author?: string
  url?: string
}

// Extended mock articles with full content
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "AI Revolution in Healthcare: New Breakthrough in Medical Diagnosis",
    snippet:
      "Researchers have developed an AI system that can diagnose rare diseases with 95% accuracy, potentially revolutionizing medical care worldwide.",
    content: `
      <p>In a groundbreaking development that could transform healthcare as we know it, researchers at Stanford University have unveiled an artificial intelligence system capable of diagnosing rare diseases with an unprecedented 95% accuracy rate.</p>
      
      <p>The AI system, dubbed "MedAI-Dx," has been trained on over 10 million medical records and imaging data from hospitals worldwide. Unlike traditional diagnostic methods that can take weeks or months for rare conditions, this system can provide accurate diagnoses within minutes.</p>
      
      <p>"This represents a paradigm shift in how we approach medical diagnosis," said Dr. Sarah Chen, lead researcher on the project. "For patients with rare diseases, early and accurate diagnosis can mean the difference between life and death."</p>
      
      <p>The system has already been tested in clinical trials across 15 hospitals, where it successfully identified conditions that had previously stumped medical professionals for months. The technology is expected to be rolled out to major medical centers by the end of 2024.</p>
      
      <p>Healthcare experts believe this breakthrough could significantly reduce healthcare costs while improving patient outcomes, particularly in underserved areas where specialist expertise is limited.</p>
    `,
    thumbnail: "/medical-ai.png",
    publishedAt: "2024-01-15T10:30:00Z",
    source: "TechNews",
    category: "Technology",
    author: "Dr. Michael Rodriguez",
    url: "https://technews.com/ai-healthcare-breakthrough",
  },
  {
    id: "2",
    title: "Climate Change Summit Reaches Historic Agreement",
    snippet:
      "World leaders have agreed on ambitious new targets for carbon reduction, marking a significant step forward in global climate action.",
    content: `
      <p>After two weeks of intense negotiations, world leaders at the Global Climate Summit have reached a historic agreement that sets the most ambitious carbon reduction targets in international climate policy history.</p>
      
      <p>The agreement, signed by representatives from 195 countries, commits nations to reducing greenhouse gas emissions by 60% by 2030 and achieving net-zero emissions by 2040 - a decade earlier than previous commitments.</p>
      
      <p>"Today marks a turning point in our fight against climate change," declared UN Secretary-General António Guterres. "This agreement shows that when the world comes together, we can achieve the impossible."</p>
      
      <p>Key provisions of the agreement include:</p>
      <ul>
        <li>$500 billion in climate financing for developing nations</li>
        <li>Mandatory renewable energy targets of 80% by 2030</li>
        <li>Phase-out of coal power plants by 2035</li>
        <li>Protection of 40% of global land and ocean areas</li>
      </ul>
      
      <p>Environmental groups have hailed the agreement as a "game-changer," while some industry leaders express concerns about the rapid timeline for implementation.</p>
    `,
    thumbnail: "/climate-summit-leaders.png",
    publishedAt: "2024-01-15T08:15:00Z",
    source: "Global News",
    category: "Environment",
    author: "Emma Thompson",
    url: "https://globalnews.com/climate-summit-agreement",
  },
  {
    id: "3",
    title: "Quantum Computing Milestone: 1000-Qubit Processor Unveiled",
    snippet:
      "A major tech company has announced the development of a 1000-qubit quantum processor, bringing us closer to practical quantum computing applications.",
    content: `
      <p>In a major leap forward for quantum computing, IBM has unveiled its latest quantum processor featuring over 1000 qubits, marking a significant milestone in the race toward practical quantum computing applications.</p>
      
      <p>The new processor, called "Quantum Condor," represents a 10-fold increase in quantum processing power compared to previous generations. This advancement brings quantum computers closer to solving real-world problems that are impossible for classical computers.</p>
      
      <p>"We're entering a new era of quantum computing," said Dr. Jay Gambetta, IBM's Vice President of Quantum Computing. "With 1000 qubits, we can now tackle problems in drug discovery, financial modeling, and climate simulation that were previously out of reach."</p>
      
      <p>The breakthrough addresses one of quantum computing's biggest challenges: quantum error correction. The new processor uses advanced error correction algorithms that maintain quantum coherence for significantly longer periods.</p>
      
      <p>Potential applications include:</p>
      <ul>
        <li>Accelerating drug discovery by simulating molecular interactions</li>
        <li>Optimizing supply chains and logistics networks</li>
        <li>Enhancing cryptography and cybersecurity</li>
        <li>Improving weather and climate predictions</li>
      </ul>
      
      <p>The technology is expected to be available to researchers and enterprise customers through IBM's quantum cloud platform by mid-2024.</p>
    `,
    thumbnail: "/quantum-computer-processor-technology.png",
    publishedAt: "2024-01-15T06:45:00Z",
    source: "Science Daily",
    category: "Science",
    author: "Prof. Alan Turing",
    url: "https://sciencedaily.com/quantum-computing-milestone",
  },
]

// Mock API functions
export const getArticles = async (): Promise<Article[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockArticles
}

export const getArticleById = async (id: string): Promise<Article | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockArticles.find((article) => article.id === id) || null
}

export const searchArticles = async (query: string): Promise<Article[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase()),
  )
}
