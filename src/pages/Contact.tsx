import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Star,
  Heart
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'john@example.com',
      description: 'Send me an email anytime',
      color: 'text-blue-500'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
      color: 'text-green-500'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'San Francisco, CA',
      description: 'Available for remote work',
      color: 'text-purple-500'
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'I usually respond quickly',
      color: 'text-orange-500'
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/johndoe',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/johndoe',
      icon: Github,
      color: 'text-gray-800',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/johndoe',
      icon: Twitter,
      color: 'text-blue-400',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Simulate successful submission
    setSubmitStatus('success');
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitStatus('idle');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section ref={elementRef} className="py-24 content-gradient relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <FloatingShapes />
        <GradientMesh />
        <div className="absolute inset-0 morphing-bg opacity-30"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'gradient-y 25s ease infinite'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-brand-accent/10 px-4 py-2 rounded-full mb-6">
              <MessageSquare className="w-4 h-4 text-brand-accent animate-pulse-soft" />
              <span className="text-brand-accent font-medium text-sm">Get in Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-content-primary mb-6">
              Let's Work Together
            </h1>
            <p className="text-xl text-content-secondary max-w-4xl mx-auto leading-relaxed">
              Have a project in mind? Want to collaborate? Or just want to say hello? 
              I'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-content-primary">
                    <MessageSquare className="w-5 h-5" />
                    <span>Send a Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-content-primary">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="border-border bg-background text-content-primary placeholder-content-secondary focus:border-brand-accent focus:ring-brand-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-content-primary">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-border bg-background text-content-primary placeholder-content-secondary focus:border-brand-accent focus:ring-brand-accent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-content-primary">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="border-border bg-background text-content-primary placeholder-content-secondary focus:border-brand-accent focus:ring-brand-accent"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-content-primary">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project, question, or just say hello..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="border-border bg-background text-content-primary placeholder-content-secondary focus:border-brand-accent focus:ring-brand-accent"
                      />
                    </div>
                  
                    {submitStatus === 'success' && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700">Message sent successfully! I'll get back to you soon.</span>
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">Please fill in all required fields.</span>
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-primary/90 hover:to-brand-accent/90" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                </form>
              </CardContent>
            </Card>

              {/* FAQ Section */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-content-primary">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-brand-accent/30 pl-4 hover:border-brand-accent transition-colors">
                    <h4 className="font-semibold mb-2 text-content-primary">What services do you offer?</h4>
                    <p className="text-content-secondary text-sm">
                      I specialize in full-stack web development, including React applications, 
                      Node.js APIs, and modern web technologies.
                    </p>
                  </div>
                  <div className="border-l-4 border-brand-accent/30 pl-4 hover:border-brand-accent transition-colors">
                    <h4 className="font-semibold mb-2 text-content-primary">What's your typical response time?</h4>
                    <p className="text-content-secondary text-sm">
                      I usually respond to emails within 24 hours, often much sooner during business hours.
                    </p>
                  </div>
                  <div className="border-l-4 border-brand-accent/30 pl-4 hover:border-brand-accent transition-colors">
                    <h4 className="font-semibold mb-2 text-content-primary">Do you work remotely?</h4>
                    <p className="text-content-secondary text-sm">
                      Yes! I'm comfortable working remotely and have experience collaborating 
                      with teams across different time zones.
                    </p>
                  </div>
                  <div className="border-l-4 border-brand-accent/30 pl-4 hover:border-brand-accent transition-colors">
                    <h4 className="font-semibold mb-2 text-content-primary">What are your rates?</h4>
                    <p className="text-content-secondary text-sm">
                      My rates vary depending on project scope and complexity. Let's discuss 
                      your specific needs to provide an accurate quote.
                    </p>
                  </div>
                </CardContent>
              </Card>
          </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-content-primary">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className={`w-5 h-5 ${info.color} mt-0.5`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-content-primary">{info.title}</h4>
                          <p className="text-sm text-content-secondary">{info.value}</p>
                          <p className="text-xs text-content-secondary/70">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Profile Card */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="John Doe" />
                    <AvatarFallback className="text-xl">JD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold mb-2 text-content-primary">John Doe</h3>
                  <p className="text-content-secondary text-sm mb-4">Full Stack Developer</p>
                  <div className="flex justify-center space-x-3 mb-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg transition-colors ${social.bgColor} ${social.color}`}
                          aria-label={social.name}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Building className="w-4 h-4 mr-2" />
                      View Portfolio
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Blog
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-content-primary">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Current Status</span>
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Response Time</span>
                      <span className="text-sm font-medium text-content-primary">24 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Timezone</span>
                      <span className="text-sm font-medium text-content-primary">PST (UTC-8)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Working Hours</span>
                      <span className="text-sm font-medium text-content-primary">9 AM - 6 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-content-primary">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Projects Completed</span>
                      <span className="font-semibold text-brand-accent">50+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Happy Clients</span>
                      <span className="font-semibold text-brand-accent">30+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Response Rate</span>
                      <span className="font-semibold text-brand-accent">99%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-content-secondary">Average Rating</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-brand-accent mr-1">4.9</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
