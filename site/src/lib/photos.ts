import type { ImageMetadata } from 'astro';
import actor1 from '../assets/photos/actor-1.jpg';
import tri1 from '../assets/photos/tri-1.jpg';
import tri2 from '../assets/photos/tri-2.jpg';
import tri3 from '../assets/photos/tri-3.jpg';
import sail1 from '../assets/photos/sail-1.jpg';
import sail2 from '../assets/photos/sail-2.jpg';
import sail3 from '../assets/photos/sail-3.jpg';
import climate1 from '../assets/photos/climate-1.jpg';
import climate2 from '../assets/photos/climate-2.jpg';
import family1 from '../assets/photos/family-1.jpg';
import family2 from '../assets/photos/family-2.jpg';
import family3 from '../assets/photos/family-3.jpg';
import slocc from '../assets/logo-slocc.png';

type Photo = { src: ImageMetadata; alt: string; pos?: string };

// Keyed by facet name (lowercased) from README.md. A facet with no entry renders text only.
export const facetPhotos: Record<string, Photo[]> = {
  actor: [{ src: actor1, alt: 'In costume, telling stories to a crowd of kids under a lit tree', pos: '50% 62%' }],
  triathlete: [
    { src: tri1, alt: 'On the bike along a beach road during a race' },
    { src: tri2, alt: 'In race kit in front of Morro Rock' },
    { src: tri3, alt: 'Pool swim in morning fog' },
  ],
  sailor: [
    { src: sail1, alt: 'On the water with spinnakers behind' },
    { src: sail2, alt: 'Kellan up the mast', pos: '50% 15%' },
    { src: sail3, alt: 'Coaching at junior sailing week' },
  ],
  climate: [
    { src: climate1, alt: 'At the SLO Climate Coalition booth', pos: '50% 20%' },
    { src: climate2, alt: 'Next to a new heat pump water heater', pos: '50% 25%' },
  ],
  father: [
    { src: family3, alt: 'Family under the St. Louis Arch' },
    { src: family1, alt: 'With Kellan at Dodger Stadium' },
    { src: family2, alt: 'With Crystal' },
  ],
};

export const facetLogos: Record<string, { src: ImageMetadata; alt: string }> = {
  climate: { src: slocc, alt: 'SLO Climate Coalition' },
};

// Every photo key must match a facet name in README.md, or its photos would silently vanish.
import { facets } from './readme';
for (const key of [...Object.keys(facetPhotos), ...Object.keys(facetLogos)]) {
  if (!facets.some((f) => f.slug === key)) throw new Error(`photos.ts has photos for "${key}", but README.md has no facet by that name`);
}
