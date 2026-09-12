import Skeleton from "@mui/material/Skeleton";

type SkeletonType = "mod-table";

interface SkeletonsProps {
  type: SkeletonType;
  rows?: number;
  columns?: number;
}

export default function OwnerSkeletons({
  type,
  rows = 8,
  columns = 8,
}: SkeletonsProps) {
  if (type === "mod-table") {
    return (
      <>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="py-4 px-2">
                <Skeleton
                  variant="text"
                  width={
                    colIndex === 0 ? 220 : colIndex === columns - 1 ? 60 : 100
                  }
                  height={24}
                />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  return null;
}
