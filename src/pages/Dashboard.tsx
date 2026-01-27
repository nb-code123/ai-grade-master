import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ScoreDisplay } from "@/components/grading/ScoreDisplay";
import {
  Plus,
  FileText,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";

// Mock data for demonstration
const recentEvaluations = [
  {
    id: "1",
    title: "Physics Midterm - Section A",
    date: "2024-01-15",
    score: 72,
    maxScore: 100,
    questions: 10,
  },
  {
    id: "2",
    title: "Chemistry Quiz 3",
    date: "2024-01-14",
    score: 45,
    maxScore: 50,
    questions: 5,
  },
  {
    id: "3",
    title: "Biology Final - Part 1",
    date: "2024-01-12",
    score: 85,
    maxScore: 100,
    questions: 15,
  },
];

const stats = [
  { icon: FileText, label: "Total Evaluations", value: "24" },
  { icon: TrendingUp, label: "Avg. Score", value: "78%" },
  { icon: Clock, label: "Time Saved", value: "12h" },
  { icon: Calendar, label: "This Week", value: "8" },
];

export default function Dashboard() {
  return (
    <>
      <Header />
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-muted-foreground">
                  Overview of your grading activity
                </p>
              </div>
              <Link to="/upload">
                <Button variant="hero" size="lg">
                  <Plus className="w-5 h-5" />
                  New Evaluation
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Evaluations */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Recent Evaluations
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentEvaluations.map((evaluation, index) => (
                  <motion.div
                    key={evaluation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{evaluation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {evaluation.questions} questions • {evaluation.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        <span
                          className={
                            evaluation.score / evaluation.maxScore >= 0.8
                              ? "text-primary"
                              : evaluation.score / evaluation.maxScore >= 0.6
                              ? "text-accent"
                              : "text-destructive"
                          }
                        >
                          {evaluation.score}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          /{evaluation.maxScore}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {((evaluation.score / evaluation.maxScore) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {recentEvaluations.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    No evaluations yet
                  </p>
                  <Link to="/upload">
                    <Button variant="outline">Start Your First Evaluation</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
