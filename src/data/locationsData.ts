export type CategoryId = 1 | 2 | 3;

export type LocationItem = {
  id: string;
  categoryId: CategoryId;
  title: string;
  coords: { lat: number; lng: number };
  description: string;
  image: any;
};

export const CATEGORIES: { id: CategoryId; title: string; subtitle: string }[] = [
  {
    id: 1,
    title: 'Famous landscapes and\nclassic wildlife',
    subtitle: 'Iconic Wildlife Parks',
  },
  {
    id: 2,
    title: 'Remote, untouched\nwilderness',
    subtitle: 'Remote & Wild Nature',
  },
  {
    id: 3,
    title: 'Easy exploration and\nlearning',
    subtitle: 'Family-Friendly & Discovery Parks',
  },
];


export const LOCATIONS: LocationItem[] = [
  {
    id: 'banff',
    categoryId: 1,
    title: 'Banff National Park',
    coords: { lat: 51.4968, lng: -115.9281 },
    description:
      'Banff is Canada’s oldest national park, known for its dramatic Rocky Mountain scenery and rich wildlife. Elk, bighorn sheep, black bears, and grizzly bears are commonly spotted throughout the park. Turquoise lakes, alpine forests, and mountain valleys create a perfect balance between accessibility and wild nature.',
    image: require('../assets/banff.png'),
  },
  {
    id: 'jasper',
    categoryId: 1,
    title: 'Jasper National Park',
    coords: { lat: 52.8734, lng: -117.9543 },
    description:
      'Jasper is one of the largest national parks in the Canadian Rockies. Its remote landscapes provide habitat for wolves, moose, caribou, and mountain goats. The park is also a designated Dark Sky Preserve, making wildlife encounters at dawn and dusk especially memorable.',
    image: require('../assets/jasper.png'),
  },
  {
    id: 'algonquin',
    categoryId: 1,
    title: 'Algonquin Provincial Park',
    coords: { lat: 45.8372, lng: -78.3796 },
    description:
      'Algonquin is famous for its forests, lakes, and canoe routes. It is one of the best places in Canada to see moose in the wild. Wolves, beavers, and loons are also key symbols of this park, which combines deep wilderness with a strong conservation history.',
    image: require('../assets/algonquin.png'),
  },
  {
    id: 'pacific_rim',
    categoryId: 1,
    title: 'Pacific Rim National Park Reserve',
    coords: { lat: 48.6535, lng: -124.7256 },
    description:
      'Located on Vancouver Island, this park protects rugged coastlines and ancient rainforests. Sea otters, whales, seals, and countless bird species thrive here. It offers a rare combination of marine and forest ecosystems in one protected area.',
    image: require('../assets/pacific_rim.png'),
  },
  {
    id: 'gros_morne',
    categoryId: 1,
    title: 'Gros Morne National Park',
    coords: { lat: 49.6494, lng: -57.7516 },
    description:
      'Gros Morne is known for its unique geology and dramatic fjords. Moose, foxes, and seabirds are commonly seen. The park tells a deep story of Earth’s formation while also preserving fragile northern ecosystems.',
    image: require('../assets/gros_morne.png'),
  },

  {
    id: 'nahanni',
    categoryId: 2,
    title: 'Nahanni National Park Reserve',
    coords: { lat: 61.5544, lng: -125.785 },
    description:
      'Nahanni is famous for its deep canyons, powerful waterfalls, and remote wilderness. Dall sheep, wolves, and grizzly bears inhabit this rugged region. It is one of Canada’s most untouched and awe-inspiring parks.',
    image: require('../assets/nahanni.png'),
  },
  {
    id: 'auyuittuq',
    categoryId: 2,
    title: 'Auyuittuq National Park',
    coords: { lat: 67.8735, lng: -65.282 },
    description:
      'Auyuittuq means “the land that never melts.” This Arctic park features glaciers, fjords, and polar wildlife. Arctic foxes and seabirds dominate the landscape, offering a rare glimpse into life in extreme environments.',
    image: require('../assets/auyuittuq.png'),
  },
  {
    id: 'wood_buffalo',
    categoryId: 2,
    title: 'Wood Buffalo National Park',
    coords: { lat: 59.305, lng: -112.4146 },
    description:
      'This is Canada’s largest national park and a key refuge for wood bison. It also protects the nesting grounds of endangered whooping cranes. Vast wetlands and boreal forests define this remote ecosystem.',
    image: require('../assets/wood_buffalo.png'),
  },
  {
    id: 'kluane',
    categoryId: 2,
    title: 'Kluane National Park',
    coords: { lat: 60.7212, lng: -137.5117 },
    description:
      'Home to Canada’s highest mountains and massive icefields, Kluane supports grizzly bears, wolves, and Dall sheep. Its landscapes are raw, powerful, and largely untouched by modern development.',
    image: require('../assets/kluane.png'),
  },
  {
    id: 'torngat',
    categoryId: 2,
    title: 'Torngat Mountains National Park',
    coords: { lat: 58.734, lng: -63.7558 },
    description:
      'This northern park features dramatic mountains rising directly from the sea. Polar bears, caribou, and Arctic wildlife roam freely. The park is co-managed with Indigenous communities, blending nature and cultural heritage.',
    image: require('../assets/torngat.png'),
  },
  {
    id: 'riding_mountain',
    categoryId: 3,
    title: 'Riding Mountain National Park',
    coords: { lat: 50.9906, lng: -99.85 },
    description:
      'Riding Mountain sits at the meeting point of prairie, forest, and wetland ecosystems. Bison, elk, and deer are commonly seen. It’s an excellent park for learning about ecosystem diversity in one location.',
    image: require('../assets/riding_mountain.png'),
  },
  {
    id: 'pei',
    categoryId: 3,
    title: 'Prince Edward Island National Park',
    coords: { lat: 46.4167, lng: -63.0833 },
    description:
      'This coastal park protects red sandstone cliffs, dunes, and beaches. Foxes, seabirds, and marine life define the area. Its gentle trails and open landscapes make it ideal for relaxed exploration.',
    image: require('../assets/pei.png'),
  },
  {
    id: 'fundy',
    categoryId: 3,
    title: 'Fundy National Park',
    coords: { lat: 45.5987, lng: -64.95 },
    description:
      'Fundy is known for the world’s highest tides. Forest animals like deer and black bears live alongside dramatic coastal ecosystems. The park combines geology, wildlife, and scenic hiking trails.',
    image: require('../assets/fundy.png'),
  },
  {
    id: 'point_pelee',
    categoryId: 3,
    title: 'Point Pelee National Park',
    coords: { lat: 41.9616, lng: -82.5186 },
    description:
      'Point Pelee is a major bird migration hotspot. Hundreds of bird species pass through every year. Its small size makes wildlife observation easy and rewarding, especially in spring and fall.',
    image: require('../assets/point_pelee.png'),
  },
  {
    id: 'waterton',
    categoryId: 3,
    title: 'Waterton Lakes National Park',
    coords: { lat: 49.052, lng: -113.915 },
    description:
      'Where prairies meet the Rocky Mountains, Waterton offers diverse habitats in a compact area. Bears, deer, and birds thrive here. The park is also part of an international peace park with the USA.',
    image: require('../assets/waterton.png'),
  },
];

export const formatCoords = (lat: number, lng: number) => `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;