import type { EditorPanel } from "@/types/editor";

type Props = {
  activePanel: EditorPanel;
  onTogglePanel: (panel: Exclude<EditorPanel, null>) => void;
};

const ITEMS: {
  key: Exclude<EditorPanel, null>;
  icon: string;
  label: string;
}[] = [
  { key: "templates", icon: "▦", label: "Templates" },
  { key: "festival", icon: "✦", label: "Festival" },
  { key: "elements", icon: "◫", label: "Elements" },
  { key: "frames", icon: "▧", label: "Frames" },
  { key: "mockups", icon: "▣", label: "Mockups" },
  { key: "brand", icon: "◆", label: "Brand" },
  { key: "resume", icon: "▤", label: "Resume" },
  { key: "text", icon: "T", label: "Text" },
  { key: "uploads", icon: "↑", label: "Uploads" },
  { key: "background", icon: "◐", label: "Background" },
  { key: "layers", icon: "☷", label: "Layers" },
];

export default function LeftRail({ activePanel, onTogglePanel }: Props) {
  return (
    <aside
      className="hidden h-full min-h-0 shrink-0 overflow-y-auto overscroll-contain border-r bg-white py-2 md:block"
      style={{ width: 76, flex: "0 0 76px" }}
    >
      {ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onTogglePanel(item.key)}
          className={`mx-2 mb-1 w-[60px] rounded-xl px-1 py-3 text-center text-[11px] transition ${
            activePanel === item.key
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="text-xl leading-none">{item.icon}</div>
          <div className="mt-2">{item.label}</div>
        </button>
      ))}
    </aside>
  );
}
