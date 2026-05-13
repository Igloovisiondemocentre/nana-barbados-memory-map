import { useState } from "react";
import { BookOpen, CalendarDays, GitBranch, ListTree } from "lucide-react";
import { familyPeople, familyTimeline, familyTreeBranches } from "../data/familyArchive";
import type { FamilyPoint } from "../types";

type FamilyArchivePanelProps = {
  selectedFamilyPoint: FamilyPoint | null;
};

const tabs = [
  { id: "evidence", label: "Evidence", icon: BookOpen },
  { id: "people", label: "People", icon: ListTree },
  { id: "tree", label: "Tree", icon: GitBranch },
  { id: "timeline", label: "Timeline", icon: CalendarDays },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function FamilyArchivePanel({ selectedFamilyPoint }: FamilyArchivePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("evidence");

  return (
    <aside className="familyArchiveCard" aria-live="polite">
      <div className="familyArchiveTabs" role="tablist" aria-label="Family archive views">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "active" : ""}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "evidence" ? (
        <section className="familyArchivePane" aria-label="Selected family evidence">
          {selectedFamilyPoint ? (
            <>
              <span>{selectedFamilyPoint.confidence} confidence</span>
              <h2>{selectedFamilyPoint.title}</h2>
              <strong>{selectedFamilyPoint.place}</strong>
              <p>{selectedFamilyPoint.summary}</p>
              {selectedFamilyPoint.sourceUrl ? (
                <a href={selectedFamilyPoint.sourceUrl} target="_blank" rel="noreferrer">
                  {selectedFamilyPoint.sourceLabel}
                </a>
              ) : (
                <small>{selectedFamilyPoint.sourceLabel}</small>
              )}
            </>
          ) : (
            <>
              <span>Family Layer beta</span>
              <h2>Family research points</h2>
              <strong>Goodman, Lynch, archives and land records</strong>
              <p>
                These points hold source-backed family leads from the report, kept separate from
                Nana's voice memories so the main map stays calm and easy to follow.
              </p>
            </>
          )}
        </section>
      ) : null}

      {activeTab === "people" ? (
        <section className="familyArchivePane familyPeoplePane" aria-label="Family people register">
          <span>{familyPeople.length} people</span>
          <h2>People register</h2>
          <div className="familyScrollList">
            {familyPeople.map((person) => (
              <article key={person.id} className="familyPersonRow">
                <div>
                  <strong>{person.name}</strong>
                  <em>{person.branch}</em>
                </div>
                <p>{person.relation}</p>
                <small>{person.confidence} confidence</small>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "timeline" ? (
        <section className="familyArchivePane familyTimelinePane" aria-label="Family timeline">
          <span>{familyTimeline.length} events</span>
          <h2>Timeline</h2>
          <div className="familyScrollList">
            {familyTimeline.map((event) => (
              <article key={event.id} className="familyTimelineRow">
                <time>{event.date}</time>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.summary}</p>
                  <small>{event.status}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "tree" ? (
        <section className="familyArchivePane familyTreePane" aria-label="Family tree branches">
          <span>{familyTreeBranches.length} branches</span>
          <h2>Family tree</h2>
          <div className="familyScrollList">
            {familyTreeBranches.map((branch) => (
              <article key={branch.id} className="familyTreeBranch">
                <header>
                  <strong>{branch.title}</strong>
                  <small>{branch.confidence} confidence</small>
                </header>
                <p>{branch.note}</p>
                <div className="familyGenerationStack">
                  {branch.generations.map((generation, index) => (
                    <div key={`${branch.id}-${index}`} className="familyGeneration">
                      <em>Generation {index + 1}</em>
                      <div>
                        {generation.map((name) => (
                          <span key={name}>{name}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
