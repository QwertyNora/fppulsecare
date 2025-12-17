import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Calendar, Pill, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Health Tracking',
    description: 'Monitor vital signs, blood samples, and health metrics in real-time.',
  },
  {
    icon: Pill,
    title: 'Medication Management',
    description: 'Never miss a dose with smart medication reminders and tracking.',
  },
  {
    icon: Calendar,
    title: 'Appointment Scheduling',
    description: 'Book and manage appointments with your healthcare providers.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is protected with enterprise-grade security.',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl primary-gradient shadow-sm">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PulseCare</span>
          </div>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Your Health, Our Priority
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Take Control of Your 
            <span className="text-primary"> Health Journey</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            PulseCare empowers you to track health data, manage medications, schedule appointments, 
            and receive personalized health insights—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-glow">
                <Users className="h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools designed to help you manage chronic conditions effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="shadow-card hover:shadow-lg transition-all duration-300 animate-slide-up border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <Card className="shadow-lg border-0 primary-gradient overflow-hidden">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of patients who are taking control of their health with PulseCare.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="shadow-md">
                Sign In Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">PulseCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PulseCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
