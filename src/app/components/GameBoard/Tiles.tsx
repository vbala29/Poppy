import styles from './styles.module.css'

type Props = {
    width: Number,
    height: Number,
    tileCount: Number
}

export default function Tiles({ width, height, tileCount }: Props) {
  return (
    <div>
        <div className="flex">
        {[...Array(tileCount)].map((_, i) => (
          <div
            key={i}
            className={`bg-grey w-${width} h-${height} mx-2 ${styles.flip}`}
            style={{ animationDelay: `${i * 100}ms` }}
          ></div>
        ))}
        </div>
    </div>
  )
}
