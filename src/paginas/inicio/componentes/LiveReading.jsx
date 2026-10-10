import { useEffect, useState } from "react";

export function LiveReading({ type }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1800);
    return () => clearInterval(timer);
  }, []);
  const value =
    type === "temperature"
      ? `${(4.2 + Math.sin(tick / 2) * 0.4).toFixed(1).replace(".", ",")}°C`
      : `${Math.round(72 + Math.cos(tick / 3) * 4)}%`;
  return <strong>{value}</strong>;
}
