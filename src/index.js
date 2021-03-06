// @flow strict

type Numberlike = number | string | null | void;
type Declensions = [string, string, string];
type Plural = (number: ?number) => string;

// N - number parameter (e.g. or ?number)
// R - retyrn type
type Formatter = <N, R>(number: N, word: string) => R;

function _absInt(number: Numberlike): number {
  const int = Math.abs(parseInt(number, 10) || 0);
  if (Number.isNaN(int)) {
    throw new TypeError('Invalid number');
  }
  return int;
}

function _declensions(one: string, _two?: string, _five?: string): Declensions {
  const two = typeof _two === 'undefined' ? one : _two;
  const five = typeof _five === 'undefined' ? two : _five;
  return [one, two, five];
}

function _pluralize(int: number, declensions: Declensions) {
  return declensions[
    int % 100 > 4 && int % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][int % 10 < 5 ? int % 10 : 5]
  ];
}

export function plural(one: string, two?: string, five?: string): Plural {
  return (number: Numberlike) =>
    _pluralize(_absInt(number), _declensions(one, two, five));
}

export function format(
  formatter: Formatter,
  one: string,
  two?: string,
  five?: string,
) {
  return (number: ?number) => formatter(number, plural(one, two, five)(number));
}

export function defaultFormat(one: string, two?: string, five?: string) {
  return (number: ?number) =>
    [number, plural(one, two, five)(number)].join(' ');
}

export default defaultFormat;
