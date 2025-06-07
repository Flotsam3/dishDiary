import * as React from "react";

export function Carousel({ children }) {
  const [current, setCurrent] = React.useState(0);
  const count = React.Children.count(children);

  function next() {
    setCurrent((c) => (c + 1) % count);
  }
  function prev() {
    setCurrent((c) => (c - 1 + count) % count);
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-xl">
        {React.Children.toArray(children)[current]}
      </div>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-900 rounded-full px-3 py-1 shadow hover:bg-gray-100 transition"
        style={{ backgroundColor: '#fff' }}
        onClick={prev}
      >
        ‹
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-900 rounded-full px-3 py-1 shadow hover:bg-gray-100 transition"
        style={{ backgroundColor: '#fff' }}
        onClick={next}
      >
        ›
      </button>
    </div>
  );
}

export function CarouselContent({ children }) {
  return <div>{children}</div>;
}

export function CarouselItem({ children }) {
  return <div className="w-full">{children}</div>;
}

export function CarouselNext() { return null; }
export function CarouselPrevious() { return null; }
