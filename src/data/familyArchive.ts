import type { FamilyPerson, FamilyTimelineEvent, FamilyTreeBranch } from "../types";

export const familyPeople: FamilyPerson[] = [
  {
    id: "meg-goodman-odeleye",
    name: "Meg Beulah Cyrilene Goodman (Odeleye)",
    branch: "Meg cluster",
    relation: "Reference person; mother, grandmother and great-grandmother",
    evidence:
      "Memorial notice anchors her identity; Croydon and Barbados records probably connect the Goodman and Odeleye names.",
    confidence: "High",
  },
  {
    id: "annette-jordan",
    name: "Annette Jordan",
    branch: "Meg cluster",
    relation: "Probable close relative of Meg",
    evidence:
      "A 2015 planning notice lists Meg Goodman care of Mrs Annette Jordan at Rowans Park; church/address records place Annette Jordan there.",
    confidence: "High",
  },
  {
    id: "anniss-jessica-gooding",
    name: "Anniss Jessica Gooding",
    branch: "Meg cluster",
    relation: "Probable sister or immediate Goodman relative",
    evidence:
      "David 'Tony' Gooding's obituary names Meg Goodman, Annette Jordan, Benny Goodman and Maureen Gooding as Tony's in-laws.",
    confidence: "Medium",
  },
  {
    id: "benny-goodman",
    name: "Benjamin 'Benny' Goodman",
    branch: "Meg cluster",
    relation: "Probable brother or immediate Goodman relative",
    evidence:
      "Named as the late Benny Goodman in the same in-law cluster as Meg Goodman and Annette Jordan.",
    confidence: "Medium",
  },
  {
    id: "maureen-gooding",
    name: "Maureen Gooding",
    branch: "Meg cluster",
    relation: "Probable immediate relative",
    evidence:
      "Named among Tony Gooding's in-laws alongside Meg Goodman, Annette Jordan and Benny Goodman.",
    confidence: "Medium",
  },
  {
    id: "david-tony-gooding",
    name: "David 'Tony' Anthony Gooding",
    branch: "Meg cluster",
    relation: "Brother-in-law context for the Goodman cluster",
    evidence:
      "His 2019 obituary supplies the strongest explicit public family-network statement for this cluster.",
    confidence: "High",
  },
  {
    id: "velda-lynch",
    name: "Velda Euphacene Lynch",
    branch: "Lynch-Goodman cluster",
    relation: "Key Lynch anchor in western St. James",
    evidence:
      "Her obituary names cousins including Luton Goodman, Jefferson Goodman, Angela Farrell and Veldene Waithe.",
    confidence: "High",
  },
  {
    id: "una-boyce",
    name: "Una Meritha Boyce",
    branch: "Lynch-Goodman cluster",
    relation: "Matriarch of the Luton Goodman sub-branch",
    evidence:
      "A Barbados Today profile identifies her children as Luton Goodman, Angela Farrell and Veldene Waithe.",
    confidence: "High",
  },
  {
    id: "luton-goodman",
    name: "Luton Goodman",
    branch: "Lynch-Goodman cluster",
    relation: "Cousin of Velda Lynch; child of Una Boyce",
    evidence:
      "Cross-matched between Velda Lynch's obituary and the Barbados Today profile of Una Boyce.",
    confidence: "High",
  },
  {
    id: "alexander-goodman",
    name: "Alexander Gray Goodman",
    branch: "Separate Goodman branch",
    relation: "Separate Goodman branch, not yet tied to Meg",
    evidence:
      "Memorial records identify his parents and siblings, including Glendora Goodman, but no direct Meg connection is proved.",
    confidence: "High",
  },
  {
    id: "glendora-goodman",
    name: "Glendora Goodman",
    branch: "Separate Goodman branch",
    relation: "Sibling of Alexander Gray Goodman",
    evidence:
      "Her obituary identifies her as a child of Benjamin James Nathaniel Goodman and Gladys Edwards.",
    confidence: "High",
  },
];

export const familyTimeline: FamilyTimelineEvent[] = [
  {
    id: "meg-birth",
    date: "27 Sep 1939",
    title: "Meg Goodman birth date",
    summary: "Birth date for Meg Beulah Cyrilene Goodman from the family memorial notice.",
    status: "Family notice",
  },
  {
    id: "meg-uk-publications",
    date: "1983-1997",
    title: "Meg Goodman in UK social-policy records",
    summary:
      "Maternity Alliance and social-policy records may point to the same Meg Goodman, but the identity match still needs a direct bridge.",
    status: "Probable",
  },
  {
    id: "croydon-electoral",
    date: "2002-2004",
    title: "Meg B Odeleye in Croydon",
    summary:
      "UK electoral records place Meg B Odeleye with Andrew A Odeleye, supporting the Goodman/Odeleye identity trail.",
    status: "Probable",
  },
  {
    id: "bowl-croydon",
    date: "c. 2012",
    title: "Barbados Overseas Women's Link",
    summary:
      "Croydon consultation material lists Ms Meg Goodman for the Barbados Overseas Women's Link.",
    status: "Probable",
  },
  {
    id: "rowans-carlton",
    date: "Jan 2015",
    title: "Rowans and A1 Carlton planning record",
    summary:
      "Meg Goodman is listed care of Mrs Annette Jordan, #244 Rowans, St. George, for an A1 Carlton residence extension.",
    status: "Documented",
  },
  {
    id: "tony-gooding-obituary",
    date: "5 Feb 2019",
    title: "Tony Gooding obituary",
    summary:
      "The obituary names Meg Goodman, Annette Jordan, Benny Goodman and Maureen Gooding as in-laws.",
    status: "Documented",
  },
  {
    id: "nifca-cyrilene",
    date: "26 Nov 2023",
    title: "Cyrilene Goodman in NIFCA awards",
    summary:
      "The unusual Cyrilene Goodman name may connect to Meg, but it remains a probable identity match.",
    status: "Probable",
  },
  {
    id: "meg-death",
    date: "12 Apr 2026",
    title: "Meg Goodman death date",
    summary: "Death date from the family memorial notice.",
    status: "Family notice",
  },
  {
    id: "meg-croydon-service",
    date: "19 May 2026",
    title: "Croydon celebration of life",
    summary: "Family memorial notice places a celebration of life at New Life Christian Centre, Croydon.",
    status: "Family notice",
  },
  {
    id: "meg-barbados-funeral",
    date: "28 May 2026",
    title: "Barbados funeral",
    summary: "Family memorial notice names a Barbados funeral date.",
    status: "Family notice",
  },
  {
    id: "certificate-next",
    date: "Next",
    title: "Certificate-backed genealogy",
    summary:
      "Priority records: Meg's Barbados death certificate, Goodman/Odeleye marriage record, A1 Carlton file and Rowans Park land/title searches.",
    status: "Research target",
  },
];

export const familyTreeBranches: FamilyTreeBranch[] = [
  {
    id: "meg-cluster",
    title: "Meg-centred Goodman cluster",
    note:
      "The report says this cluster is strongly supported by obituary, planning and address evidence, but the exact parent/sibling structure still needs certificates.",
    confidence: "Medium",
    generations: [
      ["Unidentified Goodman parent(s)"],
      [
        "Meg Beulah Cyrilene Goodman (Odeleye)",
        "Annette Jordan",
        "Benjamin 'Benny' Goodman",
        "Anniss Jessica Gooding ?",
        "Maureen Gooding ?",
      ],
      ["David 'Tony' Anthony Gooding linked through Anniss Jessica Gooding"],
    ],
  },
  {
    id: "lynch-goodman-cluster",
    title: "Western St. James Lynch-Goodman cluster",
    note:
      "A real Lynch-Goodman relationship is documented, but this branch is not yet proven to connect directly to Meg's immediate Goodman line.",
    confidence: "Medium",
    generations: [
      ["George Lynch", "Edna Hinds Lynch", "Una Meritha Boyce"],
      ["Velda Euphacene Lynch", "Luton Goodman", "Angela Farrell", "Veldene Waithe"],
      ["Jefferson Goodman named as cousin in the Velda Lynch obituary"],
    ],
  },
  {
    id: "separate-goodman-branch",
    title: "Separate Goodman branch",
    note:
      "This branch is internally well documented but remains unlinked to Meg in the material reviewed so far.",
    confidence: "High",
    generations: [
      ["Benjamin James Nathaniel Goodman", "Gladys Goodman nee Edwards"],
      ["Alexander Gray Goodman", "Glendora Goodman"],
    ],
  },
];
