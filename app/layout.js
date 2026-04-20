import './globals.css';

export const metadata = {
  title: 'WebbyAbd | Mobile-First Web Studio',
  description: 'Custom web platforms for Lebanese businesses. E-commerce, booking systems, admin dashboards, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
