import { generateSeoCombinations } from '../lib/seo-data';

const combos = generateSeoCombinations();
console.log(`Generated ${combos.length} combinations.`);

// Print first 10
console.log('--- First 10 ---');
combos.slice(0, 10).forEach(c => console.log(c.slug));

// Print random 10
console.log('--- Random 10 ---');
for (let i = 0; i < 10; i++) {
    const random = combos[Math.floor(Math.random() * combos.length)];
    console.log(random.slug);
}
