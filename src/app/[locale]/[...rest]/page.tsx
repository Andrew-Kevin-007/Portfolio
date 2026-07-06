import { notFound } from "next/navigation";

/** Catch-all: anything that isn't a defined route renders the themed 404. */
export default function CatchAll() {
  notFound();
}
