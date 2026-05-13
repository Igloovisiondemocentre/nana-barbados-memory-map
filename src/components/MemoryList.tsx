import { Volume2 } from "lucide-react";
import type { MemoryPoint } from "../types";

type MemoryListProps = {
  memories: MemoryPoint[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function MemoryList({ memories, activeId, onSelect }: MemoryListProps) {
  return (
    <section className="memoryList" aria-label="All Nana audio memories">
      <div className="listHeader">
        <span>Podcast Areas</span>
        <strong>{memories.length} memories</strong>
      </div>
      <div className="memoryRows">
        {memories.map((memory, index) => (
          <button
            key={memory.id}
            type="button"
            className={memory.id === activeId ? "memoryRow active" : "memoryRow"}
            onClick={() => onSelect(memory.id)}
          >
            <span className="rowIndex">{String(index + 1).padStart(2, "0")}</span>
            <span className="rowText">
              <strong>{memory.title}</strong>
              <small>{memory.childSubtitle}</small>
            </span>
            <span className="rowDuration">
              <Volume2 size={15} />
              {memory.duration}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
