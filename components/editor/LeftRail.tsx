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
      className="hidden h-full min-h-0 shrink-0 overflow-y-auto overscroll-contain border-r bg-white py-1.5 md:block"
      style={{ width: 68, flex: "0 0 68px" }}
    >
      {ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onTogglePanel(item.key)}
          className={`mx-1.5 mb-0.5 w-[56px] rounded-xl px-1 py-2 text-center text-[9.5px] font-medium leading-tight transition ${
            activePanel === item.key
              ? "bg-black text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="text-[17px] leading-none">{item.icon}</div>
          <div className="mt-1.5 truncate">{item.label}</div>
        </button>
      ))}
    </aside>
  );
}
