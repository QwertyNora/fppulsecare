import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notesApi } from '@/lib/api/mockApi';
import { useAuth } from '@/features/auth/AuthContext';
import { StickyNote, ArrowRight, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';

export function NotesWidget() {
  const { user } = useAuth();
  
  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: () => notesApi.getByPatientId(user?.id || 'patient-1'),
  });

  const recentNotes = notes?.slice(0, 2);

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StickyNote className="h-5 w-5 text-primary" />
          Appointment Notes
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/notes" className="text-primary hover:text-primary-dark">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse p-3 rounded-lg bg-muted/50">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : recentNotes?.length === 0 ? (
          <div className="text-center py-6">
            <StickyNote className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No appointment notes yet</p>
          </div>
        ) : (
          recentNotes?.map((note) => (
            <div 
              key={note.id}
              className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Stethoscope className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">{note.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(note.date), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-xs text-primary mb-1">{note.doctorName}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{note.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
