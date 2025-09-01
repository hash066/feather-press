import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Code, 
  Heart,
  Sparkles,
  Award,
  Users,
  Globe,
  Zap,
  Github,
  Linkedin,
  Twitter,
  Download,
  MessageSquare,
  Phone,
  Building,
  GraduationCap,
  Briefcase,
  Star
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingShapes, GradientMesh } from '@/components/AnimatedBackground';

const About = () => {
  const [activeTab, setActiveTab] = useState('about');
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const skills = [
    { name: 'React', level: 'Expert', icon: Code, color: 'text-blue-500' },
    { name: 'TypeScript', level: 'Advanced', icon: Code, color: 'text-blue-600' },
    { name: 'Node.js', level: 'Advanced', icon: Code, color: 'text-green-500' },
    { name: 'Python', level: 'Intermediate', icon: Code, color: 'text-yellow-500' },
    { name: 'Machine Learning', level: 'Intermediate', icon: Zap, color: 'text-purple-500' },
    { name: 'UI/UX Design', level: 'Advanced', icon: Heart, color: 'text-pink-500' },
  ];

  const experiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      period: '2022 - Present',
      description: 'Leading frontend development for enterprise applications using React and TypeScript.',
      achievements: ['Led team of 5 developers', 'Improved performance by 40%', 'Implemented CI/CD pipeline']
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2020 - 2022',
      description: 'Built scalable web applications and APIs using modern technologies.',
      achievements: ['Built 3 major features', 'Reduced bugs by 60%', 'Mentored junior developers']
    },
    {
      title: 'Junior Developer',
      company: 'Digital Agency',
      period: '2018 - 2020',
      description: 'Developed responsive websites and e-commerce solutions.',
      achievements: ['Completed 20+ projects', 'Learned modern frameworks', 'Collaborated with designers']
    }
  ];

  const education = [
    {
      degree: 'Master of Computer Science',
      school: 'University of Technology',
      period: '2016 - 2018',
      description: 'Specialized in Software Engineering and Web Technologies',
      gpa: '3.9/4.0'
    },
    {
      degree: 'Bachelor of Computer Science',
      school: 'State University',
      period: '2012 - 2016',
      description: 'Computer Science with focus on Web Development',
      gpa: '3.8/4.0'
    }
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/johndoe', icon: Github, color: 'text-gray-800' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: Linkedin, color: 'text-blue-600' },
    { name: 'Twitter', url: 'https://twitter.com/johndoe', icon: Twitter, color: 'text-blue-400' },
  ];

  const stats = [
    { label: 'Projects Completed', value: '50+', icon: Code },
    { label: 'Years Experience', value: '5+', icon: Calendar },
    { label: 'Happy Clients', value: '30+', icon: Users },
    { label: 'Blog Posts', value: '25+', icon: BookOpen },
  ];

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
              <User className="w-4 h-4 text-brand-accent animate-pulse-soft" />
              <span className="text-brand-accent font-medium text-sm">About Me</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-content-primary mb-6">
              Hi, I'm John Doe
            </h1>
            <p className="text-xl text-content-secondary max-w-4xl mx-auto leading-relaxed mb-6">
              A passionate full-stack developer and tech enthusiast who loves creating beautiful, 
              functional, and user-centered digital experiences.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-content-secondary">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>john@example.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>5+ years experience</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Me */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-content-primary">
                    <User className="w-5 h-5" />
                    <span>About Me</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-primary leading-relaxed">
                    I'm a dedicated software developer with over 5 years of experience in building 
                    modern web applications. My passion lies in creating intuitive user experiences 
                    and writing clean, maintainable code.
                  </p>
                  <p className="text-content-secondary leading-relaxed">
                    When I'm not coding, you can find me exploring new technologies, contributing 
                    to open-source projects, or sharing knowledge through blog posts and tutorials. 
                    I believe in continuous learning and staying up-to-date with the latest industry trends.
                  </p>
                  <div className="flex items-center space-x-4 pt-4">
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Blog
                    </Button>
                    <Button variant="outline" size="sm">
                      <Code className="w-4 h-4 mr-2" />
                      View Projects
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-content-primary">
                    <Zap className="w-5 h-5" />
                    <span>Skills & Technologies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <div key={skill.name} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-background/80 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 ${skill.color}`} />
                            <span className="font-medium text-content-primary">{skill.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {skill.level}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-content-primary">
                    <Award className="w-5 h-5" />
                    <span>Work Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 border-brand-accent/30 pl-6 hover:border-brand-accent transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg text-content-primary">{exp.title}</h4>
                            <p className="text-brand-accent font-medium">{exp.company}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {exp.period}
                          </Badge>
                        </div>
                        <p className="text-content-secondary text-sm leading-relaxed mb-3">
                          {exp.description}
                        </p>
                        <div className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm text-content-secondary">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-content-primary">
                    <GraduationCap className="w-5 h-5" />
                    <span>Education</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-brand-accent/30 pl-6 hover:border-brand-accent transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg text-content-primary">{edu.degree}</h4>
                            <p className="text-brand-accent font-medium">{edu.school}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs mb-1">
                              {edu.period}
                            </Badge>
                            <div className="text-xs text-content-secondary">GPA: {edu.gpa}</div>
                          </div>
                        </div>
                        <p className="text-content-secondary text-sm leading-relaxed">
                          {edu.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm text-center">
                <CardContent className="pt-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face" alt="John Doe" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-2 text-content-primary">John Doe</h3>
                  <p className="text-content-secondary text-sm mb-4">Full Stack Developer</p>
                  <div className="flex justify-center space-x-4 mb-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg bg-background hover:bg-background/80 transition-colors ${social.color}`}
                          aria-label={social.name}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Me
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Globe className="w-4 h-4 mr-2" />
                      View Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-content-primary">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-brand-accent" />
                            <span className="text-sm text-content-secondary">{stat.label}</span>
                          </div>
                          <span className="font-semibold text-brand-accent">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-content-primary">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-brand-accent" />
                    <div>
                      <p className="text-sm font-medium text-content-primary">Email</p>
                      <p className="text-xs text-content-secondary">john@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-brand-accent" />
                    <div>
                      <p className="text-sm font-medium text-content-primary">Phone</p>
                      <p className="text-xs text-content-secondary">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-brand-accent" />
                    <div>
                      <p className="text-sm font-medium text-content-primary">Location</p>
                      <p className="text-xs text-content-secondary">San Francisco, CA</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-brand-accent" />
                    <div>
                      <p className="text-sm font-medium text-content-primary">Availability</p>
                      <p className="text-xs text-content-secondary">Open to opportunities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card className="shadow-soft border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-content-primary">Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Web Development</Badge>
                    <Badge variant="secondary">Open Source</Badge>
                    <Badge variant="secondary">Machine Learning</Badge>
                    <Badge variant="secondary">UI/UX Design</Badge>
                    <Badge variant="secondary">Blogging</Badge>
                    <Badge variant="secondary">Photography</Badge>
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

export default About;
