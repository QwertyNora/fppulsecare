import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { patientsApi, appointmentsApi, messagesApi } from '@/lib/api/mockApi';
import { useAuth } from '@/features/auth/AuthContext';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  User,
  Clock,
  Loader2 
} from 'lucide-react';
import { format } from 'date-fns';

export function AdminDashboard() {
  const { user } = useAuth();

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsApi.getAll,
  });

  const { data: appointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.getAll,
  });

  const { data: unreadCount, isLoading: loadingMessages } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: messagesApi.getUnreadCount,
  });

  const isLoading = loadingPatients || loadingAppointments || loadingMessages;

  const todayAppointments = appointments?.filter(apt => 
    apt.date === format(new Date(), 'yyyy-MM-dd') && apt.status === 'scheduled'
  ) || [];

  const upcomingAppointments = appointments
    ?.filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title={`Welcome, ${user?.name?.split(' ')[1] || 'Admin'}!`}
        description="Here's an overview of today's activities"
      />
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value={patients?.length || 0}
          icon={<Users className="h-5 w-5" />}
          className="animate-slide-up"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={<Calendar className="h-5 w-5" />}
          className="animate-slide-up [animation-delay:0.1s]"
        />
        <StatCard
          title="Unread Messages"
          value={unreadCount || 0}
          icon={<MessageSquare className="h-5 w-5" />}
          status={unreadCount && unreadCount > 0 ? 'warning' : 'normal'}
          className="animate-slide-up [animation-delay:0.2s]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Recent Patients
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/patients" className="text-primary hover:text-primary-dark">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {patients?.slice(0, 4).map((patient) => (
              <Link
                key={patient.id}
                to={`/admin/patients/${patient.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.email}</p>
                </div>
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                  {patient.conditions.length} conditions
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/calendar" className="text-primary hover:text-primary-dark">
                View calendar
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments?.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="p-2 rounded-lg primary-gradient text-center min-w-[50px]">
                  <p className="text-lg font-bold text-primary-foreground">
                    {format(new Date(apt.date), 'd')}
                  </p>
                  <p className="text-[10px] text-primary-foreground/80 uppercase">
                    {format(new Date(apt.date), 'MMM')}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{apt.patientName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{apt.time}</span>
                    <span>•</span>
                    <span className="capitalize">{apt.type.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
