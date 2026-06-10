type ProblemTextBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProblemTextBox({ value, onChange }: ProblemTextBoxProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={13}
      className="thin-scrollbar min-h-72 w-full resize-y rounded-md border border-white/10 bg-black/30 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-aqua/60 focus:ring-2 focus:ring-aqua/20"
      placeholder="Paste an original coding problem statement here. Include input constraints, what must be returned, and any examples if you have them."
    />
  );
}
