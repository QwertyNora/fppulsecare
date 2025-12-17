import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { messagesApi, doctorsApi } from '@/lib/api/mockApi';
import { useAuth } from '@/features/auth/AuthContext';
import { MessageSquare, Plus, Send, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export function PatientMessagesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['patient-messages', user?.id],
    queryFn: () => messagesApi.getByPatientId(user?.id || 'patient-1'),
  });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorsApi.getAll,
  });

  const sendMessageMutation = useMutation({
    mutationFn: messagesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-messages'] });
      toast({ title: 'Message sent', description: 'Your message has been sent to the doctor.' });
      resetForm();
    },
  });

  const resetForm = () => {
    setSelectedDoctorId('');
    setSubject('');
    setContent('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !subject.trim() || !content.trim()) return;

    const selectedDoctor = doctors?.find(d => d.id === selectedDoctorId);
    
    sendMessageMutation.mutate({
      patientId: user?.id || 'patient-1',
      patientName: user?.name || 'John Smith',
      doctorId: selectedDoctorId,
      doctorName: selectedDoctor?.name || '',
      subject,
      content,
      date: new Date().toISOString(),
      read: false,
      fromPatient: true,
    });
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Messages"
        description="Send messages to your healthcare providers"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send a Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors?.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex flex-col">
                          <span>{doctor.name}</span>
                          <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Message subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  placeholder="Write your message here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={sendMessageMutation.isPending} className="gap-2">
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Message
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : messages?.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No messages yet</p>
            <p className="text-muted-foreground mb-4">Send your first message to a doctor</p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Send a Message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages?.map((message, index) => (
            <Card 
              key={message.id}
              className="shadow-card hover:shadow-lg transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">To: {message.doctorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(message.date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  {!message.read && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      Sent
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{message.subject}</h3>
                <p className="text-sm text-muted-foreground">{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
