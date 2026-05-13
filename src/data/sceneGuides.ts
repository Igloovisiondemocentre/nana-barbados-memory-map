import type { GoogleStreetView, MemoryJourneyStop, MemoryPoint } from "../types";

const view = (
  panoId: string,
  lat: number,
  lng: number,
  heading: number,
  fov = 84,
): GoogleStreetView => ({
  panoId,
  lat,
  lng,
  heading,
  pitch: 0,
  fov,
});

const views = {
  blunts: view("CAoSF0NJSE0wb2dLRUlDQWdJRHF5OHZncmdF", 13.197258, -59.583465, 40),
  mountMisery: view("CAoSFkNJSE0wb2dLRUlDQWdJRHF3OGliYkE.", 13.20698, -59.585663, 255, 88),
  lesterVaughanSchool: view("CAoSF0NJSE0wb2dLRUlDQWdJQzZxb0tQbFFF", 13.152662, -59.598063, 316, 82),
  stThomasChurchRoad: view("CAoSF0NJSE0wb2dLRUlDQWdJQzZpcHZpZ1FF", 13.177878, -59.579043, 165),
  archives: view("CAoSHENJQUJJaEQtcXpPQnVOemFVYkxhb2VQQjhSWWs.", 13.184529, -59.630487, 95),
  blackRock: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY4dHFablFF", 13.137977, -59.623997, 112),
  heroesSquare: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY2dW5Ib0FF", 13.096713, -59.614708, 15),
  garrison: view("CAoSF0NJSE0wb2dLRUlDQWdJRHFoZWlIeWdF", 13.081086, -59.606137, 75),
  northPointCliff: view("CAoSFkNJSE0wb2dLRUlDQWdJRDR0Skx4U2c.", 13.334324, -59.6121, 300, 92),
  animalFlowerCaveInterior: view("CAoSF0NJSE0wb2dLRUlDQWdJRGg3OXotaXdF", 13.335103, -59.613255, 0, 90),
  uwi: view("CAoSF0NJSE0wb2dLRUlDQWdJQzRtOWVxb1FF", 13.135667, -59.630868, 125, 82),
  codrington: view("CAoSF0NJSE0wb2dLRUlDQWdJRDRyY1B2LWdF", 13.175038, -59.475446, 290),
  codringtonGate: view("CAoSF0NJSE0wb2dLRUlDQWdJQzZ5cWlwa2dF", 13.17346, -59.477001, 310),
  bluntsNames: view("CAoSFkNJSE0wb2dLRUlDQWdJREV1OXlTQ1E.", 13.19693, -59.582404, 20),
  stThomasCommunity: view("CAoSFkNJSE0wb2dLRUlDQWdJQzZxb2UzRmc.", 13.165522, -59.575507, 190),
  fisherpond: view("CAoSFkNJSE0wb2dLRUlDQWdJQzY4cFhYUVE.", 13.165687, -59.553512, 110, 82),
  stNicholasAbbey: view("CAoSFkNJSE0wb2dLRUlDQWdJQzY4cXFGWkE.", 13.263426, -59.593018, 100),
  hillabyQuiet: view("CAoSFkNJSE0wb2dLRUlDQWdJQ0V4Y21aU2c.", 13.211159, -59.582273, 205, 88),
  sharonMoravian: view("CAoSF0NJSE0wb2dLRUlDQWdJQzZxcW1pc3dF", 13.165667, -59.586172, 80),
  stThomasQuiet: view("CAoSFkNJSE0wb2dLRUlDQWdJQzZpbzZ4WVE.", 13.168977, -59.583289, 260),
  downeyRoad: view("CAoSFkNJSE0wb2dLRUlDQWdJQzZxcV9aQmc.", 13.184599, -59.572803, 85),
  welchmanLower: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY2dlhRZ2dF", 13.190209, -59.574571, 210),
  anneCare: view("CAoSF0NJSE0wb2dLRUlDQWdJQzZzdlBMX1FF", 13.202299, -59.576137, 150),
  harrisonsEast: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY2dXJSdEFF", 13.188318, -59.566397, 60),
  harrisonsCave: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY2cFdIX1FF", 13.185521, -59.572575, 120),
  welchmanHall: view("CAoSF0NJSE0wb2dLRUlDQWdJQzRrZnpmaGdF", 13.192777, -59.575703, 75),
  sunbury: view("CAoSFENJSE0wb2dLRUlDQWdJQzY4cDQz", 13.110676, -59.483152, 80),
  concordeAirport: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY2dFdHOVFF", 13.080135, -59.489406, 245),
  morganLewis: view("CAoSHENJQUJJaEM3UTM2YmwyMm45YXlteFVKMG1GWEk.", 13.268341, -59.574578, 120),
  cherryTreeHill: view("CAoSFkNJSE0wb2dLRUlDQWdJQzY2ckNyTUE.", 13.257147, -59.579371, 115, 88),
  gunHill: view("CAoSFkNJSE0wb2dLRUlDQWdJRHFoZFdDUUE.", 13.143257, -59.557614, 35, 88),
  farleyHill: view("CAoSFkNJSE0wb2dLRUlDQWdJQzZpb1M1VFE.", 13.264365, -59.592926, 130, 88),
  bathsheba: view("CAoSFkNJSE0wb2dLRUlDQWdJQzY2dWlvWFE.", 13.211604, -59.527684, 80, 90),
  speightstown: view("CAoSHENJQUJJaEQycGZTa0duMHJEWGxwLW9kNUp0dms.", 13.250487, -59.643792, 120),
  tyrolCot: view("CAoSF0NJSE0wb2dLRUlDQWdJQzY4dnVobndF", 13.109243, -59.609084, 40),
};

const sources = {
  mountHillaby: "https://www.visitbarbados.org/mount-hillaby",
  animalFlowerCave: "https://animalflowercave.org/",
  welchmanHall: "https://www.welchmanhallgullybarbados.com/",
  historicBridgetown: "https://whc.unesco.org/en/list/1376",
  morganLewis: "https://barbadosnationaltrust.com/morgan-lewis/",
  codrington: "https://www.codrington.org/",
  archives: "https://www.barbadosarchives.gov.bb/",
  lesterVaughan: "https://barbadostoday.bb/2023/10/10/lester-vaughan-school-celebrates-26-years/",
};

type SceneContext = NonNullable<MemoryPoint["sceneContext"]>;

const stop = (
  label: string,
  role: MemoryJourneyStop["role"],
  note: string,
  google: GoogleStreetView,
): MemoryJourneyStop => ({
  label,
  role,
  note,
  google,
});

export const journeyStopsByMemoryId: Record<string, MemoryJourneyStop[]> = {
  "natural-environment": [
    stop("Blunts high ground", "Nana's reference", "We begin close to the inland country Nana names as the beginning of her story. St. Thomas is one of Barbados' two parishes with no coastline, so this scene teaches the island from the inside out.", views.blunts),
    stop("Mount Misery road", "Area landmark", "Then we climb higher near Mount Hillaby, Barbados' highest point, so the children can feel why Nana says the middle of the island can show both sides of Barbados.", views.mountMisery),
  ],
  village: [
    stop("Blunts village road", "Nana's reference", "This stop keeps us in the small-road village world Nana describes: about 20 houses, two shops, a schoolhouse, a blacksmith and enough neighbours to know everyone's business.", views.anneCare),
    stop("Sharon community", "Area landmark", "A nearby community view helps show how village life sat among churches, lanes and family networks. Children can look for the small-scale roads that made walking, carts and gossip all travel quickly.", views.sharonMoravian),
  ],
  school: [
    stop("The Lester Vaughan School road", "Area landmark", "This stop uses a real Street View panorama beside The Lester Vaughan School in Cane Garden, St. Thomas, while the exact Blunts schoolhouse is still being confirmed. It gives children a real Barbados school setting before Nana explains how one village school could serve several nearby communities.", views.lesterVaughanSchool),
    stop("St. Thomas church road", "Area landmark", "The second stop widens the lesson to the parish roads children would have known between home, church and school. Churches and schools often sat close together in British colonial Barbados.", views.stThomasChurchRoad),
  ],
  "family-heritage": [
    stop("Barbados Archives", "Nana's reference", "We begin where records live, because Nana is teaching why family history must be kept carefully. Archives can hold baptisms, marriages, deeds, wills and parish records that help families rebuild hidden lines.", views.archives),
    stop("Black Rock road", "Area landmark", "This nearby public-road view reminds us that archives are not abstract; they sit inside living communities where people still need names, dates and proof.", views.blackRock),
  ],
  "accent-language": [
    stop("National Heroes Square", "Nana's reference", "We start in Bridgetown, where official English, law, school and national life meet. It lets Nana's lesson about proper English and Bajan speech sit in the capital city.", views.heroesSquare),
    stop("The Garrison", "Area landmark", "The second stop brings in the colonial setting behind formal education and British influence. The Garrison is part of the UNESCO Historic Bridgetown and its Garrison World Heritage Site.", views.garrison),
  ],
  "northern-point-caves": [
    stop("North Point cliffs", "Nana's reference", "We begin on the actual cliff edge in Saint Lucy, looking out to the Atlantic the way Nana wants us to feel the northern point. This is where Barbados feels open, windy and serious.", views.northPointCliff),
    stop("Animal Flower Cave", "Area landmark", "Then we step into the cave-and-rock setting. The cave is named for sea anemones that open like little flowers, which is exactly the kind of thing Nana would make you notice before you start playing around.", views.animalFlowerCaveInterior),
  ],
  "universities-colonisation": [
    stop("UWI Cave Hill", "Nana's reference", "This campus view anchors Nana's lesson about university access and regional education. UWI Cave Hill connects Barbados to a wider Caribbean classroom, not just one island.", views.uwi),
    stop("Codrington College", "Area landmark", "Codrington adds an older educational landmark, showing how learning in Barbados has a long colonial and religious history linked to Anglican training and British institutions.", views.codrington),
  ],
  "nicknames-middle-names": [
    stop("Blunts names", "Nana's reference", "This stop keeps the nickname story close to the family village, where names were shared, teased and remembered.", views.bluntsNames),
    stop("St. Thomas community road", "Area landmark", "The second stop shows another nearby community road, because family identity travels through everyday places.", views.stThomasCommunity),
  ],
  "dads-education": [
    stop("Fisherpond estate", "Nana's reference", "Fisherpond gives us a plantation-house setting for Nana's lesson about her father's work and education. A bookkeeper's arithmetic mattered because plantations ran on accounts, crops, wages and shipping.", views.fisherpond),
    stop("St. Nicholas Abbey", "Area landmark", "This plantation landmark helps children connect bookkeeping and management to the wider sugar estate world. Plantation houses show the wealth sugar created, and also the unequal system behind it.", views.stNicholasAbbey),
  ],
  "patricia-memory": [
    stop("Quiet Hillaby road", "Nana's reference", "This tender memory stays near the family high ground, because Nana is remembering home, not a public monument.", views.hillabyQuiet),
    stop("St. Thomas quiet road", "Area landmark", "The second stop gives another quiet nearby road for thinking about family, grief and care.", views.stThomasQuiet),
  ],
  "anne-downy-roots": [
    stop("Downey family road", "Nana's reference", "This central Barbados road is our research placeholder for the Downey family line Nana is teaching us about. Nana's Downey story brings Irish, African and Barbadian histories into one family line.", views.downeyRoad),
    stop("Welchman lower gully", "Area landmark", "The gully view helps explain how land, ancestry and ecology sit together in St. Thomas. Gullies are natural corridors in Barbados' limestone landscape, full of plants, shade and old routes.", views.welchmanLower),
  ],
  "anne-downy-care": [
    stop("Anne's care road", "Nana's reference", "This stop keeps us close to the family-care landscape where older generations raised younger ones. Nana is teaching that a home is also a system of aunties, grandmothers and rules.", views.harrisonsEast),
    stop("Harrison's Cave area", "Area landmark", "A nearby natural landmark gives children a clearer sense of the central Barbados environment around that care story. Harrison's Cave shows the limestone under the island, with water shaping caverns over time.", views.harrisonsCave),
  ],
  "anne-downy-farms": [
    stop("Welchman Hall", "Nana's reference", "This green St. Thomas view anchors Nana's lesson about farms, corn, beans, saving and hard work. Small farming mattered because not every lesson about land belongs to a big plantation.", views.welchmanHall),
    stop("Sunbury estate", "Area landmark", "Sunbury gives a separate estate landscape for the wider question of land, work and provision. It helps children compare family farming with the plantation system around it.", views.sunbury),
  ],
  "leaving-barbados": [
    stop("Codrington doorway", "Nana's reference", "Codrington stands for the educational choices Nana knew before local university options expanded. It helps explain why further education often meant looking beyond the island.", views.codringtonGate),
    stop("Concorde airport", "Area landmark", "The airport stop turns the lesson toward leaving home, travelling to learn, and carrying Barbados with you. Barbados has long been connected to the world through migration, study and return visits.", views.concordeAirport),
  ],
  "sugar-food-economics": [
    stop("Morgan Lewis Mill", "Nana's reference", "Morgan Lewis is the clearest sugar landmark for Nana's lesson about crops, money and fairness. A windmill crushed sugarcane before factories and centralised systems changed the work.", views.morganLewis),
    stop("Cherry Tree Hill", "Area landmark", "Cherry Tree Hill widens the view to sugar country and fields, so the food-and-land lesson has a landscape around it. From a high view, children can ask what land is used to grow and who benefits.", views.cherryTreeHill),
  ],
  "advice-grandchildren": [
    stop("Gun Hill view", "Nana's reference", "This high view gives Nana's advice a teacher's platform: look carefully, choose well, and do good.", views.gunHill),
    stop("Farley Hill", "Area landmark", "The journey ends with a wider northern view, like a grandmother sending her family forward with roots behind them.", views.farleyHill),
  ],
};

export const sceneContextsByMemoryId: Record<string, SceneContext> = {
  "natural-environment": {
    summary: "Nana is taking us inland first. St. Thomas and St. George are Barbados' only parishes without a coastline, so this scene teaches children that an island story can begin away from the beach. Look at the height, the breeze, the roads and the green hills: this is the Barbados that raised her.",
    whyThisView: "Blunts and the Hillaby high ground are the best present anchors for the place Nana names as the beginning of her story. Mount Hillaby is the island's highest point, which helps explain Nana's memory of seeing both the Caribbean side and the Atlantic breakers from central Barbados.",
    lookFor: ["High inland country", "Roads running through family landscape", "The way a small island can still have a true middle"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Mount Hillaby", kind: "natural", note: "Highest point in Barbados and the key highland landmark for Nana's inland opening.", sourceUrl: sources.mountHillaby },
      { label: "Blunts / St. Thomas", kind: "family", note: "Family-memory area in one of Barbados' two landlocked parishes." },
    ],
  },
  village: {
    summary: "Here Nana is teaching us what a village meant: about 20 houses, two grocery shops, a schoolhouse, a blacksmith, horses, donkeys and donkey carts. The fact to catch is that donkey carts were real local transport, especially at crop time, moving goods when a big lorry made no sense for a small farmer.",
    whyThisView: "The exact childhood road still needs family confirmation, so the journey uses distinct nearby village and community views that show small roads, close houses and the scale of a place where everyone knew the names.",
    lookFor: ["Small roads and homes", "Community buildings close to family life", "Roads where donkey carts could move goods before cars dominated"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Blunts village", kind: "family", note: "Nana's dead end village, remembered as small but full of work, school and neighbours." },
      { label: "Sharon Moravian area", kind: "landmark", note: "Nearby St. Thomas community context; churches helped anchor many Barbadian villages." },
    ],
  },
  school: {
    summary: "Nana taught for decades, so this stop is a lesson inside a lesson. She remembers an elementary school serving several villages, with children from about six to fifteen together. Older girls sometimes returned to help teachers with younger children, partly because families wanted them kept safe and occupied.",
    whyThisView: "The exact Blunts schoolhouse still needs confirmation, so the first 360 stop now uses The Lester Vaughan School in Cane Garden, St. Thomas as a real local school reference. The second stop keeps the parish-road context around school, church and childhood routines.",
    lookFor: ["A real St. Thomas school setting", "The distance between home and school", "A parish landscape that served several villages"],
    confidence: "Research needed",
    landmarks: [
      { label: "Blunts schoolhouse", kind: "family", note: "Exact site still needs family or local-record confirmation." },
      { label: "The Lester Vaughan School", kind: "landmark", note: "A real school in Cane Garden, St. Thomas used as the nearby education reference.", sourceUrl: sources.lesterVaughan },
      { label: "St. Thomas parish roads", kind: "landmark", note: "A practical setting for childhood school journeys before every village had many services of its own." },
    ],
  },
  "family-heritage": {
    summary: "Nana is reminding the family that memory needs care. Stories live in people, but records help the next generation find names, places and proof. For families descended from slavery, the record trail can be broken, renamed or written by someone else, so every certificate, deed and parish entry matters.",
    whyThisView: "The Barbados Archives and nearby community setting make family heritage feel both official and personal: this is where a grandmother's memory can be checked against baptisms, marriages, land records and wills.",
    lookFor: ["Records as family tools", "Public memory beside everyday life", "Why descendants need archives and elders together"],
    confidence: "Confirmed landmark",
    landmarks: [
      { label: "Barbados Archives", kind: "history", note: "A records anchor for parish registers, deeds, wills and family-history research.", sourceUrl: sources.archives },
      { label: "Historic Bridgetown context", kind: "history", note: "National memory is tied to colonial records, trade and family recovery.", sourceUrl: sources.historicBridgetown },
    ],
  },
  "accent-language": {
    summary: "This is Nana teaching voice as history. Formal English tells one story; Bajan speech tells another. Barbados was governed, schooled and judged through English, but Bajan speech carries local rhythm, humour and privacy: as Nana says, if she wants a little secret, she goes into Bajan.",
    whyThisView: "Bridgetown and the Garrison place the language lesson beside government, schooling and British colonial influence. The World Heritage setting helps children see that accent is connected to power, education and identity.",
    lookFor: ["Civic spaces", "Colonial-era setting", "The difference between official language and family voice"],
    confidence: "Confirmed landmark",
    landmarks: [
      { label: "Historic Bridgetown", kind: "history", note: "A UNESCO site linked to British Atlantic trade, government and colonial administration.", sourceUrl: sources.historicBridgetown },
      { label: "The Garrison", kind: "history", note: "A British military setting that helps explain why formal English and colonial institutions mattered." },
    ],
  },
  "northern-point-caves": {
    summary: "Nana is letting us look at beauty with respect. The north is dramatic: cliff edge, open Atlantic water, cave rock and sea spray. The educational fact here is that Animal Flower Cave is named for sea anemones, and the cliffs show how waves work on Barbados' coral limestone edge.",
    whyThisView: "The first stop is a true North Point cliff-and-ocean view. The second stop moves into the Animal Flower Cave setting so Nana's caves reference has a real place to land.",
    lookFor: ["The cliff edge meeting the Atlantic", "Sea anemone cave history", "Coral limestone shaped by waves"],
    confidence: "Confirmed landmark",
    landmarks: [
      { label: "Animal Flower Cave", kind: "natural", note: "North Point cave named for flower-like sea anemones.", sourceUrl: sources.animalFlowerCave },
      { label: "Cove Bay", kind: "viewpoint", note: "A separate northern viewpoint for reading the Atlantic side of the island." },
    ],
  },
  "universities-colonisation": {
    summary: "Nana is teaching how education, empire and Caribbean cooperation met. In the West Indies Federation, Trinidad and Tobago held the government seat, Jamaica held the army, and Barbados held the finance centre. That turns the scene into a lesson about how small islands imagined working together.",
    whyThisView: "UWI Cave Hill anchors the regional university story; Codrington shows an older colonial-era education thread. Together they show children that education in Barbados moved through church, empire and regional Caribbean ambition.",
    lookFor: ["Campus setting", "Older educational architecture", "Regional Caribbean identity"],
    confidence: "Confirmed landmark",
    landmarks: [
      { label: "UWI Cave Hill", kind: "history", note: "Regional university context for Nana's education and Federation discussion." },
      { label: "Codrington College", kind: "history", note: "Older Barbadian educational and Anglican theological landmark.", sourceUrl: sources.codrington },
    ],
  },
  "nicknames-middle-names": {
    summary: "This is one of those family lessons that sounds light but carries culture. Nana says most Caribbean people had pet names, and that some people were called by second names so the ghost would not know what was going on. It is funny, but it teaches how names can protect, tease and identify people.",
    whyThisView: "There is no single building for a nickname, so the journey uses two distinct community views around the family landscape.",
    lookFor: ["Ordinary roads where family stories travel", "Community scale", "How humour and superstition become heritage"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Blunts names", kind: "family", note: "Family-social setting for the naming story." },
      { label: "St. Thomas community", kind: "family", note: "Second nearby view for everyday family culture." },
    ],
  },
  "dads-education": {
    summary: "Nana is showing how education and work could be tied to the plantation economy. Her father left school before matric, became a bookkeeper, then rose to overseer and manager. The fact for children is that plantation work was not only field work: accounts, crop records and management also shaped the sugar system.",
    whyThisView: "Fisherpond and St. Nicholas Abbey provide two distinct plantation-landscape lessons while exact family estates are researched. They help children see the estate world behind a bookkeeper's upward path.",
    lookFor: ["Estate grounds", "Old plantation architecture", "How bookkeeping, land and sugar belonged together"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Fisherpond estate", kind: "history", note: "Plantation-house context for Nana's father's work story." },
      { label: "St. Nicholas Abbey", kind: "history", note: "Important plantation landmark for explaining sugar-era Barbados." },
    ],
  },
  "patricia-memory": {
    summary: "Nana is teaching that some memories are quiet and sacred. This scene is not about a public landmark; it teaches that family history also lives inside rooms, rituals and grief. The white coffin in Nana's memory tells children how death was often held at home and witnessed by family.",
    whyThisView: "The exact family home is still unconfirmed, so the journey uses two quiet nearby views rather than a tourist landmark.",
    lookFor: ["Quiet inland roads", "Community calm", "How ordinary places can hold deep memory"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Hillaby family landscape", kind: "family", note: "Best-fit area for Nana's earliest memory." },
      { label: "Sharon community view", kind: "landmark", note: "Nearby quiet place for reflection." },
    ],
  },
  "anne-downy-roots": {
    summary: "Nana is tracing a family line, the way a teacher draws a thread across a board. Annie Elizabeth Downey lets the children learn that one Barbadian family can carry Irish roots, African roots, plantation history and village care at the same time.",
    whyThisView: "The exact Downey sites need archival confirmation, so the stops use distinct central Barbados views close to the family-land story, with gullies showing how the island's limestone landscape shapes roads and settlement.",
    lookFor: ["Central parish roads", "Green gully landscape", "How roots can be researched through place"],
    confidence: "Research needed",
    landmarks: [
      { label: "Downey family road", kind: "family", note: "Research placeholder for the Downey family line." },
      { label: "Welchman lower gully", kind: "natural", note: "Nearby land-and-ecology context.", sourceUrl: sources.welchmanHall },
    ],
  },
  "anne-downy-care": {
    summary: "This lesson is about care across generations. Nana is showing how family was not only bloodline; it was who bathed you, raised you and watched over you. The cultural fact is that older generations often raised younger ones, so a grandmother or great-grandmother could be central to a child's daily life.",
    whyThisView: "The stops stay in central Barbados but use separate views so the care story feels like a small journey through a living place.",
    lookFor: ["Household-scale roads", "Nearby natural landmarks", "The closeness of care, home and land"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Anne Downy's care story", kind: "family", note: "Exact home site still needs confirmation." },
      { label: "Harrison's Cave area", kind: "natural", note: "Nearby limestone cave landmark for understanding central Barbados beneath the surface." },
    ],
  },
  "anne-downy-farms": {
    summary: "Nana is teaching practical wisdom here: plant, save, work properly and understand where food comes from. She remembers learning corn and beans, selling produce wholesale to people going into town, and watching sugar payments come later if the crop did well.",
    whyThisView: "Welchman Hall gives the green St. Thomas land feeling; Sunbury gives a separate estate landscape for work and provision. The pair helps children compare small family farming with estate agriculture.",
    lookFor: ["Green land", "Estate context", "The link between family farming and island economics"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Welchman Hall", kind: "natural", note: "Central Barbados green landscape.", sourceUrl: sources.welchmanHall },
      { label: "Sunbury estate", kind: "history", note: "A separate estate setting for land and labour." },
    ],
  },
  "leaving-barbados": {
    summary: "Nana is teaching that leaving home can be about learning, not rejecting where you come from. She says she had no reason to leave Barbados except education and wanting to see the world. That turns the scene into a Caribbean migration lesson, not just a travel story.",
    whyThisView: "Codrington stands for education; the airport stop turns the lesson toward movement, study and the wider world. Children should see leaving as a doorway, not as forgetting home.",
    lookFor: ["Education as preparation", "The travel gateway", "How migration can still honour home"],
    confidence: "Confirmed landmark",
    landmarks: [
      { label: "Codrington College", kind: "history", note: "Education landmark for this memory.", sourceUrl: sources.codrington },
      { label: "Concorde airport area", kind: "landmark", note: "Travel landmark for leaving and returning." },
    ],
  },
  "sugar-food-economics": {
    summary: "Nana is teaching economics through food. Sugar brought money, but families still had to eat, plant and share the benefit fairly. She remembers a rule that part of plantation land had to stay in food, then asks why Barbados now imports so much. That is the scene's big question.",
    whyThisView: "Morgan Lewis directly shows sugar history; Cherry Tree Hill opens the view toward sugar country and fields. One teaches technology, the other teaches land use.",
    lookFor: ["The windmill as sugar technology", "Old stone and estate remains", "Land that asks questions about food, labour and fairness"],
    confidence: "Confirmed landmark",
    landmarks: [
      { label: "Morgan Lewis Windmill", kind: "history", note: "Main sugar landmark for seeing how cane was processed before modern factories.", sourceUrl: sources.morganLewis },
      { label: "Cherry Tree Hill", kind: "viewpoint", note: "A wide St. Andrew landscape for sugar-country context." },
    ],
  },
  "advice-grandchildren": {
    summary: "This is Nana at her most teacherly: do your work with care, be excellent in whatever you choose, and do good without harming people. The scene uses high viewpoints because her advice is meant to travel forward, like a child looking out and choosing a path.",
    whyThisView: "The pin sits on Nana because this lesson comes from her. The journey views are high places, chosen to feel like looking out toward the grandchildren's future.",
    lookFor: ["A high view", "A sense of direction", "Advice travelling from one generation to the next"],
    confidence: "Nearby best fit",
    landmarks: [
      { label: "Gun Hill", kind: "viewpoint", note: "A high viewpoint used as Nana's teaching platform." },
      { label: "Farley Hill", kind: "viewpoint", note: "A closing view for looking forward as a family." },
    ],
  },
};
