import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Home, Database, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import AIAssistant from "@/components/AIAssistant";
import AnswerCard from "@/components/AnswerCard";
import DataTable from "@/components/DataTable";
import ChartView from "@/components/ChartView";
import ErrorBox from "@/components/ErrorBox";
import QueryHistory from "@/components/QueryHistory";
import AddStudentDialog from "@/components/AddStudentDialog";
import ImportDataDialog from "@/components/ImportDataDialog";
import ViewDatasetDialog from "@/components/ViewDatasetDialog";
import {
  processQuery,
  QueryResult,
  getRecentQueries,
  saveQuery,
  Student,
} from "@/utils/queryParser";
import {
  getStoredStudents,
  addStudent as addStudentToStorage,
  resetStudents,
  saveStudents,
} from "@/utils/studentStorage";
import { toast } from "@/hooks/use-toast";

const Query = () => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>(
    getRecentQueries()
  );
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    setStudentCount(getStoredStudents().length);
  }, []);

  const handleAddStudent = (student: Student) => {
    addStudentToStorage(student);
    setStudentCount(getStoredStudents().length);
    // Clear current result to show updated data
    if (result) {
      setResult(null);
    }
  };

  const handleResetData = () => {
    resetStudents();
    setStudentCount(getStoredStudents().length);
    setResult(null);
    toast({
      title: "Data Reset",
      description: "Student data has been reset to default",
    });
  };

  const handleImportData = (students: Student[]) => {
    saveStudents(students);
    setStudentCount(students.length);
    setResult(null);
    toast({
      title: "Import Complete",
      description: `Successfully imported ${students.length} student records`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    setResult(null);

    // Simulate AI processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const queryResult = processQuery(query);
    setResult(queryResult);
    setIsProcessing(false);

    // Save to history
    saveQuery(query);
    setRecentQueries(getRecentQueries());
  };

  const handleSelectRecentQuery = (selectedQuery: string) => {
    setQuery(selectedQuery);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-primary/20 glass-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold glow-text">QuerySense AI</span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-primary/30 text-sm">
                <Database className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">{studentCount} students</span>
              </div>
              <ViewDatasetDialog students={getStoredStudents()} />
              <ImportDataDialog onImportData={handleImportData} />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetData}
                className="gap-2"
                title="Reset to default data"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <AddStudentDialog onAddStudent={handleAddStudent} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
        {/* AI Assistant */}
        <AIAssistant isThinking={isProcessing} />

        {/* Title */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold glow-text">Ask me about your data</h1>
          <p className="text-muted-foreground">
            Type your question in natural language
          </p>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Example: Who has the highest marks in CSE?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-14 text-lg glass-card border-primary/30 focus:border-primary"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="lg"
              disabled={isProcessing || !query.trim()}
              className="h-14 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              style={{
                boxShadow: "var(--shadow-glow)",
              }}
            >
              {isProcessing ? (
                <>
                  <span className="animate-pulse">Processing</span>
                </>
              ) : (
                <>
                  Ask
                  <Send className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Recent Queries */}
        <QueryHistory
          queries={recentQueries}
          onSelectQuery={handleSelectRecentQuery}
        />

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.type === "error" && <ErrorBox message={result.error!} />}

            {result.type === "single" && (
              <AnswerCard
                message={result.message!}
                student={result.data as Student}
              />
            )}

            {result.type === "multiple" && !result.chartData && (
              <DataTable
                students={result.data as Student[]}
                message={result.message}
              />
            )}

            {result.type === "multiple" && result.chartData && (
              <ChartView data={result.chartData} message={result.message} />
            )}
          </div>
        )}

        {/* Suggestions (when no result) */}
        {!result && !isProcessing && (
          <div className="glass-card p-8 space-y-4 animate-slide-up">
            <h3 className="font-semibold text-lg text-center mb-4">
              💡 Try these queries:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Who has the highest marks?",
                "Average attendance in IT department",
                "Show students with marks above 85",
                "List all students in CSE",
                "Who has the lowest attendance?",
                "Compare departments",
              ].map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => setQuery(suggestion)}
                  className="glass-card border-primary/30 hover:bg-primary/20 hover:text-primary-foreground justify-start text-left h-auto py-3"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Query;
