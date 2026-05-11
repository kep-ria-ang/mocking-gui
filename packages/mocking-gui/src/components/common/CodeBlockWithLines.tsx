type CodeBlockWithLinesProps = {
  text: string;
  lineColorClass?: string;
  preClass?: string;
  maxHeightClass?: string;
};

const CodeBlockWithLines = (props: CodeBlockWithLinesProps) => {
  const {
    text,
    lineColorClass = 'text-slate-500/60',
    preClass = 'text-emerald-400',
    maxHeightClass = 'max-h-[420px]',
  } = props;

  const lines = text ? text.split('\n') : [];

  return (
    <figure className={`${maxHeightClass} overflow-auto p-4 custom-scrollbar`}>
      {text ? (
        <section className="grid grid-cols-[40px_1fr] gap-3">
          <aside
            aria-label="Line numbers"
            className={`select-none text-[11px] font-mono text-right pr-2 ${lineColorClass}`}
          >
            <ol className="list-none m-0 p-0">
              {lines.map((_, idx) => (
                <li key={idx} className="leading-6">
                  {idx + 1}
                </li>
              ))}
            </ol>
          </aside>
          <pre className={`font-mono text-xs leading-6 whitespace-pre-wrap break-all ${preClass}`}>
            <code>{text}</code>
          </pre>
        </section>
      ) : (
        <p className="py-8 text-xs text-slate-500">No data</p>
      )}
    </figure>
  );
};

export default CodeBlockWithLines;
