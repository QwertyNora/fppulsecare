import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appointmentsApi } from '@/lib/api/mockApi';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const typeColors = {
  checkup: 'bg-primary/10 text-primary',
  'follow-up': 'bg-secondary/30 text-secondary-foreground',
  consultation: 'bg-accent/20 text-accent-foreground',
  lab: 'bg-muted text-muted-foreground',
};

export function AppointmentsWidget() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.getAll,
  });

  const upcomingAppointments = appointments
    ?.filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Card className="shadow-card h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Appointments
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/appointments" className="text-primary hover:text-primary-dark">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse p-4 rounded-lg bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : upcomingAppointments?.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          upcomingAppointments?.map((apt) => (
            <div 
              key={apt.id} 
              className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={typeColors[apt.type]} variant="secondary">
                      {apt.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{apt.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(apt.date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {apt.time}
                    </span>
                  </div>
                </div>
              </div>
              {apt.notes && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                  {apt.notes}
                </p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
