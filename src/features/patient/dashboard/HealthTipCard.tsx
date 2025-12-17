import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { healthTipsApi } from '@/lib/api/mockApi';
import { Sparkles, RefreshCw, Pill, Droplets, Heart, Moon } from 'lucide-react';
import { useState } from 'react';

const categoryIcons = {
  medication: Pill,
  nutrition: Droplets,
  exercise: Heart,
  sleep: Moon,
  wellness: Sparkles,
};

const categoryColors = {
  medication: 'bg-accent/20 text-accent-foreground',
  nutrition: 'bg-secondary/30 text-secondary-foreground',
  exercise: 'bg-primary/20 text-primary-dark',
  sleep: 'bg-muted text-muted-foreground',
  wellness: 'bg-primary-light/50 text-primary-dark',
};

export function HealthTipCard() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: tip, isLoading, refetch } = useQuery({
    queryKey: ['healthTip', refreshKey],
    queryFn: healthTipsApi.getRandom,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading || !tip) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="animate-pulse flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const IconComponent = categoryIcons[tip.category] || Sparkles;

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Icon Section */}
          <div className={`p-6 flex items-center justify-center ${categoryColors[tip.category]}`}>
            <div className="p-3 rounded-2xl bg-background/50">
              <IconComponent className="h-8 w-8" />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Daily Health Tip
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary capitalize">
                    {tip.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tip.content}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleRefresh}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Get new tip</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
