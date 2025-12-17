import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { patientsApi, appointmentsApi, medicationsApi } from '@/lib/api/mockApi';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Pill,
  ArrowLeft,
  Edit2,
  Plus,
  Trash2,
  Heart,
  AlertCircle,
  Loader2,
  Clock,
  Save
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function PatientDetailPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<any>(null);
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  
  // New prescription form state
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'daily', timesPerDay: 1, instructions: '' });
  // New appointment form state
  const [newApt, setNewApt] = useState({ date: '', time: '', type: 'checkup' as const, doctorName: '', notes: '' });

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientsApi.getById(patientId!),
    enabled: !!patientId,
  });

  const { data: appointments } = useQuery({
    queryKey: ['patientAppointments', patientId],
    queryFn: () => appointmentsApi.getByPatientId(patientId!),
    enabled: !!patientId,
  });

  const { data: medications } = useQuery({
    queryKey: ['medications'],
    queryFn: medicationsApi.getAll,
  });

  const updatePatientMutation = useMutation({
    mutationFn: (data: any) => patientsApi.update(patientId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      toast({ title: 'Patient updated', description: 'Changes have been saved.' });
      setIsEditing(false);
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointments', patientId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Appointment created', description: 'New appointment has been scheduled.' });
      setShowAddAppointment(false);
      setNewApt({ date: '', time: '', type: 'checkup', doctorName: '', notes: '' });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: appointmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointments', patientId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Appointment deleted' });
    },
  });

  const createMedicationMutation = useMutation({
    mutationFn: medicationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({ title: 'Prescription added', description: 'New medication has been added.' });
      setShowAddPrescription(false);
      setNewMed({ name: '', dosage: '', frequency: 'daily', timesPerDay: 1, instructions: '' });
    },
  });

  const handleStartEdit = () => {
    setEditedPatient({ ...patient });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedPatient) {
      updatePatientMutation.mutate(editedPatient);
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    createAppointmentMutation.mutate({
      ...newApt,
      patientId: patient.id,
      patientName: patient.name,
      status: 'scheduled',
    });
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    createMedicationMutation.mutate({
      ...newMed,
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!patient) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Patient not found</p>
          <Button variant="outline" onClick={() => navigate('/admin/patients')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/admin/patients')} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
      </div>

      <PageHeader 
        title={patient.name}
        description={`Patient since ${format(new Date(patient.createdAt), 'MMMM yyyy')}`}
      >
        {!isEditing ? (
          <Button onClick={handleStartEdit} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Patient
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updatePatientMutation.isPending} className="gap-2">
              {updatePatientMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </PageHeader>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={editedPatient?.name || ''} 
                        onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        value={editedPatient?.email || ''} 
                        onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input 
                        value={editedPatient?.phone || ''} 
                        onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">DOB: {format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Blood Type</Label>
                  <p className="text-lg font-semibold text-foreground">{patient.bloodType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Conditions</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patient.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="bg-primary/10 text-primary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Allergies
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="secondary" className="bg-destructive/10 text-destructive">
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No known allergies</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="shadow-card md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <Label className="text-muted-foreground text-sm">Name</Label>
                    <p className="text-foreground font-medium">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Phone</Label>
                    <p className="text-foreground font-medium">{patient.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Relationship</Label>
                    <p className="text-foreground font-medium">{patient.emergencyContact.relationship}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAddAppointment} onOpenChange={setShowAddAppointment}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAppointment} className="space-y-4">
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
                    <Label>Notes</Label>
                    <Textarea 
                      placeholder="Appointment notes..."
                      value={newApt.notes}
                      onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowAddAppointment(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createAppointmentMutation.isPending}>
                      {createAppointmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Schedule
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {appointments?.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No appointments scheduled</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {appointments?.map((apt) => (
                <Card key={apt.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg primary-gradient text-center min-w-[60px]">
                          <p className="text-lg font-bold text-primary-foreground">
                            {format(new Date(apt.date), 'd')}
                          </p>
                          <p className="text-[10px] text-primary-foreground/80 uppercase">
                            {format(new Date(apt.date), 'MMM')}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">
                              {apt.type.replace('-', ' ')}
                            </Badge>
                            <Badge variant="secondary" className={cn(
                              apt.status === 'scheduled' ? 'bg-health-positive/10 text-health-positive' : 'bg-muted text-muted-foreground'
                            )}>
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="font-medium text-foreground">{apt.doctorName}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {apt.time}
                          </div>
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
                      <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">{apt.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAddPrescription} onOpenChange={setShowAddPrescription}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Prescription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Prescription</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPrescription} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Medication Name</Label>
                    <Input 
                      placeholder="e.g., Metformin"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input 
                        placeholder="e.g., 500mg"
                        value={newMed.dosage}
                        onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Times per Day</Label>
                      <Input 
                        type="number"
                        min="1"
                        max="10"
                        value={newMed.timesPerDay}
                        onChange={(e) => setNewMed({ ...newMed, timesPerDay: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Instructions</Label>
                    <Textarea 
                      placeholder="e.g., Take with meals"
                      value={newMed.instructions}
                      onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowAddPrescription(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMedicationMutation.isPending}>
                      {createMedicationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Prescription
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {medications?.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pill className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No prescriptions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {medications?.map((med) => (
                <Card key={med.id} className="shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-accent/20">
                        <Pill className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{med.name}</h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {med.dosage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {med.timesPerDay}x daily • {med.frequency}
                        </p>
                        {med.instructions && (
                          <p className="text-sm text-muted-foreground mt-2">{med.instructions}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
