import { Game } from './BowlingGame';

describe('BowlingGame', () => {
  const setup = () => {
    const game = new Game();

    return { game };
  };
  const rollMany = (game, nbrRolls, nbrPins) => {
    for (let i=0; i<nbrRolls; i++) {
      game.roll(nbrPins);
    }
  }
  const rollSpare = (game) => {
    game.roll(5);
    game.roll(5);
  }
  const rollStrike = (game) => {
    game.roll(10);
  }

  it('returns a score of 0 for a gutter game (no bumpers)', () => {
    const { game } = setup();
    rollMany(game, 20, 0);

    expect(game.score()).toBe(0);
  });

  it('returns a score of 20 when all 1s are rolled (bumpers out)', () => {
    const { game } = setup();
    rollMany(game, 20, 1);

    expect(game.score()).toBe(20);
  });

  it('returns the correct score when one spare is rolled', () => {
    const { game } = setup();
    rollSpare(game);
    game.roll(3);
    rollMany(game, 17, 0);
    
    expect(game.score()).toBe(16);
  });

  it('returns the correct score when one strike is rolled', () => {
    const { game } = setup();
    rollStrike(game);
    game.roll(4);
    game.roll(3);
    rollMany(16, 0);
    expect(game.score()).toBe(24);
  });

  it('returns the correct score when a perfect game is played', () => {
    const { game } = setup();

    rollMany(game, 20, 10);
    expect(game.score()).toBe(300);
  });
});