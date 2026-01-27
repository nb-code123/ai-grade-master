import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Circle, Sparkles } from "lucide-react";

interface Step {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed";
}

interface EvaluationProgressProps {
  steps: Step[];
  currentStep: number;
}

export function EvaluationProgress({ steps, currentStep }: EvaluationProgressProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
            step.status === "processing"
              ? "glass border-primary/30"
              : step.status === "completed"
              ? "bg-primary/5"
              : "bg-card/50"
          }`}
        >
          <div className="flex-shrink-0">
            {step.status === "completed" ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </motion.div>
            ) : step.status === "processing" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Circle className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4
              className={`font-medium ${
                step.status === "processing"
                  ? "text-primary"
                  : step.status === "completed"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </h4>
            {step.status === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-1"
              >
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Processing...</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
