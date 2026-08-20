import type { FabricObject } from "fabric";
import LayersPanel from "./LayersPanel";
import PropertiesPanel from "./PropertiesPanel";

type Props = {
  selected: any;
  objects: FabricObject[];
  onSelectLayer: (object: FabricObject) => void;
  onToggleLayerVisibility: (object: FabricObject) => void;
  onToggleLayerLock: (object: FabricObject) => void;
  onClear: () => void;
  updateSelected: (changes: any) => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  toggleSelectedLock: () => void;
  toggleSelectedVisibility: () => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
};

export default function RightSidebar(props: Props) {
  return (
    <aside
      className="hidden shrink-0 overflow-y-auto border-l bg-white p-5 lg:block"
      style={{ width: 300, flex: "0 0 300px" }}
    >
      {!props.selected ? (
        <LayersPanel
          objects={props.objects}
          onSelect={props.onSelectLayer}
          onToggleVisibility={props.onToggleLayerVisibility}
          onToggleLock={props.onToggleLayerLock}
          onClear={props.onClear}
        />
      ) : (
        <PropertiesPanel
          selected={props.selected}
          updateSelected={props.updateSelected}
          duplicateSelected={props.duplicateSelected}
          deleteSelected={props.deleteSelected}
          bringForward={props.bringForward}
          sendBackward={props.sendBackward}
          bringToFront={props.bringToFront}
          sendToBack={props.sendToBack}
          toggleSelectedLock={props.toggleSelectedLock}
          toggleSelectedVisibility={props.toggleSelectedVisibility}
          flipHorizontal={props.flipHorizontal}
          flipVertical={props.flipVertical}
        />
      )}
    </aside>
  );
}
