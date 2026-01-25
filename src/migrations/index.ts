import * as migration_20260125_190952 from './20260125_190952';

export const migrations = [
  {
    up: migration_20260125_190952.up,
    down: migration_20260125_190952.down,
    name: '20260125_190952'
  },
];
