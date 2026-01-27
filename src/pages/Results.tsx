import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import { ResultBreakdown } from "@/components/grading/ResultBreakdown";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionResult {
  questionNumber: number;
  questionText: string;
  maxMarks: number;
  keywordScore: number;
  semanticScore: number;
  diagramScore: number;
  grammarPenalty: number;
  finalScore: number;
  feedback: string;
  improvements: string[];
}

export default function Results() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxTotal, setMaxTotal] = useState(0);

  useEffect(() => {
    const resultsData = sessionStorage.getItem("evaluationResults");
    
    if (!resultsData) {
      toast({
        title: "No Results Found",
        description: "Please complete an evaluation first.",
        variant: "destructive",
      });
      navigate("/upload");
      return;
    }

    const parsed: QuestionResult[] = JSON.parse(resultsData);
    setResults(parsed);
    setTotalScore(parsed.reduce((sum, r) => sum + r.finalScore, 0));
    setMaxTotal(parsed.reduce((sum, r) => sum + r.maxMarks, 0));
  }, [navigate, toast]);

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalScore,
      maxTotal,
      percentage: ((totalScore / maxTotal) * 100).toFixed(1),
      results: results.map((r) => ({
        question: r.questionText,
        score: r.finalScore,
        maxMarks: r.maxMarks,
        breakdown: {
          keywords: r.keywordScore,
          semantic: r.semanticScore,
          diagram: r.diagramScore,
          grammarPenalty: r.grammarPenalty,
        },
        feedback: r.feedback,
        improvements: r.improvements,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluation-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Results downloaded successfully.",
    });
  };

  if (results.length === 0) {
    return null;
  }

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Evaluation <span className="gradient-text">Results</span>
                </h1>
                <p className="text-muted-foreground">
                  Detailed breakdown of the student's performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Link to="/upload">
                  <Button variant="glass">
                    <RefreshCw className="w-4 h-4" />
                    New Evaluation
                  </Button>
                </Link>
              </div>
            </div>

            <ResultBreakdown
              results={results}
              totalScore={totalScore}
              maxTotal={maxTotal}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <Link to="/dashboard">
                <Button variant="hero" size="lg">
                  View Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
