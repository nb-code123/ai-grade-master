import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import {
  Upload,
  FileText,
  Zap,
  Brain,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Smart PDF Upload",
    description: "Upload question papers and answer sheets with automatic text extraction.",
  },
  {
    icon: Brain,
    title: "AI-Powered Evaluation",
    description: "Advanced semantic analysis using GPT & Gemini for accurate scoring.",
  },
  {
    icon: FileText,
    title: "Manual Override",
    description: "Flexible marks assignment and single-question evaluation mode.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Question-wise breakdown with keyword, semantic, and grammar scores.",
  },
  {
    icon: Shield,
    title: "Diagram Detection",
    description: "Computer vision for detecting and evaluating diagrams in answers.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive feedback and improvement suggestions in seconds.",
  },
];

const stats = [
  { value: "99%", label: "Accuracy" },
  { value: "50+", label: "Question Types" },
  { value: "10x", label: "Faster Grading" },
  { value: "100", label: "Max Marks" },
];

export default function Index() {
  return (
    <>
      <Header />
      <PageContainer>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Grading System
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Grade Smarter,
                <br />
                <span className="gradient-text">Not Harder</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Automatically evaluate handwritten answer sheets with AI precision. 
                Semantic analysis, diagram detection, and detailed feedback in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/upload">
                  <Button variant="hero" size="xl">
                    Start Grading
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/manual-evaluation">
                  <Button variant="glass" size="xl">
                    Try Manual Mode
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for
              <span className="gradient-text"> Modern Education</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate grading with AI precision and human-level understanding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              { step: 1, title: "Upload Documents", desc: "Upload question paper and student answer sheets (PDF)" },
              { step: 2, title: "Configure Marks", desc: "Set maximum marks per question (total ≤ 100)" },
              { step: 3, title: "AI Evaluation", desc: "Our AI analyzes answers using semantic similarity, keywords, and grammar" },
              { step: 4, title: "Get Results", desc: "Receive detailed breakdown with scores and improvement suggestions" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <div className="flex-1 glass rounded-xl p-5">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-border rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Grading?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join educators worldwide who are saving hours every week with AI-powered evaluation.
            </p>
            <Link to="/upload">
              <Button variant="hero" size="xl">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </PageContainer>
    </>
  );
}
