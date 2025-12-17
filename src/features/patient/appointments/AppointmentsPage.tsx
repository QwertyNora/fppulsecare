import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { appointmentsApi } from '@/lib/api/mockApi';
import { Calendar, Clock, User, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeConfig = {
  checkup: { label: 'Checkup', className: 'bg-primary/10 text-primary' },
  'follow-up': { label: 'Follow-up', className: 'bg-secondary/30 text-secondary-foreground' },
  consultation: { label: 'Consultation', className: 'bg-accent/20 text-accent-foreground' },
  lab: { label: 'Lab Test', className: 'bg-muted text-muted-foreground' },
};

const statusConfig = {
  scheduled: { label: 'Scheduled', className: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', className: 'bg-health-positive/10 text-health-positive' },
  cancelled: { label: 'Cancelled', className: 'bg-health-critical/10 text-health-critical' },
};

export function AppointmentsPage() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.getAll,
  });

  // Filter for patient's appointments (using patient-1 as demo)
  const patientAppointments = appointments?.filter(apt => apt.patientId === 'patient-1') || [];
  
  const upcomingAppointments = patientAppointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <AppLayout>
      <PageHeader 
        title="Appointments"
        description="View and manage your upcoming appointments"
      />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : upcomingAppointments.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No appointments scheduled</p>
            <p className="text-muted-foreground">Your upcoming appointments will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {upcomingAppointments.map((apt, index) => {
            const typeStyle = typeConfig[apt.type];
            const statusStyle = statusConfig[apt.status];
            
            return (
              <Card 
                key={apt.id}
                className="shadow-card hover:shadow-lg transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Date Block */}
                    <div className="flex items-center gap-4 md:w-48">
                      <div className="p-4 rounded-xl primary-gradient text-center min-w-[70px]">
                        <p className="text-2xl font-bold text-primary-foreground">
                          {format(new Date(apt.date), 'd')}
                        </p>
                        <p className="text-xs text-primary-foreground/80 uppercase">
                          {format(new Date(apt.date), 'MMM')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{format(new Date(apt.date), 'EEEE')}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{apt.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn(typeStyle.className)} variant="secondary">
                          {typeStyle.label}
                        </Badge>
                        <Badge className={cn(statusStyle.className)} variant="secondary">
                          {statusStyle.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-foreground mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{apt.doctorName}</span>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{apt.notes}</p>
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
