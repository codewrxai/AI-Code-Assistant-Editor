export const ProductManagerIcon = (fillColor: string): string => {
  const iconSvg = `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"
      fill="${fillColor}">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M7.71 3h6.79l.51.5v4.507A4.997 4.997 0 0 0 14 7.416V5.99H7.69l-.86.86-.35.15H1.99v6H7.1c.07.348.177.682.316 1H1.51l-.5-.5v-11l.5-.5h5l.35.15.85.85zm-.22 2h6.5l.01-.99H7.5l-.36-.15-.85-.85H2v3h4.28l.86-.86.35-.15z" />
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M9.778 8.674a4 4 0 1 1 4.444 6.652 4 4 0 0 1-4.444-6.652zm2.13 4.99l2.387-3.182-.8-.6-2.077 2.769-1.301-1.041-.625.78 1.704 1.364.713-.09z" />
    </svg>
  `
  const iconDataUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`
  return iconDataUrl
}
