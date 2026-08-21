import { Upload } from 'lucide-react'
import { CardLink, Container } from '@/components/ui'
import { buttonClassName } from '@/components/ui/Button'

export default function SiteUploadBox() {
  return (
    <section className="site-upload-section">
      <Container size="reading">
        <CardLink href="/pdf-editor" variant="tool" className="site-upload-card">
            <div className="site-upload-icon">
              <Upload size={22} strokeWidth={1.8}/>
            </div>
            <p className="site-upload-title">
              Drop your PDF here to start
            </p>
            <p className="site-upload-copy">
              or click to browse · up to 100 MB · processed in your browser
            </p>
            <span className={buttonClassName({ variant: 'primary', size: 'medium' })}>
              <Upload size={13} strokeWidth={2.5}/> Upload PDF
            </span>
        </CardLink>
      </Container>
    </section>
  )
}
