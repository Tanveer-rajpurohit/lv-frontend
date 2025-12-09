"use client"

import React, { useEffect, useRef, useCallback, memo, useState } from "react"
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
// @ts-ignore
import Checklist from "@editorjs/checklist"
import Table from "@editorjs/table"
import Quote from "@editorjs/quote"
import Delimiter from "@editorjs/delimiter"
import InlineCode from "@editorjs/inline-code"
// @ts-ignore
import LinkTool from "@editorjs/link"
// @ts-ignore
import Embed from "@editorjs/embed"
import ImageTool from "@editorjs/image"
import CodeTool from "@editorjs/code"
// @ts-ignore
import AttachesTool from "@editorjs/attaches"
import "./editorjs-custom.css";

class TextColorPlugin {
  api: any
  button: HTMLElement | null = null
  selectedColor = "#1a1a1a" // Changed default text color from black to dark gray matching website

  static get isInline() {
    return true
  }

  static get sanitize() {
    return {
      span: { style: true, class: true },
    }
  }

  constructor({ api }: any) {
    this.api = api
  }

  render() {
    this.button = document.createElement("button")
    this.button.type = "button"
    this.button.classList.add("ce-inline-button")
    this.button.innerHTML = "🎨 Text"
    this.button.addEventListener("click", (e) => this.showColorPicker(e))
    return this.button
  }

  showColorPicker(e: any) {
    e.preventDefault()
    e.stopPropagation()

    const colors = [
      { name: "None", hex: "default" },
      { name: "Black", hex: "#000000" },
      { name: "Red", hex: "#ef4444" },
      { name: "Blue", hex: "#3b82f6" },
      { name: "Green", hex: "#22c55e" },
      { name: "Purple", hex: "#a855f7" },
    ]

    const existing = document.querySelector(".color-picker-dropdown")
    if (existing) existing.remove()

    const dropdown = document.createElement("div")
    dropdown.className = "color-picker-dropdown"
    dropdown.innerHTML = `
      <div class="color-picker-header">Text Color</div>
      <div class="color-picker-row">
        ${colors
          .map(
            (c) => `
          <button class="color-picker-circle" data-color="${c.hex}" title="${c.name}" ${c.hex === "default" ? 'data-default="true"' : `style="background-color: ${c.hex}"`}>
            ${c.hex === "default" ? "✕" : ""}
          </button>
        `,
          )
          .join("")}
      </div>
    `

    dropdown.addEventListener("click", (e: any) => {
      if (e.target.classList.contains("color-picker-circle")) {
        const colorHex = e.target.dataset.color
        if (colorHex === "default") {
          this.selectedColor = "#1a1a1a" // Reset to default dark gray
        } else {
          this.selectedColor = colorHex
        }
        this.applyColor()
        dropdown.remove()
      }
    })

    this.button?.parentElement?.appendChild(dropdown)
    setTimeout(() => {
      const rect = this.button?.getBoundingClientRect()
      if (rect) {
        dropdown.style.position = "fixed"
        dropdown.style.top = rect.bottom + 8 + "px"
        dropdown.style.left = rect.left + "px"
      }
    }, 0)
  }

  applyColor() {
    const selection = window.getSelection()
    if (!selection || selection.toString().length === 0) {
      alert("Please select text first")
      return
    }

    const range = selection.getRangeAt(0)
    const span = document.createElement("span")
    span.style.color = this.selectedColor

    const contents = range.cloneContents()
    span.appendChild(contents)

    range.deleteContents()
    range.insertNode(span)

    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  surround(range: Range) {
    const span = document.createElement("span")
    span.style.color = this.selectedColor
    span.appendChild(range.extractContents())
    range.insertNode(span)
  }
}

class EnhancedMarker {
  api: any
  button: HTMLElement | null = null
  selectedColor = "none" // Default marker is none (removed)
  colorMap: any = {
    "#ffc107": "marker-yellow",
    "#ff5722": "marker-red",
    "#2196f3": "marker-blue",
    "#4caf50": "marker-green",
    "#9c27b0": "marker-purple",
  }

  static get isInline() {
    return true
  }

  static get sanitize() {
    return {
      mark: { class: true, style: true },
    }
  }

  constructor({ api }: any) {
    this.api = api
  }

  render() {
    this.button = document.createElement("button")
    this.button.type = "button"
    this.button.classList.add("ce-inline-button")
    this.button.innerHTML = "✎ Mark"
    this.button.addEventListener("click", (e) => this.showColorPicker(e))
    return this.button
  }

  showColorPicker(e: any) {
    e.preventDefault()
    e.stopPropagation()

    const colors = [
      { name: "None", hex: "default" },
      { name: "Yellow", hex: "#ffc107" },
      { name: "Red", hex: "#ff5722" },
      { name: "Blue", hex: "#2196f3" },
      { name: "Green", hex: "#4caf50" },
      { name: "Purple", hex: "#9c27b0" },
    ]

    const existing = document.querySelector(".marker-picker-dropdown")
    if (existing) existing.remove()

    const dropdown = document.createElement("div")
    dropdown.className = "marker-picker-dropdown"
    dropdown.innerHTML = `
      <div class="color-picker-header">Highlight Color</div>
      <div class="color-picker-row">
        ${colors
          .map(
            (c) => `
          <button class="marker-picker-circle" data-color="${c.hex}" title="${c.name}" ${c.hex === "default" ? 'data-default="true"' : `style="background-color: ${c.hex}"`}>
            ${c.hex === "default" ? "✕" : ""}
          </button>
        `,
          )
          .join("")}
      </div>
    `

    dropdown.addEventListener("click", (e: any) => {
      if (e.target.classList.contains("marker-picker-circle")) {
        const colorHex = e.target.dataset.color
        if (colorHex === "default") {
          this.selectedColor = "none" // Set to none to remove highlighting
        } else {
          this.selectedColor = colorHex
        }
        this.applyMarker()
        dropdown.remove()
      }
    })

    this.button?.parentElement?.appendChild(dropdown)
    setTimeout(() => {
      const rect = this.button?.getBoundingClientRect()
      if (rect) {
        dropdown.style.position = "fixed"
        dropdown.style.top = rect.bottom + 8 + "px"
        dropdown.style.left = rect.left + "px"
      }
    }, 0)
  }

  applyMarker() {
    const selection = window.getSelection()
    if (!selection || selection.toString().length === 0) {
      alert("Please select text first")
      return
    }

    const range = selection.getRangeAt(0)

    if (this.selectedColor === "none") {
      const textNode = document.createTextNode(selection.toString())
      range.deleteContents()
      range.insertNode(textNode)
    } else {
      const mark = document.createElement("mark")
      mark.style.backgroundColor = this.selectedColor
      mark.className = this.colorMap[this.selectedColor] || "marker-yellow"
      const contents = range.cloneContents()
      mark.appendChild(contents)
      range.deleteContents()
      range.insertNode(mark)
    }
    selection.removeAllRanges()
  }

  surround(range: Range) {
    if (this.selectedColor === "none") {
      return
    }
    const mark = document.createElement("mark")
    mark.style.backgroundColor = this.selectedColor
    mark.className = this.colorMap[this.selectedColor] || "marker-yellow"
    mark.appendChild(range.extractContents())
    range.insertNode(mark)
  }
}

interface EditorProps {
  data?: any
  onChange?: (data: any) => void
  placeholder?: string
  readOnly?: boolean
  autofocus?: boolean
  minHeight?: number
  tools?: any
  config?: any
}

interface EditorData {
  time: number
  blocks: any[]
  version?: string
}

const DEFAULT_EDITOR_DATA: EditorData = {
  time: new Date().getTime(),
  blocks: [
    {
      id: "welcome-header",
      type: "header",
      data: {
        text: "Welcome to Your Document",
        level: 1,
      },
    },
    {
      id: "welcome-paragraph",
      type: "paragraph",
      data: {
        text: "Start writing your content here. Use the toolbar to add blocks, or press '/' for quick commands.",
      },
    },
  ],
  version: "2.22.2",
}

class CustomParagraph {
  api: any
  readOnly: boolean
  data: any
  config: any
  container: HTMLElement | null
  textarea: HTMLDivElement | null

  static get toolbox() {
    return {
      title: "Text",
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h12M2 6h12M2 9h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>',
    }
  }

  constructor({ data, config, api, readOnly }: any) {
    this.api = api
    this.readOnly = readOnly
    this.data = {
      text: data?.text || "",
      alignment: data?.alignment || "left",
    }
    this.config = config || {}
    this.container = null
    this.textarea = null
  }

  render() {
    this.container = document.createElement("div")
    this.container.classList.add("ce-paragraph")

    this.textarea = document.createElement("div")
    this.textarea.classList.add("ce-paragraph__content")
    this.textarea.contentEditable = (!this.readOnly).toString()
    this.textarea.innerHTML = this.data.text || ""
    this.textarea.dataset.placeholder = this.config.placeholder || "Start typing..."

    this.container.appendChild(this.textarea)

    if (!this.readOnly) {
      this.textarea.addEventListener("input", () => {
        this.data.text = this.textarea!.innerHTML
      })
    }

    return this.container
  }

  save() {
    return {
      text: this.textarea!.innerHTML,
      alignment: this.data.alignment,
    }
  }

  static get isReadOnlySupported() {
    return true
  }
}

const Editor: React.FC<EditorProps> = ({
  data = DEFAULT_EDITOR_DATA,
  onChange,
  placeholder = "Start typing or press '/' for commands...",
  readOnly = false,
  autofocus = true,
  minHeight = 400,
  tools = {},
  config = {},
}) => {
  const editorInstance = useRef<EditorJS | null>(null)
  const [isReady, setIsReady] = useState(false)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const isUpdatingRef = useRef(false)

  useEffect(() => {
    if (!editorContainerRef.current || editorInstance.current) {
      return
    }

    let editor: EditorJS | null = null

    const initEditor = async () => {
      try {
        editor = new EditorJS({
          holder: editorContainerRef.current!,
          data: data,
          placeholder: placeholder,
          readOnly: readOnly,
          autofocus: autofocus,
          minHeight: minHeight,
          tools: {
            paragraph: {
              class: CustomParagraph,
              inlineToolbar: true,
              config: {
                placeholder: "Start typing...",
              },
            },
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                placeholder: "Enter a header",
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
              shortcut: "CMD+SHIFT+H",
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
              shortcut: "CMD+SHIFT+L",
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
              config: {},
              shortcut: "CMD+SHIFT+C",
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
              shortcut: "CMD+SHIFT+Q",
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
              shortcut: "CMD+SHIFT+T",
            },
            code: {
              class: CodeTool,
              config: {
                placeholder: "Enter code",
              },
              shortcut: "CMD+SHIFT+E",
            },
            delimiter: {
              class: Delimiter,
              shortcut: "CMD+SHIFT+D",
            },
            marker: {
              class: EnhancedMarker,
              shortcut: "CMD+SHIFT+M",
            },
            textColor: {
              class: TextColorPlugin,
              shortcut: "CMD+SHIFT+F",
            },
            inlineCode: {
              class: InlineCode,
              shortcut: "CMD+SHIFT+I",
            },
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: "/api/fetch-url",
                placeholder: "Paste a link to embed content...",
              },
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  coub: true,
                  vimeo: true,
                  imgur: true,
                  gfycat: true,
                  "twitter-video": true,
                  "instagram-post": true,
                  "google-maps": true,
                  codepen: true,
                },
              },
            },
            image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: "/api/upload-image",
                  byUrl: "/api/fetch-image",
                },
                field: "image",
                types: "image/*",
                captionPlaceholder: "Caption...",
                buttonContent: "Select an Image",
                uploader: {
                  uploadByFile: (file: File) => {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve({
                          success: 1,
                          file: {
                            url: URL.createObjectURL(file),
                          },
                        })
                      }, 1000)
                    })
                  },
                },
              },
            },
            attaches: {
              class: AttachesTool,
              config: {
                endpoint: "/api/upload-file",
                field: "file",
                types: "*",
                buttonText: "Select file to upload",
                errorMessage: "File upload failed",
                uploader: {
                  uploadByFile: (file: File) => {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve({
                          success: 1,
                          file: {
                            url: URL.createObjectURL(file),
                            title: file.name,
                            size: file.size,
                          },
                        })
                      }, 1000)
                    })
                  },
                },
              },
            },
            ...tools,
          },
          onChange: async () => {
            if (editor && onChange && isReady && !isUpdatingRef.current) {
              try {
                const outputData = await editor.save()
                onChange(outputData)
              } catch (error) {
                console.error("[v0] Saving failed:", error)
              }
            }
          },
          onReady: () => {
            setIsReady(true)
            console.log("[v0] Editor.js is ready")
          },
          ...config,
        })

        editorInstance.current = editor
      } catch (error) {
        console.error("[v0] Editor initialization failed:", error)
      }
    }

    initEditor()

    return () => {
      if (editorInstance.current && typeof (editorInstance.current as any).destroy === "function") {
        try {
          ;(editorInstance.current as any).destroy()
        } catch (error) {
          console.error("[v0] Error destroying editor:", error)
        }
        editorInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (editorInstance.current && data && isReady && !isUpdatingRef.current) {
      try {
        isUpdatingRef.current = true
        ;(editorInstance.current as any).render(data)
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 100)
      } catch (error) {
        console.error("Failed to render new data:", error)
        isUpdatingRef.current = false
      }
    }
  }, [data, isReady])

  useEffect(() => {
    if (editorInstance.current && isReady) {
      try {
        if (readOnly) {
          ;(editorInstance.current as any).readOnly.toggle()
        }
      } catch (error) {
        console.error("Failed to toggle read-only state:", error)
      }
    }
  }, [readOnly, isReady])

  const save = useCallback(async () => {
    if (editorInstance.current) {
      try {
        const outputData = await editorInstance.current.save()
        return outputData
      } catch (error) {
        console.error("Saving failed:", error)
        return null
      }
    }
  }, [])

  const clear = useCallback(async () => {
    if (editorInstance.current) {
      try {
        await editorInstance.current.clear()
        if (onChange) {
          onChange({ time: Date.now(), blocks: [] })
        }
      } catch (error) {
        console.error("Clearing failed:", error)
      }
    }
  }, [onChange])

  const render = useCallback(async (newData: EditorData) => {
    if (editorInstance.current) {
      try {
        ;(editorInstance.current as any).render(newData)
      } catch (error) {
        console.error("Rendering failed:", error)
      }
    }
  }, [])

  const focus = useCallback(() => {
    if (editorInstance.current) {
      try {
        ;(editorInstance.current as any).focus()
      } catch (error) {
        console.error("Focusing failed:", error)
      }
    }
  }, [])

  React.useImperativeHandle(React.createRef(), () => ({
    save,
    clear,
    render,
    focus,
    getInstance: () => editorInstance.current,
  }))

  return (
    <div className="editor-wrapper">
      <div className="editor-container">
        <div
          id="editorjs"
          ref={editorContainerRef}
          className="editor-js-container"
          style={{ minHeight: `${minHeight}px` }}
        />
      </div>
    </div>
  )
}

export default memo(Editor)
