import Colors from '@data/colors.json';

export interface CodeBlockProps {
  children: () => string;
}

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre css={{ padding: '8px 12px', backgroundColor: Colors.lightGrey, margin: '8px 0', overflow: 'auto' }}>
      <code className="code">{children()}</code>
    </pre>
  );
}
