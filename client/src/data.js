export const bloodTypes = ['O−', 'O+', 'A−', 'A+', 'B−', 'B+', 'AB−', 'AB+'];

export const compatibility = {
  'O−': { donatesTo: ['O−','O+','A−','A+','B−','B+','AB−','AB+'], receivesFrom: ['O−'], label: 'Universal donor' },
  'O+': { donatesTo: ['O+','A+','B+','AB+'], receivesFrom: ['O−','O+'], label: 'Common donor' },
  'A−': { donatesTo: ['A−','A+','AB−','AB+'], receivesFrom: ['O−','A−'], label: 'Rare donor' },
  'A+': { donatesTo: ['A+','AB+'], receivesFrom: ['O−','O+','A−','A+'], label: 'Common type' },
  'B−': { donatesTo: ['B−','B+','AB−','AB+'], receivesFrom: ['O−','B−'], label: 'Rare donor' },
  'B+': { donatesTo: ['B+','AB+'], receivesFrom: ['O−','O+','B−','B+'], label: 'Common type' },
  'AB−': { donatesTo: ['AB−','AB+'], receivesFrom: ['O−','A−','B−','AB−'], label: 'Rare recipient' },
  'AB+': { donatesTo: ['AB+'], receivesFrom: ['O−','O+','A−','A+','B−','B+','AB−','AB+'], label: 'Universal recipient' }
};

export const donorData = [
  { name: 'Aarav S.', type: 'O−', loc: 'Koramangala, 1.2km', dist: '1.2', resp: '4m', last: '3m ago', status: 'available' },
  { name: 'Diya M.', type: 'O+', loc: 'Indiranagar, 2.8km', dist: '2.8', resp: '8m', last: '12m ago', status: 'available' },
  { name: 'Vikram R.', type: 'A−', loc: 'HSR Layout, 3.4km', dist: '3.4', resp: '6m', last: '1h ago', status: 'limited' },
  { name: 'Sara K.', type: 'A+', loc: 'Whitefield, 5.1km', dist: '5.1', resp: '12m', last: '5m ago', status: 'available' },
  { name: 'Rohan G.', type: 'B−', loc: 'Jayanagar, 2.1km', dist: '2.1', resp: '5m', last: '8m ago', status: 'available' },
  { name: 'Anika P.', type: 'B+', loc: 'BTM Layout, 1.8km', dist: '1.8', resp: '7m', last: '20m ago', status: 'available' },
  { name: 'Kabir N.', type: 'AB−', loc: 'Marathahalli, 4.3km', dist: '4.3', resp: '15m', last: '2h ago', status: 'limited' },
  { name: 'Meera J.', type: 'AB+', loc: 'Hebbal, 6.2km', dist: '6.2', resp: '11m', last: '15m ago', status: 'available' },
  { name: 'Arjun V.', type: 'O−', loc: 'Electronic City, 7.4km', dist: '7.4', resp: '9m', last: '6m ago', status: 'available' },
  { name: 'Lena T.', type: 'O+', loc: 'MG Road, 0.9km', dist: '0.9', resp: '3m', last: '1m ago', status: 'available' },
  { name: 'Ishaan D.', type: 'A+', loc: 'Bellandur, 3.7km', dist: '3.7', resp: '10m', last: '45m ago', status: 'available' },
  { name: 'Noor F.', type: 'B+', loc: 'Banashankari, 4.0km', dist: '4.0', resp: '8m', last: '18m ago', status: 'limited' }
];

