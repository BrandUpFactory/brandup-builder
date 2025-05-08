export default function Home() {
  return (
    <div className="px-12 py-10">
      <h1 className="text-4xl font-extrabold text-[#1c2838] mb-4">
        Welcome to <span className="text-[#8db5d8]">BrandUp Builder</span> 🚀
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Build and customize Shopify sections effortlessly. Create. Export. Sell.
      </p>

      <div className="flex gap-4 mb-12">
        <a
          href="/sections"
          className="inline-flex items-center gap-2 bg-[#8db5d8] hover:bg-[#7ca4c6] text-white font-medium py-2 px-6 rounded-md transition"
        >
          Start Building →
        </a>
        <a
          href="/templates"
          className="inline-flex items-center gap-2 border border-[#8db5d8] text-[#1c2838] hover:bg-[#f4f8fb] font-medium py-2 px-6 rounded-md transition"
        >
          Explore Templates
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold text-[#1c2838] mb-2">Visual Designer</h3>
          <p className="text-sm text-gray-600">
            Customize each section visually – no coding required.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold text-[#1c2838] mb-2">One-Click Export</h3>
          <p className="text-sm text-gray-600">
            Get clean Liquid code ready for Shopify in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}