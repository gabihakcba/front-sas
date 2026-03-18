import { DialogProps } from 'primereact/dialog';

export const getResponsiveDialogProps = (
  maxWidth: string,
): Pick<
  DialogProps,
  'modal' | 'draggable' | 'resizable' | 'style' | 'contentStyle' | 'breakpoints'
> => ({
  modal: true,
  draggable: false,
  resizable: false,
  breakpoints: {
    '960px': 'calc(100vw - 2rem)',
    '640px': 'calc(100vw - 1rem)',
  },
  style: {
    width: 'calc(100vw - 2rem)',
    maxWidth,
  },
  contentStyle: {
    padding: '1rem',
    maxHeight: 'calc(100vh - 10rem)',
    overflowY: 'auto',
  },
});
