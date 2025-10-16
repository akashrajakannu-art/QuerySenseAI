import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Database, Brain, BarChart3, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
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
            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-float"
              style={{
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold glow-text leading-tight">
            Ask Questions.
            <br />
            <span
              className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient"
            >
              Get Answers Instantly.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A natural language interface for your data. No SQL, no complex
            queries—just ask in plain English.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center pt-8">
            <Link to="/query">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
                style={{
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                Start Querying
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="glass-card p-6 space-y-3 animate-slide-up [animation-delay:100ms]">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Local Data Query</h3>
              <p className="text-sm text-muted-foreground">
                Query student records instantly with natural language. No
                database knowledge required.
              </p>
            </div>

            <div className="glass-card p-6 space-y-3 animate-slide-up [animation-delay:200ms]">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Smart query parsing understands context, filters data, and
                delivers accurate results.
              </p>
            </div>

            <div className="glass-card p-6 space-y-3 animate-slide-up [animation-delay:300ms]">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Visual Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get results as cards, tables, or charts for clear data
                visualization.
              </p>
            </div>
          </div>

          {/* Example Queries */}
          <div className="pt-12">
            <p className="text-sm text-muted-foreground mb-4">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Who has the highest marks?",
                "Average attendance in CSE",
                "Students above 85 marks",
                "Compare departments",
              ].map((example, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-full glass-card border-primary/30 text-sm"
                >
                  {example}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 glass-card py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          QuerySense AI - Ideathon Project 2025
        </div>
      </footer>
    </div>
  );
};

export default Landing;
