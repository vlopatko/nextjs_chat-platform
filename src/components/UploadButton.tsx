'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleDialogOpen = (visible: boolean) => {
    if (!visible) {
      setIsOpen(visible)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>Example</DialogContent>
    </Dialog>
  )
}

export default UploadButton
