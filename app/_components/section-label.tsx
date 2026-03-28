interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <h2 className="text-light-sea-green font-inter-tight text-xl font-bold">
      {children}
    </h2>
  );
}
