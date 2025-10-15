import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface QueryHistoryProps {
  queries: string[];
  onSelectQuery: (query: string) => void;
}

const QueryHistory = ({ queries, onSelectQuery }: QueryHistoryProps) => {
  if (queries.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Recent Queries</span>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {queries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelectQuery(query)}
              className="whitespace-nowrap glass-card border-primary/30 hover:bg-primary/20 hover:text-primary-foreground transition-colors"
            >
              {query}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default QueryHistory;
