import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { notesApi, appointmentsApi } from '@/lib/api/mockApi';
import { useAuth } from '@/features/auth/AuthContext';
import { StickyNote, Loader2, Stethoscope, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function NotesPage() {
  const { user } = useAuth();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: () => notesApi.getByPatientId(user?.id || 'patient-1'),
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => appointmentsApi.getByPatientId(user?.id || 'patient-1'),
  });

  const getAppointmentDetails = (appointmentId: string) => {
    return appointments?.find(a => a.id === appointmentId);
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Appointment Notes"
        description="Notes from your healthcare providers after appointments"
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notes?.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No notes yet</p>
            <p className="text-muted-foreground">Notes from your appointments will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes?.map((note, index) => {
            const appointment = getAppointmentDetails(note.appointmentId);
            return (
              <Card 
                key={note.id}
                className="shadow-card hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{note.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(note.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-3">{note.doctorName}</p>
                      <p className="text-sm text-muted-foreground mb-3">{note.content}</p>
                      {appointment && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            From {appointment.type} appointment on {format(new Date(appointment.date), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
