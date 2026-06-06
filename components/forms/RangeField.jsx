export function RangeField({ name, label, min, max, step = 1, value, onChange }) {
  const inputId = `range-${name}`;
  const valueId = `${inputId}-value`;

  return (
    <label htmlFor={inputId} className="rounded-lg border border-ink/10 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span id={valueId} className="rounded-md bg-mist px-2 py-1 text-sm font-bold text-ink">
          {value}
        </span>
      </div>
      <input
        id={inputId}
        name={name}
        className="mt-4 w-full accent-fern"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={valueId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
