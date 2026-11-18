import React from 'react';
import {
  Activity, ArrowRight, ArrowUpToLine, Ban, Book, Bookmark, BookOpen, Bot, ChartBar,
  Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronsUpDown, ChevronUp, Circle, CircleAlert, CircleCheck, CircleHelp, CircleX,
  Clipboard, Clock, Code, Compass, Contrast, CornerDownLeft, Cpu, ArrowDownToLine, Ellipsis,
  FileText, FlaskConical, Funnel, Grid3x3, Hourglass, Info, Link, List, LucideIcon,
  Mail, MapPin, Maximize2, Minimize2, Minus, Moon, Network, Notebook, NotebookText,
  Pause, Pencil, Play, Plus, Quote, Radar, Rocket, RotateCcw, RotateCw, Search, Share2,
  SlidersHorizontal, Sparkles, Square, Sun, Table, Tag, Trash2, TriangleAlert, Users,
  X, ZoomIn,
} from 'lucide-react';

// Bootstrap Icons name (without the bi- prefix) -> Lucide icon
const ICONS: Record<string, LucideIcon> = {
  'activity': Activity,
  'arrow-clockwise': RotateCw,
  'arrow-counterclockwise': RotateCcw,
  'arrow-return-left': CornerDownLeft,
  'arrow-right': ArrowRight,
  'arrows-angle-contract': Minimize2,
  'arrows-angle-expand': Maximize2,
  'arrows-expand': ChevronsUpDown,
  'bar-chart': ChartBar,
  'book': Book,
  'book-fill': BookOpen,
  'bookmark': Bookmark,
  'bookmark-fill': Bookmark,
  'card-list': List,
  'caret-down-fill': ChevronDown,
  'caret-up-fill': ChevronUp,
  'chat-quote': Quote,
  'check': Check,
  'check-circle-fill': CircleCheck,
  'check-lg': Check,
  'check2': Check,
  'chevron-bar-up': ArrowUpToLine,
  'chevron-compact-right': ChevronRight,
  'chevron-double-left': ChevronsLeft,
  'chevron-double-right': ChevronsRight,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'circle-fill': Circle,
  'circle-half': Contrast,
  'clipboard': Clipboard,
  'clock-history': Clock,
  'compass': Compass,
  'cpu': Cpu,
  'dash-square': Minus,
  'diagram-2': Network,
  'diagram-3': Network,
  'download': ArrowDownToLine,   // an arrow down onto a line, as on the design canvas
  'envelope': Mail,
  'exclamation-circle': CircleAlert,
  'exclamation-circle-fill': CircleAlert,
  'exclamation-triangle': TriangleAlert,
  'exclamation-triangle-fill': TriangleAlert,
  'file-earmark-code': Code,
  'file-pdf': FileText,
  'file-text': FileText,
  'flask': FlaskConical,
  'funnel': Funnel,
  'geo-alt': MapPin,
  'grid-3x3': Grid3x3,
  'hourglass-split': Hourglass,
  'info-circle': Info,
  'info-circle-fill': Info,
  'info-square': Info,
  'journal': Notebook,
  'journal-text': NotebookText,
  'link-45deg': Link,
  'list-ul': List,
  'moon': Moon,
  'pause-fill': Pause,
  'pencil': Pencil,
  'people': Users,
  'play-circle': Play,
  'play-fill': Play,
  'plus-lg': Plus,
  'plus-square': Plus,
  'question-circle': CircleHelp,
  'question-circle-fill': CircleHelp,
  'quote': Quote,
  'radar': Radar,
  'robot': Bot,
  'rocket-takeoff': Rocket,
  'rocket-takeoff-fill': Rocket,
  'search': Search,
  'share': Share2,
  'slash-circle': Ban,
  'sliders': SlidersHorizontal,
  'square-fill': Square,
  'stars': Sparkles,
  'sun': Sun,
  'table': Table,
  'tag': Tag,
  'three-dots': Ellipsis,
  'trash': Trash2,
  'x': X,
  'x-circle-fill': CircleX,
  'x-lg': X,
  'zoom-in': ZoomIn,
};

// solid shapes keep their fill; other -fill names map to the outline icon
const FILLED = new Set([
  'circle-fill', 'square-fill', 'play-fill', 'pause-fill', 'bookmark-fill',
  'caret-up-fill', 'caret-down-fill',
]);

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;   // Bootstrap icon name, with or without the bi- prefix
}

/**
 * Lucide icon in an <i> wrapper sized at 1em, so CSS written for the old
 * Bootstrap icon font (font-size, color, `i` selectors) still applies.
 */
export const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  const key = name.replace(/^bi-/, '');
  const Glyph = ICONS[key];
  if (!Glyph) {
    if (process.env.NODE_ENV === 'development') console.warn(`Icon: unknown name "${name}"`);
    return null;
  }
  const labelled = rest['aria-label'] !== undefined || rest.title !== undefined;
  return (
    <i
      className={className ? `pv-icon ${className}` : 'pv-icon'}
      aria-hidden={labelled ? undefined : true}
      {...rest}
    >
      <Glyph size="1em" strokeWidth={1.75} absoluteStrokeWidth={false} aria-hidden="true"
             fill={FILLED.has(key) ? 'currentColor' : 'none'} />
    </i>
  );
};
