import { ContentTypeCard } from "./ContentTypeCard";
import { 
  FileText, 
  Image, 
  Quote, 
  ExternalLink, 
  Video, 
  Music, 
  Upload,
  Code,
  Calendar
} from "lucide-react";

const contentTypes = [
  {
    title: "Blog Post",
    description: "Rich text articles with markdown support and media embeds",
    icon: FileText,
  },
  {
    title: "Photo Gallery",
    description: "Beautiful image galleries with captions and metadata",
    icon: Image,
  },
  {
    title: "Quote",
    description: "Inspirational quotes with elegant typography",
    icon: Quote,
  },
  {
    title: "Link Share",
    description: "Rich link previews with automatic metadata extraction",
    icon: ExternalLink,
  },
  {
    title: "Video Post",
    description: "Video content with custom players and transcripts",
    icon: Video,
  },
  {
    title: "Audio Post",
    description: "Podcasts and audio content with waveform visualization",
    icon: Music,
  },
  {
    title: "File Upload",
    description: "Document sharing with preview and download options",
    icon: Upload,
  },
  {
    title: "Code Snippet",
    description: "Syntax-highlighted code with multiple language support",
    icon: Code,
  },
  {
    title: "Event",
    description: "Schedule and promote events with RSVP functionality",
    icon: Calendar,
  },
];

export const ContentTypesGrid = () => {
  return (
    <section className="py-20 content-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-content-primary mb-4">
            Every Story, Every Format
          </h2>
          <p className="text-xl text-content-secondary max-w-3xl mx-auto">
            Choose from our comprehensive content types designed for modern storytelling. 
            Each optimized for engagement and beautiful presentation.
          </p>
        </div>
        
        <div className="content-grid">
          {contentTypes.map((type, index) => (
            <ContentTypeCard
              key={index}
              title={type.title}
              description={type.description}
              icon={type.icon}
              onClick={() => console.log(`Creating ${type.title}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};