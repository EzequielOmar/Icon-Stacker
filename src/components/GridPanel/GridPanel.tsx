import { useMemo, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import GridIcon from "../GridIcon";
import styles from "./GridPanel.module.scss";
import trpc from "@/utils/trpc";

const rowHeight = 60;
const columns = { lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 };

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridPanelProps {
  allIconsQuery: any;
  allFoldersQuery: any;
}

const GridPanel: React.FC<GridPanelProps> = ({
  allIconsQuery,
  allFoldersQuery,
}) => {
  const [hasDragged, setHasDragged] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "lg" | "md" | "sm" | "xs" | "xxs"
  >("lg");
  const [layout, setLayout] = useState<any[]>([]);
  const [bookmarkTypes, setBookmarkTypes] = useState<Record<string, string>>(
    {}
  );

  const moveBookmark = trpc.moveBookmark.useMutation();
  const moveFolder = trpc.moveFolder.useMutation();

  useEffect(() => {
    const { layout, bookmarkTypes } = generateLayoutConstant(
      allIconsQuery.data,
      currentBreakpoint
    );
    setLayout(layout);
    setBookmarkTypes(bookmarkTypes);
  }, [allIconsQuery.data, currentBreakpoint]);

  const handleBreakpointChange = (newBreakpoint: keyof typeof columns) => {
    setCurrentBreakpoint(newBreakpoint);
  };

  const handleDragStart = () => {
    setHasDragged(false);
  };

  const handleDragStop = async (layout: any, oldItem: any, newItem: any) => {
    setHasDragged(!(oldItem.x === newItem.x && oldItem.y === newItem.y));
    const overlap_element = layout.filter(
      (el: any) =>
        el.x === newItem.x && el.y === newItem.y && el.i !== newItem.i
    )[0];
    if (overlap_element) {
      if (bookmarkTypes[overlap_element.i] === "bookmark") {
        newItem.x = oldItem.x;
        newItem.y = oldItem.y;
      } else {
        if (bookmarkTypes[newItem.i] === "bookmark") {
          await moveBookmark.mutateAsync({
            bookmarkId: newItem.i,
            folder_id: overlap_element.i,
          });
        } else {
          await moveFolder.mutateAsync({
            id: newItem.i,
            folder_id: overlap_element.i,
          });
          await allFoldersQuery.refetch();
        }
        await allIconsQuery.refetch();
      }
    }
  };

  return (
    <div className={styles.container}>
      <ResponsiveGridLayout
        className={styles.layout}
        layouts={{ [currentBreakpoint]: layout }}
        rowHeight={rowHeight}
        cols={columns}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        onBreakpointChange={handleBreakpointChange}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        isDraggable
        isResizable={false}
        preventCollision
        compactType={"horizontal"}
        allowOverlap
        margin={[0, 0]}
        containerPadding={[0, 0]}
      >
        {allIconsQuery.data.map((bookmark: any) => (
          <div className={styles.cell} key={bookmark.id}>
            <GridIcon
              allIconsQuery={allIconsQuery}
              allFoldersQuery={allFoldersQuery}
              bookmark={bookmark}
              hasDragged={hasDragged}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

const generateLayoutConstant = (
  bookmarks: any[],
  breakpoint: keyof typeof columns
) => {
  const columnCount = columns[breakpoint];
  const layout = bookmarks.map((bookmark: any, index: number) => ({
    i: bookmark.id,
    x: index % columnCount,
    y: Math.floor(index / columnCount),
    w: 1,
    h: 1,
  }));
  const bookmarkTypes: Record<string, string> = {};
  bookmarks.forEach((bookmark) => {
    bookmarkTypes[bookmark.id] = bookmark.url ? "bookmark" : "folder";
  });
  return { layout, bookmarkTypes };
};

export default GridPanel;
