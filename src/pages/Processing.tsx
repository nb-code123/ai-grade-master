import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import { EvaluationProgress } from "@/components/grading/EvaluationProgress";
import { Brain, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Step {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed";
}

const initialSteps: Step[] = [
  { id: "ocr", label: "Extracting text from answer sheet", status: "pending" },
  { id: "parse", label: "Parsing questions and answers", status: "pending" },
  { id: "keywords", label: "Analyzing keyword matches", status: "pending" },
  { id: "semantic", label: "Computing semantic similarity", status: "pending" },
  { id: "diagram", label: "Detecting diagrams", status: "pending" },
  { id: "grammar", label: "Evaluating grammar quality", status: "pending" },
  { id: "scoring", label: "Calculating final scores", status: "pending" },
];

export default function Processing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const evaluationData = sessionStorage.getItem("evaluationData");
    
    if (!evaluationData) {
      toast({
        title: "No Data Found",
        description: "Please upload documents first.",
        variant: "destructive",
      });
      navigate("/upload");
      return;
    }

    // Simulate processing steps
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        setSteps((prev) =>
          prev.map((step, idx) =>
            idx === i
              ? { ...step, status: "processing" }
              : idx < i
              ? { ...step, status: "completed" }
              : step
          )
        );

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));
      }

      // Complete all steps
      setSteps((prev) =>
        prev.map((step) => ({ ...step, status: "completed" }))
      );

      // Generate mock results
      const data = JSON.parse(evaluationData);
      const mockResults = data.questions.map((q: any, idx: number) => ({
        questionNumber: idx + 1,
        questionText: q.text || `Question ${idx + 1}`,
        maxMarks: q.maxMarks,
        keywordScore: q.maxMarks * 0.3 * (0.6 + Math.random() * 0.4),
        semanticScore: q.maxMarks * 0.4 * (0.5 + Math.random() * 0.5),
        diagramScore: Math.random() > 0.7 ? q.maxMarks * 0.2 * Math.random() : 0,
        grammarPenalty: q.maxMarks * 0.1 * Math.random() * 0.5,
        finalScore: 0,
        feedback: "Good attempt. The answer covers most key concepts but could be more detailed.",
        improvements: [
          "Include more specific examples",
          "Elaborate on key terminology",
          "Add diagrams where applicable",
        ],
      }));

      // Calculate final scores
      mockResults.forEach((r: any) => {
        r.finalScore = Math.min(
          r.maxMarks,
          Math.max(0, r.keywordScore + r.semanticScore + r.diagramScore - r.grammarPenalty)
        );
      });

      sessionStorage.setItem("evaluationResults", JSON.stringify(mockResults));

      // Wait a moment then navigate
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/results");
    };

    processSteps();
  }, [navigate, toast]);

  return (
    <>
      <Header />
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6"
              >
                <Brain className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                AI <span className="gradient-text">Evaluation</span> in Progress
              </h1>
              <p className="text-muted-foreground">
                Please wait while we analyze the student's answers
              </p>
            </div>

            <EvaluationProgress steps={steps} currentStep={currentStep} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Powered by Gemini AI
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
