import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Type,
  Palette,
  Undo,
  Redo,
  Eye,
  Edit3
} from "lucide-react";

interface EnhancedRichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function EnhancedRichTextEditor({
  value = "",
  onChange,
  placeholder = "Digite seu texto aqui...",
  className = "",
  minHeight = "200px"
}: EnhancedRichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const saveToHistory = (content: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const content = history[historyIndex - 1];
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const content = history[historyIndex + 1];
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
    }
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection) {
      setSelectedText(selection.toString());
    }
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      updateContent();
    }
  };

  const formatText = (tag: string, attributes: Record<string, string> = {}) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && selectedText) {
      const range = selection.getRangeAt(0);
      const element = document.createElement(tag);
      
      // Apply attributes
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      
      element.textContent = selectedText;
      range.deleteContents();
      range.insertNode(element);
      
      // Clear selection
      selection.removeAllRanges();
      updateContent();
    }
  };

  const insertLink = () => {
    const url = prompt("Digite a URL:");
    if (url && selectedText) {
      formatText('a', { href: url, target: '_blank' });
    } else if (url) {
      insertHTML(`<a href="${url}" target="_blank">${url}</a>`);
    }
  };

  const insertImage = () => {
    const url = prompt("Digite a URL da imagem:");
    const alt = prompt("Digite o texto alternativo (opcional):");
    if (url) {
      insertHTML(`<img src="${url}" alt="${alt || ''}" style="max-width: 100%; height: auto;" />`);
    }
  };

  const applyHeading = (level: string) => {
    execCommand('formatBlock', `h${level}`);
  };

  const applyColor = (color: string) => {
    execCommand('foreColor', color);
  };

  const applyBackgroundColor = (color: string) => {
    execCommand('backColor', color);
  };

  const insertTable = () => {
    const rows = prompt("Número de linhas:", "3");
    const cols = prompt("Número de colunas:", "3");
    
    if (rows && cols) {
      let tableHTML = '<table border="1" style="width: 100%; border-collapse: collapse;">';
      
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">Célula</td>';
        }
        tableHTML += '</tr>';
      }
      
      tableHTML += '</table>';
      insertHTML(tableHTML);
    }
  };

  const insertDivider = () => {
    insertHTML('<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />');
  };

  const insertCodeBlock = () => {
    if (selectedText) {
      formatText('code', { 
        style: 'background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace;' 
      });
    } else {
      insertHTML(`<pre style="background-color: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto;"><code>Digite seu código aqui</code></pre>`);
    }
  };

  if (isPreview) {
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <div className="bg-gray-50 border-b p-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPreview(false)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        <div 
          className="p-4 prose max-w-none"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* History Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Desfazer"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Refazer"
          >
            <Redo className="w-4 h-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Format Controls */}
          <Select onValueChange={applyHeading}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="H" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1</SelectItem>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
              <SelectItem value="4">H4</SelectItem>
              <SelectItem value="5">H5</SelectItem>
              <SelectItem value="6">H6</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <Toggle 
            size="sm" 
            onClick={() => execCommand('bold')}
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle 
            size="sm" 
            onClick={() => execCommand('italic')}
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle 
            size="sm" 
            onClick={() => execCommand('underline')}
            title="Sublinhado"
          >
            <Underline className="w-4 h-4" />
          </Toggle>
          <Toggle 
            size="sm" 
            onClick={() => execCommand('strikeThrough')}
            title="Riscado"
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Color Controls */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" title="Cor do texto">
                <Type className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <ColorPicker
                value="#000000"
                onChange={applyColor}
                showInput={false}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" title="Cor de fundo">
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <ColorPicker
                value="#ffffff"
                onChange={applyBackgroundColor}
                showInput={false}
              />
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyLeft')}
            title="Alinhar à esquerda"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyCenter')}
            title="Centralizar"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyRight')}
            title="Alinhar à direita"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('justifyFull')}
            title="Justificar"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('insertUnorderedList')}
            title="Lista com marcadores"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('insertOrderedList')}
            title="Lista numerada"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Insert Elements */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={insertLink}
            title="Inserir link"
          >
            <Link className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={insertImage}
            title="Inserir imagem"
          >
            <Image className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => execCommand('formatBlock', 'blockquote')}
            title="Citação"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={insertCodeBlock}
            title="Código"
          >
            <Code className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Advanced Elements */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={insertTable}
            title="Inserir tabela"
            className="text-xs px-2"
          >
            Tabela
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={insertDivider}
            title="Inserir divisor"
            className="text-xs px-2"
          >
            HR
          </Button>

          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsPreview(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 focus:outline-none prose max-w-none"
        style={{ minHeight }}
        onInput={updateContent}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        dangerouslySetInnerHTML={{ __html: value }}
        suppressContentEditableWarning={true}
      />
      
      {!value && (
        <div className="absolute inset-0 p-4 pointer-events-none text-gray-400 flex items-start">
          {placeholder}
        </div>
      )}
    </div>
  );
}