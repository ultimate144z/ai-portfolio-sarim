"use client";
import { Card, Carousel } from "@/components/projects/apple-cards-carousel";
import { data } from "@/components/projects/ConfigData";

export default function AllProjects() {
  const cards = data.map((card, index) => (
    <Card key={card.title} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full pt-6">
      <h2 className="mx-auto max-w-7xl px-1 text-xl font-bold text-white md:text-2xl">
        Projects
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
