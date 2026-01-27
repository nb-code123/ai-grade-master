import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import {
  Brain,
  Eye,
  FileSearch,
  Sparkles,
  Zap,
  Shield,
  Users,
  Code2,
} from "lucide-react";

const architecture = [
  {
    icon: FileSearch,
    title: "OCR Engine",
    description:
      "Advanced text extraction from handwritten documents using vision transformers.",
  },
  {
    icon: Brain,
    title: "AI Evaluation",
    description:
      "Semantic similarity analysis powered by Gemini for understanding answer context.",
  },
  {
    icon: Eye,
    title: "Computer Vision",
    description:
      "Diagram detection and label recognition for technical subjects.",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description:
      "Edge functions for fast, scalable evaluation with streaming results.",
  },
];

const team = [
  { name: "AI Engine", role: "Powered by Gemini Pro" },
  { name: "OCR Module", role: "Vision Transformer" },
  { name: "Grammar Check", role: "NLP Analysis" },
  { name: "Scoring System", role: "Multi-criteria Evaluation" },
];

export default function About() {
  return (
    <>
      <Header />
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Hero */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6"
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                About <span className="gradient-text">AutoGradeAI</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A state-of-the-art automated grading system that brings AI precision
                to academic evaluation, making grading faster, fairer, and more consistent.
              </p>
            </div>

            {/* Architecture */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Code2 className="w-6 h-6 text-primary" />
                System Architecture
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {architecture.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-6"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Scoring Formula */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Brain className="w-6 h-6 text-primary" />
                Scoring Formula
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8"
              >
                <div className="font-mono text-sm bg-secondary/50 rounded-xl p-6 mb-6 overflow-x-auto">
                  <p className="text-primary mb-2">// Final Score Calculation</p>
                  <p className="text-muted-foreground">
                    Final_Score = Keyword_Score + Semantic_Score + Diagram_Score - Grammar_Penalty
                  </p>
                  <br />
                  <p className="text-accent">// Where:</p>
                  <p className="text-muted-foreground">
                    Keyword_Score = (Keywords_Matched / Total_Keywords) × 0.30 × Max_Marks
                  </p>
                  <p className="text-muted-foreground">
                    Semantic_Score = Similarity × 0.40 × Max_Marks
                  </p>
                  <p className="text-muted-foreground">
                    Diagram_Score = Present × Labeling_Accuracy × 0.20 × Max_Marks
                  </p>
                  <p className="text-muted-foreground">
                    Grammar_Penalty = (1 - Grammar_Quality) × 0.10 × Max_Marks
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-primary">30%</p>
                    <p className="text-xs text-muted-foreground">Keywords</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-accent">40%</p>
                    <p className="text-xs text-muted-foreground">Semantic</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">20%</p>
                    <p className="text-xs text-muted-foreground">Diagram</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-destructive">-10%</p>
                    <p className="text-xs text-muted-foreground">Grammar</p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Components */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                AI Components
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-5 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-muted-foreground text-sm"
            >
              <p>
                Built with React, Tailwind CSS, and powered by Gemini AI.
              </p>
              <p className="mt-2">
                Designed for modern education platforms.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
