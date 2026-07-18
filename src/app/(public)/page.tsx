import Link from "next/link";

export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="max-w-xl text-center">
        <p className="text-primary mb-3 text-sm font-semibold tracking-[0.2em]">
          ANMISOFT
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Content platform foundation
        </h1>
        <p className="text-base-content/65 mt-4 leading-7">
          The public experience is being rebuilt around independent products and
          one maintainable publishing platform.
        </p>
        <Link className="btn btn-primary mt-8" href="/login">
          Owner sign in
        </Link>
      </section>
    </main>
  );
}
