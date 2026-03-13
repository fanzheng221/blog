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

const author = {
  name: '范征',
  avatar: 'https://s3.bmp.ovh/2026/03/13/rbJKn656.jpg',
  bio: '近5年高级前端工程师经验，精通 React 全栈及工程化体系，具备独立主导大型前端项目架构设计与升级的能力。近两年深度进入 AI Agent 领域，参与并落地基于大模型的代码自动化工作流。',
}

export function About() {
  useTitle('关于')
  const skills = [
    'React',
    'TypeScript',
    'Next.js',
    'Vite',
    'Webpack',
    'Tailwind CSS',
    'GitLab CI',
    'OpenCode',
    'ECharts',
  ]

  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Avatar className="h-32 w-32 mx-auto mb-6">
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="text-4xl">{author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{author.name}</h1>

          <p className="text-xl text-muted-foreground mb-6">高级前端开发工程师 / AI Agent 工程师</p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{author.bio}</p>

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

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">工作经历</h2>
          <div className="space-y-8">
            {[
              {
                id: 'exp-1',
                company: '司马康（大连）信息技术有限公司',
                role: '高级前端工程师',
                period: '2023.07 - 至今',
                description:
                  '主导人才管理系统前端架构全面升级，深度参与 AI Agent 项目（One HR AI, One HR Chat GAI），优化 GitLab CI 流程，大幅提升开发与交付效率。',
              },
              {
                id: 'exp-2',
                company: '大连文思海辉信息技术有限公司',
                role: '高级前端开发工程师',
                period: '2021.10 - 2023.07',
                description:
                  '主导多个软件项目的概要设计与详细设计，设计并维护团队内部组件库，推动 React Hooks 和 TypeScript 最佳实践。',
              },
              {
                id: 'exp-3',
                company: '日进（大连）科技发展有限公司',
                role: '前端开发工程师',
                period: '2020.03 - 2021.09',
                description:
                  '负责 SmartCompany SaaS 系统核心功能模块的开发与交付，使用 Storybook 建设组件文档体系，搭建 E2E 自动化测试脚本。',
              },
            ].map((exp) => (
              <div key={exp.id} className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="md:w-1/3 shrink-0">
                  <h3 className="font-bold">{exp.company}</h3>
                  <p className="text-muted-foreground">{exp.period}</p>
                </div>
                <div className="md:w-2/3">
                  <h4 className="font-semibold mb-2">{exp.role}</h4>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              </div>
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
