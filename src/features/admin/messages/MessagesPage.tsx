import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/shared/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { messagesApi } from '@/lib/api/mockApi';
import { MessageSquare, User, Clock, Mail, MailOpen, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesApi.getAll,
  });

  const markAsReadMutation = useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
    },
  });

  const handleSelectMessage = (messageId: string, isRead: boolean) => {
    setSelectedMessage(messageId);
    if (!isRead) {
      markAsReadMutation.mutate(messageId);
    }
  };

  const selectedMessageData = messages?.find(m => m.id === selectedMessage);
  const unreadCount = messages?.filter(m => !m.read).length || 0;

  return (
    <AppLayout>
      <PageHeader 
        title="Messages"
        description={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : messages?.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No messages</p>
            <p className="text-muted-foreground">Patient messages will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Message List */}
          <div className="space-y-2">
            {messages?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((message, index) => (
              <Card 
                key={message.id}
                className={cn(
                  'shadow-card cursor-pointer transition-all hover:shadow-lg animate-slide-up',
                  selectedMessage === message.id && 'ring-2 ring-primary',
                  !message.read && 'bg-primary/5'
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleSelectMessage(message.id, message.read)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-full shrink-0',
                      message.read ? 'bg-muted' : 'bg-primary/10'
                    )}>
                      {message.read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={cn(
                          'font-medium truncate',
                          !message.read && 'text-foreground',
                          message.read && 'text-muted-foreground'
                        )}>
                          {message.patientName}
                        </span>
                        {!message.read && (
                          <Badge className="bg-primary text-primary-foreground text-[10px]">New</Badge>
                        )}
                      </div>
                      <p className={cn(
                        'text-sm truncate mb-1',
                        !message.read ? 'text-foreground font-medium' : 'text-muted-foreground'
                      )}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(message.date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Detail */}
          <Card className="shadow-card h-fit lg:sticky lg:top-20">
            {selectedMessageData ? (
              <CardContent className="p-6">
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{selectedMessageData.patientName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(selectedMessageData.date), 'MMMM d, yyyy at h:mm a')}
                      </div>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedMessageData.subject}</h2>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{selectedMessageData.content}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="w-full sm:w-auto">
                    Reply to {selectedMessageData.patientName.split(' ')[0]}
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a message to view</p>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
