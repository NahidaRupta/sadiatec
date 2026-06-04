import type { StatsBarBlockProps } from './types'

export function StatsBarBlock({
  items,
}: StatsBarBlockProps) {
  if (!items || items.length === 0) return null

  // Ensure we are handling exactly up to two main blocks as shown in the design
  const missionItem = items[0]
  const impactItem = items[1]

  return (
    <section className="bg-[#fafafa] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          
          {/* Left Block: Mission & Chart */}
          {missionItem && (
            <div className="flex flex-col justify-between rounded-none bg-[#2d2d2d] p-8 text-white md:col-span-1 lg:col-span-2">
              <div>
                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                  {missionItem.label}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-neutral-300">
                  {missionItem.body}
                </p>
              </div>

              {/* Graphic Section: Bar Chart with Indicator */}
              <div className="mt-12 flex items-end justify-between gap-2 px-2 h-36">
                <div className="w-4 bg-neutral-500 h-1/4"></div>
                <div className="w-4 bg-neutral-500 h-2/5"></div>
                <div className="w-4 bg-neutral-500 h-3/5"></div>
                
                {/* Active Highlighted Arrow Bar */}
                <div className="relative flex flex-col items-center w-6 h-full justify-end">
                  <div className="absolute -top-10 bg-neutral-700 text-[10px] px-2 py-0.5 rounded-full border border-neutral-500 whitespace-nowrap">
                    {missionItem.value || "$12,000+"}
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white"></div>
                  <div className="w-2 bg-white h-4/5"></div>
                </div>

                <div className="w-4 bg-neutral-500 h-3/4"></div>
                <div className="w-4 bg-neutral-500 h-1/2"></div>
                <div className="w-4 bg-neutral-500 h-2/3"></div>
              </div>
            </div>
          )}

          {/* Right Block: Impact & Map */}
          {impactItem && (
            <div className="relative flex flex-col justify-between bg-white p-8 md:col-span-2 lg:col-span-3 shadow-sm border border-neutral-100 min-h-[400px]">
              <div>
                <h2 className="text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
                  {impactItem.label}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">
                  {impactItem.body}
                </p>
              </div>

              {/* World Map Background Placeholder with Custom Pinpoints */}
              <div className="absolute inset-0 top-32 left-12 right-4 bottom-4 opacity-70 pointer-events-none bg-center bg-no-repeat bg-contain" 
                   style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80')`, mixBlendMode: 'multiply' }}>
                {/* Dot 1 */}
                <span className="absolute top-[40%] left-[65%] h-4 w-4 rounded-full bg-orange-400 opacity-80 animate-pulse"></span>
                {/* Dot 2 */}
                <span className="absolute top-[30%] left-[72%] h-4 w-4 rounded-full bg-orange-400 opacity-80"></span>
                {/* Dot 3 */}
                <span className="absolute top-[55%] left-[69%] h-4 w-4 rounded-full bg-orange-400 opacity-80"></span>
              </div>

              {/* Action Button */}
              <div className="mt-12 z-10">
                <button className="rounded bg-[#0fa457] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d8f4c]">
                  Learn More
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}