import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { projects, socialLinks } from '@/data/mock-data'
import { useTitle } from '@/hooks/useTitle'
import { ExternalLink, Github, Linkedin, Mail, Twitter } from 'lucide-react'

const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  mail: Mail,
}

export function About() {
  useTitle('关于')
  const skills = [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Tailwind CSS',
    'Figma',
    'UI Design',
    'Accessibility',
  ]

  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <Avatar className="h-32 w-32 mx-auto mb-6">
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="text-4xl">{author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{author.name}</h1>

          <p className="text-xl text-muted-foreground mb-6">设计师与开发者</p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{author.bio}</p> */}

          {/* Social links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = iconMap[social.icon as keyof typeof iconMap]
              return (
                <Button key={social.name} variant="outline" size="icon" asChild>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              )
            })}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Skills */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">技能</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm px-4 py-2">
                {skill}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Projects */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">精选项目</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="ghost" size="sm" className="group/btn" asChild>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      查看项目
                      <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Contact */}
        <section className="text-center py-12">
          <h2 className="font-display text-2xl font-bold mb-4">联系我</h2>
          <p className="text-muted-foreground mb-6">有兴趣合作或者只是想打个招呼？欢迎随时联系！</p>
          <Button size="lg" asChild>
            <a href="mailto:fzlny@outlook.com">取得联系</a>
          </Button>
        </section>
      </div>
    </div>
  )
}
