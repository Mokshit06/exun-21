import { Box, Text, TextProps } from '@chakra-ui/react';
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

export default function Tag({
  px = 2,
  py = 0.5,
  ...props
}: TextProps & {
  py?: number;
  px?: number;
}) {
  let [bg, color] = useMemo(() => tagIndex.next().value!, []);

  console.log({ bg, color });

  return (
    <Box px={px} py={py} bg={bg} w="max-content" rounded="md">
      <Text {...props} color={color} />
    </Box>
  );
}
