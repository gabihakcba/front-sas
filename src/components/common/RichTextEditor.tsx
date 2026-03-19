'use client';

import { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import { Divider } from 'primereact/divider';
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Extension } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';

// ── Types ────────────────────────────────────────────────────

type RichTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minHeightRem?: number;
};

// ── Color Presets ────────────────────────────────────────────

const TEXT_COLORS = [
  { label: 'Por defecto', value: '' },
  { label: 'Negro', value: '#111111' },
  { label: 'Gris', value: '#6b7280' },
  { label: 'Rojo', value: '#dc2626' },
  { label: 'Naranja', value: '#ea580c' },
  { label: 'Azul', value: '#2563eb' },
  { label: 'Verde', value: '#16a34a' },
  { label: 'Amarillo', value: '#ca8a04' },
  { label: 'Violeta', value: '#9333ea' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Sin resaltado', value: '' },
  { label: 'Amarillo', value: '#fef08a' },
  { label: 'Celeste', value: '#bfdbfe' },
  { label: 'Verde', value: '#bbf7d0' },
  { label: 'Rosa', value: '#fecdd3' },
  { label: 'Naranja', value: '#fed7aa' },
  { label: 'Violeta', value: '#e9d5ff' },
];

const HEADING_OPTIONS = [
  { label: 'H1', value: 1 },
  { label: 'H2', value: 2 },
  { label: 'H3', value: 3 },
];

// ── Extensions ───────────────────────────────────────────────

const CustomKeyboardExtension = Extension.create({
  name: 'customKeyboard',
  priority: 1000,
  addKeyboardShortcuts() {
    return {
      // Sangría en listas o insertar espacios
      Tab: () => {
        if (this.editor.can().sinkListItem('listItem')) {
          this.editor.chain().focus().sinkListItem('listItem').run();
          return true;
        }
        this.editor.chain().focus().insertContent('    ').run();
        return true;
      },
      'Shift-Tab': () => {
        if (this.editor.can().liftListItem('listItem')) {
          this.editor.chain().focus().liftListItem('listItem').run();
          return true;
        }
        
        // Si no está en una lista, intentamos borrar hasta 4 espacios antes del cursor (el "Tab" insertado)
        const { state } = this.editor;
        const { empty, $from } = state.selection;
        
        if (empty) {
          const textBefore = state.doc.textBetween(Math.max(0, $from.pos - 4), $from.pos, '\n', '\ufffc');
          const match = textBefore.match(/ {1,4}$/);
          if (match) {
            this.editor.chain().focus().deleteRange({ from: $from.pos - match[0].length, to: $from.pos }).run();
            return true;
          }
        }
        return true;
      },
      // Headings: Ctrl+Shift+1/2/3
      'Mod-Shift-1': () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      'Mod-Shift-2': () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      'Mod-Shift-3': () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      // Lists: Ctrl+Shift+7 y Ctrl+Shift+8 (estándar Notion/Docs)
      'Mod-Shift-7': () => this.editor.chain().focus().toggleOrderedList().run(),
      'Mod-Shift-8': () => this.editor.chain().focus().toggleBulletList().run(),
      // Enlace: interceptar Ctrl+K antes que el browser
      'Mod-k': () => {
        const prev = this.editor.getAttributes('link').href as string | undefined;
        const next = window.prompt('Ingresa la URL', prev ?? 'https://');
        if (next === null) return true;
        if (!next.trim()) {
          this.editor.chain().focus().unsetLink().run();
          return true;
        }
        this.editor.chain().focus().setLink({ href: next.trim() }).run();
        return true;
      },
    };
  },
});

// ── Helpers ──────────────────────────────────────────────────

const normalizeHtml = (html: string) => html.replace(/\s+/g, ' ').trim();

/** Convierte hex con # al formato sin # que espera ColorPicker */
const toPickerValue = (hex: string) => hex.replace('#', '');

/** Convierte el valor sin # de ColorPicker a hex completo */
const fromPickerValue = (val: string) => `#${val}`;

// ── Component ────────────────────────────────────────────────

export function RichTextEditor({
  id,
  value,
  onChange,
  disabled = false,
  minHeightRem = 16,
}: RichTextEditorProps) {
  const textColorPanelRef = useRef<OverlayPanel>(null);
  const highlightPanelRef = useRef<OverlayPanel>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ autolink: true, openOnClick: !disabled, defaultProtocol: 'https' }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      CustomKeyboardExtension,
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (normalizeHtml(current) === normalizeHtml(value || '')) return;
    editor.commands.setContent(value || '', false);
  }, [editor, value]);

  if (!editor) return null;

  // ── Handlers ─────────────────────────────────────────────

  const setLink = () => {
    if (disabled) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const next = window.prompt('Ingresa la URL', prev ?? 'https://');
    if (next === null) return;
    if (!next.trim()) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: next.trim() }).run();
  };

  const applyTextColor = (color: string) => {
    if (!color) editor.chain().focus().unsetColor().run();
    else editor.chain().focus().setColor(color).run();
  };

  const applyHighlight = (color: string) => {
    if (!color) editor.chain().focus().unsetHighlight().run();
    else editor.chain().focus().setHighlight({ color }).run();
  };

  // ── Active state helpers ──────────────────────────────────

  const btnSeverity = (active: boolean) => (active ? undefined : 'secondary') as
    | undefined
    | 'secondary';

  const activeHeading: number | null =
    editor.isActive('heading', { level: 1 }) ? 1 :
    editor.isActive('heading', { level: 2 }) ? 2 :
    editor.isActive('heading', { level: 3 }) ? 3 :
    null;

  const currentTextColor = (editor.getAttributes('textStyle').color as string | undefined) ?? '';
  const currentHighlight = (editor.getAttributes('highlight').color as string | undefined) ?? '';

  // ── Color swatch style ────────────────────────────────────

  const swatchStyle = (color: string): React.CSSProperties => ({
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--surface-border)',
    backgroundColor: color || 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    flexShrink: 0,
  });

  const colorIndicatorStyle = (color: string): React.CSSProperties => ({
    width: '0.6rem',
    height: '0.6rem',
    borderRadius: '2px',
    backgroundColor: color || 'transparent',
    border: color ? '1px solid var(--surface-border)' : '1px dashed var(--surface-border)',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '0.2rem',
  });

  return (
    <div
      className="w-full flex flex-col"
      style={{ border: '1px solid var(--surface-border)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}
    >
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--surface-section)',
          borderBottom: '1px solid var(--surface-border)',
          padding: '0.375rem 0.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        {/* Headings */}
        <SelectButton
          value={activeHeading}
          options={HEADING_OPTIONS}
          optionLabel="label"
          optionValue="value"
          allowEmpty
          disabled={disabled}
          tooltip="Encabezado • Ctrl+Shift+1 / 2 / 3"
          pt={{ button: { style: { padding: '0.4rem 0.65rem', fontSize: '0.875rem' } } }}
          onChange={(e: SelectButtonChangeEvent) => {
            const level = e.value as 1 | 2 | 3 | null;
            if (!level) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level }).run();
          }}
        />

        <Divider layout="vertical" style={{ margin: '0 0.125rem', height: '1.25rem' }} />

        {/* Text formatting */}
        <div className="flex items-center gap-1">
          <Button type="button" label="B" size="small" outlined={!editor.isActive('bold')} severity={editor.isActive('bold') ? undefined : 'secondary'} onClick={() => editor.chain().focus().toggleBold().run()} disabled={disabled} tooltip="Negrita (Ctrl+B)" />
          <Button type="button" label="I" size="small" outlined={!editor.isActive('italic')} severity={editor.isActive('italic') ? undefined : 'secondary'} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={disabled} tooltip="Cursiva (Ctrl+I)" />
          <Button type="button" label="U" size="small" outlined={!editor.isActive('underline')} severity={editor.isActive('underline') ? undefined : 'secondary'} onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={disabled} tooltip="Subrayado (Ctrl+U)" />
        </div>

        <Divider layout="vertical" style={{ margin: '0 0.125rem', height: '1.25rem' }} />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button type="button" icon="pi pi-list" size="small" outlined={!editor.isActive('bulletList')} text={!editor.isActive('bulletList')} severity={btnSeverity(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={disabled} tooltip="Viñetas (Ctrl+Shift+8)" />
          <Button type="button" icon="pi pi-sort-numeric-down" size="small" outlined={!editor.isActive('orderedList')} text={!editor.isActive('orderedList')} severity={btnSeverity(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={disabled} tooltip="Numerada (Ctrl+Shift+7)" />
        </div>

        <Divider layout="vertical" style={{ margin: '0 0.125rem', height: '1.25rem' }} />

        {/* Block & Link */}
        <div className="flex items-center gap-1">
          <Button type="button" icon="pi pi-comment" size="small" outlined={!editor.isActive('blockquote')} text={!editor.isActive('blockquote')} severity={btnSeverity(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={disabled} tooltip="Cita (Ctrl+Shift+B)" />
          <Button type="button" icon="pi pi-link" size="small" outlined={!editor.isActive('link')} text={!editor.isActive('link')} severity={btnSeverity(editor.isActive('link'))} onClick={setLink} disabled={disabled} tooltip="Enlace (Ctrl+K)" />
        </div>

        <Divider layout="vertical" style={{ margin: '0 0.125rem', height: '1.25rem' }} />

        {/* ── Text Color ──────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="small"
            text
            outlined
            severity="secondary"
            disabled={disabled}
            tooltip="Color de texto"
            onClick={(e) => textColorPanelRef.current?.toggle(e)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <i className="pi pi-palette" style={{ fontSize: '0.85rem' }} />
              <span style={colorIndicatorStyle(currentTextColor)} />
            </span>
          </Button>
          <OverlayPanel ref={textColorPanelRef} style={{ width: '14rem' }}>
            <div className="flex flex-col gap-2">
              {/* Presets */}
              <div className="flex flex-wrap gap-1">
                {TEXT_COLORS.map((c) => (
                  <span
                    key={c.value || 'default'}
                    title={c.label}
                    style={swatchStyle(c.value)}
                    onClick={() => { applyTextColor(c.value); textColorPanelRef.current?.hide(); }}
                  />
                ))}
              </div>
              {/* Free picker */}
              <ColorPicker
                value={currentTextColor ? toPickerValue(currentTextColor) : undefined}
                format="hex"
                onChange={(e: ColorPickerChangeEvent) => {
                  if (typeof e.value === 'string') applyTextColor(fromPickerValue(e.value));
                }}
                inline
              />
            </div>
          </OverlayPanel>
        </div>

        {/* ── Highlight Color ─────────────────────────────────── */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="small"
            text
            outlined
            severity="secondary"
            disabled={disabled}
            tooltip="Resaltado"
            onClick={(e) => highlightPanelRef.current?.toggle(e)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <i className="pi pi-pen-to-square" style={{ fontSize: '0.85rem' }} />
              <span style={colorIndicatorStyle(currentHighlight)} />
            </span>
          </Button>
          <OverlayPanel ref={highlightPanelRef} style={{ width: '14rem' }}>
            <div className="flex flex-col gap-2">
              {/* Presets */}
              <div className="flex flex-wrap gap-1">
                {HIGHLIGHT_COLORS.map((c) => (
                  <span
                    key={c.value || 'default'}
                    title={c.label}
                    style={swatchStyle(c.value)}
                    onClick={() => { applyHighlight(c.value); highlightPanelRef.current?.hide(); }}
                  />
                ))}
              </div>
              {/* Free picker */}
              <ColorPicker
                value={currentHighlight ? toPickerValue(currentHighlight) : undefined}
                format="hex"
                onChange={(e: ColorPickerChangeEvent) => {
                  if (typeof e.value === 'string') applyHighlight(fromPickerValue(e.value));
                }}
                inline
              />
            </div>
          </OverlayPanel>
        </div>
      </div>

      {/* ── Editor area ──────────────────────────────────────── */}
      <div
        id={id}
        style={{ minHeight: `${minHeightRem}rem`, background: 'var(--surface-card)', cursor: 'text', overflowY: 'auto' }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none w-full min-h-full p-4 focus:outline-none"
        />
      </div>
    </div>
  );
}
