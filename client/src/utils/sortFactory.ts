import Field from '../types/Field';
import Game from '../types/Game';

const sortFactory = (field: Field, desc = false) => (a: Game, b: Game) => {
  if ((a[field] || 0) < (b[field] || 0)) {
    return desc ? 1 : -1
  }
  if ((a[field] || 0) > (b[field] || 0)) {
    return desc ? -1 : 1
  }
  return 0
}

export default sortFactory
