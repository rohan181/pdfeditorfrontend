'use client'
import { useEffect } from 'react'
import PDFEditor from '@/components/PDFEditor'

export default function EditorPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return <PDFEditor />
}
