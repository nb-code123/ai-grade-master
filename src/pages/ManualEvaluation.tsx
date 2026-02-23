import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import { ScoringFormulaCustomizer } from "@/components/grading/ScoringFormulaCustomizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScoreDisplay } from "@/components/grading/ScoreDisplay";
import { ArrowRight, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScoringFormula, DEFAULT_FORMULA } from "@/lib/scoringFormula";

interface EvaluationResult {
  finalScore: number;
  keywordScore: number;
  semanticScore: number;
  diagramScore: number;
  grammarPenalty: number;
  feedback: string;
  improvements: string[];
}

export default function ManualEvaluation() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [question, setQuestion] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [maxMarks, setMaxMarks] = useState(10);
  const [scoringFormula, setScoringFormula] = useState<ScoringFormula>(DEFAULT_FORMULA);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (!question.trim() || !modelAnswer.trim() || !studentAnswer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (maxMarks <= 0 || maxMarks > 100) {
      toast({
        title: "Invalid Marks",
        description: "Marks must be between 1 and 100.",
        variant: "destructive",
      });
      return;
    }

    // Validate scoring formula if using custom
    if (scoringFormula.useCustom) {
      const total = Object.values(scoringFormula.weights).reduce((sum, w) => sum + w, 0);
      if (Math.abs(total - 100) >= 0.1) {
        toast({
          title: "Invalid Scoring Formula",
          description: "Custom weights must sum to 100%.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsEvaluating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-answer", {
        body: {
          question,
          modelAnswer,
          studentAnswer,
          maxMarks,
          scoringFormula,
        },
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Evaluation Complete",
        description: `Score: ${data.finalScore.toFixed(1)} / ${maxMarks}`,
      });
    } catch (error) {
      console.error("Evaluation error:", error);
      toast({
        title: "Evaluation Failed",
        description: "Unable to evaluate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setModelAnswer("");
    setStudentAnswer("");
    setMaxMarks(10);
    setScoringFormula(DEFAULT_FORMULA);
    setResult(null);
  };

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
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Single Question Mode
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Manual <span className="gradient-text">Evaluation</span>
              </h1>
              <p className="text-muted-foreground">
                Quickly evaluate individual questions without uploading PDFs
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-3 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-xl p-6 space-y-5"
                >
                  {/* Question */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Question
                    </label>
                    <Textarea
                      placeholder="Enter the question..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Max Marks */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Maximum Marks</label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>

                  {/* Model Answer */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Model Answer / Evaluation Key
                    </label>
                    <Textarea
                      placeholder="Enter the expected answer or key points..."
                      value={modelAnswer}
                      onChange={(e) => setModelAnswer(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  {/* Student Answer */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Student Answer
                    </label>
                    <Textarea
                      placeholder="Paste or type the student's answer..."
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      className="min-h-[150px] resize-none"
                    />
                  </div>

                  {/* Scoring Formula Customizer */}
                  <div className="mt-5">
                    <ScoringFormulaCustomizer
                      onFormulaChange={setScoringFormula}
                      initialFormula={scoringFormula}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={handleEvaluate}
                      disabled={isEvaluating}
                      className="flex-1"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Evaluate Answer
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Results Section */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-xl p-6 sticky top-24"
                >
                  <h3 className="text-lg font-semibold mb-6 text-center">
                    Evaluation Result
                  </h3>

                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-center">
                        <ScoreDisplay
                          score={result.finalScore}
                          maxScore={maxMarks}
                          size="lg"
                        />
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Keywords</p>
                          <p className="font-semibold text-primary">
                            {result.keywordScore.toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Semantic</p>
                          <p className="font-semibold text-accent">
                            {result.semanticScore.toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Diagram</p>
                          <p className="font-semibold">
                            {result.diagramScore.toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Grammar</p>
                          <p className="font-semibold text-destructive">
                            -{result.grammarPenalty.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="bg-card/50 rounded-lg p-4">
                        <h5 className="text-sm font-medium mb-2">Feedback</h5>
                        <p className="text-sm text-muted-foreground">
                          {result.feedback}
                        </p>
                      </div>

                      {/* Improvements */}
                      {result.improvements.length > 0 && (
                        <div className="bg-card/50 rounded-lg p-4">
                          <h5 className="text-sm font-medium mb-2">Improvements</h5>
                          <ul className="space-y-1">
                            {result.improvements.map((imp, i) => (
                              <li
                                key={i}
                                className="text-sm text-muted-foreground flex items-start gap-2"
                              >
                                <span className="text-primary">•</span>
                                {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Fill in the details and click
                        <br />
                        "Evaluate Answer" to see results
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
