import {
  gridDensityFactorSelector,
  gridDimensionsSelector,
  gridRowCountSelector,
  gridVisibleColumnDefinitionsSelector,
  useGridApiContext,
  useGridRootProps,
  useGridSelector
} from "@mui/x-data-grid";
import { Box, LinearProgress, Skeleton, styled } from "@mui/material";
import { ReactNode, useEffect, useMemo, useRef } from "react";

export const TableLoader = () => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;

  const factor = useGridSelector(apiRef, gridDensityFactorSelector);
  const rowHeight = Math.floor(rootProps.rowHeight * factor);

  const skeletonRowsCount = Math.ceil(viewportHeight / rowHeight);

  const columns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);

  const children = useMemo(() => {
    const random = randomBetween(12345, 25, 75);
    const array: ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      for (const column of columns) {
        const width = Math.round(random());
        array.push(
            <SkeletonCell key={`col-${column.field}-${i}`} sx={{justifyContent: column.align}}>
              <Skeleton sx={{mx: 1}} width={`${width}%`}/>
            </SkeletonCell>
        );
      }
      array.push(<SkeletonCell key={`fill-${i}`}/>);
    }
    return array;
  }, [skeletonRowsCount, columns]);

  const rowsCount = useGridSelector(apiRef, gridRowCountSelector);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return apiRef.current.subscribeEvent('scrollPositionChange', (params) => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = params.left;
      }
    });
  }, [apiRef]);

  return rowsCount > 0 ? (
      <LinearProgress/>
  ) : (
      <div
          ref={scrollRef}
          style={{
            display: 'grid',
            gridTemplateColumns: `${columns.map(({computedWidth}) => `${computedWidth}px`).join(' ')} 1fr`,
            gridAutoRows: `${rowHeight}px`,
            overflowX: 'hidden',
          }}>
        {children}
      </div>
  );
}

const SkeletonCell = styled(Box)(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const mulberry32 = (a: number) => {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randomBetween = (seed: number, min: number, max: number) => {
  const random = mulberry32(seed);
  return () => min + (max - min) * random();
}
