import type { EconomicEvent } from '@/services/economicCalendarService';
import { getEconomicImpactLabel, getEconomicImpactLevel } from '@/utils/economicImpact';

const formatDateId = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const safeText = (value: unknown) => {
  const text = String(value ?? '').trim();
  return text ? text : '-';
};

// Use asterisk stars for PDF compatibility with built-in fonts.
const impactStarsText = (impact: unknown) => {
  const level = getEconomicImpactLevel(impact);
  if (!level) return '-';
  return `${'*'.repeat(level)} (${getEconomicImpactLabel(level)})`;
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });

const loadWatermark = async (url: string) => {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Failed to fetch watermark (${response.status})`);
  const blob = await response.blob();
  const dataUrl = await blobToDataUrl(blob);

  const format = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
  return { dataUrl, format } as const;
};

const drawWatermark = (doc: unknown, watermark: { dataUrl: string; format: 'PNG' | 'JPEG' }) => {
  const pdf = doc as any;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = typeof pdf.getImageProperties === 'function'
    ? pdf.getImageProperties(watermark.dataUrl)
    : { width: 1, height: 1 };

  const maxWidth = Math.min(360, pageWidth * 0.45);
  const ratio = imgProps.width > 0 ? imgProps.height / imgProps.width : 1;
  const width = maxWidth;
  const height = Math.max(1, maxWidth * ratio);

  const x = (pageWidth - width) / 2;
  const y = (pageHeight - height) / 2;

  const hasGState = typeof pdf.GState === 'function' && typeof pdf.setGState === 'function';
  if (hasGState) {
    pdf.setGState(new pdf.GState({ opacity: 0.18 }));
  }

  pdf.addImage(watermark.dataUrl, watermark.format, x, y, width, height);

  if (hasGState) {
    pdf.setGState(new pdf.GState({ opacity: 1 }));
  }
};

export async function downloadEconomicCalendarPdf(options: {
  events: EconomicEvent[];
  title: string;
  filterLabel: string;
  filename?: string;
}) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const autoTable =
    (autoTableModule as unknown as { default?: unknown }).default ??
    (autoTableModule as unknown);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const generatedAt = new Date();
  const headerLeft = safeText(options.title);
  const headerRight = `${safeText(options.filterLabel)} | ${formatDateId(generatedAt)}`;

  let watermark: { dataUrl: string; format: 'PNG' | 'JPEG' } | null = null;
  try {
    watermark = await loadWatermark(encodeURI('/assets/logo_BestProfit ful.png'));
  } catch {
    watermark = null;
  }

  const head = [[
    'Date',
    'Time',
    'Country',
    'Impact',
    'Event',
    'Actual',
    'Forecast',
    'Previous',
  ]];

  const body = (options.events || []).map((event) => ([
    safeText(event.date),
    safeText(event.time),
    safeText(event.country),
    impactStarsText(event.impact),
    safeText(event.figures),
    safeText(event.actual),
    safeText(event.forecast),
    safeText(event.previous),
  ]));

  if (typeof autoTable === 'function') {
    (autoTable as (doc: unknown, config: unknown) => void)(doc, {
      head,
      body,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [8, 0, 49], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 70, left: 40, right: 40 },
      didDrawPage: () => {
        if (watermark) drawWatermark(doc, watermark);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(headerLeft, 40, 36);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(headerRight, doc.internal.pageSize.getWidth() - 40, 36, { align: 'right' });
      },
    });
  }

  const defaultFilename = `economic-calendar-${formatDateId(generatedAt).replace(/-/g, '')}.pdf`;
  doc.save(options.filename || defaultFilename);
}
