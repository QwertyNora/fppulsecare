import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { appointmentsApi, patientsApi } from '@/lib/api/mockApi';
import { Calendar as CalendarIcon, Clock, User, Trash2, Plus, Loader2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const typeConfig = {
  checkup: { label: 'Checkup', className: 'bg-primary/10 text-primary' },
  'follow-up': { label: 'Follow-up', className: 'bg-secondary/30 text-secondary-foreground' },
  consultation: { label: 'Consultation', className: 'bg-accent/20 text-accent-foreground' },
  lab: { label: 'Lab Test', className: 'bg-muted text-muted-foreground' },
};

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newApt, setNewApt] = useState({
    patientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'checkup' as const,
    doctorName: '',
    notes: '',
  });

  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.getAll,
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsApi.getAll,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Appointment created', description: 'New appointment has been scheduled.' });
      setShowAddDialog(false);
      setNewApt({
        patientId: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '09:00',
        type: 'checkup',
        doctorName: '',
        notes: '',
      });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: appointmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Appointment deleted' });
    },
  });

  const selectedDateAppointments = appointments?.filter(apt => 
    isSameDay(new Date(apt.date), selectedDate)
  ).sort((a, b) => a.time.localeCompare(b.time));

  const datesWithAppointments = appointments?.map(apt => new Date(apt.date)) || [];

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients?.find(p => p.id === newApt.patientId);
    if (!patient) return;

    createAppointmentMutation.mutate({
      ...newApt,
      patientName: patient.name,
      status: 'scheduled',
    });
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Appointment Calendar"
        description="View and manage all patient appointments"
      >
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={newApt.patientId} onValueChange={(v) => setNewApt({ ...newApt, patientId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={newApt.date}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={newApt.time}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newApt.type} onValueChange={(v: any) => setNewApt({ ...newApt, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="lab">Lab Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Input 
                  placeholder="Dr. Name"
                  value={newApt.doctorName}
                  onChange={(e) => setNewApt({ ...newApt, doctorName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea 
                  placeholder="Appointment notes..."
                  value={newApt.notes}
                  onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAppointmentMutation.isPending || !newApt.patientId}>
                  {createAppointmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Calendar */}
        <Card className="shadow-card h-fit">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="pointer-events-auto"
              modifiers={{
                hasAppointments: datesWithAppointments,
              }}
              modifiersStyles={{
                hasAppointments: {
                  backgroundColor: 'hsl(var(--primary) / 0.15)',
                  fontWeight: 600,
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Appointments for Selected Date */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedDateAppointments?.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No appointments on this date</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setNewApt(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
                    setShowAddDialog(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedDateAppointments?.map((apt, index) => {
                const typeStyle = typeConfig[apt.type];
                
                return (
                  <Card 
                    key={apt.id} 
                    className="shadow-card animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-lg font-semibold text-foreground min-w-[70px]">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {apt.time}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={cn(typeStyle.className)} variant="secondary">
                                {typeStyle.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-foreground">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{apt.patientName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{apt.doctorName}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => deleteAppointmentMutation.mutate(apt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {apt.notes && (
                        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                          {apt.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
