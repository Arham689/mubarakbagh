/**
 * All imagery comes from Unsplash (free license). Swap any entry here and every
 * template updates. Find more at https://unsplash.com/s/photos/saree
 * Unsplash asks (not requires) that you credit photographers — see `credits` below.
 */
export type Photo = { id: string; alt: string; by: string };

const p = (id: string, alt: string, by: string): Photo => ({ id, alt, by });

export const img = {
  roseSilk: p("1727430228383-aa1fb59db8bf", "Woman in rose-gold silk saree by the sea", "shades by 43"),
  tieDye: p("1769275061202-cf3ef67d7279", "Woman in vibrant tie-dye saree reaching for flowers", "Dhruv Vishwakarma"),
  forestLight: p("1769275061721-bb6439d24ebc", "Woman in dark embroidered saree in forest light", "Dhruv Vishwakarma"),
  mintKanjivaram: p("1679006831648-7c9ea12e5807", "Woman in mint silk saree with temple jewellery", "Sabesh Photography"),
  pinkSilk: p("1617627143750-d86bc21e42bb", "Woman in pink and orange silk saree among trees", "Sabesh Photography"),
  purpleBorder: p("1610030469983-98e550d6193c", "Woman in purple saree with gold border on red", "Bulbul Ahmed"),
  redBridal: p("1610047614301-13c63f00c032", "Bride in red and gold lehenga", "Bulbul Ahmed"),
  violetSilk: p("1641699862936-be9f49b1c38d", "Woman in violet and gold silk saree", "Bella Pon Fruitsia"),
  ivory: p("1729146768775-3662af38016e", "Woman in ivory saree with pearl necklace", "The Behruz Theory"),
  archLehenga: p("1746372283841-dbb3838f9935", "Woman in lehenga standing in a stone archway", "SAREE GHAR"),
  mustardLehenga: p("1767955694884-d4bf352c23c2", "Woman in mustard and maroon lehenga", "Morni Saree"),
  nightBride: p("1759906760638-eeffcb471e53", "Bride in red lehenga and veil at night", "Royal Photography"),
  zardozi1: p("1724856604254-f7cf4e9c8f72", "Close-up of red and gold bridal embroidery", "Abhishek Sharma"),
  zardozi2: p("1724856604403-60304b28906c", "Elephant motif zardozi on red lehenga", "Abhishek Sharma"),
  zardozi3: p("1724856605022-106d6dd6e842", "Gold zardozi border on red lehenga", "Abhishek Sharma"),
  pinkBride: p("1610173827043-9db50e0d8ef9", "Bride in pink with kundan jewellery and henna", "Alok Verma"),
  bridePortrait: p("1600685890506-593fdf55949b", "Bride portrait with maang tikka and veil", "Aayush Rawat"),
  palaceBride: p("1654764746225-e63f5e90facd", "Bride in red lehenga before palace walls", "Harsh Gupta"),
  coralBride: p("1684868268327-7e5590bcfbd6", "Bride in coral with nath and jewellery", "Gurpreet Singh"),
  goldZari: p("1787554497632-1727c23e58cb", "Hand with gold rings on gold zari lace", "Raúl Mermans García"),
  redSilk: p("1616756141603-6d37d5cde2a2", "Red silk with gold bangle", "Urvi Kotasthane"),
  pearlsIkat: p("1616756351484-798f37bdffa0", "Pearl strand on red ikat silk", "Urvi Kotasthane"),
  floralPrint: p("1783763625078-e015b4b42a92", "Antique Indian floral block print", "The Metropolitan Museum of Art"),
  paisley: p("1783763624907-b9974ce1dbe3", "Repeating paisley textile pattern", "The Metropolitan Museum of Art"),
  hawaMahal: p("1578999935853-4ec5fa6c1f60", "Hawa Mahal facade against blue sky", "Roberto Reposo"),
  hawaHorses: p("1477587458883-47145ed94245", "Decorated horses passing Hawa Mahal", "Aditya Siva"),
  jalMahal: p("1661924326425-c14a6426d989", "Jal Mahal reflected in still water", "Mayur Sable"),
  hawaDetail: p("1695395550316-8995ae9d35ff", "Hawa Mahal jharokha windows detail", "Jayanth Muppaneni"),
  hawaPink: p("1722577359807-96d328b8b303", "Pink Hawa Mahal facade", "Tony Sebastian"),
  jaipurGate: p("1716534134003-ba47907e119b", "Ornate painted gate of City Palace Jaipur", "Johan Mouchet"),
  amerGarden: p("1681642153169-e5daa77025da", "Mughal garden and pavilion at Amer", "Pradheep Rajendirane"),
} satisfies Record<string, Photo>;

export const base = (ph: Photo) => `https://images.unsplash.com/photo-${ph.id}`;

/** Direct URL (for CSS backgrounds / WebGL textures). */
export const url = (ph: Photo, w = 1600) => `${base(ph)}?auto=format&fit=crop&w=${w}&q=80`;

export const credits = Array.from(new Set(Object.values(img).map((x) => x.by)));
