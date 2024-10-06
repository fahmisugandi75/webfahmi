export default function Testimonial() {
    return (
      <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 z-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.gray.900))] opacity-20" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <img
            alt=""
            src="https://tailwindui.com/plus/img/logos/workcation-logo-indigo-600.svg"
            className="mx-auto h-12"
          />
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-100 sm:text-2xl sm:leading-9">
              <p>
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias
                molestiae. Numquam corrupti in laborum sed rerum et corporis."
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="mx-auto h-10 w-10 rounded-full"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-100">Judith Black</div>
                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-400">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="text-gray-400">CEO of Workcation</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }
