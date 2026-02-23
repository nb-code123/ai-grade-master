import { motion } from "framer-motion";
import { ScoreDisplay } from "./ScoreDisplay";
import { ChevronDown, ChevronUp, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";

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

interface Weights {
  keywords: number;
  semantic: number;
  diagram: number;
  grammar: number;
}

interface ResultBreakdownProps {
  results: QuestionResult[];
  totalScore: number;
  maxTotal: number;
  weights?: Weights;
}

const DEFAULT_WEIGHTS: Weights = { keywords: 30, semantic: 40, diagram: 20, grammar: 10 };

export function ResultBreakdown({ results, totalScore, maxTotal, weights = DEFAULT_WEIGHTS }: ResultBreakdownProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Total Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <h2 className="text-xl font-semibold mb-6">Total Score</h2>
        <ScoreDisplay score={totalScore} maxScore={maxTotal} size="lg" label="" />
        <p className="mt-4 text-muted-foreground">
          {((totalScore / maxTotal) * 100).toFixed(1)}% achieved
        </p>
      </motion.div>

      {/* Question Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Question-wise Breakdown</h3>
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-5 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  Q{result.questionNumber}
                </span>
                <div className="text-left">
                  <p className="font-medium line-clamp-1">{result.questionText}</p>
                  <p className="text-sm text-muted-foreground">
                    {result.finalScore.toFixed(1)} / {result.maxMarks} marks
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className={`text-lg font-bold ${result.finalScore / result.maxMarks >= 0.8
                        ? "text-primary"
                        : result.finalScore / result.maxMarks >= 0.6
                          ? "text-accent"
                          : result.finalScore / result.maxMarks >= 0.4
                            ? "text-yellow-500"
                            : "text-destructive"
                      }`}
                  >
                    {((result.finalScore / result.maxMarks) * 100).toFixed(0)}%
                  </span>
                </div>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {expandedIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border/50 p-5 space-y-4"
              >
                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Keywords ({weights.keywords}%)</p>
                    <p className="font-semibold text-primary">
                      {result.keywordScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Semantic ({weights.semantic}%)</p>
                    <p className="font-semibold text-accent">
                      {result.semanticScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Diagram ({weights.diagram}%)</p>
                    <p className="font-semibold">{result.diagramScore.toFixed(1)}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Grammar (-{weights.grammar}%)</p>
                    <p className="font-semibold text-destructive">
                      -{result.grammarPenalty.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-card/50 rounded-lg p-4">
                  <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    AI Feedback
                  </h5>
                  <p className="text-sm text-muted-foreground">{result.feedback}</p>
                </div>

                {/* Improvements */}
                {result.improvements.length > 0 && (
                  <div className="bg-card/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Suggested Improvements
                    </h5>
                    <ul className="space-y-1">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
