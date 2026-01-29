"use client";

const banner = {
  title: "Welcome to Bestprofit Futures",
  description:
    "Selamat datang. Kami siap membantu perjalanan trading Anda dengan layanan profesional dan dukungan terbaik.",
  image: "/assets/bpf-logo-backup.png",
};

export default function CarouselWithContent() {
  return (
    <div className="relative w-full overflow-hidden bg-[url(/assets/bg-rfb.jpg)]">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 px-6 py-10 md:px-16 lg:px-32">
        <div className="text-center md:text-left max-w-xl text-white">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            {banner.title}
          </h1>
          <p className="text-base md:text-lg mb-6">{banner.description}</p>
        </div>

        <div className="mt-8 md:mt-0 w-full md:w-1/2 flex-shrink-0">
          <div className="relative w-full h-[300px] md:h-[380px] lg:h-[400px]">
            <div
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
