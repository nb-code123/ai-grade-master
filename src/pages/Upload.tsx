import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Header } from "@/components/layout/Header";
import { FileUploadZone } from "@/components/grading/FileUploadZone";
import { QuestionCard } from "@/components/grading/QuestionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Plus,
  AlertCircle,
  FileText,
  ClipboardList,
  Upload as UploadIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  maxMarks: number;
  modelAnswer?: string;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questionPaper, setQuestionPaper] = useState<File | null>(null);
  const [modelAnswerFile, setModelAnswerFile] = useState<File | null>(null);
  const [studentAnswer, setStudentAnswer] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", maxMarks: 10, modelAnswer: "" },
  ]);

  const totalMarks = useMemo(
    () => questions.reduce((sum, q) => sum + q.maxMarks, 0),
    [questions]
  );

  const isValid = totalMarks <= 100 && totalMarks > 0;

  const addQuestion = () => {
    const remaining = 100 - totalMarks;
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: "",
        maxMarks: Math.min(10, remaining),
        modelAnswer: "",
      },
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleEvaluate = () => {
    if (!isValid) {
      toast({
        title: "Invalid Total Marks",
        description: "Total marks must not exceed 100.",
        variant: "destructive",
      });
      return;
    }

    if (!studentAnswer) {
      toast({
        title: "Missing Student Answer",
        description: "Please upload the student answer sheet.",
        variant: "destructive",
      });
      return;
    }

    // Store data in sessionStorage for the processing page
    const evaluationData = {
      questions: questions.filter((q) => q.text.trim()),
      hasQuestionPaper: !!questionPaper,
      hasModelAnswer: !!modelAnswerFile,
      totalMarks,
    };
    sessionStorage.setItem("evaluationData", JSON.stringify(evaluationData));
    navigate("/processing");
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
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Upload & <span className="gradient-text">Configure</span>
              </h1>
              <p className="text-muted-foreground">
                Upload documents and configure marks for each question
              </p>
            </div>

            {/* Total Marks Indicator */}
            <motion.div
              animate={{
                borderColor: isValid ? "hsl(var(--border))" : "hsl(var(--destructive))",
              }}
              className={`glass rounded-xl p-4 mb-8 flex items-center justify-between border-2 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="font-medium">Total Marks</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-2xl font-bold ${
                    isValid ? "text-primary" : "text-destructive"
                  }`}
                >
                  {totalMarks}
                </span>
                <span className="text-muted-foreground">/ 100</span>
                {!isValid && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Exceeds limit
                  </motion.div>
                )}
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* File Uploads */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UploadIcon className="w-5 h-5 text-primary" />
                  Document Uploads
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Question Paper (Optional)
                    </label>
                    <FileUploadZone
                      file={questionPaper}
                      onFileAccepted={setQuestionPaper}
                      onRemove={() => setQuestionPaper(null)}
                      label="Question Paper"
                      description="PDF with questions"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Model Answer Key (Optional)
                    </label>
                    <FileUploadZone
                      file={modelAnswerFile}
                      onFileAccepted={setModelAnswerFile}
                      onRemove={() => setModelAnswerFile(null)}
                      label="Model Answer"
                      description="Evaluation key PDF"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Student Answer Sheet *
                    </label>
                    <FileUploadZone
                      file={studentAnswer}
                      onFileAccepted={setStudentAnswer}
                      onRemove={() => setStudentAnswer(null)}
                      label="Student Answer"
                      description="Handwritten answer PDF"
                    />
                  </div>
                </div>
              </div>

              {/* Questions Configuration */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Questions & Marks
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <AnimatePresence mode="popLayout">
                    {questions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        onUpdate={updateQuestion}
                        onRemove={removeQuestion}
                        showModelAnswer={!modelAnswerFile}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addQuestion}
                  disabled={totalMarks >= 100}
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>
            </div>

            {/* Evaluate Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                variant="hero"
                size="xl"
                onClick={handleEvaluate}
                disabled={!isValid || !studentAnswer}
              >
                Start Evaluation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
