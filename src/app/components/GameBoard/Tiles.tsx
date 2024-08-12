import styles from "./styles.module.css";

type Props = {
  width: number;
  height: number;
  tileCount: number;
  tilesToFill: number;
};

export default function Tiles({
  width,
  height,
  tileCount,
  tilesToFill,
}: Props) {
  return (
    <div>
      <div className="flex">
        {[...Array(tileCount)].map((_, i) => {
          if (i < tilesToFill) {
            return (
              <div
                key={i}
                className={`bg-grey w-${width} h-${height} mx-2 ${styles.flip}`}
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            );
          } else {
            return (
              <div
                key={i}
                className={`bg-grey w-${width} h-${height} mx-2`}
              ></div>
            );
          }
        })}
      </div>
    </div>
  );
}