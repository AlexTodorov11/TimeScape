"use client"

import { useEffect, useRef } from "react"
import { Timeline as VisTimeline } from "vis-timeline/standalone"
import "vis-timeline/styles/vis-timeline-graph2d.css"

interface TimelineProps {
  items: {
    id: string
    content: string
    start: Date
    end: Date
    type: string
    className?: string
  }[]
}

export function Timeline({ items }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<VisTimeline | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const options = {
      height: "400px",
      editable: true,
      margin: {
        item: 20,
        axis: 40,
      },
    }

    timelineRef.current = new VisTimeline(
      containerRef.current,
      items,
      options
    )

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy()
      }
    }
  }, [items])

  return <div ref={containerRef} />
} 