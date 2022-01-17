import { Tag as CTag } from '@chakra-ui/react';
import { useMemo } from 'react';

const TagColors: Array<[string, string]> = [
  ['#253c56', '#2787e3'],
  ['#1c442d', '#1d9152'],
  ['#5b4019', '#c18435'],
];

function* colorGenerator() {
  let currIndex = 0;
  while (true) {
    yield TagColors[currIndex];
    currIndex = (currIndex + 1) % TagColors.length;
  }
}
const tagIndex = colorGenerator();

export default function Tag(props: { size: 'md' | 'lg'; children: string }) {
  const { size, children } = props;
  let [bg, color] = useMemo(() => tagIndex.next().value!, []);

  return (
    <CTag size={size} bg={bg} color={color}>
      {children}
    </CTag>
  );
}
