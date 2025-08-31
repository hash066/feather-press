import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  Zap
} from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { name: 'React', level: 'Expert', icon: Code },
    { name: 'TypeScript', level: 'Advanced', icon: Code },
    { name: 'Node.js', level: 'Advanced', icon: Code },
    { name: 'Python', level: 'Intermediate', icon: Code },
    { name: 'Machine Learning', level: 'Intermediate', icon: Zap },
    { name: 'UI/UX Design', level: 'Advanced', icon: Heart },
  ];

  const experiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      period: '2022 - Present',
      description: 'Leading frontend development for enterprise applications using React and TypeScript.'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2020 - 2022',
      description: 'Built scalable web applications and APIs using modern technologies.'
    },
    {
      title: 'Junior Developer',
      company: 'Digital Agency',
      period: '2018 - 2020',
      description: 'Developed responsive websites and e-commerce solutions.'
    }
  ];

  const education = [
    {
      degree: 'Master of Computer Science',
      school: 'University of Technology',
      period: '2016 - 2018',
      description: 'Specialized in Software Engineering and Web Technologies'
    },
    {
      degree: 'Bachelor of Computer Science',
      school: 'State University',
      period: '2012 - 2016',
      description: 'Computer Science with focus on Web Development'
    }
  ];

  return (
    <div className="min-h-screen chyrp-page-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 chyrp-hero-bg py-16 px-8 rounded-3xl">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 chyrp-glass">
            <Sparkles className="w-4 h-4" />
            <span>About Me</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 chyrp-heading">
            Hi, I'm John Doe
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            A passionate full-stack developer and tech enthusiast who loves creating beautiful, 
            functional, and user-centered digital experiences.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
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
            <Card className="chyrp-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>About Me</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  I'm a dedicated software developer with over 5 years of experience in building 
                  modern web applications. My passion lies in creating intuitive user experiences 
                  and writing clean, maintainable code.
                </p>
                <p className="text-muted-foreground leading-relaxed">
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
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="chyrp-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Skills & Technologies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div key={skill.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{skill.name}</span>
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
            <Card className="chyrp-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Work Experience</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{exp.title}</h4>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {exp.period}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="chyrp-glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{edu.degree}</h4>
                          <p className="text-primary font-medium">{edu.school}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {edu.period}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
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
            <Card className="chyrp-glass text-center">
              <CardContent className="pt-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face" alt="John Doe" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                <p className="text-muted-foreground text-sm mb-4">Full Stack Developer</p>
                <div className="flex justify-center space-x-4">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="chyrp-glass">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Projects Completed</span>
                    <span className="font-semibold">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Years Experience</span>
                    <span className="font-semibold">5+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Happy Clients</span>
                    <span className="font-semibold">30+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Blog Posts</span>
                    <span className="font-semibold">25+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="chyrp-glass">
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
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
    </div>
  );
};

export default About;
