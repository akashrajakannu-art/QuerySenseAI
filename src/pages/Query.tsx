import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Home, Database, RotateCcw, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>(
    getRecentQueries()
  );
  const [studentCount, setStudentCount] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || null);
      }
    });

    setStudentCount(getStoredStudents().length);

    return () => subscription.unsubscribe();
  }, [navigate]);

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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold glow-text">QuerySense AI</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-primary/30 text-sm">
                <Database className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground">{studentCount} students</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <ViewDatasetDialog 
                  students={getStoredStudents()} 
                  onDataChange={() => {
                    setStudentCount(getStoredStudents().length);
                    if (result) setResult(null);
                  }} 
                />
                <ImportDataDialog onImportData={handleImportData} />
              </div>
              <Link to="/" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden lg:inline">Home</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">Profile</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetData}
                  className="gap-2 hidden sm:flex"
                  title="Reset to default data"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <div className="hidden sm:block">
                  <AddStudentDialog onAddStudent={handleAddStudent} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    toast({
                      title: "Logged out",
                      description: "You have been logged out successfully.",
                    });
                  }}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-5xl">
        {/* AI Assistant */}
        <AIAssistant isThinking={isProcessing} />

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold glow-text">Ask me about your data</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Type your question in natural language
          </p>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmit} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Example: Who has the highest marks in CSE?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-12 sm:h-14 text-base sm:text-lg glass-card border-primary/30 focus:border-primary"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="lg"
              disabled={isProcessing || !query.trim()}
              className="h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
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
              <div className="space-y-6">
                <ChartView data={result.chartData} message={result.message} />
                <DataTable
                  students={result.data as Student[]}
                  message="Detailed Data"
                />
              </div>
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
