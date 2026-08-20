type Props = {
  zoom: number;
  onChange: (zoom: number) => void;
};

export default function ZoomControls({ zoom, onChange }: Props) {
  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-lg">
      <button
        onClick={() => onChange(Math.max(25, zoom - 10))}
        className="px-2"
      >
        −
      </button>

      <button
        onClick={() => onChange(55)}
        className="min-w-12 text-center text-sm"
        title="Reset zoom"
      >
        {zoom}%
      </button>

      <button
        onClick={() => onChange(Math.min(100, zoom + 10))}
        className="px-2"
      >
        +
      </button>
    </div>
  );
}
